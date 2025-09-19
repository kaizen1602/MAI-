<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prubea extends Model
{
    use HasFactory;

    protected $table = 'prubea';

    protected $fillable = [
        'nombres',
        'apellidos',
        'email',
        'telefono',
        'fecha_nacimiento',
    ];
}
