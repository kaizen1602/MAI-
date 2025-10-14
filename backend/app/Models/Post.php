<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'quantity_kg',
        'price_per_kg',
        'status',
        'post_type_id',
        'product_id',
        'user_id',
        'municipality_id',
    ];

    public function postType()
    {
        return $this->belongsTo(PostType::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function municipality()
    {
        return $this->belongsTo(Municipality::class);
    }

    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'user_publication_favorites', 'post_id', 'user_id')
            ->withPivot('date')
            ->withTimestamps();
    }
}
