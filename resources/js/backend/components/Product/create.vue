<template>
    <div class="FormProduct">
        <el-form v-loading="loadingForm" label-position="right" :model="form" ref="form" class="demo-ruleForm">
            <div class="elevation-1" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Thông tin cơ bản</span>
                <el-divider></el-divider>
                <el-form-item label-width="180px" label="Hình ảnh sản phẩm">
                    <div class="form-group">
                        <el-upload class="custorm-upload" ref="upload" :auto-upload="false" accept="image/png, image/jpeg"
                            action="/api/admin/upload" list-type="picture-card" :on-change="handleUploadChange"
                            :on-remove="removeImg" multiple :limit="limitImg" :on-exceed="messLimit" :file-list="fileList">
                            <div slot="file" slot-scope="{file}">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-delete" @click="removeImg(file)">
                                        <i class="el-icon-delete"></i>
                                    </span>
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                </span>
                                <div style="background-color: rgba(139,145,147,0.66); color: #fff;
                                            position: absolute;bottom: 0;
                                            width: 100%; text-align: center"
                                    v-if="fileList.length && fileList[0].uid == file.uid">Ảnh bìa</div>
                            </div>
                            <div
                                style="text-align: center;line-height: 20px;display: flex; align-items: center; flex-direction: column">
                                <i color="red" class="el-icon-picture-outline"></i>
                                <span style="font-size: 10px">Thêm hình ảnh {{ fileList.length }}/{{ limitImg }}</span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </div>
                    <!-- <el-button @click="$refs.upload.submit()" size="small" type="primary">Upload</el-button> -->
                </el-form-item>
                <el-form-item label-width="180px" :inline-message="true" :rules="required" label="Tên sản phẩm" prop="name">
                    <div class="form-group">
                        <el-input v-model="form.name"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" :inline-message="true" label="Danh mục sản phẩm" prop="id_category"
                    :rules="requiredChange">
                    <el-input style="display:none" v-model="form.id_category"></el-input>
                    <el-button v-show="!listTitleCategory" style="border: 1px dotted; color: orange"
                        @click="selectCategory()">
                        <i class="el-icon-edit"></i> Chọn danh mục sản phẩm
                    </el-button>
                    <div v-show="listTitleCategory"
                        style="border: 1px dotted rgb(0,0,0,0.2); padding: 5px; border-radius: 5px;">
                        <span style="font-weight: bold;">{{ listTitleCategory && listTitleCategory.join(' -> ') }}</span>
                        <el-button type="text" v-show="listTitleCategory" style=" color: orange" @click="selectCategory()">
                            <i class="el-icon-edit"></i>
                        </el-button>
                    </div>
                    <el-dialog :visible.sync="dialogSelectCategory">
                        <treeDataCategory @saveData="saveCategory($event)" />
                    </el-dialog>
                </el-form-item>
                <el-form-item label-width="180px" label="Thương hiệu" prop="trade_mark">
                    <div class="form-group">
                        <el-input v-model="form.trade_mark"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" label="Mô tả sản phẩm" prop="description">
                    <div class="form-group">
                        <Editor show-word-limit maxlength="500" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="form.description"></Editor>
                    </div>
                </el-form-item>
            </div>
            <div class="elevation-1 mt-2" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Thông tin chi tiết</span>
                <el-divider></el-divider>
                <el-form-item label-width="180px" label="Giá trị chung">
                    <div class="row">
                        <div class="col-3 mt-2 ">
                            <el-form-item :inline-message="true" label-width="auto">
                                <div class="display:flex; flex-wrap:nowrap">
                                    <el-descriptions :column="3" border>
                                        <el-descriptions-item>
                                            <template slot="label">
                                                <i class="el-icon-user"></i>
                                                Total
                                            </template>
                                            <el-input v-model="total_all"></el-input>
                                        </el-descriptions-item>

                                    </el-descriptions>
                                </div>

                            </el-form-item>
                        </div>
                        <div class="col-3 mt-2 ">
                            <el-form-item :inline-message="true" label-width="auto">
                                <div class="display:flex; flex-wrap:nowrap">
                                    <el-descriptions :column="3" border>
                                        <el-descriptions-item>
                                            <template slot="label">
                                                <i class="el-icon-user"></i>
                                                Price
                                            </template>
                                            <money v-model="price_all" v-bind="money" name="price_all" style="height: 33px"
                                                class="el-input__inner" />
                                        </el-descriptions-item>

                                    </el-descriptions>
                                </div>

                            </el-form-item>
                        </div>
                        <div class="col-3 mt-2 ">
                            <el-form-item :inline-message="true" label-width="auto">
                                <div class="display:flex; flex-wrap:nowrap;">
                                    <el-popconfirm confirm-button-text='Set' cancel-button-text='Close'
                                        :title="'Bạn có chắc chắn muốn cập nhật tất cả giá trị *số lượng* sản phẩm ?'"
                                        @confirm="() => setAll()">
                                        <el-button slot="reference" type="success" style="height: 50px; width: 80px;">Set
                                            All</el-button>
                                    </el-popconfirm>
                                    <el-popconfirm confirm-button-text='Clear' cancel-button-text='Close'
                                        :title="'Bạn có chắc chắn muốn claer tất cả giá trị *số lượng* sản phẩm ??'"
                                        @confirm="() => clearAll()">
                                        <el-button slot="reference" type="danger" style="height: 50px; width: 80px;">Clear
                                            All</el-button>

                                    </el-popconfirm>
                                </div>


                            </el-form-item>
                        </div>

                    </div>

                </el-form-item>
                <el-form-item label-width="180px" label="Phân loại sản phẩm">
                    <div v-for="(item, i) in form['option']" :key="i">
                        <input type="file" accept="image/*" style="display:none" :ref="'uploadFile' + i" @change="handleFileUpload($event, i)">
                        <div class="box-image-option" style="position:relative;padding:5px;margin-left:-10px">
                            <img @click="uploadFile(i)" style="height:100px; width:100px; cursor:pointer; border-radius:10px" :src="fileUrl(i)" v-if="fileUrl(i)">
                            <div class="overlay-remove" @click="clearImage(i)" v-if="fileUrl(i)" style="opacity:0 ;position:absolute;top:5px;left:10px;display:flex;justify-content:center;align-items:center;height:100px; width:100px; cursor:pointer; border:1px dotted rgb(0,0,0,0.1); border-radius:10px">
                                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center">
                                    <i color="red" class="el-icon-delete"></i>
                                    <span style="font-size: 10px">Xoá ảnh</span>
                                </div>
                            </div>
                            <div @click="uploadFile(i)" v-else style="display:flex;justify-content:center;align-items:center;height:100px; width:100px; cursor:pointer; border:1px dotted rgb(0,0,0,0.1); border-radius:10px">
                                <div style="display:flex; flex-direction:column; justify-content:center; align-items:center">
                                    <i color="red" class="el-icon-picture-outline"></i>
                                    <span style="font-size: 10px">Thêm hình ảnh</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- <uploadFileComponent :fileListOption_Detail="fileListOption[i]" @clearImage="clearImage($event, i)" @addFileSuccess="addFileOption($event,i)"/> -->
                        <div class="row" style="background-color: #f6f6f6;">
                            <div class="col-3 mt-2 ">
                                <el-form-item :inline-message="true" label-width="auto" :rules="requiredChange"
                                    :prop="'option.' + i + '.id_color'">
                                    <!--                                <el-input placeholder="ví dụ: Đỏ, xanh, vàng,..." v-model="item['id_color']">-->
                                    <!--                                    <template slot="prepend">Màu</template>-->
                                    <!--                                </el-input>-->
                                    <div class="display:flex; flex-wrap:nowrap">
                                        <el-descriptions :column="3" border>
                                            <el-descriptions-item>
                                                <template slot="label">
                                                    <i class="el-icon-user"></i>
                                                    Mẫu
                                                </template>
                                                <el-select v-if="listColor" style="width:100%" multiple :multiple-limit="1"
                                                    v-model="item['id_color']" placeholder="ví dụ: mẫu 1, mẫu 2,...">
                                                    <el-option v-for="item in listColor" :key="item.id" :label="item.title"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>
                                            </el-descriptions-item>
                                        </el-descriptions>
                                    </div>

                                </el-form-item>
                            </div>
                            <div class="col-3 mt-2">
                                <el-form-item :inline-message="true" label-width="auto" :rules="required"
                                    :prop="'option.' + i + '.id_size'">
                                    <!--                                <el-input placeholder="ví dụ: X, M, L, XL,..." style="width: 100%;" v-model="item['id_size']">-->
                                    <!--                                    <template slot="prepend">Size</template>-->
                                    <!--                                </el-input>-->
                                    <div class="display:flex; flex-wrap:nowrap">
                                        <el-descriptions :column="2" border>
                                            <el-descriptions-item>
                                                <template slot="label">
                                                    <i class="el-icon-user"></i>
                                                    Size
                                                </template>
                                                <el-select style="width:100%" multiple v-model="item['id_size']"
                                                    placeholder="ví dụ: X, M, L, XL,...">
                                                    <el-option v-for="item in listSize" :key="item.id" :label="item.title"
                                                        :value="item.title">
                                                    </el-option>
                                                </el-select>
                                            </el-descriptions-item>
                                        </el-descriptions>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="col-3 mt-2 ">
                                <el-form-item :inline-message="true" label-width="auto" :rules="required"
                                    :prop="'option.' + i + '.total'">
                                    <div class="display:flex; flex-wrap:nowrap">
                                        <el-descriptions :column="3" border>
                                            <el-descriptions-item>
                                                <template slot="label">
                                                    <i class="el-icon-user"></i>
                                                    Total
                                                </template>
                                                <el-input type="number" v-model="item['total']">
                                                    <!--                                                <template slot="prepend">Kho hàng</template>-->
                                                </el-input>
                                            </el-descriptions-item>
                                        </el-descriptions>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="col-3 mt-2 ">
                                <el-form-item :inline-message="true" label-width="auto" :rules="required"
                                    :prop="'option.' + i + '.price'">
                                    <div class="display:flex; flex-wrap:nowrap">
                                        <el-descriptions :column="3" border>
                                            <el-descriptions-item>
                                                <template slot="label">
                                                    <i class="el-icon-user"></i>
                                                    Price
                                                </template>
                                                <!--                                            <el-input type="number" v-model="item['price']">-->
                                                <!--&lt;!&ndash;                                                <template slot="prepend">Giá</template>&ndash;&gt;-->
                                                <!--                                            </el-input>-->
                                                <money v-model="item['price']" v-bind="money" name="price"
                                                    style="height: 33px" class="el-input__inner" />

                                            </el-descriptions-item>
                                            <el-descriptions-item>
                                                <el-button type="text" style="padding: 10px; cursor: pointer;"
                                                    @click="removeOption(item)"><i class="el-icon-delete"></i></el-button>
                                            </el-descriptions-item>
                                        </el-descriptions>
                                    </div>
                                </el-form-item>
                            </div>
                            <!--                        <div class="col-1 mt-2 mb-2" >-->
                            <!--                        </div>-->
                        </div>
                    </div>
                    <el-button class="mt-3" style="border: 1px dotted; color: orange" @click="addOption()">
                        <i class="el-icon-plus"></i> Thêm nhóm phân loại
                    </el-button>
                    <!-- <el-button class="mt-3" style="border: 1px dotted; color: orange" @click="submit()">
                        <i class="el-icon-plus"></i> Thêm nhóm phân loại
                    </el-button> -->
                </el-form-item>
            </div>
            <div class="elevation-1 mt-2"
                style="padding: 14px; background-color: #ffffff; display: flex; justify-content: end;">
                <el-button :loading="loadingBtn" v-if="$route.params.id" type="success" @click="updateData()"><i
                        class="el-icon-document-checked"></i> Cập nhật</el-button>
                <el-button :loading="loadingBtn" v-else type="success" @click="submitData()"><i
                        class="el-icon-document-checked"></i> Lưu lại</el-button>
                <el-button @click="resetForm('form')"><i class="el-icon-refresh"></i> Reset Form</el-button>
                <el-button @click="$router.push({ name: 'ProductList' })"><i class="el-icon-close"></i> Đóng</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import uploadFileComponent from './uploadFileComponent'
