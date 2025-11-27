<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Recommendation Model
 *
 * Historial de recomendaciones generadas
 *
 * @property int $id
 * @property int|null $post_id
 * @property int $user_id
 * @property int $product_catalog_id
 * @property float $user_price
 * @property float $market_avg_price
 * @property float|null $market_min_price
 * @property float|null $market_max_price
 * @property string $recommendation_type
 * @property float|null $difference_percentage
 * @property string|null $suggestion_text
 * @property bool|null $was_accepted
 * @property float|null $final_price
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Recommendation extends Model
{
    protected $table = 'recommendations';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [
        'post_id',
        'user_id',
        'product_catalog_id',
        'user_price',
        'market_avg_price',
        'market_min_price',
        'market_max_price',
        'recommendation_type',
        'difference_percentage',
        'suggestion_text',
        'was_accepted',
        'final_price',
    ];

    protected $casts = [
        'post_id' => 'integer',
        'user_id' => 'integer',
        'product_catalog_id' => 'integer',
        'user_price' => 'decimal:2',
        'market_avg_price' => 'decimal:2',
        'market_min_price' => 'decimal:2',
        'market_max_price' => 'decimal:2',
        'difference_percentage' => 'decimal:2',
        'was_accepted' => 'boolean',
        'final_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Recommendation types
    const TYPE_VERY_LOW = 'MUY_POR_DEBAJO';
    const TYPE_LOW = 'POR_DEBAJO';
    const TYPE_IN_RANGE = 'EN_RANGO';
    const TYPE_HIGH = 'POR_ENCIMA';
    const TYPE_VERY_HIGH = 'MUY_POR_ENCIMA';
    const TYPE_NO_DATA = 'NO_DATA';

    /**
     * Get the post.
     *
     * @return BelongsTo
     */
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id', 'post_id');
    }

    /**
     * Get the user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

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
     * Scope by user.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope by type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('recommendation_type', $type);
    }

    /**
     * Scope recent recommendations.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $days
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope accepted recommendations.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAccepted($query)
    {
        return $query->where('was_accepted', true);
    }

    /**
     * Check if recommendation is very low.
     *
     * @return bool
     */
    public function isVeryLow(): bool
    {
        return $this->recommendation_type === self::TYPE_VERY_LOW;
    }

    /**
     * Check if recommendation is in range.
     *
     * @return bool
     */
    public function isInRange(): bool
    {
        return $this->recommendation_type === self::TYPE_IN_RANGE;
    }

    /**
     * Check if recommendation is very high.
     *
     * @return bool
     */
    public function isVeryHigh(): bool
    {
        return $this->recommendation_type === self::TYPE_VERY_HIGH;
    }

    /**
     * Get recommendation color for UI.
     *
     * @return string
     */
    public function getColor(): string
    {
        return match($this->recommendation_type) {
            self::TYPE_VERY_LOW => 'red',
            self::TYPE_LOW => 'orange',
            self::TYPE_IN_RANGE => 'green',
            self::TYPE_HIGH => 'yellow',
            self::TYPE_VERY_HIGH => 'darkred',
            default => 'gray',
        };
    }

    /**
     * Get recommendation icon for UI.
     *
     * @return string
     */
    public function getIcon(): string
    {
        return match($this->recommendation_type) {
            self::TYPE_VERY_LOW => '⚠️',
            self::TYPE_LOW => '⬇️',
            self::TYPE_IN_RANGE => '✅',
            self::TYPE_HIGH => '⬆️',
            self::TYPE_VERY_HIGH => '🔴',
            default => 'ℹ️',
        };
    }

    /**
     * Mark recommendation as accepted.
     *
     * @param float|null $finalPrice
     * @return bool
     */
    public function markAsAccepted(?float $finalPrice = null): bool
    {
        $this->was_accepted = true;
        if ($finalPrice !== null) {
            $this->final_price = $finalPrice;
        }
        return $this->save();
    }

    /**
     * Get price difference in COP.
     *
     * @return float
     */
    public function getPriceDifference(): float
    {
        return $this->user_price - $this->market_avg_price;
    }

    /**
     * Get absolute difference percentage.
     *
     * @return float
     */
    public function getAbsoluteDifferencePercentage(): float
    {
        return abs($this->difference_percentage ?? 0);
    }
}
