<template>
    <div class="product_list">
        <div class="card card-default">
            <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                <h3 class="card-title">DANH SÁCH ĐƠN HÀNG</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                    <!-- <button type="button" class="btn btn-tool" data-card-widget="remove">
                      <i class="fas fa-times"></i>
                    </button> -->
                </div>
            </div>
            <!-- /.card-header -->
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <el-tabs v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane label="Tất cả" name="all">
                            </el-tab-pane>
                            <el-tab-pane v-for="item in listPackStatus" :key="item.value" :label="item.title" :name="item.value.toString()">
                            </el-tab-pane>

                        </el-tabs>
                        <div class="row" style="display: flex; flex-wrap: nowrap; padding: 8px; justify-content: start">
                            <el-input
                                style="width: 500px"
                                v-model="numberPhoneSearch"
                                placeholder="Nhập số điện thoại ..."
                                @keyup.enter.native="getList()"
                            >
                            </el-input>
                            <el-input
                                style="width: 500px; margin-left: 10px"
                                v-model="textSearch"
                                placeholder="Nhập mã đơn hàng ..."
                                @keyup.enter.native="getList()"
                            >
                                <template v-slot:append>
                                    <el-button type="primary" @click="getList()"><i class="el-icon-search"></i> Tìm
                                        kiếm
                                    </el-button>

                                </template>
                            </el-input>

