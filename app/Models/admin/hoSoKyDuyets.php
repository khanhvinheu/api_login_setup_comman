<?php

namespace App\Models\admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class hoSoKyDuyets extends Model
{
    use HasFactory;
    protected $table = 'hosokyduyets';
    protected $fillable = [
        'maHoSo',
        'nguoiKyDuyet',
        'hinhanhchuky',
        'publickey',
        'privatekey',
        'signature',
        'thongTinLuu',
        'ghiChu',
    ];
}
