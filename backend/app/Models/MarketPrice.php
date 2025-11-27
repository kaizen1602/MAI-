<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * MarketPrice Model
 *
 * Precios históricos de Corabastos
 *
 * @property int $id
 * @property int $product_catalog_id
 * @property int|null $product_variation_id
 * @property int $measurement_unit_id
 * @property float $quantity
 * @property float|null $price_extra
 * @property float|null $price_first
 * @property float $price_unit
 * @property string $price_variation
 * @property string $date
 * @property string $source
 * @property string|null $raw_name
 * @property float $extraction_confidence
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class MarketPrice extends Model
{
    protected $table = 'market_prices';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'product_catalog_id',
        'product_variation_id',
        'measurement_unit_id',
        'quantity',
        'price_extra',
        'price_first',
        'price_unit',
        'price_variation',
        'date',
        'source',
        'raw_name',
        'extraction_confidence',
    ];

    protected $casts = [
        'product_catalog_id' => 'integer',
        'product_variation_id' => 'integer',
        'measurement_unit_id' => 'integer',
        'quantity' => 'decimal:2',
        'price_extra' => 'decimal:2',
        'price_first' => 'decimal:2',
        'price_unit' => 'decimal:2',
        'extraction_confidence' => 'decimal:2',
        'date' => 'date',
        'created_at' => 'datetime',
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
     * Get the product variation.
     *
     * @return BelongsTo
     */
    public function productVariation(): BelongsTo
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }

    /**
     * Get the measurement unit.
     *
     * @return BelongsTo
     */
    public function measurementUnit(): BelongsTo
    {
        return $this->belongsTo(MeasurementUnit::class, 'measurement_unit_id');
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
     * Scope by date range.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $from
     * @param string $to
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDateRange($query, string $from, string $to)
    {
        return $query->whereBetween('date', [$from, $to]);
    }

    /**
     * Scope by source.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $source
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBySource($query, string $source)
    {
        return $query->where('source', $source);
    }

    /**
     * Scope recent prices (last N days).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $days
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecent($query, int $days = 30)
    {
        $fromDate = now()->subDays($days)->format('Y-m-d');
        return $query->where('date', '>=', $fromDate);
    }

    /**
     * Scope latest price per product.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('date', 'desc');
    }

    /**
     * Get the best price (lowest).
     *
     * @return float
     */
    public function getBestPrice(): float
    {
        $prices = array_filter([
            $this->price_unit,
            $this->price_first,
            $this->price_extra
        ]);

        return !empty($prices) ? min($prices) : $this->price_unit;
    }

    /**
     * Get price per kilogram.
     *
     * @return float|null
     */
    public function getPricePerKg(): ?float
    {
        if ($this->measurementUnit && $this->measurementUnit->hasKgEquivalent()) {
            $totalKg = $this->measurementUnit->convertToKg($this->quantity);
            if ($totalKg > 0) {
                return $this->price_unit / $totalKg;
            }
        }

        // If unit is already KILO
        if ($this->measurementUnit && strtoupper($this->measurementUnit->unit_name) === 'KILO') {
            return $this->price_unit / $this->quantity;
        }

        return null;
    }

    /**
     * Check if price went up.
     *
     * @return bool
     */
    public function isPriceIncreasing(): bool
    {
        return strtolower($this->price_variation) === 'subio';
    }

    /**
     * Check if price went down.
     *
     * @return bool
     */
    public function isPriceDecreasing(): bool
    {
        return strtolower($this->price_variation) === 'bajo';
    }

    /**
     * Check if price is stable.
     *
     * @return bool
     */
    public function isPriceStable(): bool
    {
        return strtolower($this->price_variation) === 'estable';
    }
}
