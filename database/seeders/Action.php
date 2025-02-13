<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Actions;
use DB;

class Action extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $listTypeTask=[
            [
                "code"=>'kyDuyet',
                "name"=>'Ký duyệt',
                "module_code"=>'MD0007',   
                "type"=>'0'            
            ],
        ];
         // Disable foreign key checks to prevent issues during truncation
         DB::statement('SET FOREIGN_KEY_CHECKS=0;');

         // Truncate the table
         DB::table('actions')->truncate();

         // Enable foreign key checks again
         DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        foreach ($listTypeTask as $index =>$value){
            $data =$value;
            Actions::insert($data);
        }
        dump('Add list module success');
    }
}
