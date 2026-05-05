<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'materi_id',
        'user_id',
        'submission_type',
        'google_form_link',
        'due_date',
        'description',
        'status',
        'answer',
        'score'
    ];

    public function materi()
    {
        return $this->belongsTo(Materi::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
