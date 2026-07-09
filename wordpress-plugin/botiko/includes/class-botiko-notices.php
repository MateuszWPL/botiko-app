<?php
/**
 * Admin notices and plugin action links.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Nudges the admin to finish setup and adds a Settings shortcut.
 */
class Botiko_Notices {

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
	 * Register admin hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_notices', array( $this, 'maybe_show_setup_notice' ) );
		add_filter( 'plugin_action_links_' . BOTIKO_PLUGIN_BASENAME, array( $this, 'action_links' ) );
	}

	/**
	 * Prompt to configure the bot until a Bot ID is set.
	 *
	 * @return void
	 */
	public function maybe_show_setup_notice() {
		if ( ! current_user_can( 'manage_options' ) || $this->settings->has_bot_id() ) {
			return;
		}

		// Don't nag on the plugin's own screen.
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( $screen && 'toplevel_page_botiko' === $screen->id ) {
			return;
		}

		$url = Botiko_Admin::page_url();
		printf(
			'<div class="notice notice-info is-dismissible"><p>%1$s <a href="%2$s">%3$s</a></p></div>',
			esc_html__( 'Botiko jest prawie gotowe, połącz swoją stronę z botem, aby zaczął odpowiadać klientom.', 'botiko-ai-customer-service-bot' ),
			esc_url( $url ),
			esc_html__( 'Dokończ konfigurację →', 'botiko-ai-customer-service-bot' )
		);
	}

	/**
	 * Add a Settings link to the plugins list row.
	 *
	 * @param string[] $links Existing action links.
	 * @return string[]
	 */
	public function action_links( $links ) {
		$settings_link = sprintf(
			'<a href="%1$s">%2$s</a>',
			esc_url( Botiko_Admin::page_url() ),
			esc_html__( 'Ustawienia', 'botiko-ai-customer-service-bot' )
		);
		array_unshift( $links, $settings_link );
		return $links;
	}
}
