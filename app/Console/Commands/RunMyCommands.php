<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class RunMyCommands extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'run:initapp  {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup new app';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {      
        $database = $this->argument('name') ?: env('DB_DATABASE');

        if (!$database) {
            $this->error('Please provide a database name or set DB_DATABASE in your .env file.');
            return;
        }

         // Update the .env file with the new database name
        $this->updateEnvFile('DB_DATABASE', $database);

        // Update the database configuration to use the 'mysql' database
        Config::set('database.connections.mysql.database', null);

        // Create the database
        $query = "CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
        DB::statement($query);

        $this->info("Database '$database' created successfully!");

        // Optionally, set the database back to what it was after creating it
        Config::set('database.connections.mysql.database', $database);
        DB::purge('mysql');
        DB::reconnect('mysql');

        // $this->call('cache:clear');
        $this->call('migrate');
        $this->call('db:seed');
        $this->call('passport:install');
        return 0;
    }
     /**
     * Update the value in the .env file.
     *
     * @param string $key
     * @param string $value
     * @return void
     */
    protected function updateEnvFile($key, $value)
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $env = file_get_contents($path);
            $oldValue = env($key);

            // Replace existing key-value pair if it exists
            $env = str_replace(
                "$key=" . ($oldValue ?: ''),
                "$key=$value",
                $env
            );

            // Write the updated .env file
            file_put_contents($path, $env);
        }
    }
}
