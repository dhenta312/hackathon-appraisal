<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['assessor_id', 'assessed_id', 'period', 'status', 'relationship', 'flag', 'submitted_at'])]
class Assessment extends Model
{
    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
        ];
    }

    public function assessor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assessor_id');
    }

    public function assessed(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assessed_id');
    }

    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    public function reasons(): HasMany
    {
        return $this->hasMany(Reason::class);
    }
}
