<?php
/**
 * Thin client for the public Botiko API.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Talks to the public, unauthenticated Botiko endpoints:
 *  - GET  /api/v1/bot/{id}/config  (status: name, online, domainAllowed)
 *  - POST /api/v1/bot/pair         (one-click pairing)
 */
class Botiko_Api {

	const STATUS_TRANSIENT = 'botiko_status';
	const STATUS_TTL       = 60; // Seconds.

	/**
	 * Settings store.
	 *
	 * @var Botiko_Settings
	 */
	private $settings;

	/**
	 * Constructor.
	 *
	 * @param Botiko_Settings $settings Settings store.
	 */
	public function __construct( Botiko_Settings $settings ) {
		$this->settings = $settings;
	}

	/**
	 * The site's origin (scheme://host[:port]), used as the Origin header so
	 * the API can report whether this domain is on the bot's allow-list.
	 *
	 * @return string
	 */
	public static function site_origin() {
		$parts = wp_parse_url( home_url() );
		if ( empty( $parts['scheme'] ) || empty( $parts['host'] ) ) {
			return home_url();
		}
		$origin = $parts['scheme'] . '://' . $parts['host'];
		if ( ! empty( $parts['port'] ) ) {
			$origin .= ':' . $parts['port'];
		}
		return $origin;
	}

	/**
	 * Fetch live bot status. Cached briefly to avoid hammering the API.
	 *
	 * @param bool $force Bypass the cache.
	 * @return array{ok:bool,name:string,online:bool,domain_allowed:bool}|WP_Error
	 */
	public function get_status( $force = false ) {
		$bot_id = $this->settings->get( 'bot_id', '' );
		if ( '' === $bot_id ) {
			return new WP_Error( 'no_bot_id', __( 'Brak Bot ID.', 'botiko-ai-customer-service-bot' ) );
		}

		if ( ! $force ) {
			$cached = get_transient( self::STATUS_TRANSIENT );
			if ( is_array( $cached ) && isset( $cached['bot_id'] ) && $cached['bot_id'] === $bot_id ) {
				return $cached['data'];
			}
		}

		$url      = trailingslashit( BOTIKO_API_BASE ) . 'api/v1/bot/' . rawurlencode( $bot_id ) . '/config';
		$response = wp_remote_get(
			$url,
			array(
				'timeout' => 8,
				'headers' => array(
					'Origin' => self::site_origin(),
					'Accept' => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		if ( 404 === $code ) {
			return new WP_Error( 'not_found', __( 'Nie znaleziono bota o tym ID.', 'botiko-ai-customer-service-bot' ) );
		}
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error( 'http_error', __( 'Botiko API zwróciło błąd. Spróbuj ponownie za chwilę.', 'botiko-ai-customer-service-bot' ) );
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! is_array( $body ) || empty( $body['id'] ) ) {
			return new WP_Error( 'bad_response', __( 'Nieoczekiwana odpowiedź z Botiko API.', 'botiko-ai-customer-service-bot' ) );
		}

		$data = array(
			'ok'             => true,
			'name'           => isset( $body['name'] ) ? (string) $body['name'] : '',
			'online'         => ! empty( $body['online'] ),
			'domain_allowed' => ! empty( $body['domainAllowed'] ),
		);

		set_transient(
			self::STATUS_TRANSIENT,
			array(
				'bot_id' => $bot_id,
				'data'   => $data,
			),
			self::STATUS_TTL
		);

		return $data;
	}

	/**
	 * Drop the cached status (after connect/disconnect/config change).
	 *
	 * @return void
	 */
	public function flush_status() {
		delete_transient( self::STATUS_TRANSIENT );
	}

	/**
	 * Redeem a pairing code: authorizes this domain and returns the bot id/name.
	 *
	 * @param string $token Pairing code from the dashboard.
	 * @return array{bot_id:string,bot_name:string}|WP_Error
	 */
	public function pair( $token ) {
		$url      = trailingslashit( BOTIKO_API_BASE ) . 'api/v1/bot/pair';
		$response = wp_remote_post(
			$url,
			array(
				'timeout' => 12,
				'headers' => array(
					'Content-Type' => 'application/json',
					'Accept'       => 'application/json',
				),
				'body'    => wp_json_encode(
					array(
						'token'  => $token,
						'domain' => self::site_origin(),
					)
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code = (int) wp_remote_retrieve_response_code( $response );
		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $code < 200 || $code >= 300 ) {
			$message = is_array( $body ) && ! empty( $body['message'] )
				? (string) $body['message']
				: __( 'Nie udało się połączyć. Sprawdź kod i spróbuj ponownie.', 'botiko-ai-customer-service-bot' );
			return new WP_Error( 'pair_failed', $message );
		}

		if ( ! is_array( $body ) || empty( $body['botId'] ) ) {
			return new WP_Error( 'bad_response', __( 'Nieoczekiwana odpowiedź z Botiko API.', 'botiko-ai-customer-service-bot' ) );
		}

		return array(
			'bot_id'   => (string) $body['botId'],
			'bot_name' => isset( $body['botName'] ) ? (string) $body['botName'] : '',
		);
	}
}
