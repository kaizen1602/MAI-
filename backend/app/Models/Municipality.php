<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Municipality extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'department_id',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function priceReferences()
    {
        return $this->hasMany(PriceReference::class);
    }
}
