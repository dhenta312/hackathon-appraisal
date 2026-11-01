<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['assessment_id', 'question_id', 'text'])]
class Reason extends Model
{
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
