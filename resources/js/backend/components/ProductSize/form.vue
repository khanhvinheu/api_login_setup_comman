<template>
    <div class="form_product_color">
       <div style="margin-top: -30px">
           <span style="font-size: 13px; font-weight: bold; text-transform: uppercase">{{title}}</span>
           <el-divider></el-divider>
       </div>
        <el-form :model="form"  ref="form" label-width="120px" class="demo-ruleForm">
            <el-form-item :rules="requiredForm" label="Size sản phẩm" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: end">
            <el-button type="primary" @click="submit">Lưu lại</el-button>
            <el-button @click="$refs.form.resetFields()">Reset Form</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "create_update",
        props:['resID'],
        data(){
            return {
                title:'',
                form:{
                    title:'',
                    value:'null'
                },
                requiredForm: { required: true, message: 'Vui lòng không bỏ trống!', trigger: 'blur' }
            }
        },
        mounted() {
            if(this.resID){
                this.title='Cập nhật size sản phẩm'
                this.getDetail(this.resID)
            }else {
                this.title='Thêm mới size sản phẩm'
                this.$refs.form.resetFields()
            }
        },
        watch:{
            resID(e){
                if(e){
                    this.title='Cập nhật size sản phẩm'
                    this.getDetail(e)
                }else {
                    this.title='Thêm mới size sản phẩm'
                }
            }
        },
        methods:{
            submit(){
                let _this= this
                let url
                url = this.resID?('/api/admin/product_size/update/'+this.resID):'/api/admin/product_size/create'
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        axios({
                            method: 'post',
                            url: url,
                            data: this.form
                        })
                            .then(function (response) {
                                if(response.data['success']){
                                    _this.$notify({
                                        title: 'Success',
                                        message: response.data['mess'],
                                        type: 'success'
                                    });

                                    _this.$emit('success')
                                    _this.$refs.form.resetFields()
                                }else{
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
            async getDetail(id){
                let _this = this
                await axios({
                    method: 'get',
                    url: '/api/admin/product_size/detail/'+id,
                })
                    .then(({data})=> {
                        if(data['success']){
                            let res = data['data']
                            _this.form.title = res['title']
                            _this.form.value = res['value']

                        }
                    });

            },
        }
    }
</script>

<style scoped>

</style>
