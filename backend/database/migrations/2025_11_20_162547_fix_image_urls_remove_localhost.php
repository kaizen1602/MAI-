<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Esta migración convierte URLs absolutas (con localhost) a URLs relativas
     * para que funcionen correctamente en cualquier entorno.
     */
    public function up(): void
    {
        // Skip this migration in SQLite (used for testing) as it uses MySQL-specific functions
        if (DB::getDriverName() === 'sqlite') {
            echo "Skipping image URL fix migration in SQLite\n";
            return;
        }

        // Actualizar URLs en la tabla post_images
        // Convierte: http://localhost/storage/posts/10/xxx.png
        // A: /storage/posts/10/xxx.png
        DB::table('post_images')
            ->where(function($query) {
                $query->where('image_url', 'like', 'http://%')
                      ->orWhere('image_url', 'like', 'https://%');
            })
            ->update([
                'image_url' => DB::raw("
                    CASE
                        WHEN image_url LIKE 'http://localhost/%' THEN REPLACE(image_url, 'http://localhost', '')
                        WHEN image_url LIKE 'https://localhost/%' THEN REPLACE(image_url, 'https://localhost', '')
                        WHEN image_url LIKE 'http://localhost:%' THEN CONCAT('/', SUBSTRING_INDEX(image_url, '/', -1))
                        WHEN image_url LIKE 'https://localhost:%' THEN CONCAT('/', SUBSTRING_INDEX(image_url, '/', -1))
                        WHEN image_url LIKE 'http://%/storage/%' THEN CONCAT('/storage/', SUBSTRING_INDEX(image_url, '/storage/', -1))
                        WHEN image_url LIKE 'https://%/storage/%' THEN CONCAT('/storage/', SUBSTRING_INDEX(image_url, '/storage/', -1))
                        ELSE image_url
                    END
                ")
            ]);

        // Actualizar URLs de profile_image en la tabla users
        DB::table('users')
            ->whereNotNull('profile_image')
            ->where(function($query) {
                $query->where('profile_image', 'like', 'http://%')
                      ->orWhere('profile_image', 'like', 'https://%');
            })
            ->update([
                'profile_image' => DB::raw("
                    CASE
                        WHEN profile_image LIKE 'http://localhost/%' THEN REPLACE(profile_image, 'http://localhost', '')
                        WHEN profile_image LIKE 'https://localhost/%' THEN REPLACE(profile_image, 'https://localhost', '')
                        WHEN profile_image LIKE 'http://localhost:%' THEN CONCAT('/', SUBSTRING_INDEX(profile_image, '/', -1))
                        WHEN profile_image LIKE 'https://localhost:%' THEN CONCAT('/', SUBSTRING_INDEX(profile_image, '/', -1))
                        WHEN profile_image LIKE 'http://%/storage/%' THEN CONCAT('/storage/', SUBSTRING_INDEX(profile_image, '/storage/', -1))
                        WHEN profile_image LIKE 'https://%/storage/%' THEN CONCAT('/storage/', SUBSTRING_INDEX(profile_image, '/storage/', -1))
                        ELSE profile_image
                    END
                ")
            ]);

        // Log de actualización
        $postImagesUpdated = DB::table('post_images')
            ->where('image_url', 'like', '/storage/%')
            ->count();

        $usersUpdated = DB::table('users')
            ->whereNotNull('profile_image')
            ->where('profile_image', 'like', '/storage/%')
            ->count();

        echo "\n✅ Migración completada:\n";
        echo "   - Post images actualizadas: {$postImagesUpdated}\n";
        echo "   - User profiles actualizados: {$usersUpdated}\n\n";
    }

    /**
     * Reverse the migrations.
     *
     * NOTA: No es posible revertir completamente esta migración porque
     * no sabemos cuál era el dominio original. Se mantiene el código
     * por compatibilidad pero no se recomienda ejecutar rollback.
     */
    public function down(): void
    {
        // Skip this migration in SQLite (used for testing) as it uses MySQL-specific functions
        if (DB::getDriverName() === 'sqlite') {
            echo "Skipping image URL fix migration in SQLite\n";
            return;
        }

        // Revertir a localhost (solo para desarrollo)
        DB::table('post_images')
            ->where('image_url', 'like', '/storage/%')
            ->update([
                'image_url' => DB::raw("CONCAT('http://localhost', image_url)")
            ]);

        DB::table('users')
            ->whereNotNull('profile_image')
            ->where('profile_image', 'like', '/storage/%')
            ->update([
                'profile_image' => DB::raw("CONCAT('http://localhost', profile_image)")
            ]);
    }
};