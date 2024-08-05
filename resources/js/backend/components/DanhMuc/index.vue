<template>
    <div class="row">
        <div class="col-md-6">
            <div class="card card-default">
                <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                    <h3 class="card-title">DANH MỤC SẢN PHẨM</h3>
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
                            <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
                            <div class="row" style="display: flex; flex-wrap: nowrap;">
                                <el-input
                                    placeholder="Nhập kí tự cần tìm kiếm danh mục"
                                    v-model="filterDataCategorys">
                                </el-input>
                                <el-button @click="idUpdate='', resetForm('formData')" class="ml-2" type="primary"><i
                                    class="el-icon-plus"></i> Thêm mới
                                </el-button>
                            </div>
                            <el-divider></el-divider>
                            <el-tree
                                ref="tree"
                                empty-text="Không tìm thấy !"
                                :filter-node-method="filterNode"
                                v-show="data"
                                :data="data"
                                :show-checkbox="false"
                                node-key=id
                                default-expand-all
                                :expand-on-click-node="false">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span>{{ data.title }}</span>
                      <span>
                        <!-- <el-button
                          type="text"
                          size="mini"
                          @click="() => append(data)">
                              <i class="el-icon-plus"></i> Thêm mới
                        </el-button> -->
                        <el-button
                            type="text"
                            size="mini"
                            style="color:green"
                            @click="() => getDetail(data.id)">
                              <i class="el-icon-edit"></i> Cập nhật
                        </el-button>
                          <!-- <el-button

                            type="text"
                            size="mini"
                            @click="()=>deleteCategory(data.id)">
                                <i class="el-icon-delete"></i> Xóa
                          </el-button> -->
                        <el-divider direction="vertical"></el-divider>
                        <el-popconfirm
                            confirm-button-text='Xóa'
                            cancel-button-text='Không'
                            :title="'Bạn có chắc chắn muốn xóa danh mục *'+data.title+ '* không ?'"
                            @confirm="()=>deleteCategory(data.id)"
                        >
                          <el-button slot="reference" type="text" style="color: red;"
                                     size="mini"><i class="el-icon-delete"></i> Xóa</el-button>
                        </el-popconfirm>
                      </span>
                    </span>
                            </el-tree>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card card-default">
                <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
                    <h3 class="card-title">THÔNG TIN DANH MỤC</h3>
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
                            <el-form label-position="right" :model="formData" :rules="rules" ref="formData"
                                     label-width="120px" class="demo-ruleForm">
                                <el-form-item label="Hình ảnh" prop="icon">
                                    <div class="form-group">
                                        <vue-upload-multiple-image
                                            :showEdit="false"
                                            popupText="Hình ảnh được chọn sẽ sử dụng làm ảnh hiển thị ở banner trang chủ"
                                            :multiple="false"
                                            @upload-success="uploadImageSuccess"
                                            @before-remove="beforeRemove"
                                            :data-images="images"
                                        ></vue-upload-multiple-image>
                                    </div>
                                </el-form-item>
                                <el-form-item label="Tên danh mục" prop="title">
                                    <div class="form-group">
                                        <!-- <label class="label__form">Tên danh mục</label> -->
                                        <el-input validate-event placeholder="Nhập tên danh mục"
                                                  v-model="formData.title"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="Level" prop="level">
                                    <div class="form-group">
                                        <el-select @change="getDataParent(null, false)" style="width: 100%"
                                                   v-model="formData.level" size="large"
                                                   placeholder="Chọn cấp danh mục">
                                            <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                :disabled="item.disabled">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-form-item>

                                <el-form-item label="Danh mục cha" prop="idParent">
                                    <div class="form-group">
                                        <!-- <label class="label__form">Danh mục cha</label> -->
                                        <!-- <el-input v-model="formData.idParent" placeholder="Chọn danh mục cha"></el-input> -->

                                        <el-select style="width: 100%" v-model="formData.idParent" size="large"
                                                   placeholder="Chọn danh mục cha">
                                            <el-option
                                                v-for="item in listCategoryParent"
                                                :key="item.id"
                                                :label="item.title"
                                                :value="item.id"
                                            >
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-form-item>


                                <el-form-item label="Icon" prop="icon">
                                    <div class="form-group">
                                        <!-- <label class="label__form">Icon</label> -->
                                        <el-input v-model="formData.icon"
                                                  placeholder="Nhập icon có dạng fa fa-nameicon"></el-input>
                                    </div>
                                </el-form-item>

                                <el-form-item label="Hiển thị/ ẩn" prop="hidden">
                                    <div class="form-group">
                                        <!-- <label class="label__form">Danh mục cha</label> -->
                                        <!-- <el-input v-model="formData.idParent" placeholder="Chọn danh mục cha"></el-input> -->

                                        <el-switch
                                            active-value="1"
                                            inactive-value="0"
                                            v-model="formData.hidden"
                                            active-color="#13ce66"
                                            inactive-color="#ff4949">
                                        </el-switch>
                                    </div>
                                </el-form-item>
                            </el-form>

                            <!-- /.form-group -->
                        </div>
                        <!-- /.col -->

                    </div>
                    <!-- /.row -->
                </div>
                <!-- /.card-body -->
                <div class="card-footer">
                    <el-button v-show="!idUpdate" type="success" @click="create"><i class="el-icon-plus"></i> Lưu lại
                    </el-button>
                    <el-button v-show="idUpdate" type="success" @click="update"><i class="el-icon-edit"></i> Lưu lại
                    </el-button>
                    <el-button>Đóng</el-button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ApiService from '../../common/api.service';
