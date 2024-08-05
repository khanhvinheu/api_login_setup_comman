<template>
    <div class="row">
        <div class="col-md-12">
            <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
            <div class="row" style="display: flex; flex-wrap: nowrap;">
            <el-input
            placeholder="Nhập kí tự cần tìm kiếm danh mục"
            v-model="filterDataCategorys">
            </el-input>            
            </div>
            <el-divider></el-divider>
            <div v-show="loading" style="display: flex; justify-content: center;">                
                <i style="font-size: 40px;" class="el-icon-loading"></i>
            </div>
            <el-tree                
                ref="tree"
                empty-text="Không tìm thấy !"
                :filter-node-method="filterNode"
                v-show="data && !loading"
                :data="data"
                :show-checkbox="false"                  
                node-key=id
                default-expand-all
                :check-on-click-node="true"               
                @node-click="selectCategory"
                :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.title}}</span>
                <span>
                <span v-show="data.id == categoryActive.id"><i style="color: #67c23a; font-size: 20px; font-weight: bold;" class="el-icon-circle-check"></i></span>                      
                </span>
            </span>
            </el-tree>            
            <el-divider></el-divider>
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <span v-show="categoryActive">
                    <i class="el-icon-check"></i> Đã chọn: <span style="font-weight: bold; font-size: 15px;">{{this.titleCaterogy}}</span></span>
                </div>
                <div>
                    <el-button @click="getList()"><i class="el-icon-refresh"></i> Reload</el-button>
                    <el-button type="success" @click="submitData()"><i class="el-icon-document-checked"></i> Lưu lại</el-button>
                </div>
              
            </div>
        </div>
        </div>
        <!-- /.row --> 
</template>
<script>
import ApiService from '../../common/api.service';
export default {
    watch: {
        filterDataCategorys(val) {
            this.$refs.tree.filter(val);
        }
    },
    data(){
        return{
            filterDataCategorys:'',
            data: [],
            categoryActive:'',
            loading:true,
            listCate:[]
        }
    },
    mounted(){
        this.getList()
    },
    methods:{      
        async getParent(id){
            let _this = this           
            await ApiService.query('/api/admin/categorys/getParent/'+id).then(({data})=>{
                    if(data['success']){
                       _this.listCate= data['data']
                    }
            })            

        },
        async selectCategory(item){               
            this.categoryActive = item
            this.listCate=[]
            await this.getParent(item.id); 
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        getList(){
            let _this = this
            _this.loading = true
            ApiService.query('/api/admin/categorys', {params:{type:'treeData'}}).then(({data})=>{
                _this.data = data['data']
                _this.loading = false
            })
        },
        submitData(){
            this.$emit('saveData',this.categoryActive.id)            
        }
    },
    computed:{
        titleCaterogy(){
            return this.listCate.join(' -> ')
        }
    }
}
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
</style>