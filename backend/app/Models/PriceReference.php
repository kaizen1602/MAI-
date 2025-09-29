<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceReference extends Model
{
    use HasFactory;

    protected $fillable = [
        'price_per_kg',
        'date',
        'source',
        'product_id',
        'municipality_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }
}
