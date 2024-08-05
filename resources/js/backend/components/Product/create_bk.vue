<template>
    <div style="height: calc(100vh - 140px); overflow-x: hidden">
        <el-form label-position="right" :model="formData" ref="formData" label-width="180px" class="demo-ruleForm">
            <div class="elevation-1" style="padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Thông tin cơ bản</span>
                <el-divider></el-divider>
                <el-form-item label="Hình ảnh sản phẩm" prop="title">
                    <div class="form-group">
                        <el-upload class="custorm-upload" ref="upload" :auto-upload="false"
                            accept="image/png, image/jpeg" action="/api/admin/upload" list-type="picture-card"
                            :on-change="handleUploadChange" :on-remove="removeImg" multiple :limit="limitImg"
                            :on-exceed="messLimit" :file-list="fileList">
                            <div slot="file" slot-scope="{file}">
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-delete" @click="removeImg(file)">
                                        <i class="el-icon-delete"></i>
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
                    </div>
                    <el-button @click="$refs.upload.submit()" size="small" type="primary">Upload</el-button>
                </el-form-item>

                <el-form-item label="Tên sản phẩm" prop="type">
                    <div class="form-group">
                        <el-input v-model="formData.type"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="Danh mục sản phẩm" prop="icon">
                    <div class="form-group">
                        <el-input v-model="formData.type"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="Thương hiệu" prop="icon">
                    <div class="form-group">
                        <el-input v-model="formData.type"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="Mô tả sản phẩm" prop="icon">
                    <div class="form-group">
                        <el-input show-word-limit maxlength="20" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }"
                            v-model="formData.type"></el-input>
                    </div>
                </el-form-item>
            </div>
            <!-- <div class="elevation-1" style="margin-top: 5px;padding: 14px; background-color: #ffffff">
                <span style="font-size: 15px; font-weight: bold">Thông tin chi tiết</span>
                <el-divider></el-divider>
                <el-form-item label="Phân loại bán hàng">
                  <div class="form-group">
                      <div v-for="(item,i) in totalGroupOption">
                          <div v-if="totalGroupOption.length > 0"
                               style="width: 100%; background-color: #f6f6f6;margin-bottom: 5px; padding:15px; position: relative">
                              <div style="position: absolute; right: 10px; top: 0px;z-index: 9">
                                  <i style="cursor: pointer" @click="removeGroup(item)" class="el-icon-close"></i>
                              </div>
                              <div v-if="totalGroupOption.length > 0" class="row">
                                  <div class="col-2 mb-2">
                                      <span>Nhóm phân loại {{i+1}}</span>
                                  </div>
                                  <div class="col-10">
                                      <div class="row">
                                          <div class="col-4">                                           
                                                <el-input :placeholder="item==1?'ví dụ: màu sắc v.v':'ví dụ: size, v.v'" v-model="formData.groupOption['Option_'+item].name"></el-input>                                             
                                          </div>
                                      </div>
                                  </div>

                              </div>
                              <div class="row">
                                  <div class="col-2">
                                      <span>Phân loại hàng</span>
                                  </div>
                                  <div class="col-10">
                                      <div v-if="totalGroupOption.length > 0" class="row mb-2">
                                          <div class="col-4" v-for="(option,indexOption) in formData.groupOption['Option_'+item].listOption ">
                                              <el-input :placeholder="item==1?'ví dụ: trắng, đỏ v.v':'ví dụ: S, M, v.v'"
                                                        class="mb-2"
                                                        @input="addOption(option, indexOption)"
                                                        v-model="formData.groupOption['Option_'+item].listOption[indexOption]">
                                                        <i style="cursor: pointer" @click="deleteOption(option)" slot="suffix" class="el-input__icon el-icon-delete"></i>
                                              </el-input>

                                          </div>

                                      </div>
                                  </div>
                              </div>


                              <el-button @click="totalGroupOption=[1,2]; addGroup(2)"  v-if="totalGroupOption.length == 1" style="border: 1px dotted; color: orange">
                                  <i class="el-icon-plus"></i> Thêm nhóm phân loại 2
                              </el-button>
                          </div>

                      </div>

                      <el-button @click="totalGroupOption=[1]; addGroup(1)"  v-if="totalGroupOption.length==0" style="border: 1px dotted; color: orange">
                          <i class="el-icon-plus"></i> Thêm nhóm phân loại
                      </el-button>
                  </div>
                </el-form-item>
                <el-button @click="submit">Click</el-button>
            </div> -->
        </el-form>
        <div class="elevation-1 mt-2" style="padding: 14px; background-color: #ffffff">
            <span style="font-size: 15px; font-weight: bold">Thông tin chi tiết</span>
                <el-divider></el-divider>
            <div class="row">
                <div style="width: 180px; text-align: end; font-weight: bold; color: #606266; font-size: 14px;padding-top: 10px;"> 
                    Phân loại bán hàng
                </div>
                <div style="padding: 14px; width: calc(100% - 180px);" > 
                        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">     
                        <div  v-for="(domain, index) in dynamicValidateForm.domains" :key="domain.key">
                            <div style="width: 100%; background-color: #f6f6f6;margin-bottom: 5px; padding:15px; position: relative">
                                <div style="position: absolute; right: 10px; top: 0px;z-index: 9">
                                    <i style="cursor: pointer" @click.prevent="removeDomain(domain)" class="el-icon-close"></i>
                                </div>
                                <div class="row">
                                    <div class="col-2">
                                       Nhóm phân loại {{(index+1)}}
                                    </div>
                                    <div class="col-10">
                                    <div class="row">
                                        <div class="col-3">
                                            <el-form-item
                                                :prop="'domains.' + index + '.value'" :rules="ruleReq">
                                                <el-input v-model="domain.value"></el-input>
                                                <!-- <el-button @click.prevent="removeDomain(domain)">Delete</el-button> -->
                                            </el-form-item>
                                        </div>
                                        </div>
                                    </div>
                                </div>                               

                                <div class="row">
                                    <div class="col-2">
                                        Phân loại hàng
                                    </div>
                                    <div class="col-10">
                                        <div class="row">
                                            <div class="col-3" v-for="(domainChild, index2) in domain.listOption" :key="domainChild.key">
                                                <el-form-item
                                                    :prop="dynamicValidateForm.domains[index].listOption[index2].value" :rules="ruleReq">     
                                                    <!-- {{ dynamicValidateForm.domains[index].listOption[index2].value}}                        -->
                                                    <el-input @change="changeOption(domain)" v-model="domainChild.value"></el-input>
                                                    <!-- <el-button @click.prevent="removeDomain(domainChild)">Delete</el-button> -->
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                </div>             
                            </div>
                        </div>   
                    </el-form>
                    <el-button @click="addDomain(dynamicValidateForm.domains.length)" v-if="dynamicValidateForm.domains.length<2" style="border: 1px dotted; color: orange">
                        <i class="el-icon-plus"></i> Thêm nhóm phân loại
                    </el-button>
                </div>
            </div>     
            <!-- <el-form label-width="180" v-if="dynamicValidateForm.domains.length>0">
                <el-form-item label="Danh sách phân loại hàng">
                    <div style="display: flex;">
                        <el-input
                            placeholder="Giá"
                            >
                        </el-input>
                        <el-input
                           
                            placeholder="Kho hàng"
                           >
                        </el-input>
                        <el-input
                          
                            placeholder="Ghi chú"
                            >
                        </el-input>
                        <el-button style="background-color: #FFA500; color: #fff;">Áp dụng cho tất cả phân loại</el-button>
                    </div>
                    <div style="display: flex; justify-items: end;">
                        <table style="width: calc(100%); margin-top: 10px;" class="table table-bordered">
                            <tr style="background-color: #f5f5f5;">
                                <td>{{dynamicValidateForm.domains[0].value?dynamicValidateForm.domains[0].value:'Nhóm phân loại 1'}}</td>
                                <td v-show="dynamicValidateForm.domains.length>1">{{dynamicValidateForm.domains[1]&&dynamicValidateForm.domains[1].value?dynamicValidateForm.domains[1].value:'Nhóm phân loại 2'}}</td>
                                <td>Giá</td>
                                <td>Kho hàng</td>
                                <td>Ghi chú</td>
                            </tr>
                            <tr v-for="(item) in dynamicValidateForm.domains[0].listOption">
                                <td >{{ item.value }}</td>
                                <td v-if="dynamicValidateForm.domains.length>1">
                                    <div v-for="item2 in dynamicValidateForm.domains[1].listOption">{{ item2.value }}</div>
                                </td>
                                <td v-if="dynamicValidateForm.domains.length>1"><el-input  v-for="item2 in dynamicValidateForm.domains[1].listOption" v-model="item2['price']"></el-input></td>
                                <td v-if="dynamicValidateForm.domains.length>1"><el-input  v-for="item2 in dynamicValidateForm.domains[1].listOption" v-model="item2['total']"></el-input></td>
                                <td v-if="dynamicValidateForm.domains.length>1"><el-input  v-for="item2 in dynamicValidateForm.domains[1].listOption" v-model="item2['note']"></el-input></td>                                         
                            </tr>
                        </table>
                    </div>
                    
                </el-form-item>
            </el-form> -->
        </div>
        <el-button @click="submit">Click</el-button>
        
    </div>
