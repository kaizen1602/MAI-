<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'product_type_id',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function priceReferences()
    {
        return $this->hasMany(PriceReference::class);
    }

    public function priceAlerts()
    {
        return $this->hasMany(PriceAlert::class);
    }
    public function productType()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id');
    }
}
