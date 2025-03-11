<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    public static function bootLogsActivity()
    {
        static::created(function ($model) {
            self::logActivity('created', $model);
        });

        static::updated(function ($model) {
            self::logActivity('updated', $model);
        });

        static::deleted(function ($model) {
            self::logActivity('deleted', $model);
        });
    }

    protected static function logActivity(string $event, $model)
    {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'log_name' => strtolower(class_basename($model)),
            'description' => ucfirst($event) . ' ' . class_basename($model),
            'event' => $event,
            'subject_type' => get_class($model),
            'subject_id' => $model->id,
            'properties' => $model->toArray()
        ]);
    }
}
