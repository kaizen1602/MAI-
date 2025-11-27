<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ProductVariation Model
 *
 * Variaciones de productos (lavada, sucia, roja, etc.)
 *
 * @property int $id
 * @property int $product_catalog_id
 * @property string $variation_name
 * @property float $price_modifier
 * @property string|null $description
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ProductVariation extends Model
{
    protected $table = 'product_variations';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'product_catalog_id',
        'variation_name',
        'price_modifier',
        'description',
        'is_active',
    ];

    protected $casts = [
        'product_catalog_id' => 'integer',
        'price_modifier' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the product catalog this variation belongs to.
     *
     * @return BelongsTo
     */
    public function productCatalog(): BelongsTo
    {
        return $this->belongsTo(ProductCatalog::class, 'product_catalog_id');
    }

    /**
     * Get the market prices for this variation.
     *
     * @return HasMany
     */
    public function marketPrices(): HasMany
    {
        return $this->hasMany(MarketPrice::class, 'product_variation_id');
    }

    /**
     * Scope active variations.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Apply price modifier to a base price.
     *
     * @param float $basePrice
     * @return float
     */
    public function applyModifier(float $basePrice): float
    {
        return $basePrice * $this->price_modifier;
    }

    /**
     * Get full product name with variation.
     *
     * @return string
     */
    public function getFullName(): string
    {
        return $this->productCatalog->name . ' ' . $this->variation_name;
    }
}
