<template>
    <div class="FormProduct">
        <el-form v-loading="loadingForm" label-position="right" :model="form" ref="form" class="demo-ruleForm">
            <div class="elevation-1 mb-2"
                style="padding: 14px; background-color: #ffffff; display: flex; justify-content: space-between;">
                <el-tag size="lage" v-if="form.status" :type="listStatus.find(e=>e.value == form.status).type">
                    <span v-html="listStatus.find(e=>e.value == form.status).title"></span>    
                </el-tag> 
                <div>
                    <el-button :loading="loadingBtn"  type="success" @click="updateStatus()"><i
                        class="el-icon-circle-check"></i> Chuyển trạng thái</el-button>
                    <el-badge :is-dot="listFeedback.length>0" class="item">
                        <el-button :loading="loadingBtn"  type="primary" @click="outerVisible=true"><i
                            class="el-icon-chat-dot-square"></i> Thông tin phản hồi</el-button>
                    </el-badge>
                        
                    <el-button @click="$router.push({ name: 'TaskList' })"><i class="el-icon-menu"></i> Danh sách công việc</el-button>
                </div>
              
            </div>
            
            <div class="elevation-1 mb-2" style="padding: 14px; background-color: #ffffff">
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-size: 15px; font-weight: bold; text-transform: uppercase;">{{ form.title }}</span>
                    <span style="font-size: 11px;" v-if="form.create_by">{{ form.create_by[0].name }} - {{ form.create_by[0].chucvu }} | {{ form.created_at | formatDate }}</span>
                </div>
                
                <el-divider></el-divider>                
                  
                <el-form-item label-width="180px" v-if="form.task_type[0]"  label="Danh mục công việc " :rules="requiredChange" prop="task_type">
                    <div class="form-group">
                        <el-input :readonly="true" :value="form.task_type[0].title"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" v-if="form.assign_to[0]" label="Giao cho" prop="assign_to" :rules="requiredChange">
                    <div class="form-group">
                        <el-input :readonly="true" :value="form.assign_to[0].name "></el-input>
                    </div>
                </el-form-item>
               
            </div>
            <div class="elevation-1 mb-2" style="padding: 14px; background-color: #ffffff">
                <div style="display: flex; justify-content: space-between;">
                    <el-progress v-if="form.progress" :stroke-width="15" :width="70" type="dashboard" :percentage="parseInt(form.progress) " :color="colors"></el-progress>
                    <div>
                        <el-button :loading="loadingBtn"  type="success" @click="updateProgress()"><i
                        class="el-icon-circle-check"></i> Cập nhật tiến độ công việc</el-button>
                    </div>
                </div>
                
                <el-divider></el-divider>
                <el-form-item label-width="180px" label="Tiến độ công việc" prop="note">
                    <div class="form-group">
                        <el-slider                           
                            v-model="form.progress"
                            :step="10"
                            show-stops>
                            </el-slider>
                    </div>
                </el-form-item>      
            </div>
            <div class="elevation-1 mt-2" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Chi tiết công việc</span>
                <el-divider></el-divider>
                <el-form-item label-width="180px" label="Chi tiết công việc" prop="task_detail">
                    <div class="form-group">
                        <Editor :readonly="true" show-word-limit maxlength="500" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="form.task_detail"></Editor>
                    </div>
                </el-form-item>
                <el-form-item label-width="180px" label="Ghi chú" prop="note">
                    <div class="form-group">
                        <Editor :readonly="true" show-word-limit maxlength="500" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="form.note"></Editor>
                    </div>
                </el-form-item>              
            </div>            
        </el-form>
        <el-dialog :visible.sync="outerVisible" >
                <template slot="title">
                    <span style="font-size: 15px; font-weight: bold">Thông tin phản hồi</span>
                    <el-divider></el-divider>   
                </template> 
                <template slot-scope="scope">
                    <div class="mt-n5">
                    <el-tree
                        ref="tree"
                        empty-text="Không tìm thấy !"                    
                        v-if="listFeedback.length"
                        :data="listFeedback"
                        :show-checkbox="false"
                        node-key="id"
                        class="tree-module_task-detail"
                        default-expand-all  
                        :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <div style="display: flex; flex-direction: column;  position: relative; background-color: rgb(0,0,0,0.1 ); border-radius: 10px; padding: 10px; width: 100%; ">
                                <div style="display: flex; align-items: center;"><el-avatar icon="el-icon-user-solid"></el-avatar>
                                    <span style="padding-left: 5px;">{{ data.feedback }}</span>
                                </div>   
                                <div style="display: flex; justify-content: space-between; align-items: center;padding-left: 40px; width: 100%;">   
                                    <div style="width: 100%;">
                                        <el-input v-if="indexFeedback==data.id" v-model="formReply.feedback" style="width: calc(100% - 100px)">
                                            <el-button @click="sunbmitReply()"  slot="append">
                                                <i class="el-icon-s-promotion"></i>
                                            </el-button>
                                        </el-input>  
                                        <el-button  
                                            v-if="indexFeedback!=data.id"                                         
                                            type="text"                                      
                                            size="mini"
                                            style="color:green"
                                            @click="reply(data)">
                                            <i class="el-icon-chat-line-square"></i> Trả lời
                                        </el-button>   
                                    </div>  
                                    <div>
                                        <span style="font-size: 11px; font-style: italic;"><span v-if="data.create_by[0]">{{data.create_by[0].name }}</span> |  {{ data.created_at | formatDate }}</span> 
                                    </div>  
                                </div>    
                            </div>    
                        </span>
                    </el-tree>  
                    <el-input v-else v-model="formReply.feedback" placeholder="Nhập nội dung phản hồi" style="width: 100%">
                        <el-button @click="sunbmitReply()"  slot="append">
                            <i class="el-icon-s-promotion"></i>
                        </el-button>
                    </el-input> 
                    </div>    
                </template>
            <!-- </div> -->
        </el-dialog>
    </div>