import Editor from '../Tinymce/index.vue'
import ApiService from '../../common/api.service';
import treeDataCategory from './treeDataCategory.vue'
import { Money } from 'v-money';
export default {
    components: { treeDataCategory, Money, Editor, uploadFileComponent, VueUploadMultipleImage },
    data() {
        return {
            files: [],
            fileListOption: [],
            total_all: '',
            price_all: '',
            loadingBtn: false,
            loadingForm: false,
            required: { required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur' },
            requiredChange: { required: true, message: 'Vui lòng không bỏ trống', trigger: 'change' },
            listTitleCategory: '',
            form: {
                name: '',
                id_category: '',
                description: '',
                trade_mark: '',
                option: [
                    {
                        key: Date.now(),
                        id_color: '',
                        id_size: '',
                        total: '',
                        price: '',
                    }
                ],
                delete_id: [],
                delete_image: [],
                delete_image_option:[]
            },
            money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false,
            },
            formData: new FormData(),
            dialogVisible: false,
            dialogImageUrl: '',
            limitImg: 12,
            fileList: [],            
            listCategory: [],
            dialogSelectCategory: false,
            isUpdate: false,
            listColor: [],
            listSize: [],
        }
    },
    async mounted() {
        await this.getCategory()
        await this.getListColor()
        await this.getListSize()
        if (this.$route.params.id) {
            this.isUpdate = true
            await this.getDetailProduct()
        } else {
            this.isUpdate = false
        }

    },
    methods: {
        uploadFile(i) {
            // this.$refs['uploadFile'+i]
            this.$refs['uploadFile' + i][0].click();
        },
        clearImage(i){      
            this.fileListOption.splice(i, 1,null); 
        },
        handleFileUpload(event, index) {
            // Get the uploaded file
            const file = event.target.files[0]
            // Update the files array with the new file
            this.$set(this.fileListOption, index, file)           
          
        },

        fileUrl(index) {
            // Get the URL for the uploaded file
            if (this.fileListOption[index] && this.fileListOption[index] instanceof File) {
                return URL.createObjectURL(this.fileListOption[index])
            }else{
                return this.fileListOption[index]
            }
        },

        handleSubmit(event) {
            event.preventDefault()
            // Handle form submission here
        },
        //image option
        // clearImage(file, index) {
            // let indexFile = this.fileListOption.findIndex(e=>e.id==index)
            // this.fileListOption.splice(indexFile, 1);           
        // },
        addFileOption(file, index) {
            // console.log(file);
            // let indexFile = this.fileListOption.findIndex(e=>e.id==index)
            // if(indexFile==-1){
            //     this.fileListOption.push({id:index,file:file})
            // }else{
            //     this.fileListOption[indexFile]={id:index,file:file}
            // }          
        },
        setAll() {
            this.form.option && this.form.option.map(e => {
                e.total = this.total_all
                e.price = this.price_all
            })
        },
        clearAll() {
            this.total_all = ''
            this.price_all = ''
            this.form.option && this.form.option.map(e => {
                e.total = this.total_all
                e.price = this.price_all
            })
        },
        //getListColor
        getListColor() {
            ApiService.query('/api/admin/product_color').then(({ data }) => {
                if (data['success']) {
                    this.listColor = data['data']
                }
            })

        },
        //getListSize
        getListSize() {
            ApiService.query('/api/admin/product_size').then(({ data }) => {
                if (data['success']) {
                    this.listSize = data['data']
                }
            })

        },
        //getDetail
        getDetailProduct() {
            this.loadingForm = true
            ApiService.query('/api/admin/products/' + this.$route.params.id).then(({ data }) => {
                if (data['success']) {
                    let res = data['data']
                    this.form.name = res['name']
                    this.form.id_category = res['id_category']
                    this.getParent(res['id_category'])
                    this.form.trade_mark = res['trade_mark']
                    this.form.description = res['description']
                    this.form.option = res['options_product']

                    this.form.option.map((e, i) => {
                        e.id_color = [parseInt(e.id_color) ]
                        e.id_size = JSON.parse(e.list_size)
                        e.id = e.id
                    })

                    res['images_product'].forEach(e => {
                        this.fileList.push({ url: e.path, id: e.id })
                    })

                    res['options_product'].forEach((e, i) => {
                        this.fileListOption.push(e.image)
                    })

                }
                this.loadingForm = false
            })
        },
        appendToFormData() {
            let _this = this
            Object.keys(this.form).forEach(key => {
                if (key === 'option' || key === 'delete_image' || key === 'delete_id') {
                    this.formData.set(key, JSON.stringify(this.form[key]))
                    return;
                }
                _this.formData.set(key, this.form[key])
            });
            _this.formData.set('set_id_size', this.listSize[0]['id'])

        },
        appendFileToFormData() {
            let index = 0
            this.fileList.map((e) => {
                if (e && e.status == "ready") {
                    this.formData.set('file' + index, e.raw)
                    index++
                }
            })

        },
        appendFileOptionToFormData() {
            let index = 0
            this.fileListOption.map((e,i) => {
                if (e instanceof File) {
                    this.formData.set('fileOption' + i, e)
                    index++
                }else{
                    this.formData.set('fileOption',JSON.stringify(this.fileListOption))
                }
            })

        },
        submitData() {
            let _this = this
            _this.appendToFormData()
            _this.appendFileToFormData()
            _this.appendFileOptionToFormData()
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/products/create', _this.formData).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                            _this.$router.push({ name: 'ProductList' })
                        } else {
                            _this.$notify({
                                title: 'Error',
                                message: data['mess'],
                                type: 'error'
                            });
                        }
                        this.loadingBtn = false
                    })
                } else {
                    return false;
                }
            });
        },
        updateData() {
            let _this = this
            _this.formData = new FormData()
            _this.appendToFormData()
            _this.appendFileToFormData()
            _this.appendFileOptionToFormData()
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/products/update/' + this.$route.params.id, _this.formData).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                            _this.$router.push({ name: 'ProductList' })
                        } else {
                            _this.$notify({
                                title: 'Error',
                                message: data['mess'],
                                type: 'error'
                            });
                        }
                        this.loadingBtn = false
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.listTitleCategory = ''
        },
        selectCategory() {
            this.dialogSelectCategory = true
        },
        saveCategory(e) {
            this.form.id_category = e
            e && this.getParent(e)
            this.dialogSelectCategory = false
        },
        async getParent(id) {
            let _this = this
            await ApiService.query('/api/admin/categorys/getParent/' + id).then(({ data }) => {
                if (data['success']) {
                    _this.listTitleCategory = data['data']
                }
            })

        },
        submit() {
            console.log(this.form);
        },
        // CategoryProduct
        getCategory() {
            ApiService.query('/api/admin/categorys', { params: { type: 'data' } }).then(({ data }) => {
                this.listCategory = data['data']
            })
        },
        // Custorm option
        removeOption(item) {
            if (this.form.option.length > 1) {
                var index = this.form.option.indexOf(item);
                if (index !== -1) {
                    if (this.isUpdate) {
                        this.form.delete_id.push(item.id)
                    }
                    this.form.option.splice(index, 1);
                    this.fileListOption.splice(index, 1);
                }
            }
        },
        addOption() {
            this.form.option.push({
                key: Date.now(),
                id_color: '',
                id_size: '',
                total: '',
                price: '',
                image: null
            })
        },
        //Custorm upload images
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleUploadChange(file) {
            if (this.fileList.findIndex(e => e.uid == file.uid) == -1) {
                this.fileList.push(file)
            }

        },
        messLimit() {
            this.$notify({
                title: 'Error',
                message: 'Không upload số lượng ảnh vượt quá mức cho phép',
                type: 'error'
            });
        },
        removeImg(el) {
            if (el.id) {
                this.form.delete_image.push(el.id)
            }
            this.fileList = this.fileList.filter(e => e.uid != el.uid)
            ApiService.post('/api/admin/removeFile', { path: el.response })
        },

    }
}
</script>
<style>
.custorm-upload .el-upload--picture-card {
    width: 120px;
    height: unset;
    line-height: 10px;
    padding: 25px;
}

.custorm-upload .el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
}
.box-image-option:hover .overlay-remove{
    opacity:1 !important;
    background-color:rgb(0,0,0,0.3)!important;
    color:#fff;
    transition: all 0.9ms linear;
}
</style>
