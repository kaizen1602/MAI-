<?php

namespace App\Services;

use App\Models\ProductCatalog;
use App\Models\ProductVariation;
use App\Models\MeasurementUnit;
use Illuminate\Support\Str;

/**
 * ProductNormalizationService
 *
 * Servicio para normalizar nombres de productos crudos a productos del catálogo
 */
class ProductNormalizationService
{
    /**
     * Normalize a raw product name to catalog product.
     *
     * @param string $rawProductName
     * @param string|null $category
     * @return array{product: ProductCatalog|null, variation: ProductVariation|null, confidence: float}
     */
    public function normalize(string $rawProductName, ?string $category = null): array
    {
        // Clean input
        $rawProductName = $this->cleanProductName($rawProductName);

        // 1. Try exact match
        $result = $this->findExactMatch($rawProductName, $category);
        if ($result['product']) {
            return $result;
        }

        // 2. Try alias match
        $result = $this->findAliasMatch($rawProductName, $category);
        if ($result['product']) {
            return $result;
        }

        // 3. Try partial match
        $result = $this->findPartialMatch($rawProductName, $category);
        if ($result['product']) {
            return $result;
        }

        // 4. Try fuzzy match
        $result = $this->findFuzzyMatch($rawProductName, $category);
        if ($result['product']) {
            return $result;
        }

        // 5. Extract base and variation
        $result = $this->extractBaseAndVariation($rawProductName, $category);
        if ($result['product']) {
            return $result;
        }

        // Not found
        return [
            'product' => null,
            'variation' => null,
            'confidence' => 0.0
        ];
    }

    /**
     * Clean product name.
     *
     * @param string $name
     * @return string
     */
    protected function cleanProductName(string $name): string
    {
        // To uppercase
        $name = strtoupper(trim($name));

        // Remove extra spaces
        $name = preg_replace('/\s+/', ' ', $name);

        // Remove special characters (keep letters, numbers, spaces)
        $name = preg_replace('/[^\p{L}\p{N}\s]/u', '', $name);

        return $name;
    }

    /**
     * Find exact match.
     *
     * @param string $name
     * @param string|null $category
     * @return array
     */
    protected function findExactMatch(string $name, ?string $category): array
    {
        $query = ProductCatalog::active()
            ->where('name', $name);

        if ($category) {
            $query->where('category', $category);
        }

        $product = $query->first();

        if ($product) {
            return [
                'product' => $product,
                'variation' => null,
                'confidence' => 1.0
            ];
        }

        return ['product' => null, 'variation' => null, 'confidence' => 0.0];
    }

    /**
     * Find match in aliases.
     *
     * @param string $name
     * @param string|null $category
     * @return array
     */
    protected function findAliasMatch(string $name, ?string $category): array
    {
        $query = ProductCatalog::active();

        if ($category) {
            $query->where('category', $category);
        }

        $products = $query->get();

        foreach ($products as $product) {
            if ($product->aliases && is_array($product->aliases)) {
                foreach ($product->aliases as $alias) {
                    if (strtoupper($alias) === $name) {
                        return [
                            'product' => $product,
                            'variation' => null,
                            'confidence' => 0.95
                        ];
                    }
                }
            }
        }

        return ['product' => null, 'variation' => null, 'confidence' => 0.0];
    }

    /**
     * Find partial match (product name contained in raw name).
     *
     * @param string $name
     * @param string|null $category
     * @return array
     */
    protected function findPartialMatch(string $name, ?string $category): array
    {
        $query = ProductCatalog::active();

        if ($category) {
            $query->where('category', $category);
        }

        $products = $query->get();

        // Try finding product name in raw name
        foreach ($products as $product) {
            $productName = strtoupper($product->name);

            if (str_contains($name, $productName)) {
                // Check if there's a variation
                $variationPart = str_replace($productName, '', $name);
                $variationPart = trim($variationPart);

                $variation = null;
                if (!empty($variationPart)) {
                    $variation = $this->findVariation($product->id, $variationPart);
                }

                return [
                    'product' => $product,
                    'variation' => $variation,
                    'confidence' => 0.85
                ];
            }
        }

        return ['product' => null, 'variation' => null, 'confidence' => 0.0];
    }

    /**
     * Find fuzzy match using Levenshtein distance.
     *
     * @param string $name
     * @param string|null $category
     * @param float $threshold
     * @return array
     */
    protected function findFuzzyMatch(string $name, ?string $category, float $threshold = 0.7): array
    {
        $query = ProductCatalog::active();

        if ($category) {
            $query->where('category', $category);
        }

        $products = $query->get();
        $bestMatch = null;
        $bestSimilarity = 0.0;

        foreach ($products as $product) {
            $productName = strtoupper($product->name);
            $similarity = $this->calculateSimilarity($name, $productName);

            if ($similarity > $bestSimilarity && $similarity >= $threshold) {
                $bestSimilarity = $similarity;
                $bestMatch = $product;
            }

            // Also check aliases
            if ($product->aliases && is_array($product->aliases)) {
                foreach ($product->aliases as $alias) {
                    $aliasSimilarity = $this->calculateSimilarity($name, strtoupper($alias));
                    if ($aliasSimilarity > $bestSimilarity && $aliasSimilarity >= $threshold) {
                        $bestSimilarity = $aliasSimilarity;
                        $bestMatch = $product;
                    }
                }
            }
        }

        if ($bestMatch) {
            return [
                'product' => $bestMatch,
                'variation' => null,
                'confidence' => $bestSimilarity
            ];
        }

        return ['product' => null, 'variation' => null, 'confidence' => 0.0];
    }

