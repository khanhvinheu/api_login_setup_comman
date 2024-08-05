<template>
    <div class="row">
        <div class="col-md-12">
            <div class="card card-default">
                <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                    <h3 class="card-title">DANH SÁCH BLOGPOST</h3>
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
                                    placeholder="Nhập kí tự cần tìm kiếm bài viết"
                                    @keyup.enter.native="getList()"
                                >
                                    <template v-slot:append>
                                        <el-button type="primary" @click="getList()"><i class="el-icon-search"></i> Tìm
                                            kiếm
                                        </el-button>

                                    </template>
                                </el-input>
                                <el-button @click="$router.push({name:'BlogCreate'})" class="ml-2" type="primary"><i
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
                                        <div class="elevation-1" style="margin:10px; margin-left:50px; padding: 10px">
                                            <span>Nội dung bài viết</span>
                                            <el-divider></el-divider>
                                            <span v-html="props.row.description"></span>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="title"
                                    label="TITLE"
                                    sortable
                                >
                                </el-table-column>

                                <el-table-column
                                    prop="image"
                                    label="HÌNH ẢNH"
                                    width="180"
                                >
                                    <template slot-scope="scope">
                                        <!-- <el-avatar shape="square" :size="50" fit="fit" :src="'/'+scope.row.path"></el-avatar> -->
                                        <el-image
                                            lazy
                                            style="height: 60px"
                                            :src="scope.row.image"
                                            fit="fit">
                                            <div slot="error" class="image-slot">
                                                <i class="el-icon-picture-outline"></i>
                                            </div>
                                        </el-image>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="hastag"
                                    label="HASTAG"
                                    sortable
                                >
                                </el-table-column>

                                <el-table-column
                                    prop="image"
                                    label="ĐƯỜNG DẪN"
                                >
                                </el-table-column>


                                <el-table-column
                                    prop="hidden"
                                    width="100"
                                    label="ẨN/ HIỆN">
                                    <template slot-scope="scope">
                                        <el-switch
                                            @change="updateStatus(scope.row.id,scope.row.hidden)"
                                            :value="scope.row.hidden.toString()"
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
                                    width="180"
                                >
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            @click="$router.push({name:'BlogUpdate', params:{id:scope.row.id}})">Cập
                                            nhật
                                        </el-button>
                                        <!-- <el-button
                                          size="mini"
                                          type="danger"
                                          @click="delete(scope.row.id)">Xóa</el-button> -->
                                        <el-popconfirm
                                            confirm-button-text='Xóa'
                                            cancel-button-text='Không'
                                            :title="'Bạn có chắc chắn muốn xóa hình ảnh này ?'"
                                            @confirm="()=>deleteItem(scope.row.id)"
                                        >
                                            <el-button slot="reference" type="danger"
                                                       size="mini"><i class="el-icon-delete"></i> Xóa
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
    </div>

</template>

<script>
    export default {
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
                let _this = this
                var formData = new FormData()
                formData.append('hidden', hidden == "0" ? "1" : "0")
                axios({
                    method: 'post',
                    url: '/api/admin/blogs/update/' + id,
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
            deleteItem(id) {
                let _this = this
                axios({
                    method: 'post',
                    url: '/api/admin/blogs/delete/' + id,
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
                    url: '/api/admin/blogs',
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
            },
            changeStatus(id) {
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

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
