<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['component_id', 'job_role_id', 'text', 'sort_order'])]
class Question extends Model
{
    public function component(): BelongsTo
    {
        return $this->belongsTo(Component::class);
    }

    public function jobRole(): BelongsTo
    {
        return $this->belongsTo(JobRole::class);
    }

    public function scores(): HasMany
    {
        return $this->hasMany(Score::class);
    }

    public function choices(): HasMany
    {
        return $this->hasMany(AnswerChoice::class);
    }
}