<!--                            <el-button @click="$router.push({name:'ProductCreate'})" class="ml-2" type="primary"><i-->
<!--                                class="el-icon-plus"></i> Thêm mới-->
<!--                            </el-button>-->
                        </div>
                        <el-table
                            empty-text="Chưa có dữ liệu !"
                            :data="tableData"
                            style="width: 100%"
                            border
                            :resizable="true"
                            v-loading="loadingTable"
                            :row-class-name="tableRowClassName">
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <div class="elevation-1" style="margin:10px; margin-left:50px; padding: 10px">
                                        <div style="display: flex; justify-content: space-between">
                                            <div>
                                                <span class="title-detail-order">
                                                <i class="el-icon-finished"/>
                                                MÃ ĐƠN HÀNG:</span>
                                                <a href="#">{{ props.row.order_code}}</a>
                                            </div>
                                            <div>
                                                <el-button @click="updateStatus(props.row.id,2,'payment_status');props.row.payment_status=2"
                                                           v-show="props.row.payment_methods==2 && props.row.payment_status==1" type="success">
                                                    <i class="el-icon-money"></i>
                                                    Xác nhận thanh toán</el-button>
                                                <el-select v-if="listPackStatus" @change="updateStatus(props.row.id,props.row.pack_status,'pack_status')" v-model="props.row.pack_status" placeholder="Trạng thái đơn hàng">
                                                    <el-option
                                                        v-for="item in listPackStatus"
                                                        :key="item.value"
                                                        :label="item.title"
                                                        :value="(item.value).toString()">
                                                    </el-option>
                                                </el-select>
                                                <!--                                                <el-button type="primary">-->
                                                <!--                                                    <i class="el-icon-document-checked"></i>-->
                                                <!--                                                    Lưu lại</el-button>-->
                                            </div>

                                        </div>
                                        <div>
                                            <span style="margin-left: 15px" class="title-detail-order">Được tạo lúc:</span>
                                            <span >{{ props.row.created_at | formatDate}}</span>
                                        </div>

                                        <div style="padding-left: 15px">
                                            <el-divider></el-divider>
                                            <div>
                                                <span class="title-detail-order">Tên khách hàng:</span>
                                                <span>{{ props.row.member.name}}</span>
                                            </div>
                                            <div>
                                                <span class="title-detail-order">Số điện thoại:</span>
                                                <span>{{ props.row.member.phone_number}}</span>
                                            </div>
                                            <div>
                                                <span class="title-detail-order">Email:</span>
                                                <span>{{ props.row.member.email}}</span>
                                            </div>
                                            <div>
                                                <span class="title-detail-order">Địa chỉ:</span>
                                                <span>
                                               {{props.row.member.location_text + '-'+ props.row.member.commune+ '-'+ props.row.member.district+ '-'+ props.row.member.province }}
                                            </span>
                                            </div>
                                            <div v-show="props.row.note">
                                                <span class="title-detail-order">Ghi chú:</span>
                                                <span>
                                               {{props.row.note?props.row.note:'______'}}
                                                </span>
                                            </div>
                                        </div>
                                        <div style="padding-left: 15px">
                                            <el-divider ></el-divider>
                                        </div>
                                        <div>
                                            <span class="title-detail-order">
                                                <i class="el-icon-finished"></i>
                                                DANH SÁCH CÁC SẢN PHẨM ĐƯỢC MUA:</span>

                                        </div>
                                        <div style="padding: 15px">
                                            <table class="table table-bordered">
                                                <tr style="background-color:rgb(0,0,0,0.02)">
                                                    <th><i class="el-icon-connection"></i> TÊN SẢN PHẨM</th>
                                                    <th><i class="el-icon-connection"></i> HÌNH ẢNH</th>
                                                    <th><i class="el-icon-connection"></i> SIZE</th>
                                                    <th><i class="el-icon-connection"></i> MÀU</th>
                                                    <th><i class="el-icon-connection"></i> ĐƠN GIÁ</th>
                                                    <th><i class="el-icon-connection"></i> SỐ LƯỢNG</th>
                                                    <th><i class="el-icon-connection"></i> THÀNH TIỀN</th>
                                                </tr>
                                                <tr v-for="item in props.row.detail">
                                                    <td>
                                                        <div style="display: flex; align-items: center">
                                                            <span class="ml-2">{{ item.product_name }}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <el-image
                                                            lazy
                                                            style="height: 60px; width:60px"
                                                            :src="(item.image?(item.image['path']):'https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png')"
                                                            fit="contain">
                                                        </el-image>
                                                    </td>
                                                    <td>{{ item.product_color}}</td>
                                                    <td>{{ item.color.title}}</td>
                                                    <td>{{ item.price | toThousandFilter }} đ</td>
                                                    <td>x{{item.quantity}}</td>
                                                    <td>{{ item.price_total | toThousandFilter }} đ</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="6">
                                                        <span style="font-weight: bold">Thành tiền</span>
                                                    </td>
                                                    <td>
                                                        <span style="font-weight: bold">{{props.row.detail.map(e=>e.price*e.quantity).reduce((a, b) => a + b, 0) | toThousandFilter}} đ</span>
                                                    </td>

                                                </tr>
                                            </table>
                                        </div>

                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="order_code"
                                label="MÃ ĐƠN HÀNG"
                                sortable
                            >
                            </el-table-column>
                            <el-table-column
                                prop="member.name"
                                label="TÊN KHÁCH HÀNG"
                                sortable
                            >
                            </el-table-column>
                            <el-table-column
                                prop="member.phone_number"
                                label="SĐT"
                                sortable
                            >
                            </el-table-column>
                            <el-table-column
                                prop="member.location_text"
                                label="LOẠI THANH TOÁN"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <el-tag  effect="dark" :type="scope.row.payment_methods==2?'success':''"> {{scope.row.payment_methods==1?'COD':'Chuyển khoản trước' }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="member.location_text"
                                label="TRẠNG THÁI THANH TOÁN"
                                sortable
                            >
                                <template slot-scope="scope">
                                    <el-tag v-show="scope.row.payment_methods==2"  :type="scope.row.payment_status==2?'success':''"> {{scope.row.payment_status==1?'Chưa thanh toán':'Đã thanh toán' }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="member.location_text"
                                label="TRẠNG THÁI ĐƠN HÀNG"
                                sortable

                            >
                                <template slot-scope="scope">
                                    <el-tag  :type="listPackStatus.find(e=>e.value==scope.row.pack_status).type"> {{listPackStatus.find(e=>e.value==scope.row.pack_status).title }}</el-tag>

                                </template>
                            </el-table-column>

                            <el-table-column
                                label="THAO TÁC"
                                width="120"
                                align="center"
                            >
                                <template slot-scope="scope">

                                    <el-popconfirm
                                        confirm-button-text='Xóa'
                                        cancel-button-text='Không'
                                        :title="'Bạn có chắc chắn muốn xóa hình ảnh này ?'"
                                        @confirm="()=>deleteOrder(scope.row.id)"
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
</template>

<script>
export default {
    name: "product_list",
    data() {
        return {
            activeName:'all',
            loadingTable:false,
            tableData: [],
            status_pack:'',
            slideData: [],
            textSearch: '',
            numberPhoneSearch: '',
            currentPage: 1,
            options:{
                Total:10,
                Page:1,
                PageLimit:10
            },
            listPackStatus:[
                {value:1, title:'Đơn tạo mới',type:''},
                {value:2, title:'Đơn đã đóng gói',type:'info'},
                {value:3, title:'Đơn đã vận chuyển đi',type:'warning'},
                {value:4, title:'Đơn đã hoàn tất',type:'success'},
                {value:5, title:'Đơn hủy',type:'danger'},
            ],
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleClick(){          
            this.getList()
        },
        handleSizeChange(val) {
            this.options.PageLimit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.options.Page = val
            this.getList()
        },
        updateStatus(id, status, key) {
            let _this = this
            var formData = new FormData()
            console.log(status)
            formData.append(key, status)
            axios({
                method: 'post',
                url: '/api/admin/orders/update/' + id,
                data: formData
            })
                .then(function (response) {
                    if (response.data['success']) {
                        _this.$notify({
                            title: 'Success',
                            message: response.data['mess'],
                            type: 'success'
                        });

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
                url: '/api/admin/products/delete/' + id,
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
            this.options.Page &&(param.page = this.options.Page)
            this.options.PageLimit &&(param.limit = this.options.PageLimit)
            this.textSearch && (param.search = this.textSearch)
            this.numberPhoneSearch && (param.phone_number = this.numberPhoneSearch)
            this.activeName!='all' && (param.pack_status=this.activeName)
            axios({
                method: 'get',
                url: '/api/admin/orders',
                params: param
            })
                .then(function ({data}) {
                    if (data['success']) {
                        _this.tableData = data['data']
                        _this.options.Total = data['count']
                        // _this.slideData = data['data'].filter(e => e.hidden == 1)
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
        },
        deleteOrder(id){
            let _this = this
            axios({
                method: 'post',
                url: '/api/admin/orders/delete/' + id,
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
        }
    }
}
</script>

<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
.color-item{
    height: 27px;
    width: 50px;
    border-radius: 10px;
    border: 1px solid rgb(0,0,0,0.5);
}
span.title-detail-order{
    font-weight: bold;
}
</style>
