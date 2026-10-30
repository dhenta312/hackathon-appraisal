<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'start_date', 'end_date', 'is_open'])]
class Period extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_open' => 'boolean',
        ];
    }

    /**
     * The currently-open assessment period, if any.
     */
    public static function open(): ?self
    {
        return static::where('is_open', true)->first();
    }
}
