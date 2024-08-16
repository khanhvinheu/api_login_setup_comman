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
                                            type="success"
                                            size="mini"
                                            @click="generatePDF(scope.row)"
                                            ><i class="el-icon-view"></i>
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
        <el-dialog class="dialog-pdf-viewer" :visible.sync="viewPdf" width="60%" top="5vh" :show-close="false">
            <!-- <div style="margin-top: -30px">
                <span style="font-size: 13px; font-weight: bold; text-transform: uppercase">THÔNG TIN CHI TIẾT CHỨNG CHỈ</span>
                <el-divider></el-divider>
            </div>            -->
            <embed style="width: 100%; height: 80vh" :src="pdfSrc" 	title="Embedded PDF Viewer" type="application/pdf">              
            </embed>       
        </el-dialog>
        <!-- <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_front.jpg');background-position: center;
                    background-repeat: no-repeat; background-size: 100% auto;
                ">
                <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                    <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">RECTOR</span>
                    </div>                    
                    <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">TRA VINH UNIVERSITY</span>
                    </div>                   
                    <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">${item.hoTen}</span>
                    </div>
                    <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:26px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">CN CNTT</span>
                    </div>                
                    <div class="fromDateEN" style="position: absolute;top:298px; left:196px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">01&nbsp 01 &nbsp&nbsp2016 
                            &nbsp
                            &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                    </div>                
                    <div class="noiDaoTaoEN" style="position: absolute;top:328px; left:46px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">Trà Vinh University</span>
                    </div>
                </div>
                <div class="right" style="position: relative; width: 50%;height: 100%;">
                    <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">HIỆU TRƯỞNG</span>
                    </div>
                    <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                    </div>
                    <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">${item.hoTen}</span>
                    </div>
                    <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">Nam</span>
                    </div>
                    <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 25px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">Công nhân CNTT</span>
                    </div>
                    <div class="fromDate" style="position: absolute;top:298px; left: 178px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">01&nbsp 01 2016 
                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                            &nbsp 01&nbsp  09&nbsp  2020</span>
                    </div>
                    <div class="noiDaoTao" style="position: absolute;top:328px; left: 45px">
                        <span style="font-size: 13px;font-weight: bold; color: red;">Trường đại học Trà Vinh</span>
                    </div>
                </div>
        </div>
        <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_back.jpg');background-position: center;
                    background-repeat: no-repeat; background-size: 100% auto;
                "></div> -->
        
       
    </div>

</template>

<script>
import html2pdf from 'html2pdf.js';
import formData from "./form";
export default {
    components:{formData},
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
            pdfSrc:''
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async generatePDF(item) {         
            const element = `
                <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_front.jpg');background-position: center;
                    background-repeat: no-repeat; background-size: 100% auto;
                ">
                        <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                            <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">RECTOR</span>
                            </div>                    
                            <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">TRA VINH UNIVERSITY</span>
                            </div>                   
                            <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.hoTen}</span>
                            </div>
                            <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.namSinh}</span>
                            </div>
                            <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:26px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">CN CNTT</span>
                            </div>                
                            <div class="fromDateEN" style="position: absolute;top:298px; left:196px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">01&nbsp 01 &nbsp&nbsp2016 
                                    &nbsp
                                    &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                            </div>                
                            <div class="noiDaoTaoEN" style="position: absolute;top:328px; left:46px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Trà Vinh University</span>
                            </div>
                        </div>
                        <div class="right" style="position: relative; width: 50%;height: 100%;">
                            <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">HIỆU TRƯỞNG</span>
                            </div>
                            <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                            </div>
                            <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.hoTen}</span>
                            </div>
                            <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Nam</span>
                            </div>
                            <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.namSinh}</span>
                            </div>
                            <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 25px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Công nhân CNTT</span>
                            </div>
                            <div class="fromDate" style="position: absolute;top:298px; left: 178px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">01&nbsp 01 2016 
                                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                                    &nbsp 01&nbsp  09&nbsp  2020</span>
                            </div>
                            <div class="noiDaoTao" style="position: absolute;top:328px; left: 45px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Trường đại học Trà Vinh</span>
                            </div>
                        </div>
                </div>
                <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_back.jpg');background-position: center;
                            background-repeat: no-repeat; background-size: 100% auto;
                        "></div>
            `;
            const pdfBlob = await html2pdf().from(element).outputPdf('blob');
            this.pdfSrc = URL.createObjectURL(pdfBlob);  
            // this.pdfSrc='/pdf/chungchimau.pdf'
            this.viewPdf = true
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
        updateStatus(id, hidden) {
            let _this = this
            var formData = new FormData()
            console.log(hidden, hidden == "0" ? "1" : "0")
            formData.append('hidden', hidden == "0" ? "1" : "0")
            axios({
                method: 'post',
                url: '/api/admin/cap-chung-chi/update/' + id,
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
