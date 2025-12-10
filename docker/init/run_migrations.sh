
#!/bin/sh
set -e

MARKER="/var/www/html/.migrations_done"

echo "Starting migrations runner"

if [ -f "$MARKER" ]; then
	echo "Marker found ($MARKER) — migrations already applied. Exiting."
	exit 0
fi

cd /var/www/html || exit 1

# Ensure env exists
cp -n .env.example .env || true

echo "Installing composer dependencies (no-dev)..."
composer install --no-dev --optimize-autoloader --no-interaction || true

echo "Generating app key if missing..."
php artisan key:generate --force || true

echo "Running migrations..."
php artisan migrate --force

# By default we skip seeding to avoid duplicate-key problems in repeated runs.
# To enable seeding, run with environment variable: RUN_SEED=true
if [ "${RUN_SEED:-false}" = "true" ]; then
	echo "RUN_SEED=true — executing db:seed (errors ignored)"
	php artisan db:seed --force || true
else
	echo "Skipping db:seed (set RUN_SEED=true to enable)"
fi

echo "Creating storage link (if missing)..."
php artisan storage:link || true

touch "$MARKER"
echo "Migrations runner finished — marker created: $MARKER"

exit 0
