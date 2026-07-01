<?php
/**
 * Admin screen — the plugin's storefront.
 *
 * Registers a top-level "Botiko" menu (with the brand mark as its icon) and
 * renders a branded, card-based dashboard: connection, display rules, and a
 * resources/review sidebar. All iconography is inline SVG (never emoji), output
 * through wp_kses() with a tight SVG allow-list.
 *
 * @package Botiko
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Renders the "Botiko" admin page and enqueues its assets.
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
	 * The admin page URL (top-level menu).
	 *
	 * @return string
	 */
	public static function page_url() {
		return admin_url( 'admin.php?page=' . self::PAGE_SLUG );
	}

	/**
	 * URL where the user can rate the plugin. Filterable; defaults to the
	 * WordPress.org reviews page (live once the plugin is published there).
	 *
	 * @return string
	 */
	public static function review_url() {
		/**
		 * Filter the "rate this plugin" destination.
		 *
		 * @param string $url Reviews URL.
		 */
		return (string) apply_filters( 'botiko_review_url', 'https://wordpress.org/support/plugin/botiko-ai-customer-service-bot/reviews/#new-post' );
	}

	/**
	 * Add a top-level menu with the Botiko mark as its icon.
	 *
	 * @return void
	 */
	public function add_menu() {
		add_menu_page(
			__( 'Botiko', 'botiko' ),
			__( 'Botiko', 'botiko' ),
			'manage_options',
			self::PAGE_SLUG,
			array( $this, 'render_page' ),
			self::menu_icon_uri(),
			58
		);
	}

	/**
	 * Base64 data-URI of the Botiko mark, used as the admin menu icon.
	 *
	 * @return string
	 */
	private static function menu_icon_uri() {
		$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 55 162 192">'
			. '<path fill="#a7aaad" d="M159.952 239C150.223 239 141.599 237.267 134.078 233.802C127.026 230.478 121.375 226.019 117.126 220.427C116.594 219.727 115.774 219.297 114.895 219.297H114.398C112.126 219.297 111.021 216.519 112.673 214.959C114.275 213.445 116.91 214.581 116.91 216.785V232.099C116.91 234.308 115.119 236.099 112.91 236.099H84C81.7909 236.099 80 234.308 80 232.099V67C80 64.7909 81.7909 63 84 63H115.485C117.694 63 119.485 64.7909 119.485 67V122.066C119.485 122.094 119.473 122.12 119.451 122.138C119.364 122.209 119.255 122.1 119.328 122.014C123.349 117.269 128.633 113.514 135.181 110.747C142.13 107.766 149.937 106.275 158.603 106.275C176.179 106.275 191.139 112.44 203.484 124.769C215.828 137.018 222 153.015 222 172.758C222 192.26 215.991 208.176 203.974 220.506C192.039 232.835 177.364 239 159.952 239ZM150.019 205.396C159.175 205.396 166.778 202.414 172.827 196.451C178.877 190.487 181.902 182.59 181.902 172.758C181.902 163.007 178.877 155.15 172.827 149.187C166.778 143.223 159.175 140.242 150.019 140.242C140.945 140.242 133.383 143.264 127.333 149.308C121.366 155.352 118.341 163.168 118.259 172.758C118.177 182.106 121.12 189.883 127.088 196.088C133.056 202.293 140.699 205.396 150.019 205.396Z"/>'
			. '</svg>';
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions -- Encoding a static SVG into a data URI for the menu icon.
		return 'data:image/svg+xml;base64,' . base64_encode( $svg );
	}

	/**
	 * Enqueue page assets (only on our screen).
	 *
	 * @param string $hook Current admin page hook.
	 * @return void
	 */
	public function enqueue( $hook ) {
		if ( 'toplevel_page_' . self::PAGE_SLUG !== $hook ) {
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
	 * Render the admin page.
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
			<h1 class="screen-reader-text"><?php esc_html_e( 'Botiko', 'botiko' ); ?></h1>

			<?php $this->render_header(); ?>

			<?php settings_errors( Botiko_Settings::OPTION_KEY ); ?>

			<div class="botiko-layout">
				<div class="botiko-main">
					<?php $this->render_connection_card( $status ); ?>

					<form method="post" action="options.php" id="botiko-settings-form" class="botiko-card">
						<?php settings_fields( 'botiko_settings_group' ); ?>
						<div class="botiko-card__head">
							<?php self::the_icon( 'sliders' ); ?>
							<h2><?php esc_html_e( 'Wyświetlanie', 'botiko' ); ?></h2>
						</div>
						<?php $this->render_display_settings(); ?>
						<div class="botiko-submit">
							<?php submit_button( __( 'Zapisz ustawienia', 'botiko' ), 'primary', 'submit', false ); ?>
						</div>
					</form>
				</div>

				<aside class="botiko-aside">
					<?php $this->render_appearance_note(); ?>
					<?php $this->render_resources(); ?>
					<?php $this->render_review(); ?>
				</aside>
			</div>

			<?php $this->render_footer(); ?>
		</div>
		<?php
	}

	/**
	 * Branded gradient header with the wordmark and version.
	 *
	 * @return void
	 */
	private function render_header() {
		?>
		<div class="botiko-header">
			<div class="botiko-header__brand">
				<img
					class="botiko-header__logo"
					src="<?php echo esc_url( BOTIKO_PLUGIN_URL . 'assets/botiko-logo-white.svg' ); ?>"
					alt="Botiko"
				/>
				<div>
					<p class="botiko-header__tagline">
						<?php esc_html_e( 'Bot obsługi klienta 24/7 — odpowiada na pytania i zbiera kontakty, gdy Ciebie nie ma.', 'botiko' ); ?>
					</p>
				</div>
			</div>
			<div class="botiko-header__meta">
				<span class="botiko-pill">
					<?php
					printf(
						/* translators: %s: plugin version. */
						esc_html__( 'wersja %s', 'botiko' ),
						esc_html( BOTIKO_VERSION )
					);
					?>
				</span>
				<a class="botiko-pill" href="<?php echo esc_url( BOTIKO_DASHBOARD_URL . '/overview' ); ?>" target="_blank" rel="noopener noreferrer">
					<?php self::the_icon( 'external' ); ?>
					<?php esc_html_e( 'Panel Botiko', 'botiko' ); ?>
				</a>
			</div>
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
			<div class="botiko-card__head">
				<?php self::the_icon( 'plug' ); ?>
				<h2><?php esc_html_e( 'Połączenie', 'botiko' ); ?></h2>
			</div>

			<div class="botiko-connected" <?php echo $has_bot ? '' : 'style="display:none"'; ?>>
				<p class="botiko-connected-line">
					<span class="botiko-avatar"><?php self::the_icon( 'check' ); ?></span>
					<span>
						<?php esc_html_e( 'Połączono z botem', 'botiko' ); ?><br />
						<strong class="botiko-bot-name"><?php echo esc_html( $bot_name ? $bot_name : __( 'Twój bot', 'botiko' ) ); ?></strong>
					</span>
				</p>
				<p class="botiko-chips"><?php $this->render_status_chips( $status ); ?></p>
				<p class="botiko-meta">
					<?php esc_html_e( 'Bot ID:', 'botiko' ); ?>
					<code><?php echo esc_html( $this->mask_id( $bot_id ) ); ?></code>
				</p>
				<p class="botiko-actions">
					<button type="button" class="button" id="botiko-refresh">
						<?php self::the_icon( 'refresh' ); ?>
						<?php esc_html_e( 'Sprawdź status', 'botiko' ); ?>
					</button>
					<button type="button" class="button button-link-delete" id="botiko-disconnect">
						<?php self::the_icon( 'unplug' ); ?>
						<?php esc_html_e( 'Rozłącz', 'botiko' ); ?>
					</button>
				</p>
				<?php if ( ! $connected ) : ?>
					<div class="botiko-callout">
						<?php self::the_icon( 'alert' ); ?>
						<span><?php esc_html_e( 'Bot ID wpisany ręcznie. Pamiętaj, aby dodać domenę tej strony w panelu Botiko → Ustawienia → Domeny — inaczej czat się pokaże, ale nie odpowie.', 'botiko' ); ?></span>
					</div>
				<?php endif; ?>
			</div>

			<div class="botiko-disconnected" <?php echo $has_bot ? 'style="display:none"' : ''; ?>>
				<p class="botiko-lead">
					<?php esc_html_e( 'Jeden kod połączy Twoją stronę z botem i autoryzuje tę domenę — bez edycji motywu. Wygeneruj go w panelu Botiko → Instalacja → WordPress.', 'botiko' ); ?>
				</p>
				<div class="botiko-connect-row">
					<input type="text" id="botiko-code" class="regular-text" autocomplete="off" spellcheck="false" placeholder="botiko_pair_…" aria-label="<?php esc_attr_e( 'Kod połączenia', 'botiko' ); ?>" />
					<button type="button" class="button button-primary button-hero" id="botiko-connect">
						<?php self::the_icon( 'plug' ); ?>
						<?php esc_html_e( 'Połącz stronę', 'botiko' ); ?>
					</button>
				</div>
				<p class="botiko-connect-msg" role="status" aria-live="polite"></p>
				<p>
					<a class="botiko-link" href="<?php echo esc_url( BOTIKO_DASHBOARD_URL . '/embed' ); ?>" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e( 'Gdzie znajdę kod połączenia?', 'botiko' ); ?>
						<?php self::the_icon( 'external' ); ?>
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
			echo '<span class="botiko-chip botiko-chip-warn">';
			self::the_icon( 'alert' );
			echo esc_html__( 'Status niedostępny', 'botiko' ) . '</span>';
			return;
		}

		if ( ! empty( $status['domain_allowed'] ) ) {
			echo '<span class="botiko-chip botiko-chip-ok">';
			self::the_icon( 'shield-check' );
			echo esc_html__( 'Domena autoryzowana', 'botiko' ) . '</span>';
		} else {
			echo '<a class="botiko-chip botiko-chip-warn" href="' . esc_url( BOTIKO_DASHBOARD_URL . '/settings' ) . '" target="_blank" rel="noopener noreferrer">';
			self::the_icon( 'alert' );
			echo esc_html__( 'Dodaj domenę w panelu', 'botiko' ) . '</a>';
		}

		if ( ! empty( $status['online'] ) ) {
			echo '<span class="botiko-chip botiko-chip-ok">';
			self::the_icon( 'dot' );
			echo esc_html__( 'Online', 'botiko' ) . '</span>';
		} else {
			echo '<span class="botiko-chip botiko-chip-off">';
			self::the_icon( 'dot-outline' );
			echo esc_html__( 'Offline', 'botiko' ) . '</span>';
		}
	}

	/**
	 * Render the display-rules settings fields.
	 *
	 * @return void
	 */
	private function render_display_settings() {
		$enabled    = (bool) $this->settings->get( 'enabled', true );
		$test_mode  = (bool) $this->settings->get( 'admin_test_mode', false );
		$mode       = (string) $this->settings->get( 'display_mode', 'all' );
		$page_ids   = (array) $this->settings->get( 'page_ids', array() );
		$opt        = Botiko_Settings::OPTION_KEY;
		$show_pages = in_array( $mode, array( 'include', 'exclude' ), true );
		?>
		<div class="botiko-field">
			<p class="botiko-field__label"><?php esc_html_e( 'Bot na stronie', 'botiko' ); ?></p>
			<label class="botiko-check">
				<input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[enabled]" value="1" <?php checked( $enabled ); ?> />
				<span><?php esc_html_e( 'Pokazuj bota na froncie strony', 'botiko' ); ?></span>
			</label>
		</div>

		<div class="botiko-field">
			<p class="botiko-field__label"><?php esc_html_e( 'Gdzie pokazywać', 'botiko' ); ?></p>
			<fieldset class="botiko-radios" id="botiko-display-mode">
				<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="all" <?php checked( $mode, 'all' ); ?> /> <span><?php esc_html_e( 'Na wszystkich stronach', 'botiko' ); ?></span></label>
				<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="exclude" <?php checked( $mode, 'exclude' ); ?> /> <span><?php esc_html_e( 'Wszędzie oprócz wybranych', 'botiko' ); ?></span></label>
				<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[display_mode]" value="include" <?php checked( $mode, 'include' ); ?> /> <span><?php esc_html_e( 'Tylko na wybranych', 'botiko' ); ?></span></label>
			</fieldset>

			<div class="botiko-pages" id="botiko-pages" <?php echo $show_pages ? '' : 'hidden'; ?>>
				<label for="botiko-page-ids"><?php esc_html_e( 'Wybrane strony', 'botiko' ); ?></label>
				<select id="botiko-page-ids" name="<?php echo esc_attr( $opt ); ?>[page_ids][]" multiple size="7">
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
				<span class="description"><?php esc_html_e( 'Przytrzymaj Ctrl (Windows) lub Cmd (Mac), aby zaznaczyć kilka stron.', 'botiko' ); ?></span>
			</div>
		</div>

		<div class="botiko-field">
			<p class="botiko-field__label"><?php esc_html_e( 'Tryb testowy', 'botiko' ); ?></p>
			<label class="botiko-check">
				<input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[admin_test_mode]" value="1" <?php checked( $test_mode ); ?> />
				<span><?php esc_html_e( 'Pokaż bota tylko zalogowanym administratorom (zanim udostępnisz go klientom).', 'botiko' ); ?></span>
			</label>
		</div>
		<?php
	}

	/**
	 * Sidebar: note that look & feel is managed server-side in the dashboard.
	 *
	 * @return void
	 */
	private function render_appearance_note() {
		?>
		<div class="botiko-card">
			<div class="botiko-note">
				<span class="botiko-note__ico"><?php self::the_icon( 'palette' ); ?></span>
				<div>
					<strong><?php esc_html_e( 'Wygląd bota zmienisz w panelu', 'botiko' ); ?></strong>
					<p><?php esc_html_e( 'Kolor, godziny pracy i sugerowane pytania są wspólne dla wszystkich stron i ustawiasz je w panelu Botiko.', 'botiko' ); ?></p>
					<a class="botiko-link" href="<?php echo esc_url( BOTIKO_DASHBOARD_URL . '/settings' ); ?>" target="_blank" rel="noopener noreferrer">
						<?php esc_html_e( 'Otwórz ustawienia bota', 'botiko' ); ?>
						<?php self::the_icon( 'external' ); ?>
					</a>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Sidebar: helpful links.
	 *
	 * @return void
	 */
	private function render_resources() {
		$links = array(
			array(
				'icon'  => 'book',
				'title' => __( 'Dokumentacja', 'botiko' ),
				'sub'   => __( 'Instalacja i najczęstsze pytania', 'botiko' ),
				'url'   => 'https://botiko.pl/integracje/wordpress',
			),
			array(
				'icon'  => 'grid',
				'title' => __( 'Panel Botiko', 'botiko' ),
				'sub'   => __( 'Leady, rozmowy, baza wiedzy', 'botiko' ),
				'url'   => BOTIKO_DASHBOARD_URL . '/overview',
			),
			array(
				'icon'  => 'lifebuoy',
				'title' => __( 'Pomoc i kontakt', 'botiko' ),
				'sub'   => __( 'Napisz do nas — pomożemy', 'botiko' ),
				'url'   => 'mailto:kontakt@botiko.pl',
			),
		);
		?>
		<div class="botiko-card botiko-resources">
			<div class="botiko-card__head">
				<?php self::the_icon( 'compass' ); ?>
				<h2><?php esc_html_e( 'Przydatne linki', 'botiko' ); ?></h2>
			</div>
			<div class="botiko-resources__list">
				<?php
				foreach ( $links as $link ) :
					$is_mail = ( 0 === strpos( $link['url'], 'mailto:' ) );
					?>
					<a class="botiko-resource" href="<?php echo esc_url( $link['url'] ); ?>" <?php echo $is_mail ? '' : 'target="_blank" rel="noopener noreferrer"'; ?>>
						<span class="botiko-resource__ico"><?php self::the_icon( $link['icon'] ); ?></span>
						<span class="botiko-resource__body">
							<span class="botiko-resource__title"><?php echo esc_html( $link['title'] ); ?></span>
							<span class="botiko-resource__sub"><?php echo esc_html( $link['sub'] ); ?></span>
						</span>
						<span class="botiko-resource__arrow"><?php self::the_icon( 'chevron' ); ?></span>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}

	/**
	 * Sidebar: ask happy users to leave a review.
	 *
	 * @return void
	 */
	private function render_review() {
		?>
		<div class="botiko-card botiko-review">
			<span class="botiko-stars">
				<?php for ( $i = 0; $i < 5; $i++ ) : ?>
					<?php self::the_icon( 'star' ); ?>
				<?php endfor; ?>
			</span>
			<h2><?php esc_html_e( 'Podoba Ci się Botiko?', 'botiko' ); ?></h2>
			<p><?php esc_html_e( 'Twoja opinia pomaga innym mikrofirmom i motywuje nas do rozwoju wtyczki. Zajmie minutę.', 'botiko' ); ?></p>
			<a class="button button-primary" href="<?php echo esc_url( self::review_url() ); ?>" target="_blank" rel="noopener noreferrer">
				<?php self::the_icon( 'star' ); ?>
				<?php esc_html_e( 'Oceń wtyczkę', 'botiko' ); ?>
			</a>
		</div>
		<?php
	}

	/**
	 * Page footer meta.
	 *
	 * @return void
	 */
	private function render_footer() {
		?>
		<p class="botiko-foot">
			<?php
			printf(
				/* translators: %s: plugin version. */
				esc_html__( 'Botiko %s', 'botiko' ),
				esc_html( BOTIKO_VERSION )
			);
			?>
			·
			<a href="https://botiko.pl" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'botiko.pl', 'botiko' ); ?></a>
		</p>
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

	/**
	 * Echo an inline SVG icon, escaped through the SVG allow-list.
	 *
	 * @param string $name Icon key.
	 * @return void
	 */
	public static function the_icon( $name ) {
		echo wp_kses( self::icon( $name ), self::svg_allowed_html() );
	}

	/**
	 * Return an inline SVG icon (Lucide-style, currentColor). Static markup only.
	 *
	 * @param string $name Icon key.
	 * @return string
	 */
	public static function icon( $name ) {
		$open  = '<svg class="botiko-ico" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
		$close = '</svg>';

		$paths = array(
			'check'        => '<polyline points="20 6 9 17 4 12"/>',
			'alert'        => '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
			'shield-check' => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
			'refresh'      => '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
			'plug'         => '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/>',
			'unplug'       => '<path d="m19 5 3-3"/><path d="m2 22 3-3"/><path d="M6.3 11.7 4 14a4 4 0 0 0 0 5.66l.34.34A4 4 0 0 0 10 20l2.3-2.3"/><path d="M11.7 6.3 14 4a4 4 0 0 1 5.66 0l.34.34A4 4 0 0 1 20 10l-2.3 2.3"/>',
			'external'     => '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
			'chevron'      => '<polyline points="9 18 15 12 9 6"/>',
			'sliders'      => '<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>',
			'palette'      => '<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.7 1.7-1.6 0-.4-.2-.8-.5-1.1-.3-.3-.4-.6-.4-1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.1-10-8.1z"/>',
			'book'         => '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
			'grid'         => '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
			'lifebuoy'     => '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>',
			'compass'      => '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
			'star'         => '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>',
			'dot'          => '<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>',
			'dot-outline'  => '<circle cx="12" cy="12" r="5"/>',
		);

		$body = isset( $paths[ $name ] ) ? $paths[ $name ] : $paths['dot'];
		return $open . $body . $close;
	}

	/**
	 * Allow-list for inline SVG output via wp_kses().
	 *
	 * @return array<string,array<string,bool>>
	 */
	public static function svg_allowed_html() {
		$attrs = array(
			'class'           => true,
			'xmlns'           => true,
			'width'           => true,
			'height'          => true,
			'viewbox'         => true,
			'fill'            => true,
			'stroke'          => true,
			'stroke-width'    => true,
			'stroke-linecap'  => true,
			'stroke-linejoin' => true,
			'aria-hidden'     => true,
			'focusable'       => true,
		);
		$geo   = array(
			'd'      => true,
			'points' => true,
			'x'      => true,
			'y'      => true,
			'x1'     => true,
			'y1'     => true,
			'x2'     => true,
			'y2'     => true,
			'cx'     => true,
			'cy'     => true,
			'r'      => true,
			'rx'     => true,
			'ry'     => true,
			'width'  => true,
			'height' => true,
			'fill'   => true,
			'stroke' => true,
		);

		$group = array(
			'fill'   => true,
			'stroke' => true,
		);

		return array(
			'svg'      => $attrs,
			'g'        => $group,
			'path'     => $geo,
			'polyline' => $geo,
			'polygon'  => $geo,
			'line'     => $geo,
			'circle'   => $geo,
			'rect'     => $geo,
		);
	}
}
