/* global BotikoAdmin */
( function () {
	'use strict';

	if ( typeof BotikoAdmin === 'undefined' ) {
		return;
	}

	var cfg = BotikoAdmin;

	function $( id ) {
		return document.getElementById( id );
	}

	function post( action, data ) {
		var body = new URLSearchParams();
		body.append( 'action', action );
		body.append( 'nonce', cfg.nonce );
		Object.keys( data || {} ).forEach( function ( key ) {
			body.append( key, data[ key ] );
		} );

		return fetch( cfg.ajaxUrl, {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: body.toString()
		} ).then( function ( res ) {
			return res.json().then( function ( json ) {
				return { ok: res.ok && json && json.success, json: json };
			} );
		} );
	}

	function setMsg( el, text, isError ) {
		if ( ! el ) {
			return;
		}
		el.textContent = text || '';
		el.className = 'botiko-connect-msg' + ( isError ? ' is-error' : ' is-ok' );
	}

	function setBusy( btn, busy, busyLabel ) {
		if ( ! btn ) {
			return;
		}
		if ( busy ) {
			btn.dataset.label = btn.textContent;
			btn.textContent = busyLabel;
			btn.disabled = true;
		} else {
			if ( btn.dataset.label ) {
				btn.textContent = btn.dataset.label;
			}
			btn.disabled = false;
		}
	}

	// Connect.
	var connectBtn = $( 'botiko-connect' );
	if ( connectBtn ) {
		connectBtn.addEventListener( 'click', function () {
			var input = $( 'botiko-code' );
			var msg = document.querySelector( '.botiko-connect-msg' );
			var code = input ? input.value.trim() : '';
			if ( ! code ) {
				setMsg( msg, cfg.i18n.genericError, true );
				return;
			}
			setMsg( msg, '', false );
			setBusy( connectBtn, true, cfg.i18n.connecting );

			post( 'botiko_connect', { code: code } ).then( function ( r ) {
				if ( r.ok ) {
					// Reload so the server re-renders the connected state.
					window.location.reload();
				} else {
					setBusy( connectBtn, false );
					setMsg( msg, ( r.json && r.json.data && r.json.data.message ) || cfg.i18n.genericError, true );
				}
			} ).catch( function () {
				setBusy( connectBtn, false );
				setMsg( msg, cfg.i18n.genericError, true );
			} );
		} );
	}

	// Disconnect.
	var disconnectBtn = $( 'botiko-disconnect' );
	if ( disconnectBtn ) {
		disconnectBtn.addEventListener( 'click', function () {
			if ( ! window.confirm( cfg.i18n.confirmReset ) ) {
				return;
			}
			setBusy( disconnectBtn, true, cfg.i18n.connecting );
			post( 'botiko_disconnect', {} ).then( function () {
				window.location.reload();
			} ).catch( function () {
				setBusy( disconnectBtn, false );
			} );
		} );
	}

	// Refresh status.
	var refreshBtn = $( 'botiko-refresh' );
	if ( refreshBtn ) {
		refreshBtn.addEventListener( 'click', function () {
			setBusy( refreshBtn, true, cfg.i18n.checking );
			post( 'botiko_refresh_status', {} ).then( function () {
				// Simplest reliable update: reload to re-render chips server-side.
				window.location.reload();
			} ).catch( function () {
				setBusy( refreshBtn, false );
			} );
		} );
	}
} )();