    /**
     * Extract base product and variation.
     *
     * @param string $name
     * @param string|null $category
     * @return array
     */
    protected function extractBaseAndVariation(string $name, ?string $category): array
    {
        // Common variation keywords
        $variationKeywords = [
            'LAVADA', 'SUCIA', 'ROJA', 'BLANCA', 'VERDE', 'AMARILLA',
            'NEGRA', 'CRIOLLA', 'IMPORTADA', 'NACIONAL', 'EXTRA',
            'PRIMERA', 'SEGUNDA', 'INDUSTRIAL', 'HARTON', 'COLICERO',
            'HASS', 'PIELES VERDES', 'TOMMY', 'REINA', 'CHANCLETO'
        ];

        foreach ($variationKeywords as $keyword) {
            if (str_contains($name, $keyword)) {
                // Remove variation to get base name
                $baseName = str_replace($keyword, '', $name);
                $baseName = trim($baseName);

                // Try to find base product
                $result = $this->findPartialMatch($baseName, $category);

                if ($result['product']) {
                    // Find or create variation
                    $variation = $this->findOrCreateVariation($result['product']->id, $keyword);

                    return [
                        'product' => $result['product'],
                        'variation' => $variation,
                        'confidence' => 0.75
                    ];
                }
            }
        }

        return ['product' => null, 'variation' => null, 'confidence' => 0.0];
    }

    /**
     * Find variation for a product.
     *
     * @param int $productId
     * @param string $variationName
     * @return ProductVariation|null
     */
    protected function findVariation(int $productId, string $variationName): ?ProductVariation
    {
        return ProductVariation::active()
            ->where('product_catalog_id', $productId)
            ->where('variation_name', strtoupper(trim($variationName)))
            ->first();
    }

    /**
     * Find or create variation.
     *
     * @param int $productId
     * @param string $variationName
     * @return ProductVariation|null
     */
    protected function findOrCreateVariation(int $productId, string $variationName): ?ProductVariation
    {
        $variation = $this->findVariation($productId, $variationName);

        if (!$variation) {
            $variation = ProductVariation::create([
                'product_catalog_id' => $productId,
                'variation_name' => strtoupper(trim($variationName)),
                'price_modifier' => 1.0,
                'is_active' => true
            ]);
        }

        return $variation;
    }

    /**
     * Calculate similarity between two strings.
     *
     * Uses Levenshtein distance normalized.
     *
     * @param string $str1
     * @param string $str2
     * @return float
     */
    protected function calculateSimilarity(string $str1, string $str2): float
    {
        $maxLength = max(strlen($str1), strlen($str2));

        if ($maxLength === 0) {
            return 1.0;
        }

        $distance = levenshtein($str1, $str2);

        return 1.0 - ($distance / $maxLength);
    }

    /**
     * Normalize measurement unit.
     *
     * @param string $unitName
     * @return MeasurementUnit|null
     */
    public function normalizeMeasurementUnit(string $unitName): ?MeasurementUnit
    {
        $unitName = strtoupper(trim($unitName));

        // Exact match
        $unit = MeasurementUnit::active()
            ->where('unit_name', $unitName)
            ->first();

        if ($unit) {
            return $unit;
        }

        // Fuzzy match
        $units = MeasurementUnit::active()->get();
        $bestMatch = null;
        $bestSimilarity = 0.0;

        foreach ($units as $unit) {
            $similarity = $this->calculateSimilarity($unitName, strtoupper($unit->unit_name));
            if ($similarity > $bestSimilarity && $similarity >= 0.8) {
                $bestSimilarity = $similarity;
                $bestMatch = $unit;
            }
        }

        return $bestMatch;
    }

    /**
     * Get normalization suggestions for a raw name.
     *
     * @param string $rawProductName
     * @param int $limit
     * @return array
     */
    public function getSuggestions(string $rawProductName, int $limit = 5): array
    {
        $rawProductName = $this->cleanProductName($rawProductName);
        $suggestions = [];

        $products = ProductCatalog::active()->get();

        foreach ($products as $product) {
            $productName = strtoupper($product->name);
            $similarity = $this->calculateSimilarity($rawProductName, $productName);

            $suggestions[] = [
                'product' => $product,
                'similarity' => $similarity
            ];

            // Also check aliases
            if ($product->aliases && is_array($product->aliases)) {
                foreach ($product->aliases as $alias) {
                    $aliasSimilarity = $this->calculateSimilarity($rawProductName, strtoupper($alias));
                    if ($aliasSimilarity > $similarity) {
                        $suggestions[] = [
                            'product' => $product,
                            'similarity' => $aliasSimilarity
                        ];
                    }
                }
            }
        }

        // Sort by similarity
        usort($suggestions, function ($a, $b) {
            return $b['similarity'] <=> $a['similarity'];
        });

        // Remove duplicates and limit
        $seen = [];
        $unique = [];

        foreach ($suggestions as $suggestion) {
            $productId = $suggestion['product']->id;
            if (!isset($seen[$productId])) {
                $seen[$productId] = true;
                $unique[] = $suggestion;
            }
            if (count($unique) >= $limit) {
                break;
            }
        }

        return $unique;
    }
}
