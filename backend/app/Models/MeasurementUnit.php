<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * MeasurementUnit Model
 *
 * Unidades de medida estandarizadas
 *
 * @property int $id
 * @property string $unit_name
 * @property string $unit_type
 * @property float|null $kg_equivalent
 * @property string|null $description
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class MeasurementUnit extends Model
{
    protected $table = 'measurement_units';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'unit_name',
        'unit_type',
        'kg_equivalent',
        'description',
        'is_active',
    ];

    protected $casts = [
        'kg_equivalent' => 'decimal:4',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the market prices using this unit.
     *
     * @return HasMany
     */
    public function marketPrices(): HasMany
    {
        return $this->hasMany(MarketPrice::class, 'measurement_unit_id');
    }

    /**
     * Scope active units.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope by type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByType($query, $type)
    {
        return $query->where('unit_type', $type);
    }

    /**
     * Convert quantity to kilograms.
     *
     * @param float $quantity
     * @return float|null
     */
    public function convertToKg(float $quantity): ?float
    {
        if ($this->kg_equivalent === null) {
            return null;
        }

        return $quantity * $this->kg_equivalent;
    }

    /**
     * Check if unit has kg equivalent.
     *
     * @return bool
     */
    public function hasKgEquivalent(): bool
    {
        return $this->kg_equivalent !== null && $this->kg_equivalent > 0;
    }
}
