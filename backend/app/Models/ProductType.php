<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductType extends Model
{
    use HasFactory;
    //
    protected $table = 'products_type';
    protected $fillable = ['type_name', 'description'];

    public function products()
    {
        return $this->hasMany(Product::class, 'product_type_id');
    }
}
