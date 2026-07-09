<?php
/**
 * One-click pairing + connection lifecycle (admin-ajax handlers).
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles connect / disconnect / status-refresh actions from the settings page.
 */
class Botiko_Pairing {

	const NONCE_ACTION = 'botiko_admin';
	const CAPABILITY   = 'manage_options';

	/**
	 * Settings store.
	 *
	 * @var Botiko_Settings
	 */
	private $settings;

	/**
	 * API client.
	 *
	 * @var Botiko_Api
	 */
	private $api;

	/**
	 * Constructor.
	 *
	 * @param Botiko_Settings $settings Settings store.
	 * @param Botiko_Api      $api      API client.
	 */
	public function __construct( Botiko_Settings $settings, Botiko_Api $api ) {
		$this->settings = $settings;
		$this->api      = $api;
	}

	/**
	 * Register AJAX hooks (admin only).
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wp_ajax_botiko_connect', array( $this, 'ajax_connect' ) );
		add_action( 'wp_ajax_botiko_disconnect', array( $this, 'ajax_disconnect' ) );
		add_action( 'wp_ajax_botiko_refresh_status', array( $this, 'ajax_refresh_status' ) );
	}

	/**
	 * Guard shared by every AJAX handler: capability + nonce.
	 *
	 * @return void
	 */
	private function authorize() {
		if ( ! current_user_can( self::CAPABILITY ) ) {
			wp_send_json_error( array( 'message' => __( 'Brak uprawnień.', 'botiko-ai-customer-service-bot' ) ), 403 );
		}
		check_ajax_referer( self::NONCE_ACTION, 'nonce' );
	}

	/**
	 * Normalize a pasted pairing code to its safe charset.
	 *
	 * @param mixed $raw Raw value.
	 * @return string
	 */
	public static function sanitize_pairing_code( $raw ) {
		$value = trim( (string) $raw );
		// Tokens are `botiko_pair_<base32>`, letters, digits and underscores only.
		return preg_match( '/^[A-Za-z0-9_]{12,128}$/', $value ) ? $value : '';
	}

	/**
	 * AJAX: redeem a pairing code and store the connection.
	 *
	 * @return void
	 */
	public function ajax_connect() {
		$this->authorize();

		// Nonce + capability are verified in authorize() above.
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$raw_code = isset( $_POST['code'] ) ? sanitize_text_field( wp_unslash( $_POST['code'] ) ) : '';
		$code     = self::sanitize_pairing_code( $raw_code );
		if ( '' === $code ) {
			wp_send_json_error( array( 'message' => __( 'Nieprawidłowy kod połączenia.', 'botiko-ai-customer-service-bot' ) ), 400 );
		}

		$result = $this->api->pair( $code );
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'message' => $result->get_error_message() ), 400 );
		}

		$this->settings->update(
			array(
				'bot_id'    => $result['bot_id'],
				'bot_name'  => $result['bot_name'],
				'connected' => true,
				'enabled'   => true,
			)
		);
		$this->api->flush_status();

		$status = $this->api->get_status( true );

		wp_send_json_success(
			array(
				'message' => __( 'Połączono! Bot jest już na Twojej stronie.', 'botiko-ai-customer-service-bot' ),
				'status'  => is_wp_error( $status ) ? null : $status,
			)
		);
	}

	/**
	 * AJAX: clear the local connection (does not remove the domain server-side).
	 *
	 * @return void
	 */
	public function ajax_disconnect() {
		$this->authorize();

		$this->settings->update(
			array(
				'bot_id'    => '',
				'bot_name'  => '',
				'connected' => false,
			)
		);
		$this->api->flush_status();

		wp_send_json_success( array( 'message' => __( 'Rozłączono.', 'botiko-ai-customer-service-bot' ) ) );
	}

	/**
	 * AJAX: return a freshly fetched status.
	 *
	 * @return void
	 */
	public function ajax_refresh_status() {
		$this->authorize();

		$status = $this->api->get_status( true );
		if ( is_wp_error( $status ) ) {
			wp_send_json_error( array( 'message' => $status->get_error_message() ), 400 );
		}

		wp_send_json_success( array( 'status' => $status ) );
	}
}