</template>
<script>
import Editor from '../Tinymce/index.vue'
import ApiService from '../../common/api.service';
import { listStatus } from './configStatus';
export default {
    components: {  Editor},
    data() {
        return {
            colors: [
                {color: '#f56c6c', percentage: 20,status:"exception"},
                {color: '#6f7ad3', percentage: 40},
                {color: '#e6a23c', percentage: 60},
                {color: '#1989fa', percentage: 80},
                {color: '#5cb87a', percentage: 100,status:"success"}
            ],
            outerVisible:false,
            indexFeedback:'',
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
                status: '',
                create_by: '',
                progress: 0
            },         
            formData: new FormData(),
            isUpdate: false,
            listUser: [],
            listFeedback:[],
            formReply:{
                feedback:'',
                id_task:this.$route.params.id,
                create_by:this.$store.getters.user.id,
                id_parent:''
            },
            listStatus:listStatus
        }
    },
    async mounted() {          
        await this.getListUser()
        await this.getListTaskType()
        if (this.$route.params.id) {
            this.isUpdate = true
            await this.getDetailProduct()
            await this.getFeedbacks()
        } else {
            this.isUpdate = false
        }
    },
    methods: {
        reply(e){
            this.indexFeedback = e.id
            this.formReply.id_parent = e.id
        },
        sunbmitReply(){    
            ApiService.post('/api/admin/list-task-feedback/create',this.formReply).then(({data})=>{
                if(data.success){
                  this.formReply.feedback=''
                  this.indexFeedback=''
                  this.getFeedbacks()
                }
            })
        },
        getFeedbacks(){
            ApiService.query('/api/admin/list-task-feedback',{params:{type:'treeData',id_task: this.$route.params.id }}).then(({data})=>{
                if(data.success){
                    this.listFeedback = data['data']
                }
            })
        },
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
                    this.form.task_type = res['task_type']
                    this.form.assign_to = res['assign_to']
                    this.form.task_detail = res['task_detail']
                    this.form.note = res['note']
                    this.form.create_by = res['create_by']
                    this.form.created_at = res['created_at']
                    this.form.progress = parseInt(res['progress']  )                 
                    this.form.status = res['status']                  
                }
                this.loadingForm = false
            })
        }, 
        updateStatus() {
            let _this = this          
            let param={
                status : (this.form.status <5) ? (this.form.status+1):1,               
            }     
            this.form.status == 4 &&  (param.progress = 100  )
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/list-task/update/' + this.$route.params.id, param).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                            _this.getDetailProduct()                           
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
        updateProgress() {
            let _this = this
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.loadingBtn = true
                    ApiService.post('/api/admin/list-task/update/' + this.$route.params.id,{progress:this.form.progress}).then(({ data }) => {
                        if (data['success']) {
                            _this.$notify({
                                title: 'Success',
                                message: data['mess'],
                                type: 'success'
                            });
                          
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
<style>
.tree-module_task-detail .custom-tree-node {
    width: 100%;
    font-size: 14px;
    padding-right: 8px;
}

.label__form {  
    font-size: 13px;
}
.tree-module_task-detail .el-tree-node__content{
    height: 100px;
   
    /* border: 1px dotted rgb(0,0,0,0.2);
    border-radius: 5px;
    margin-bottom: 5px; */
   
}
.tree-module_task-detail .custom-tree-node{ 
    border-radius: 20px;
    padding: 5px;
}
.tree-module_task-detail .el-tree-node__content:hover, .el-upload-list__item:hover {
    background-color:transparent !important;
}</style>

