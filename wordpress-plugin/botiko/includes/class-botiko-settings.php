<?php
/**
 * Settings store and sanitization.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wraps the single `botiko_settings` option.
 */
class Botiko_Settings {

	const OPTION_KEY = 'botiko_settings';

	/**
	 * Allowed display modes.
	 *
	 * @var string[]
	 */
	const DISPLAY_MODES = array( 'all', 'exclude', 'include' );

	/**
	 * Default settings.
	 *
	 * @return array<string,mixed>
	 */
	public static function defaults() {
		return array(
			'bot_id'          => '',
			'bot_name'        => '',
			'connected'       => false,
			'enabled'         => true,
			'display_mode'    => 'all',
			'page_ids'        => array(),
			'admin_test_mode' => false,
		);
	}

	/**
	 * Register the option with the Settings API.
	 *
	 * @return void
	 */
	public function register_hooks() {
		register_setting(
			'botiko_settings_group',
			self::OPTION_KEY,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize' ),
				'default'           => self::defaults(),
				'show_in_rest'      => false,
			)
		);
	}

	/**
	 * Seed defaults on activation without clobbering existing config.
	 *
	 * @return void
	 */
	public static function on_activate() {
		if ( false === get_option( self::OPTION_KEY, false ) ) {
			add_option( self::OPTION_KEY, self::defaults() );
		}
	}

	/**
	 * Read the full settings array, merged over defaults.
	 *
	 * @return array<string,mixed>
	 */
	public function all() {
		$stored = get_option( self::OPTION_KEY, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}
		return wp_parse_args( $stored, self::defaults() );
	}

	/**
	 * Read a single setting.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $fallback Fallback when missing.
	 * @return mixed
	 */
	public function get( $key, $fallback = null ) {
		$all = $this->all();
		return array_key_exists( $key, $all ) ? $all[ $key ] : $fallback;
	}

	/**
	 * Merge and persist a partial set of settings (already-trusted values).
	 *
	 * @param array<string,mixed> $values Values to merge.
	 * @return void
	 */
	public function update( array $values ) {
		$merged = array_merge( $this->all(), $values );
		update_option( self::OPTION_KEY, $merged );
	}

	/**
	 * Sanitize raw input from the settings form.
	 *
	 * Connection fields (bot_id, bot_name, connected) are NOT taken from the
	 * form here, they are managed by the pairing/connect flow, so we preserve
	 * the stored values to avoid wiping the connection on a settings save.
	 *
	 * @param mixed $input Raw form input.
	 * @return array<string,mixed>
	 */
	public function sanitize( $input ) {
		$current = $this->all();
		$input   = is_array( $input ) ? $input : array();

		$clean = array(
			// Preserve connection state managed elsewhere.
			'bot_id'    => $current['bot_id'],
			'bot_name'  => $current['bot_name'],
			'connected' => $current['connected'],
		);

		// Manual Bot ID entry (fallback path), only when provided and valid.
		if ( isset( $input['bot_id'] ) && '' !== trim( (string) $input['bot_id'] ) ) {
			$candidate = self::sanitize_bot_id( $input['bot_id'] );
			if ( '' !== $candidate ) {
				$clean['bot_id'] = $candidate;
				// Manual entry does not prove a verified connection.
				$clean['connected'] = false;
			} else {
				add_settings_error(
					self::OPTION_KEY,
					'botiko_bad_bot_id',
					esc_html__( 'Nieprawidłowy Bot ID. Skopiuj go dokładnie z panelu Botiko.', 'botiko-ai-customer-service-bot' )
				);
			}
		}

		$clean['enabled']         = ! empty( $input['enabled'] );
		$clean['admin_test_mode'] = ! empty( $input['admin_test_mode'] );

		$mode                  = isset( $input['display_mode'] ) ? sanitize_key( $input['display_mode'] ) : 'all';
		$clean['display_mode'] = in_array( $mode, self::DISPLAY_MODES, true ) ? $mode : 'all';

		$page_ids = array();
		if ( isset( $input['page_ids'] ) && is_array( $input['page_ids'] ) ) {
			foreach ( $input['page_ids'] as $id ) {
				$id = absint( $id );
				if ( $id > 0 ) {
					$page_ids[] = $id;
				}
			}
		}
		$clean['page_ids'] = array_values( array_unique( $page_ids ) );

		return $clean;
	}

	/**
	 * Validate and normalize a Bot ID (Prisma CUID).
	 *
	 * Mirrors the API contract: lowercase alphanumeric, 20-40 chars.
	 *
	 * @param mixed $raw Raw value.
	 * @return string Normalized id, or '' when invalid.
	 */
	public static function sanitize_bot_id( $raw ) {
		$value = strtolower( trim( (string) $raw ) );
		return preg_match( '/^[a-z0-9]{20,40}$/', $value ) ? $value : '';
	}

	/**
	 * Whether a usable Bot ID is configured.
	 *
	 * @return bool
	 */
	public function has_bot_id() {
		return '' !== (string) $this->get( 'bot_id', '' );
	}

	/**
	 * Whether the bot was connected via the one-click pairing flow.
	 *
	 * @return bool
	 */
	public function is_connected() {
		return $this->has_bot_id() && (bool) $this->get( 'connected', false );
	}
}
