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
	$site_ids = get_sites( array( 'fields' => 'ids' ) );
	foreach ( $site_ids as $site_id ) {
		switch_to_blog( $site_id );
		delete_option( 'botiko_settings' );
		delete_transient( 'botiko_status' );
		restore_current_blog();
	}
}
