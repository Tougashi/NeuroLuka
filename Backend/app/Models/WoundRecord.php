<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WoundRecord extends Model
{
    protected $fillable = [
        'user_id',
        'original_image',
        'segmentation_image',
        'area_cm2',
        'confidence',
        'wound_type',
        'note',
        'analyzed_at',
        'area_recovery_time',
        'total_recovery_time',
        'tissue_condition',
        'recommendations'
    ];

    protected $casts = [
        'area_cm2' => 'decimal:2',
        'confidence' => 'decimal:2',
        'analyzed_at' => 'datetime',
        'recommendations' => 'array'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
