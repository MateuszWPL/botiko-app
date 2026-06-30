<?php
/**
 * Uninstall cleanup.
 *
 * Runs only when the user deletes the plugin from WordPress. Removes the single
 * settings option and the cached status transient. No bot data lives in WP.
 *
 * @package Botiko
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'botiko_settings' );
delete_transient( 'botiko_status' );

// Multisite: clean each site's option.
if ( is_multisite() ) {
	$botiko_site_ids = get_sites( array( 'fields' => 'ids' ) );
	foreach ( $botiko_site_ids as $botiko_site_id ) {
		switch_to_blog( $botiko_site_id );
		delete_option( 'botiko_settings' );
		delete_transient( 'botiko_status' );
		restore_current_blog();
	}
}
