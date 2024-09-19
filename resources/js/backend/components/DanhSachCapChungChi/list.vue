<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card card-default">
                <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                    <h3 class="card-title">DANH SÁCH CẤP CHỨNG CHỈ TỐT NGHIỆP</h3>
                    <div class="card-tools">
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                            <i class="fas fa-minus"></i>
                        </button>                     
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="row" style="display: flex; flex-wrap: nowrap; padding: 8px; justify-content: space-between">
                                <el-input
                                    style="width: 500px"
                                    v-model="textSearch"
                                    placeholder="Nhập kí tự cần tìm kiếm"
                                    @keyup.enter.native="getList()"
                                >
                                    <template v-slot:append>
                                        <el-button type="primary" @click="getList()"><i class="el-icon-search"></i> Tìm
                                            kiếm
                                        </el-button>

                                    </template>
                                </el-input>
                                <el-button @click="$router.push({name:'CapChungChiCreate'})" class="ml-2" type="primary"><i
                                    class="el-icon-plus"></i> Thêm mới
                                </el-button>
                            </div>
                            <el-table
                                empty-text="Chưa có dữ liệu !"
                                :data="tableData"
                                style="width: 100%"
                                border
                                :resizable="true"
                                v-loading="loadingTable"
                                :row-class-name="tableRowClassName">

                                <el-table-column
                                    prop="maChungChi"
                                    label="MÃ CHỨNG CHỈ"
                                    sortable
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="hoTen"
                                    label="HỌ TÊN"
                                    sortable
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="image"
                                    label="Ảnh 3X4"                                   
                                >
                                    <template slot-scope="scope">
                                        <img width="50px" :src="scope.row.image"/>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="namSinh"
                                    label="NĂM SINH"
                                    sortable
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="danToc"
                                    label="DÂN TỘC"
                                    sortable
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="xepLoai"
                                    label="XẾP LOẠI"
                                    sortable
                                >
                                </el-table-column>

                                <el-table-column
                                    prop="created_at"
                                    label="NGÀY TẠO"
                                    width="150"
                                >
                                    <template slot-scope="scope">
                                        {{ scope.row.created_at | formatDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="THAO TÁC"
                                    width="180"
                                >
                                    <template slot-scope="scope">
                                       
                                        <el-button
                                            v-if="scope.row.ho_so_duyet"
                                            type="success"
                                            size="mini"
                                            @click="generatePDF(scope.row)"
                                            ><i class="el-icon-view"></i>
                                        </el-button>
                                        <el-button
                                            v-else
                                            type="success"
                                            size="mini"
                                            @click="kyDuyet(scope.row)"
                                            ><i class="el-icon-check"></i>
                                        </el-button>
                                        <!-- <el-button
                                            type="success"
                                            size="mini"
                                            ><i class="el-icon-check"></i>
                                        </el-button> -->
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="update(scope.row)"><i class="el-icon-edit"></i>
                                        </el-button>
                                        <!-- <el-button
                                          size="mini"
                                          type="danger"
                                          @click="delete(scope.row.id)">Xóa</el-button> -->
                                        <el-popconfirm
                                            confirm-button-text='Xóa'
                                            cancel-button-text='Không'
                                            :title="'Bạn có chắc chắn muốn xóa hình ảnh này ?'"
                                            @confirm="()=>deleteBanner(scope.row.id)"
                                        >
                                            <el-button slot="reference" type="danger"
                                                       size="mini"><i class="el-icon-delete"></i>
                                            </el-button>
                                        </el-popconfirm>
                                    </template>
                                </el-table-column>
                                <template slot="empty">
                                    <el-empty description="No data"></el-empty>
                                </template>
                            </el-table>
                        </div>
                        <div class="block" style="margin-left: 0px;margin-right: 8px;padding: 10px;width: 100%">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="currentPage"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="options.PageLimit"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="options.Total">
                            </el-pagination>
                        </div>
                        <!-- /.col -->

                    </div>
                    <!-- /.row -->
                </div>
                <!-- /.card-body -->
                <div class="card-footer">

                </div>
            </div>
        </div>
        <el-dialog :visible.sync="outerVisible">
            <formData :resID="idUpdate" @success="success"/>
        </el-dialog>
        <el-dialog :visible.sync="viewPdf" width="80vw">
            <div style="margin-top: -30px">
                <span style="font-size: 13px; font-weight: bold; text-transform: uppercase">QUÉT MÃ ĐỂ TẢI CHỨNG CHỈ</span>
                <el-divider></el-divider>
            </div>           
            <embed style="width: 100%; height: 60vh" :src="pdfSrc" 	title="Embedded PDF Viewer" type="application/pdf">              
            </embed>       
           <div style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
                <!-- <VueQRCodeComponent :text="this.qrValue"></VueQRCodeComponent>  
                <a style="text-align: center; width: 100%;" :href="this.qrValue" target="_brank">Nhấn vào để xem</a> -->
           </div>
        </el-dialog>
        <!-- <div style="display: flex;position: relative;width: 785px;height: 540px;">
              
                <img src="/assets/chungchimau/chungchiv2.jpg" style="width: 100%; height: 100%; position: absolute; top: 1px; left: 0;"/>
                
                <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                    <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">RECTOR</span>
                    </div>                    
                    <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRA VINH UNIVERSITY</span>
                    </div>                   
                    <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:24px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">CN CNTT</span>
                    </div>                
                    <div class="fromDateEN" style="position: absolute;top:298px; left:192px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 &nbsp&nbsp2016 
                            &nbsp
                            &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                    </div>                
                    <div class="noiDaoTaoEN" style="position: absolute;top:328px; left:46px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Trà Vinh University</span>
                    </div>
                </div>
                <div class="right" style="position: relative; width: 50%;height: 100%;">
                    <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">HIỆU TRƯỞNG</span>
                    </div>
                    <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                    </div>
                    <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Nam</span>
                    </div>
                    <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 30px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Công nhân CNTT</span>
                    </div>
                    <div class="fromDate" style="position: absolute;top:298px; left: 182px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 2016 
                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                            &nbsp 01&nbsp  09&nbsp  2020</span>
                    </div>
                    <div class="noiDaoTao" style="position: absolute;top:328px; left: 45px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Trường đại học Trà Vinh</span>
                    </div>
                </div>
        </div> -->
        <!-- <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_back.jpg');background-position: center;
                    background-repeat: no-repeat; background-size: 100% auto;
                "></div> -->
        
       
    </div>

</template>

<script>
import html2pdf from 'html2pdf.js';
import formData from "./form";
import VueQRCodeComponent from 'vue-qrcode-component'
import QRCode from 'qrcode';
export default {
    components:{formData, VueQRCodeComponent},
    data() {
        return {
            idUpdate:'',
            outerVisible:false,
            viewPdf:false,
            loadingTable:false,
            tableData: [],
            slideData: [],
            textSearch: '',
            currentPage: 1,
            options:{
                Total:10,
                Page:1,
                PageLimit:10
            },
            pdfSrc:'',
            qrValue: 'https://example.com'
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async generatePDF(item) {  
            const { protocol, hostname, port, pathname, search, hash } = window.location;
            this.qrValue= 'http://'+hostname+':'+port+'/check-file-in-pdf/'+item.id
            var qrCodeUrl = await QRCode.toDataURL(this.qrValue);  
            const element = `
            <div style="display: flex;position: relative;width: 785px;height: 540px;">              
                <img src="/assets/chungchimau/chungchiv2.jpg" style="width: 100%; height: 100%; position: absolute; top: 1px; left: 0;"/>                
                <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                    <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">RECTOR</span>
                    </div>                    
                    <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRA VINH UNIVERSITY</span>
                    </div>                   
                    <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:24px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.tenKhoaHocEN}</span>
                    </div>                
                    <div class="fromDateEN" style="position: absolute;top:298px; left:192px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 &nbsp&nbsp2016 
                            &nbsp
                            &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                    </div>                
                    <div class="noiDaoTaoEN" style="position: absolute;top:325px; left:46px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.noiDaoTaoEN}</span>
                    </div>
                    <img src="${item.image}" style="position:absolute; top:380px; left:60px; width: 60px; height:75px; object-fit:contain"/>                 
                    <img src="${qrCodeUrl}" style="position:absolute; top:440px; left:280px; width: 80px; height:80px; object-fit:contain"/>   
                    <div class="noiDaoTaoEN" style="position: absolute;top:495px; left:86px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">${item.maChungChi}</span>
                    </div>              
                </div>
                <div class="right" style="position: relative; width: 50%;height: 100%;">
                    <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">HIỆU TRƯỞNG</span>
                    </div>
                    <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                    </div>
                    <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Nam</span>
                    </div>
                    <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 30px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.tenKhoaHoc}</span>
                    </div>
                    <div class="fromDate" style="position: absolute;top:298px; left: 182px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 2016 
                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                            &nbsp 01&nbsp  09&nbsp  2020</span>
                    </div>
                    <div class="noiDaoTao" style="position: absolute;top:325px; left: 48px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.noiDaoTao}</span>
                    </div>
                    <img src="${item.ho_so_duyet.hinhanhchuky}" style="position:absolute; top:380px; left:220px; width: 80px; height:80px; object-fit:contain"/>    
                    <div class="noiDaoTaoEN" style="position: absolute;top:495px; left:170px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">${item.maChungChi}</span>
                    </div>     
                </div>                              
            </div>
            <div style="display: flex;position: relative;width: 785px;height: 540px;">              
                <img src="/assets/chungchimau/chungchimau_back.jpg" style="width: 100%; height: 100%; position: absolute; top: 1px; left: 0;"/>  
            </div>
            `;
            const pdfBlob = await html2pdf().from(element).outputPdf('blob');
            this.pdfSrc = URL.createObjectURL(pdfBlob);  
            // this.pdfSrc='/pdf/chungchimau.pdf'
            this.viewPdf = true
           
            // var qrcode = new QRCode("test", {
            //     text: "http://jindo.dev.naver.com/collie",
            //     width: 128,
            //     height: 128,
            //     colorDark : "#000000",
            //     colorLight : "#ffffff",
            //     correctLevel : QRCode.CorrectLevel.H
            // });
            // var qrcode = new QRCode("qrcode");
            // qrcode.makeCode(this.qrValue);
            // console.log(qrcode);
            
            
        },
        success(){
          this.outerVisible = false
          this.getList()
        },
        update(e){
            this.idUpdate = e.id
            // this.outerVisible=true
            this.$router.push({name:'CapChungChiUpdate',params:{id:e.id}})
        },
        handleSizeChange(val) {
            this.options.PageLimit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.options.Page = val
            this.getList()
        },
        kyDuyet(item) {
            let _this = this
            var formData = new FormData()                          
            formData.set('nguoiKyDuyet',this.$store.getters.user.id)
            formData.set('maHoSo',item.id)    
            formData.set('thongTinLuu','')    
            formData.set('ghiChu','')    
            formData.set('privatekey',this.$store.getters.user.privatekey)    
            formData.set('publickey',this.$store.getters.user.publickey)    
            formData.set('signature',this.$store.getters.user.signature)    
            formData.set('hinhanhchuky',this.$store.getters.user.hinhanhchuky)             
            // $store.getters.user         
            axios({
                method: 'post',
                url: '/api/admin/cap-chung-chi/kyduyet/' + item.id,
                data: formData
            })
                .then(function (response) {
                    if (response.data['success']) {
                        _this.$notify({
                            title: 'Success',
                            message: response.data['mess'],
                            type: 'success'
                        });
                        _this.getList()
                    } else {
                        _this.$notify({
                            title: 'Error',
                            message: response.data['mess'],
                            type: 'error'
                        });
                    }

                });

        },
        deleteBanner(id) {
            let _this = this
            axios({
                method: 'post',
                url: '/api/admin/cap-chung-chi/delete/' + id,
            })
                .then(function (response) {
                    if (response.data['success']) {
                        _this.$notify({
                            title: 'Success',
                            message: response.data['mess'],
                            type: 'success'
                        });
                        _this.getList()
                    } else {
                        _this.$notify({
                            title: 'Error',
                            message: response.data['mess'],
                            type: 'error'
                        });
                    }
                });
        },
        getList() {
            let _this = this
            _this.loadingTable = true
            let param = {}
            this.options.Page &&(param.Page = this.options.Page)
            this.options.PageLimit &&(param.PageLimit = this.options.PageLimit)
            this.textSearch && (param.TextSearch = this.textSearch)
            axios({
                method: 'get',
                url: '/api/admin/cap-chung-chi',
                params: param
            })
                .then(function ({data}) {
                    if (data['success']) {
                        _this.tableData = data['data']
                        _this.options.Total = data['total']
                        _this.slideData = data['data'].filter(e => e.hidden == 1)
                    }
                    _this.loadingTable = false
                });
        }, changeStatus(id) {
            alert(id)
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        }
    }
};
</script>

<style lang="scss">
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
.dialog-pdf-viewer{
    .el-dialog__body{
        padding: 0 !important
    }
    .el-dialog__header{
        display: none;
    }
}

</style>
