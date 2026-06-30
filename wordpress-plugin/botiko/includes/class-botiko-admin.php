<?php
/**
 * Admin settings screen.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the "Settings → Botiko" page and enqueues its assets.
 */
class Botiko_Admin {

	const PAGE_SLUG = 'botiko';

	/**
	 * Settings store.
	 *
	 * @var Botiko_Settings
	 */
	private $settings;

	/**
	 * API client.
	 *
	 * @var Botiko_Api
	 */
	private $api;

	/**
	 * Pairing module.
	 *
	 * @var Botiko_Pairing
	 */
	private $pairing;

	/**
	 * Constructor.
	 *
	 * @param Botiko_Settings $settings Settings store.
	 * @param Botiko_Api      $api      API client.
	 * @param Botiko_Pairing  $pairing  Pairing module.
	 */
	public function __construct( Botiko_Settings $settings, Botiko_Api $api, Botiko_Pairing $pairing ) {
		$this->settings = $settings;
		$this->api      = $api;
		$this->pairing  = $pairing;
	}

	/**
	 * Register admin hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	/**
	 * Add the options page under Settings.
	 *
	 * @return void
	 */
	public function add_menu() {
		add_options_page(
			__( 'Botiko', 'botiko' ),
			__( 'Botiko', 'botiko' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' )
		);
	}

	/**
	 * Enqueue page assets (only on our screen).
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue( $hook ) {
		if ( 'settings_page_' . self::PAGE_SLUG !== $hook ) {
			return;
		}

		wp_enqueue_style(
			'botiko-admin',
			BOTIKO_PLUGIN_URL . 'assets/admin.css',
			array(),
			BOTIKO_VERSION
		);

		wp_enqueue_script(
			'botiko-admin',
			BOTIKO_PLUGIN_URL . 'assets/admin.js',
			array(),
			BOTIKO_VERSION,
			true
		);

		wp_localize_script(
			'botiko-admin',
			'BotikoAdmin',
			array(
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( Botiko_Pairing::NONCE_ACTION ),
				'i18n'    => array(
					'connecting'   => __( 'Łączenie…', 'botiko' ),
					'checking'     => __( 'Sprawdzanie…', 'botiko' ),
					'genericError' => __( 'Coś poszło nie tak. Spróbuj ponownie.', 'botiko' ),
					'confirmReset' => __( 'Rozłączyć stronę z botem?', 'botiko' ),
				),
			)
		);
	}

	/**
	 * Render the settings page.
	 *
	 * @return void
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$status = $this->settings->has_bot_id() ? $this->api->get_status() : null;
		?>
		<div class="wrap botiko-wrap">
			<h1 class="botiko-title">
				<span class="botiko-logo" aria-hidden="true">🤖</span>
				<?php esc_html_e( 'Botiko — bot obsługi klienta', 'botiko' ); ?>
			</h1>

			<?php settings_errors( Botiko_Settings::OPTION_KEY ); ?>

			<?php $this->render_connection_card( $status ); ?>

			<form method="post" action="options.php" id="botiko-settings-form" class="botiko-card">
				<?php settings_fields( 'botiko_settings_group' ); ?>
				<?php $this->render_display_settings(); ?>
				<?php submit_button( __( 'Zapisz ustawienia', 'botiko' ) ); ?>
			</form>

			<?php $this->render_help(); ?>
		</div>
		<?php
	}

	/**
	 * Connection hero card (connected / manual / disconnected).
	 *
	 * @param array|WP_Error|null $status Live status or null.
	 * @return void
	 */
	private function render_connection_card( $status ) {
		$connected = $this->settings->is_connected();
		$has_bot   = $this->settings->has_bot_id();
		$bot_name  = (string) $this->settings->get( 'bot_name', '' );
		$bot_id    = (string) $this->settings->get( 'bot_id', '' );
		?>
		<div class="botiko-card botiko-connection" data-connected="<?php echo $has_bot ? '1' : '0'; ?>">
			<h2><?php esc_html_e( 'Połączenie', 'botiko' ); ?></h2>

			<div class="botiko-connected" <?php echo $has_bot ? '' : 'style="display:none"'; ?>>
				<p class="botiko-connected-line">
					<span class="botiko-badge botiko-badge-ok">✓</span>
					<?php esc_html_e( 'Połączono:', 'botiko' ); ?>
					<strong class="botiko-bot-name"><?php echo esc_html( $bot_name ? $bot_name : __( 'Twój bot', 'botiko' ) ); ?></strong>
				</p>
				<p class="botiko-chips"><?php $this->render_status_chips( $status ); ?></p>
				<p class="botiko-meta">
					<?php esc_html_e( 'Bot ID:', 'botiko' ); ?>
					<code><?php echo esc_html( $this->mask_id( $bot_id ) ); ?></code>
				</p>
				<p class="botiko-actions">
					<button type="button" class="button" id="botiko-refresh"><?php esc_html_e( 'Sprawdź status', 'botiko' ); ?></button>
					<button type="button" class="button button-link-delete" id="botiko-disconnect"><?php esc_html_e( 'Rozłącz', 'botiko' ); ?></button>
				</p>
				<?php if ( ! $connected ) : ?>
					<p class="botiko-hint">
						<?php esc_html_e( 'Bot ID wpisany ręcznie. Pamiętaj, aby dodać domenę tej strony w panelu Botiko → Ustawienia → Domeny, inaczej czat nie odpowie.', 'botiko' ); ?>
					</p>
				<?php endif; ?>
			</div>

			<div class="botiko-disconnected" <?php echo $has_bot ? 'style="display:none"' : ''; ?>>
				<p class="botiko-lead">
					<?php esc_html_e( 'Jeden kod pobierze Twojego bota i autoryzuje tę domenę. Skopiuj go z panelu Botiko → Instalacja → WordPress.', 'botiko' ); ?>
				</p>
				<div class="botiko-connect-row">
					<input type="text" id="botiko-code" class="regular-text" autocomplete="off" spellcheck="false" placeholder="botiko_pair_…" aria-label="<?php esc_attr_e( 'Kod połączenia', 'botiko' ); ?>" />
					<button type="button" class="button button-primary" id="botiko-connect"><?php esc_html_e( 'Połącz stronę', 'botiko' ); ?></button>
				</div>
				<p class="botiko-connect-msg" role="status" aria-live="polite"></p>
				<p>
					<a href="<?php echo esc_url( BOTIKO_DASHBOARD_URL . '/embed' ); ?>" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e( 'Gdzie znajdę kod połączenia? →', 'botiko' ); ?>
					</a>
				</p>

				<details class="botiko-manual">
					<summary><?php esc_html_e( 'Mam już Bot ID — wpiszę ręcznie', 'botiko' ); ?></summary>
					<p class="botiko-hint"><?php esc_html_e( 'Wklej Bot ID poniżej i zapisz. Domenę dodasz osobno w panelu Botiko.', 'botiko' ); ?></p>
					<p>
						<input type="text" name="<?php echo esc_attr( Botiko_Settings::OPTION_KEY ); ?>[bot_id]" form="botiko-settings-form" class="regular-text" autocomplete="off" spellcheck="false" placeholder="<?php esc_attr_e( 'np. clx1a2b3c4d5e6f7g8h9i0', 'botiko' ); ?>" />
					</p>
				</details>
			</div>
		</div>
		<?php
	}

	/**
	 * Render status chips (domain + online), if status is available.
	 *
	 * @param array|WP_Error|null $status Live status.
	 * @return void
	 */
	private function render_status_chips( $status ) {
		if ( is_wp_error( $status ) || ! is_array( $status ) ) {
			echo '<span class="botiko-chip botiko-chip-warn">' . esc_html__( 'Status niedostępny', 'botiko' ) . '</span>';
			return;
		}

		if ( ! empty( $status['domain_allowed'] ) ) {
			echo '<span class="botiko-chip botiko-chip-ok">' . esc_html__( '✓ Domena autoryzowana', 'botiko' ) . '</span>';
		} else {
			echo '<a class="botiko-chip botiko-chip-warn" href="' . esc_url( BOTIKO_DASHBOARD_URL . '/settings' ) . '" target="_blank" rel="noopener noreferrer">'
				. esc_html__( '⚠ Domena nieautoryzowana — dodaj w panelu', 'botiko' ) . '</a>';
		}

		if ( ! empty( $status['online'] ) ) {
			echo ' <span class="botiko-chip botiko-chip-ok">' . esc_html__( '● Online', 'botiko' ) . '</span>';
		} else {
			echo ' <span class="botiko-chip">' . esc_html__( '○ Offline', 'botiko' ) . '</span>';
		}
	}

	/**
	 * Render the display-rules settings fields.
	 *
	 * @return void
	 */
	private function render_display_settings() {
		$enabled   = (bool) $this->settings->get( 'enabled', true );
		$test_mode = (bool) $this->settings->get( 'admin_test_mode', false );
		$mode      = (string) $this->settings->get( 'display_mode', 'all' );
		$page_ids  = (array) $this->settings->get( 'page_ids', array() );
		$opt       = Botiko_Settings::OPTION_KEY;
		?>
		<h2><?php esc_html_e( 'Wyświetlanie', 'botiko' ); ?></h2>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><?php esc_html_e( 'Bot na stronie', 'botiko' ); ?></th>
				<td>
					<label>
						<input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[enabled]" value="1" <?php checked( $enabled ); ?> />
						<?php esc_html_e( 'Pokazuj bota na froncie strony', 'botiko' ); ?>
					</label>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Gdzie pokazywać', 'botiko' ); ?></th>
				<td>
					<fieldset>
						<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="all" <?php checked( $mode, 'all' ); ?> /> <?php esc_html_e( 'Na wszystkich stronach', 'botiko' ); ?></label><br />
						<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="exclude" <?php checked( $mode, 'exclude' ); ?> /> <?php esc_html_e( 'Wszędzie oprócz wybranych', 'botiko' ); ?></label><br />
						<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="include" <?php checked( $mode, 'include' ); ?> /> <?php esc_html_e( 'Tylko na wybranych', 'botiko' ); ?></label>
					</fieldset>
					<p class="botiko-pages">
						<label for="botiko-page-ids"><?php esc_html_e( 'Wybrane strony:', 'botiko' ); ?></label><br />
						<select id="botiko-page-ids" name="<?php echo esc_attr( $opt ); ?>[page_ids][]" multiple size="6" class="regular-text">
							<?php
							$pages = get_pages( array( 'sort_column' => 'menu_order,post_title' ) );
							if ( $pages ) {
								foreach ( $pages as $page ) {
									printf(
										'<option value="%1$d" %2$s>%3$s</option>',
										(int) $page->ID,
										selected( in_array( (int) $page->ID, array_map( 'intval', $page_ids ), true ), true, false ),
										esc_html( $page->post_title )
									);
								}
							}
							?>
						</select>
						<span class="description"><?php esc_html_e( 'Przytrzymaj Ctrl/Cmd, aby zaznaczyć kilka.', 'botiko' ); ?></span>
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e( 'Tryb testowy', 'botiko' ); ?></th>
				<td>
					<label>
						<input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[admin_test_mode]" value="1" <?php checked( $test_mode ); ?> />
						<?php esc_html_e( 'Pokaż bota tylko zalogowanym administratorom (do testów)', 'botiko' ); ?>
					</label>
				</td>
			</tr>
		</table>
		<?php
	}

	/**
	 * Render the help section.
	 *
	 * @return void
	 */
	private function render_help() {
		?>
		<div class="botiko-card botiko-help">
			<h2><?php esc_html_e( 'Pomoc', 'botiko' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'Kolor bota, godziny pracy i sugerowane pytania zmienisz w panelu Botiko (są wspólne dla każdej strony, na której działa bot).', 'botiko' ); ?></li>
				<li>
					<a href="<?php echo esc_url( 'https://botiko.pl/integracje/wordpress' ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Dokumentacja wtyczki', 'botiko' ); ?></a>
					·
					<a href="<?php echo esc_url( 'mailto:kontakt@botiko.pl' ); ?>"><?php esc_html_e( 'Kontakt', 'botiko' ); ?></a>
				</li>
			</ul>
			<p class="botiko-version">
				<?php
				printf(
					/* translators: %s: plugin version */
					esc_html__( 'Wersja wtyczki: %s', 'botiko' ),
					esc_html( BOTIKO_VERSION )
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Mask a Bot ID for display.
	 *
	 * @param string $id Bot ID.
	 * @return string
	 */
	private function mask_id( $id ) {
		$len = strlen( $id );
		if ( $len <= 8 ) {
			return $id;
		}
		return substr( $id, 0, 4 ) . str_repeat( '•', max( 4, $len - 8 ) ) . substr( $id, -4 );
	}
}
