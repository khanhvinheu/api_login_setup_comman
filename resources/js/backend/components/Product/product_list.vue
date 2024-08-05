<template>
    <div class="product_list">
        <div class="card card-default">
            <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                <h3 class="card-title">DANH SÁCH SẢN PHẨM</h3>
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
                        <div class="row" style="display: flex; flex-wrap: nowrap; padding: 8px; justify-content: space-between">
                            <el-input
                                style="width: 500px"
                                v-model="textSearch"
                                placeholder="Nhập kí tự cần tìm kiếm danh mục"
                                @keyup.enter.native="getList()"
                            >
                                <template v-slot:append>
                                    <el-button type="primary" @click="getList()"><i class="el-icon-search"></i> Tìm
                                        kiếm
                                    </el-button>

                                </template>
                            </el-input>
                            <el-button @click="$router.push({name:'ProductCreate'})" class="ml-2" type="primary"><i
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
                            <el-table-column type="expand">
                                <template slot-scope="props">
                                    <div style="margin:10px; margin-left:50px">
                                        <table class="table table-bordered">
                                            <tr style="background-color:rgb(0,0,0,0.02)">
                                               <th><i class="el-icon-connection"></i> Color</th>
                                               <th><i class="el-icon-connection"></i> Size</th>
                                               <th><i class="el-icon-connection"></i> Total</th>
                                               <th><i class="el-icon-connection"></i> Price</th>
                                            </tr>
                                            <tr v-for="item in props.row.options_product">
                                                <td>
                                                    <div style="display: flex; align-items: center">
                                                        <div v-if="item.color.image" class="color-item" style="background-repeat: no-repeat;background-size: cover;background-position: center;border:1px solid rgb(0,0,0,0.3)" v-bind:style="{'background-image':('url('+item.color.image+')')}"></div>
                                                        <div v-else class="color-item" v-bind:style="{'background-color':item.color.value}"></div>
                                                        <span class="ml-2">{{ item.color.title }}</span>
                                                    </div>
                                                </td>
                                                <td >
                                                  {{ JSON.parse(item.list_size).join(', ') }}
                                                </td>
                                                <td>
                                                    <el-tag effect="dark" v-if="item.total>0" type="success">{{item.total + ' (sản phẩm)'}}</el-tag>
                                                    <el-tag effect="dark" v-else type="danger">Hết hàng</el-tag>

                                                </td>
                                                <td>{{ item.price | toThousandFilter }} đ</td>
                                            </tr>
                                        </table>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="TÊN"
                                sortable
                            >
                            </el-table-column>

                            <el-table-column
                                prop="path"
                                label="HÌNH ẢNH"
                                width="180"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <!-- <el-avatar shape="square" :size="50" fit="fit" :src="'/'+scope.row.path"></el-avatar> -->
                                    <el-image
                                        lazy
                                        style="height: 60px; width:60px"

                                        :src="(scope.row.images_product.length?(scope.row.images_product[0]['path']):'https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png')"
                                        fit="contain">
                                        <!-- <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>                                       -->
                                    </el-image>
                                </template>
                            </el-table-column>

                            <el-table-column
                                prop="category.title"
                                label="DANH MỤC"
                            >
                            </el-table-column>

                            </el-table-column>

                            <el-table-column
                                prop="trade_mark"
                                label="THƯƠNG HIỆU"
                            >
                            <template slot-scope="scope">
                                <el-tag type="success">{{ scope.row.trade_mark }}</el-tag>
                            </template>
                            </el-table-column>

                            <el-table-column
                                prop="address"
                                width="100"
                                align="center"
                                label="ẨN/ HIỆN">
                                <template slot-scope="scope">
                                    <el-switch
                                        @change="updateStatus(scope.row.id,scope.row.hidden)"
                                        :value="scope.row.status.toString()"
                                        active-value="1"
                                        inactive-value="0"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949">
                                    </el-switch>
                                </template>
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
                                width="120"
                                align="center"
                            >
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="success"
                                        @click="$router.push({name:'ProductUpdate', params:{id:scope.row.id}})"><i class="el-icon-edit"></i>
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
</template>

<script>
import parseJson from 'parse-json'

export default {
    name: "product_list",
    data() {
        return {
            loadingTable:false,
            tableData: [],
            slideData: [],
            textSearch: '',
            currentPage: 1,
            options:{
                Total:10,
                Page:1,
                PageLimit:10
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleSizeChange(val) {
            this.options.PageLimit = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.options.Page = val
            this.getList()
        },
        updateStatus(id, hidden) {
            // let _this = this
            // var formData = new FormData()
            // formData.append('hidden', hidden == "0" ? "1" : "0")
            // axios({
            //     method: 'post',
            //     url: '/api/admin/banners/update/' + id,
            //     data: formData
            // })
            //     .then(function (response) {
            //         if (response.data['success']) {
            //             _this.$notify({
            //                 title: 'Success',
            //                 message: response.data['mess'],
            //                 type: 'success'
            //             });
            //             _this.getList()
            //         } else {
            //             _this.$notify({
            //                 title: 'Error',
            //                 message: response.data['mess'],
            //                 type: 'error'
            //             });
            //         }
            //
            //     });
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
            axios({
                method: 'get',
                url: '/api/admin/products',
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
</style>
