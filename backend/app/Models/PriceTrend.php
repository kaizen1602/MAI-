<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PriceTrend Model
 *
 * Tendencias de precios calculadas
 *
 * @property int $id
 * @property int $product_catalog_id
 * @property string $period_start
 * @property string $period_end
 * @property float $avg_price
 * @property float $min_price
 * @property float $max_price
 * @property float|null $price_volatility
 * @property string $trend_direction
 * @property float|null $price_change_percentage
 * @property int $data_points
 * @property \Carbon\Carbon $calculated_at
 * @property \Carbon\Carbon $updated_at
 */
class PriceTrend extends Model
{
    protected $table = 'price_trends';
    protected $primaryKey = 'id';
    public $timestamps = false;

    const UPDATED_AT = 'updated_at';
    const CREATED_AT = 'calculated_at';

    protected $fillable = [
        'product_catalog_id',
        'period_start',
        'period_end',
        'avg_price',
        'min_price',
        'max_price',
        'price_volatility',
        'trend_direction',
        'price_change_percentage',
        'data_points',
    ];

    protected $casts = [
        'product_catalog_id' => 'integer',
        'period_start' => 'date',
        'period_end' => 'date',
        'avg_price' => 'decimal:2',
        'min_price' => 'decimal:2',
        'max_price' => 'decimal:2',
        'price_volatility' => 'decimal:2',
        'price_change_percentage' => 'decimal:2',
        'data_points' => 'integer',
        'calculated_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the product catalog.
     *
     * @return BelongsTo
     */
    public function productCatalog(): BelongsTo
    {
        return $this->belongsTo(ProductCatalog::class, 'product_catalog_id');
    }

    /**
     * Scope by product.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $productId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByProduct($query, int $productId)
    {
        return $query->where('product_catalog_id', $productId);
    }

    /**
     * Scope recent trends.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $days
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecent($query, int $days = 7)
    {
        $fromDate = now()->subDays($days)->format('Y-m-d');
        return $query->where('period_end', '>=', $fromDate);
    }

    /**
     * Scope by trend direction.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $direction
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByDirection($query, string $direction)
    {
        return $query->where('trend_direction', strtoupper($direction));
    }

    /**
     * Scope volatile products (high volatility).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param float $threshold
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeVolatile($query, float $threshold = 1000)
    {
        return $query->where('price_volatility', '>', $threshold);
    }

    /**
     * Scope stable products (low volatility).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param float $threshold
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeStable($query, float $threshold = 500)
    {
        return $query->where('price_volatility', '<=', $threshold);
    }

    /**
     * Check if trend is going up.
     *
     * @return bool
     */
    public function isIncreasing(): bool
    {
        return $this->trend_direction === 'UP';
    }

    /**
     * Check if trend is going down.
     *
     * @return bool
     */
    public function isDecreasing(): bool
    {
        return $this->trend_direction === 'DOWN';
    }

    /**
     * Check if trend is stable.
     *
     * @return bool
     */
    public function isStable(): bool
    {
        return $this->trend_direction === 'STABLE';
    }

    /**
     * Get price range.
     *
     * @return float
     */
    public function getPriceRange(): float
    {
        return $this->max_price - $this->min_price;
    }

    /**
     * Get volatility percentage.
     *
     * @return float|null
     */
    public function getVolatilityPercentage(): ?float
    {
        if ($this->price_volatility === null || $this->avg_price == 0) {
            return null;
        }

        return ($this->price_volatility / $this->avg_price) * 100;
    }

    /**
     * Get trend description.
     *
     * @return string
     */
    public function getDescription(): string
    {
        $direction = match($this->trend_direction) {
            'UP' => 'aumentando',
            'DOWN' => 'disminuyendo',
            default => 'estable',
        };

        $volatility = $this->getVolatilityPercentage();
        $volatilityDesc = $volatility !== null && $volatility > 15 ? 'alta volatilidad' : 'baja volatilidad';

        return "Precio {$direction} con {$volatilityDesc}";
    }
}
