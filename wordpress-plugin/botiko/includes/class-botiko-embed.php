<?php
/**
 * Front-end widget injection.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueues the Botiko widget loader in the site footer when the configured
 * display rules allow it.
 */
class Botiko_Embed {

	/**
	 * Registered script handle for the widget loader.
	 *
	 * @var string
	 */
	const SCRIPT_HANDLE = 'botiko-widget';

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
	 * Register front-end hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_filter( 'script_loader_tag', array( $this, 'filter_script_tag' ), 10, 2 );
	}

	/**
	 * Decide whether the widget should load on the current request.
	 *
	 * @return bool
	 */
	public function should_render() {
		// Never in admin (the widget also self-skips /wp-admin defensively).
		if ( is_admin() ) {
			return false;
		}

		if ( ! $this->settings->get( 'enabled', true ) || ! $this->settings->has_bot_id() ) {
			return false;
		}

		// Test mode: only logged-in administrators see the bot.
		if ( $this->settings->get( 'admin_test_mode', false ) && ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		$should = $this->passes_display_rules();

		/**
		 * Filter whether the Botiko widget renders on the current request.
		 *
		 * @param bool $should Current decision.
		 */
		return (bool) apply_filters( 'botiko_should_render', $should );
	}

	/**
	 * Evaluate the page include/exclude rules.
	 *
	 * @return bool
	 */
	private function passes_display_rules() {
		$mode = $this->settings->get( 'display_mode', 'all' );
		if ( 'all' === $mode ) {
			return true;
		}

		$ids       = (array) $this->settings->get( 'page_ids', array() );
		$object_id = (int) get_queried_object_id();
		$listed    = $object_id > 0 && in_array( $object_id, array_map( 'intval', $ids ), true );

		if ( 'include' === $mode ) {
			return $listed;
		}
		// 'exclude'.
		return ! $listed;
	}

	/**
	 * Enqueue the widget loader in the footer when display rules allow it.
	 *
	 * @return void
	 */
	public function enqueue() {
		if ( ! $this->should_render() ) {
			return;
		}

		wp_enqueue_script(
			self::SCRIPT_HANDLE,
			trailingslashit( BOTIKO_WIDGET_URL ) . 'embed.js',
			array(),
			null,
			true
		);

		// WP 6.3+ honours the async strategy; older versions ignore it safely.
		wp_script_add_data( self::SCRIPT_HANDLE, 'strategy', 'async' );
	}

	/**
	 * Add the data-bot-id attribute to the widget loader tag.
	 *
	 * The loader reads its bot identifier from this attribute; other scripts
	 * are returned untouched.
	 *
	 * @param string $tag    The full script tag HTML.
	 * @param string $handle The registered script handle.
	 * @return string
	 */
	public function filter_script_tag( $tag, $handle ) {
		if ( self::SCRIPT_HANDLE !== $handle ) {
			return $tag;
		}

		$bot_id = $this->settings->get( 'bot_id', '' );

		return str_replace(
			' src=',
			' data-bot-id="' . esc_attr( $bot_id ) . '" src=',
			$tag
		);
	}
}
