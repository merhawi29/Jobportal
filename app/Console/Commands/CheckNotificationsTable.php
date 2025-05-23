<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

class CheckNotificationsTable extends Command
{
    protected $signature = 'notifications:check-table';
    protected $description = 'Check and fix the notifications table structure';

    public function handle()
    {
        $this->info('Checking notifications table...');
        
        // Check if the table exists
        if (!Schema::hasTable('notifications')) {
            $this->warn('Notifications table does not exist. Creating it...');
            
            try {
                Schema::create('notifications', function (Blueprint $table) {
                    $table->uuid('id')->primary();
                    $table->string('type');
                    $table->morphs('notifiable');
                    $table->text('data');
                    $table->timestamp('read_at')->nullable();
                    $table->timestamps();
                });
                
                $this->info('✓ Notifications table created successfully!');
            } catch (\Exception $e) {
                $this->error('Failed to create notifications table: ' . $e->getMessage());
                return 1;
            }
        } else {
            $this->info('✓ Notifications table exists');
            
            // Check table structure
            $this->info('Checking table structure...');
            
            $columns = Schema::getColumnListing('notifications');
            $this->info('Current columns: ' . implode(', ', $columns));
            
            $requiredColumns = ['id', 'type', 'notifiable_id', 'notifiable_type', 'data', 'read_at', 'created_at', 'updated_at'];
            $missingColumns = array_diff($requiredColumns, $columns);
            
            if (!empty($missingColumns)) {
                $this->warn('Missing columns: ' . implode(', ', $missingColumns));
                
                // Try to add missing columns
                $this->info('Attempting to add missing columns...');
                Schema::table('notifications', function (Blueprint $table) use ($missingColumns) {
                    if (in_array('id', $missingColumns)) {
                        $table->uuid('id')->primary();
                    }
                    if (in_array('type', $missingColumns)) {
                        $table->string('type');
                    }
                    if (in_array('notifiable_id', $missingColumns) && in_array('notifiable_type', $missingColumns)) {
                        $table->morphs('notifiable');
                    } else {
                        if (in_array('notifiable_id', $missingColumns)) {
                            $table->string('notifiable_id');
                        }
                        if (in_array('notifiable_type', $missingColumns)) {
                            $table->string('notifiable_type');
                        }
                    }
                    if (in_array('data', $missingColumns)) {
                        $table->text('data');
                    }
                    if (in_array('read_at', $missingColumns)) {
                        $table->timestamp('read_at')->nullable();
                    }
                    if (in_array('created_at', $missingColumns)) {
                        $table->timestamp('created_at')->nullable();
                    }
                    if (in_array('updated_at', $missingColumns)) {
                        $table->timestamp('updated_at')->nullable();
                    }
                });
                
                $this->info('✓ Added missing columns successfully!');
            } else {
                $this->info('✓ All required columns are present');
            }
        }
        
        // Check if there are any notifications in the table
        $count = DB::table('notifications')->count();
        $this->info("Total notifications in database: $count");
        
        if ($count > 0) {
            // Display a few recent notifications
            $this->info('Recent notifications:');
            $notifications = DB::table('notifications')->orderBy('created_at', 'desc')->limit(3)->get();
            
            foreach ($notifications as $notification) {
                $this->line('---------------------------------------');
                $this->line('ID: ' . $notification->id);
                $this->line('Type: ' . $notification->type);
                $this->line('Notifiable: ' . $notification->notifiable_type . ':' . $notification->notifiable_id);
                $this->line('Data: ' . $notification->data);
                $this->line('Read: ' . ($notification->read_at ? 'Yes' : 'No'));
                $this->line('Created: ' . $notification->created_at);
            }
        }
        
        $this->info('Notifications table check completed.');
        return 0;
    }
} 