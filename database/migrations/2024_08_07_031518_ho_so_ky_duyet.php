<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class HoSoKyDuyet extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('hoSoKyDuyets', function (Blueprint $table) {
            $table->id();
            $table->string('maHoSo')->unique();
            $table->string('nguoiKyDuyet');
            $table->string('thongTinLuu');
            $table->string('ghiChu');               
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::dropIfExists('hoSoKyDuyets');
    }
}
