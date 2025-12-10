# Init scripts

This folder contains one-off scripts used during development to prepare the backend.

run_migrations.sh
- Purpose: applies database migrations and (optionally) seeds.
- Behavior:
  - Idempotent: if `/var/www/html/.migrations_done` exists the script exits immediately.
  - By default **does not** run `db:seed` to avoid duplicate-key errors when run multiple times.
  - To force seeding set the environment variable `RUN_SEED=true` when running the container.

Usage examples (from project root):

Run migrations only (safe, default):
```powershell
docker-compose run --rm php_migrate
```

Run migrations and seed (explicit):
```powershell
docker-compose run --rm -e RUN_SEED=true php_migrate
```

Run specific seeder via the running php-fpm container:
```powershell
docker-compose exec php_fpm php artisan db:seed --class=SpecificSeeder --force
```

Notes:
- We recommend not running seeds automatically during `php_fpm` startup to keep the service stable and avoid intermittent 502 errors.
- If you need a clean database, drop the DB volume, recreate it and then run the migrate+seed command above.
 - If your seeders are failing due to duplicate data, you can run the cleanup SQL included here before seeding:
 ```powershell
 # from project root — run SQL against the mysql container using compose defaults
 docker exec -i mysql_db mysql -uagro_user -pagro_password agro_db < docker/init/cleanup_duplicates.sql
 # Then run seeders explicitly
 docker-compose run --rm -e RUN_SEED=true php_migrate
```
