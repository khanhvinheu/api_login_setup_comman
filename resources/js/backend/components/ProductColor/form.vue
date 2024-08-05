<template>
    <div class="form_product_color">
        <div style="margin-top: -30px">
            <span style="font-size: 13px; font-weight: bold; text-transform: uppercase">{{ title }}</span>
            <el-divider></el-divider>
        </div>
        <el-form :model="form" ref="form" label-width="120px" class="demo-ruleForm">
            <el-form-item :rules="requiredForm" label="Màu sản phẩm" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item :rules="requiredForm" label="Chọn mã màu" prop="value">
                <el-color-picker v-model="form.value"></el-color-picker>
            </el-form-item>
            <el-form-item label="Chọn mã màu" prop="image">
                <vue-upload-multiple-image :showEdit="false"
                    popupText="Hình ảnh được chọn sẽ sử dụng làm ảnh hiển thị ở banner trang chủ" :multiple="false"
                    @upload-success="uploadImageSuccess" @before-remove="beforeRemove"
                    :data-images="images"></vue-upload-multiple-image>
            </el-form-item>
        </el-form>
        <div style="display: flex; justify-content: end">
            <el-button type="primary" @click="submit">Lưu lại</el-button>
            <el-button @click="$refs.form.resetFields()">Reset Form</el-button>
        </div>
    </div>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
export default {
    name: "create_update",
    components: {
        VueUploadMultipleImage,
    },
    props: ['resID','triggerLoad'],
    data() {
        return {
            title: '',
            form: {
                title: '',
                value: '',
                image: ''
            },
            requiredForm: { required: true, message: 'Vui lòng không bỏ trống!', trigger: 'blur' },
            images:[]
        }
    },
    mounted() {
        if (this.resID) {
            this.title = 'Cập nhật màu sản phẩm'
            this.getDetail(this.resID)
        } else {
            this.title = 'Thêm mới màu sản phẩm'
            this.$refs.form.resetFields()
        }
    },
    watch: {
        resID(e) {
            this.form.title= '',
            this.form.value= '',
            this.images= []
            if (e) {
                this.title = 'Cập nhật màu sản phẩm'
                this.getDetail(e)
            } else {
                this.title = 'Thêm mới màu sản phẩm'
            }
           
        },
        triggerLoad(){
            this.title= '',
            this.value= '',
            this.images=[]
            if (this.resID) {
                this.title = 'Cập nhật màu sản phẩm'
                this.getDetail(this.resID)
            } else {
                this.title = 'Thêm mới màu sản phẩm'
            }
            
           
        }
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
            return new File([u8arr], filename, { type: mime });
        },
        uploadImageSuccess(formData, index, fileList) {
            this.form.image = this.dataURLtoFile(fileList[0].path, fileList[0].name);
            // console.log('data', formData, index, fileList)
            // Upload image api
            // axios.post('http://your-url-upload', formData).then(response => {
            //   console.log(response)
            // })
        },
        beforeRemove(index, done, fileList) {
            done()            
            this.form.image = '';
        },
        submit() {
            let _this = this
            let url
            var formData = new FormData()
            formData.append('title', this.form.title)
            formData.append('value', this.form.value)         
            formData.append('image', this.form.image)
            url = this.resID ? ('/api/admin/product_color/update/' + this.resID) : '/api/admin/product_color/create'
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    axios({
                        method: 'post',
                        url: url,
                        data: formData
                    })
                        .then(function (response) {
                            if (response.data['success']) {
                                _this.$notify({
                                    title: 'Success',
                                    message: response.data['mess'],
                                    type: 'success'
                                });

                                _this.$emit('success')
                                _this.$refs.form.resetFields()
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
        async getDetail(id) {
            let _this = this
            await axios({
                method: 'get',
                url: '/api/admin/product_color/detail/' + id,
            })
                .then(({ data }) => {
                    if (data['success']) {
                        let res = data['data']
                        _this.form.title = res['title']
                        _this.form.value = res['value']
                        res['image'] && (_this.images = [{path:res['image']}])

                    }
                });

        },
    }
}
</script>

<style scoped></style>
