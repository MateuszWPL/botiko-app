<?php
/**
 * Plugin Name:       Botiko — AI Customer Service Bot
 * Plugin URI:        https://botiko.pl/integracje/wordpress
 * Description:        Add the Botiko customer-service bot to your site. It answers visitors 24/7 and captures leads. Connect your site with a single code, no theme editing.
 * Version:           1.0.3
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Botiko
 * Author URI:        https://botiko.pl
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       botiko
 * Domain Path:       /languages
 *
 * @package Botiko
 */

// Block direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BOTIKO_VERSION', '1.0.3' );
define( 'BOTIKO_PLUGIN_FILE', __FILE__ );
define( 'BOTIKO_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'BOTIKO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'BOTIKO_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

// Production endpoints. Overridable via the BOTIKO_API_BASE / BOTIKO_WIDGET_URL
// constants (wp-config.php) for local development against a dev backend.
if ( ! defined( 'BOTIKO_API_BASE' ) ) {
	define( 'BOTIKO_API_BASE', 'https://api.botiko.pl' );
}
if ( ! defined( 'BOTIKO_WIDGET_URL' ) ) {
	define( 'BOTIKO_WIDGET_URL', 'https://widget.botiko.pl' );
}
if ( ! defined( 'BOTIKO_DASHBOARD_URL' ) ) {
	define( 'BOTIKO_DASHBOARD_URL', 'https://botiko.pl/dashboard' );
}

require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-settings.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-api.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-pairing.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-admin.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-embed.php';
require_once BOTIKO_PLUGIN_DIR . 'includes/class-botiko-notices.php';

/**
 * Boot the plugin once WordPress is ready.
 *
 * @return Botiko
 */
function botiko() {
	return Botiko::instance();
}

botiko();

// Sensible defaults on activation; no destructive work on deactivation.
register_activation_hook( __FILE__, array( 'Botiko_Settings', 'on_activate' ) );
