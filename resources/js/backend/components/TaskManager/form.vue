<template>
    <div class="FormProduct">
        <el-form v-loading="loadingForm" label-position="right" :model="form" ref="form" class="demo-ruleForm">
            <div class="elevation-1" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Thông tin cơ bản</span>
                <el-divider></el-divider>                
                <el-form-item label-width="180px" :inline-message="true" :rules="required" label="Tiêu đề" prop="title">
                    <div class="form-group">
                        <el-input v-model="form.title"></el-input>
                    </div>
                </el-form-item>                
                <el-form-item label-width="180px" label="Danh mục công việc " :rules="requiredChange" prop="task_type">
                    <div class="form-group">
                        <el-select style="width: 100%" v-model="form.task_type" size="large"
                                    filterable 
                                    placeholder="Chọn danh mục công việc">
                            <el-option
                                v-for="item in listTypeTask"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            >                                            
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" label="Giao cho" prop="assign_to" :rules="requiredChange">
                    <div class="form-group">
                        <el-select style="width: 100%" v-model="form.assign_to" size="large"
                                    filterable 
                                    placeholder="Chọn nhân viên được giao">
                            <el-option
                                v-for="item in listUser"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >                                            
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
               
            </div>
            <div class="elevation-1 mt-2" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Chi tiết công việc</span>
                <el-divider></el-divider>
                <el-form-item label-width="180px" label="Chi tiết công việc" prop="task_detail">
                    <div class="form-group">
                        <Editor show-word-limit maxlength="500" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="form.task_detail"></Editor>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" label="Ghi chú" prop="note">
                    <div class="form-group">
                        <Editor show-word-limit maxlength="500" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="form.note"></Editor>
                    </div>
                </el-form-item>
              
            </div>
            <div class="elevation-1 mt-2"
                style="padding: 14px; background-color: #ffffff; display: flex; justify-content: end;">
                <el-button :loading="loadingBtn" v-if="$route.params.id" type="success" @click="updateData()"><i
                        class="el-icon-document-checked"></i> Cập nhật</el-button>
                <el-button :loading="loadingBtn" v-else type="success" @click="submitData()"><i
                        class="el-icon-document-checked"></i> Lưu lại</el-button>
                <el-button @click="resetForm('form')"><i class="el-icon-refresh"></i> Reset Form</el-button>
                <el-button @click="$router.push({ name: 'TaskList' })"><i class="el-icon-close"></i> Đóng</el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
import Editor from '../Tinymce/index.vue'
import ApiService from '../../common/api.service';
export default {
    components: {  Editor},
    data() {
        return {
            listTypeTask:[],           
            loadingBtn: false,
            loadingForm: false,
            required: { required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur' },
            requiredChange: { required: true, message: 'Vui lòng không bỏ trống', trigger: 'change' },         
            form: {
                title: '',
                task_detail: '',
                task_type: '',
                note: '',      
                assign_to: '',     
                create_by: this.$store.getters.user.id      
            },         
            formData: new FormData(),
            isUpdate: false,
            listUser: [],
        }
    },
    async mounted() {          
        await this.getListUser()
        await this.getListTaskType()
        if (this.$route.params.id) {
            this.isUpdate = true
            await this.getDetailProduct()
        } else {
            this.isUpdate = false
        }
    },
    methods: {
        getListUser(){
            ApiService.query('/api/admin/users').then(({data})=>{
                if(data.success){
                    this.listUser = data['data']
                }
            })
        },       
        getListTaskType(){
            ApiService.query('/api/admin/list-task-type').then(({data})=>{
                if(data.success){
                    this.listTypeTask = data['data']
                }
            })
        },       
        
        //getDetail
        getDetailProduct() {
            this.loadingForm = true
            ApiService.query('/api/admin/list-task/detail/' + this.$route.params.id).then(({ data }) => {
                if (data['success']) {
                    let res = data['data']
                    this.form.title = res['title']
                    this.form.task_type = res['task_type'][0].id
                    this.form.assign_to = res['assign_to'][0].id
                    this.form.task_detail = res['task_detail']
                    this.form.note = res['note']
                  
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
        },
    
        submitData() {
            let _this = this
            _this.appendToFormData()          
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/list-task/create', _this.formData).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                            _this.$router.push({ name: 'TaskList' })
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/list-task/update/' + this.$route.params.id, _this.formData).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                            _this.$router.push({ name: 'TaskList' })
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
        },

    }
}
</script>