import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
    watch: {
        filterDataCategorys(val) {
            this.$refs.tree.filter(val);
        }
    },
    components: {
        VueUploadMultipleImage,
    },
    data() {
        return {
            images:[],
            idUpdate: '',
            rules: {
                title: [
                    {required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur'},
                    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
                ],
                // idParent: [
                //   { required: true, message: 'Vui lòng không bỏ trống', trigger: 'change' },
                // ],
                level: [
                    {required: true, message: 'Vui lòng không bỏ trống', trigger: 'change'},
                ],
            },
            data: [],
            filterDataCategorys: '',
            listCategoryParent: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            options: [{
                value: 1,
                label: 'Level 1'
            }, {
                value: 2,
                label: 'Level 2',
            }, {
                value: 3,
                label: 'Level 3'
            }, {
                value: 4,
                label: 'Level 4'
            }, {
                value: 5,
                label: 'Level 5'
            }],
            formData: {
                title: '',
                idParent: '',
                icon: '',
                level: '',
                img: '',
                hidden: '1'
            }

        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        // convert base64 to file
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        },
        uploadImageSuccess(formData, index, fileList) {
            this.formData.img = this.dataURLtoFile(fileList[0].path, fileList[0].name);
            // console.log('data', formData, index, fileList)
            // Upload image api
            // axios.post('http://your-url-upload', formData).then(response => {
            //   console.log(response)
            // })
        },
        beforeRemove(index, done, fileList) {
            done()
            this.formData.img = '';
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        resetForm(formName) {
            this.images=[]
            this.$refs[formName].resetFields();
        },
        getList() {
            let _this = this
            // axios({
            //   method: 'get',
            //   url: '/api/admin/categorys',
            //   params:{type:'treeData'}
            // })
            //   .then(function (response) {
            //     _this.data = response.data['data']
            //   });
            ApiService.query('/api/admin/categorys', {params: {type: 'treeData'}}).then(({data}) => {
                _this.data = data['data']
            })
        },
        async getDataParent(id, update) {
            let _this = this
            _this.listCategoryParent = []
            !update && (_this.formData.idParent = '')
            await axios({
                method: 'get',
                url: '/api/admin/categorys',
                params: {type: 'data'}
            })
                .then(function (response) {
                    if (response.data['success'] && response.data['data'].length > 0) {
                        response.data['data'].map(e => {
                            if (e.level == (_this.formData.level - 1)) {
                                _this.listCategoryParent.push(e)
                                if (e.id == id) {
                                    _this.formData.idParent = id
                                }
                            }
                        })
                    }
                });

        },
        async getDetail(id) {
            let _this = this
            _this.listCategoryParent = []
            _this.idUpdate = id
            let idParent

            await axios({
                method: 'get',
                url: '/api/admin/categorys/detail/' + id,
            })
                .then(({data}) => {
                    if (data['success']) {
                        let res = data['data']
                        _this.formData.title = res['title']
                        _this.formData.level = res['level']
                        idParent = res['idParent']
                        _this.formData.icon = res['icon']
                        // _this.formData.img = res['img']
                        res['img'] && res['img']!=null && ( _this.images = [{path:res['img']}])
                        _this.images=[{path:(res['img'])}]
                        _this.formData.hidden = res['hidden'].toString()
                    }
                });
            await _this.getDataParent(idParent, true)

        },
        deleteCategory(id) {
            let _this = this
            axios({
                method: 'post',
                url: '/api/admin/categorys/delete/' + id,
                responseType: 'stream'
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
        create() {
            let _this = this
            var formData = new FormData()
            formData.append('title', this.formData.title)
            formData.append('idParent', this.formData.idParent)
            formData.append('icon', this.formData.icon)
            formData.append('level', this.formData.level)
            formData.append('hidden', this.formData.hidden)
            formData.append('img', this.formData.img)
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    axios({
                        method: 'post',
                        url: '/api/admin/categorys/create',
                        data: formData
                    })
                        .then(function (response) {
                            if (response.data['success']) {
                                _this.$notify({
                                    title: 'Success',
                                    message: response.data['mess'],
                                    type: 'success'
                                });
                                _this.resetForm('formData')
                                _this.getList()
                            } else {
                                _this.$notify({
                                    title: 'Error',
                                    message: response.data['mess'],
                                    type: 'error'
                                });
                            }

                        });
                } else {
                    return false;
                }
            });
        },
        update() {
            let _this = this
            var formData = new FormData()
            formData.append('title', this.formData.title)
            formData.append('idParent', this.formData.idParent)
            formData.append('icon', this.formData.icon)
            formData.append('level', this.formData.level)
            formData.append('hidden', this.formData.hidden)
            formData.append('img', this.formData.img)
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    axios({
                        method: 'post',
                        url: '/api/admin/categorys/update/' + _this.idUpdate,
                        data: formData
                    })
                        .then(function (response) {
                            if (response.data['success']) {
                                _this.$notify({
                                    title: 'Success',
                                    message: response.data['mess'],
                                    type: 'success'
                                });
                                _this.resetForm('formData')
                                _this.images = []
                                _this.idUpdate = ''
                                _this.getList()
                            } else {
                                _this.$notify({
                                    title: 'Error',
                                    message: response.data['mess'],
                                    type: 'error'
                                });
                            }

                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.label__form {
    font-size: 13px;
}

/* .label__form::before{
  content: '+ ';
} */
</style>