</template>

<script>
import ApiService from "../../common/api.service";

export default {
    name: "create",
    data() {
        return {
            ruleReq:[
                { required: true, message: 'Please input email address', trigger: 'blur' },
                { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
            ],
            dynamicValidateForm: {
                domains: [], 
                email: ''
            },

            totalGroupOption: [],
            limitImg: 6,
            fileList: [],
            rules: {
                type: [
                    { required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur' },
                    // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
                ],
                level: [
                    { required: true, message: 'Vui lòng không bỏ trống', trigger: 'change' },
                ],
            },
            required: { required: true, message: 'Vui lòng không bỏ trống', trigger: 'blur' },
            formData: {
                title: '',
                // type:'',
                hidden: '1',
                images: '',
                groupOption: {

                },
            },
        }
    },
    watch: {
        fileList(e) {
            // console.log(e)
        }
    },
    methods: {
        changeOption(item){
            item.listOption.push({
                key:  Date.now(),
                value: '',
            })           
        },
        FormTest(){
            console.log(this.dynamicValidateForm);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        addDomain(level) {
            if(level==0){
                 this.dynamicValidateForm.domains.push({
                    key: Date.now(),
                    value: '',
                    listOption:[
                            {
                                key:  Date.now(),
                                value: '',
                                listOption2:[]
                            }
                        ]
                });
            }else{
                this.dynamicValidateForm.domains[0].listOption[0].listOption2.push(
                    {
                        key:  Date.now(),
                        value: '',
                    }
                )
            }
           
        },
        // 
        submit() {
            console.log(this.dynamicValidateForm)
        },
        //Group option product
        addGroup(index) {
            console.log(this.totalGroupOption.length)
            this.formData.groupOption = {
                ...this.formData.groupOption, ['Option_' + index]: {
                    name: '',
                    listOption: {
                        option_1: '',
                    }
                }
            }
            console.log(this.formData)
        },
        removeGroup(index) {
            delete this.formData.groupOption[index]
            this.totalGroupOption = this.totalGroupOption.filter(e => e != index)
        },
        addOption(item, index) {
            item = { ...item, ['option_' + (index + 1)]: '' }
        },
        deleteOption(item) {
            console.log(item)
        },
        //Custorm upload images
        handleUploadChange(file) {
            console.log(this.fileList.findIndex(e => e.uid == file.uid))
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
            this.fileList = this.fileList.filter(e => e.uid != el.uid)
            console.log(el.uid)
            ApiService.post('/api/admin/removeFile', { path: el.response })
        }
    }
}
</script>

<style>
.custorm-upload .el-upload--picture-card {
    width: unset;
    height: unset;
    line-height: 20px;
    padding: 50px;
}
</style>
