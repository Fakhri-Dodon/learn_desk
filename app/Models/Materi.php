<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materi extends Model
{
    protected $fillable = [
        'user_id', 
        'title', 
        'url', 
        'link', 
        'description', 
        'class',
        'deleted', 
        'created_by', 
        'updated_by', 
        'deleted_by',
        'deleted_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }
}
