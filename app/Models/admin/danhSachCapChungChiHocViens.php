<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class danhSachCapChungChiHocViens extends Model
{
    use HasFactory;
    protected $table = 'danhSachCapChungChiHocViens';
    protected $fillable = [
       'maChungChi',
       'hoTen',
       'namSinh',
       'gioiTinh',
       'vanHoa',
       'danToc',
       'queQuan',
       'diemTrungBinh',
       'xepLoai',
       'image',
       'ghiChu',
       'maDotCap',
       'maKhoaHoc',
       'maHoSoKyDuyet',
    ];
    public function dotCap(): \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(dotCaps::class, 'maDotCap', 'maDot');
    }
    public function khoaHoc(): \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(thongTinKhoaHocs::class, 'maKhoaHoc', 'maKhoaHoc');
    }
}
