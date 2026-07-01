=== Botiko — AI Customer Service Bot ===
Contributors: botiko
Tags: chatbot, customer service, live chat, lead generation, ai
Requires at least: 5.8
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.0.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Add the Botiko customer-service bot to your site. It answers visitors 24/7 and captures leads. Connect with one code, no theme editing.

== Description ==

Botiko is a customer-service bot for small service businesses — beauty salons, health and spa studios, restaurants and car workshops. It answers customer questions 24/7 based on your business knowledge (prices, hours, services), captures leads, and points visitors to your booking tool.

This plugin embeds the Botiko chat widget on your WordPress site without editing your theme and without any code.

Highlights:

* **One-code connection** — paste a connection code from the Botiko dashboard and the plugin fetches your bot and authorises this site's domain.
* **Live status** — see whether the bot is connected, whether the domain is authorised, and whether the bot is online.
* **Display rules** — show the bot on every page, everywhere except selected pages, or only on selected pages.
* **Test mode** — show the bot to logged-in administrators first, before you make it public.
* The bot never appears in the WordPress admin area.

A Botiko account is required. The bot's appearance, working hours and suggested questions are configured in the Botiko dashboard and are shared across every site where the bot runs.

== Installation ==

1. Install and activate the plugin (Plugins → Add New → search for "Botiko", or upload the ZIP).
2. Open the "Botiko" item in the WordPress admin menu.
3. In the Botiko dashboard (botiko.pl → Install → WordPress), generate a connection code.
4. Paste the code into the "Connect site" field and click the button. Done — the bot appears on the front end of your site.

No account yet? Create one at https://botiko.pl (14-day free trial).

== Frequently Asked Questions ==

= Do I need a Botiko account? =
Yes. The plugin embeds your existing bot. Create an account at https://botiko.pl.

= Where do I get the connection code? =
In the Botiko dashboard: Install → WordPress → "Generate connection code". The code is valid for 15 minutes and can be used once.

= The chat does not appear or does not answer. =
On the plugin settings screen, check that the status shows "Domain authorised". If it does not, connect the site again with a code, or add the domain in the Botiko dashboard under Settings → Domains.

= How do I change the bot colour or working hours? =
In the Botiko dashboard — those settings are shared across every site where the bot runs.

== Screenshots ==

1. Connect your site with a single code.
2. Live status: connected, domain authorised, online.
3. Display rules and test mode.
4. The bot on the front end of your site.

== External services ==

This plugin connects to the Botiko service so the customer-service bot can work:

* **Botiko widget** — the plugin loads the widget script from `https://widget.botiko.pl/embed.js`. The script renders the chat window on the front end of your site.
* **Botiko API** (`https://api.botiko.pl`) — the plugin calls the public configuration endpoint (to show the bot status) and the pairing endpoint (to authorise this site's domain when you connect). Data sent: the bot identifier and this site's address (domain). The plugin does not send visitor data or page content.

Use of the Botiko service is subject to its terms (https://botiko.pl/regulamin) and privacy policy (https://botiko.pl/prywatnosc).

== Changelog ==

= 1.0.4 =
* Corrected the in-plugin "rate this plugin" link to the directory slug.

= 1.0.3 =
* Compliance and polish: English readme, translations loaded automatically (removed manual textdomain call), updated "Tested up to".

= 1.0.2 =
* Minor UI fixes: centered display-rule controls, corrected dashboard link.

= 1.0.1 =
* Redesigned admin screen: dedicated "Botiko" menu item with logo, branded header, two-column layout, vector icons, help and rating sections.

= 1.0.0 =
* First release: widget embedding, one-code connection, live status, display rules, test mode.
