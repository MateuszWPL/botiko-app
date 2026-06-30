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
 * Prints the Botiko widget loader into the site footer when the configured
 * display rules allow it.
 */
class Botiko_Embed {

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
		add_action( 'wp_footer', array( $this, 'render' ), 20 );
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
	 * Output the widget loader script tag.
	 *
	 * @return void
	 */
	public function render() {
		if ( ! $this->should_render() ) {
			return;
		}

		$bot_id = $this->settings->get( 'bot_id', '' );
		$src    = trailingslashit( BOTIKO_WIDGET_URL ) . 'embed.js';

		// The widget loader is an external script keyed by the data-bot-id
		// attribute; wp_enqueue_script cannot carry that attribute cleanly, so
		// we print an escaped tag instead.
		// phpcs:disable WordPress.WP.EnqueuedResources.NonEnqueuedScript
		printf(
			'<script src="%1$s" data-bot-id="%2$s" async></script>' . "\n",
			esc_url( $src ),
			esc_attr( $bot_id )
		);
		// phpcs:enable WordPress.WP.EnqueuedResources.NonEnqueuedScript
	}
}
