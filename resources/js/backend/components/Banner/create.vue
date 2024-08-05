<template>
    <div class="row">
        <div class="col-md-12">
          <div class="card card-default">
            <div class="card-header" style="background-color: rgb(0,0,0,0.1);">
              <h3 class="card-title">{{idUpdate?'CẬP NHẬT':'THÊM MỚI'}} BANNER</h3>
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
                  <el-form label-position="right" :model="formData" :rules="rules" ref="formData" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="Tên banner" prop="title">
                       <div class="form-group">
                        <!-- <label class="label__form">Tên danh mục</label> -->
                        <el-input validate-event placeholder="Nhập tên banner" v-model="formData.title"></el-input>
                      </div>
                    </el-form-item>


                    <!-- <el-form-item label="Loại banner" prop="icon">
                      <div class="form-group">
                        <el-input v-model="formData.type" placeholder="Nhập icon có dạng fa fa-nameicon"></el-input>
                      </div>
                    </el-form-item>                     -->
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
                </div>
                <!-- /.col -->



              </div>
              <!-- /.row -->
            </div>
            <!-- /.card-body -->
            <div class="card-footer">
              <el-button type="success" @click="submit"><i class="el-icon-plus"></i> Lưu lại</el-button>
              <!-- <el-button type="success" @click="update"><i class="el-icon-edit"></i> Lưu lại</el-button> -->
              <el-button @click="$router.push({name:'BannerList'})">Đóng</el-button>
            </div>

          </div>
        </div>
    </div>

</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
export default {
  components: {
    VueUploadMultipleImage,
  },
  data(){
    return{
      images:[],
      SlideData:[
                {img:'https://media.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/February2023/Banner_valentine.jpg'},
                {img:'https://media.coolmate.me/cdn-cgi/image/width=1920,quality=90,format=auto/uploads/November2022/Banner-Coolmate-Active-opt-1s.jpg'},
      ],
      tableData:  [],
      rules: {
          title: [
            { required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur' },
            // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          level: [
            { required: true, message: 'Vui lòng không bỏ trống', trigger: 'change' },
          ],
      },
      formData:{
        title:'',
        // type:'',
        hidden:'1',
        images:''
      },
      idUpdate:''


    }
  },
  watch :{

  },
  mounted(){
    this.getList()
    if(this.$route.params.id){
      this.idUpdate=this.$route.params.id
      this.getDetail(this.idUpdate)
    }
  },
  methods:{
    // convert base64 to file
    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    } ,
    uploadImageSuccess(formData, index, fileList) {
      this.formData.images = this.dataURLtoFile(fileList[0].path, fileList[0].name);
      // console.log('data', formData, index, fileList)
      // Upload image api
      // axios.post('http://your-url-upload', formData).then(response => {
      //   console.log(response)
      // })
    },
    beforeRemove (index, done, fileList) {
        done()       
        this.formData.images = '';
    },

    getList(){
      let _this = this
      axios({
        method: 'get',
        url: '/api/admin/banners',
        params:{type:'treeData'}
      })
        .then(function (response) {
          _this.tableData = response.data['data']
        });
    },

    submit(){
      let _this= this
      var formData = new FormData()
      formData.append('title', this.formData.title)
      formData.append('image', this.formData.images)
      formData.append('type', this.formData.type)
      formData.append('hidden', this.formData.hidden)
      let url
      url = this.idUpdate?('/api/admin/banners/update/'+this.idUpdate):'/api/admin/banners/create'

      this.$refs['formData'].validate((valid) => {
          if (valid) {
            axios({
              method: 'post',
              url: url,
              data: formData
            })
            .then(function (response) {
              if(response.data['success']){
                _this.$notify({
                  title: 'Success',
                  message: response.data['mess'],
                  type: 'success'
                });

                _this.$router.push({name:'BannerList'})
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
        url: '/api/admin/banners/detail/'+id,
      })
        .then(({data})=> {
          if(data['success']){
            let res = data['data']
              _this.formData.title = res['title']
              res['path'] && res['path']!=null && ( _this.images = [{path:res['path']}])
          }
        });

    },

    changeStatus(id){
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

.preview-image:hover .image-overlay, .preview-image:hover .image-overlay-details {
    opacity: 1;
    display: flex;
    justify-content: center;
}
.image-primary{
  background-color: transparent !important;
}
</style>
