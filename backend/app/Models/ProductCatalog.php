<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ProductCatalog Model
 *
 * Catálogo estandarizado de productos agrícolas
 *
 * @property int $id
 * @property string $name
 * @property string|null $category
 * @property array|null $aliases
 * @property string|null $description
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ProductCatalog extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'products_catalog';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'category',
        'aliases',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'aliases' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * Get the market prices for this product.
     *
     * @return HasMany
     */
    public function marketPrices(): HasMany
    {
        return $this->hasMany(MarketPrice::class, 'product_catalog_id');
    }

    /**
     * Get the variations for this product.
     *
     * @return HasMany
     */
    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class, 'product_catalog_id');
    }

    /**
     * Get the price trends for this product.
     *
     * @return HasMany
     */
    public function priceTrends(): HasMany
    {
        return $this->hasMany(PriceTrend::class, 'product_catalog_id');
    }

    /**
     * Get the recommendations for this product.
     *
     * @return HasMany
     */
    public function recommendations(): HasMany
    {
        return $this->hasMany(Recommendation::class, 'product_catalog_id');
    }

    /**
     * Scope a query to only include active products.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by category.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search products by name or aliases.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'LIKE', "%{$search}%")
              ->orWhere('description', 'LIKE', "%{$search}%")
              ->orWhereRaw("JSON_SEARCH(aliases, 'one', ?) IS NOT NULL", ["%{$search}%"]);
        });
    }

    /**
     * Check if a product name matches this catalog entry.
     *
     * @param string $productName
     * @return bool
     */
    public function matches(string $productName): bool
    {
        $productName = strtolower(trim($productName));
        $catalogName = strtolower($this->name);

        // Exact match
        if ($productName === $catalogName) {
            return true;
        }

        // Check if catalog name is contained in product name
        if (str_contains($productName, $catalogName)) {
            return true;
        }

        // Check aliases
        if ($this->aliases && is_array($this->aliases)) {
            foreach ($this->aliases as $alias) {
                $alias = strtolower($alias);
                if ($productName === $alias || str_contains($productName, $alias)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get the latest market price for this product.
     *
     * @return MarketPrice|null
     */
    public function getLatestPrice()
    {
        return $this->marketPrices()
            ->orderBy('date', 'desc')
            ->first();
    }

    /**
     * Get average price for a specific period.
     *
     * @param int $days
     * @return float|null
     */
    public function getAveragePrice(int $days = 30): ?float
    {
        $fromDate = now()->subDays($days);

        $avg = $this->marketPrices()
            ->where('date', '>=', $fromDate)
            ->avg('price_unit');

        return $avg ? (float) $avg : null;
    }

    /**
     * Get the current trend for this product.
     *
     * @return PriceTrend|null
     */
    public function getCurrentTrend()
    {
        return $this->priceTrends()
            ->orderBy('period_end', 'desc')
            ->first();
    }
}
