<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        // $this->call(Province::class);
        $this->call(Module::class);
        $this->call(Action::class);
        $this->call(Role::class);
        $this->call(Users::class);
        $this->call(addfistBlocks::class);
        $this->call(addExDotCap::class);
        $this->call(addExKhoaHoc::class);
        $this->call(addExDanhSachCap::class);
        // $this->call(Province::class);
    }
}
