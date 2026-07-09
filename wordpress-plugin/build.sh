#!/usr/bin/env bash
#
# Build a distributable ZIP of the Botiko WordPress plugin.
# Output: wordpress-plugin/dist/botiko.zip (ready for manual upload or SVN).
#
# Usage: ./wordpress-plugin/build.sh
set -euo pipefail

# The staged folder name MUST equal the WordPress.org slug, so the installed
# plugin directory matches the text domain (Plugin Check enforces this).
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SLUG="botiko-ai-customer-service-bot"
SRC="$HERE/botiko"
DIST="$HERE/dist"
STAGE="$DIST/$SLUG"

VERSION="$(grep -m1 -oE "Version:\s*[0-9]+\.[0-9]+\.[0-9]+" "$SRC/botiko.php" | grep -oE "[0-9]+\.[0-9]+\.[0-9]+")"
echo "Building Botiko plugin v${VERSION}..."

rm -rf "$DIST"
mkdir -p "$STAGE"

# Ship only runtime files, exclude dev tooling and build artifacts.
rsync -a \
	--exclude '.git*' \
	--exclude 'composer.json' \
	--exclude 'composer.lock' \
	--exclude 'phpcs.xml.dist' \
	--exclude 'vendor' \
	--exclude 'node_modules' \
	"$SRC/" "$STAGE/"

( cd "$DIST" && zip -rq "botiko.zip" "$SLUG" )
rm -rf "$STAGE"

echo "Done → $DIST/botiko.zip"
