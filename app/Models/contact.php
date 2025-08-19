<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class contact extends Model
{
    use HasFactory;
    public static array $Services =[
    'UI/UXDesign',
    'WordpressPlugin',
    'WordpressTheme',
    'RestApi',
    'WebMobileApp',
    'WebsiteDeveloper'
];
    protected $casts = ['options' => 'array'];
    protected $fillable = ['name' , 'email' , 'services'];
}
