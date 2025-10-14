<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPublicationFavorite extends Model
{
    use HasFactory;

    protected $table = 'user_publication_favorites';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'post_id',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];
}
