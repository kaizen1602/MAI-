<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Subir un archivo o imagen sin procesar.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return string URL del archivo subido
     */
    public function uploadImage(UploadedFile $file, string $directory = 'posts'): string
    {
        // Generar nombre único
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

        // Guardar en storage (disco public)
        $path = $file->storeAs($directory, $filename, 'public');

        // Retornar la URL relativa (sin dominio) para evitar problemas con localhost
        return '/storage/' . $path;
    }

    /**
     * Subir múltiples archivos.
     *
     * @param array $files
     * @param string $directory
     * @return array URLs de los archivos subidos
     */
    public function uploadMultipleImages(array $files, string $directory = 'posts'): array
    {
        $urls = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $urls[] = $this->uploadImage($file, $directory);
            }
        }

        return $urls;
    }

    /**
     * Eliminar un archivo del almacenamiento.
     *
     * @param string $url
     * @return bool
     */
    public function deleteImage(string $url): bool
    {
        // Extraer el path relativo de la URL
        $path = str_replace('/storage/', '', parse_url($url, PHP_URL_PATH));

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }

    /**
     * Eliminar múltiples archivos.
     *
     * @param array $urls
     * @return void
     */
    public function deleteMultipleImages(array $urls): void
    {
        foreach ($urls as $url) {
            $this->deleteImage($url);
        }
    }
}
