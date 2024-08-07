<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DanhSachCapChungChiHocVien extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('danhSachCapChungChiHocViens', function (Blueprint $table) {
            $table->id();
            $table->string('maChungChi')->unique();
            $table->string('hoTen');
            $table->string('namSinh');
            $table->string('gioiTinh');
            $table->string('vanHoa');
            $table->string('danToc');
            $table->string('queQuan');
            $table->string('diemTrungBinh');
            $table->string('xepLoai');
            $table->string('ghiChu');
            $table->string('maDotCap');    
            $table->string('maKhoaHoc');                 
            $table->string('maHoSoKyDuyet');                 
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
        Schema::dropIfExists('danhSachCapChungChiHocViens');
    }
}
