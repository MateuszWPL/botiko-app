<?php
/**
 * Main plugin bootstrap.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Singleton that wires the plugin modules together.
 */
final class Botiko {

	/**
	 * Single shared instance.
	 *
	 * @var Botiko|null
	 */
	private static $instance = null;

	/**
	 * Settings module.
	 *
	 * @var Botiko_Settings
	 */
	public $settings;

	/**
	 * API client module.
	 *
	 * @var Botiko_Api
	 */
	public $api;

	/**
	 * Pairing module.
	 *
	 * @var Botiko_Pairing
	 */
	public $pairing;

	/**
	 * Admin UI module.
	 *
	 * @var Botiko_Admin
	 */
	public $admin;

	/**
	 * Front-end embed module.
	 *
	 * @var Botiko_Embed
	 */
	public $embed;

	/**
	 * Admin notices module.
	 *
	 * @var Botiko_Notices
	 */
	public $notices;

	/**
	 * Retrieve the shared instance.
	 *
	 * @return Botiko
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Wire modules and hooks.
	 */
	private function __construct() {
		$this->settings = new Botiko_Settings();
		$this->api      = new Botiko_Api( $this->settings );
		$this->pairing  = new Botiko_Pairing( $this->settings, $this->api );
		$this->embed    = new Botiko_Embed( $this->settings );

		if ( is_admin() ) {
			$this->admin   = new Botiko_Admin( $this->settings, $this->api, $this->pairing );
			$this->notices = new Botiko_Notices( $this->settings );
		}

		add_action( 'plugins_loaded', array( $this, 'init_modules' ) );
	}

	/**
	 * Register module hooks.
	 *
	 * @return void
	 */
	public function init_modules() {
		$this->settings->register_hooks();
		$this->pairing->register_hooks();
		$this->embed->register_hooks();

		if ( is_admin() ) {
			$this->admin->register_hooks();
			$this->notices->register_hooks();
		}
	}

	/**
	 * Prevent cloning.
	 *
	 * @return void
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Cloning is not allowed.', 'botiko' ), '1.0.0' );
	}

	/**
	 * Prevent unserializing.
	 *
	 * @return void
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Unserializing is not allowed.', 'botiko' ), '1.0.0' );
	}
}
