<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class recentSubmissions extends Model
{
    protected $fillable = [
        'assignment_id',
        'user_id',
        'due_date',
        'status',
        'deleted', 
        'created_by', 
        'updated_by', 
        'deleted_by',
        'deleted_at'
    ];

    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
