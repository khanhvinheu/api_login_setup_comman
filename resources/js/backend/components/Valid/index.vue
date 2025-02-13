<template>
    <div style="height: 100vh;width: 100vw; display: flex; justify-content: center; align-items: center;">       
    
        <el-result v-if="statusValid" icon="success" title="Thành công" subTitle="Chứng chỉ hợp lệ.">
        <!-- <template slot="extra">
            <el-button type="primary" size="medium">Back</el-button>
        </template> -->
        </el-result>

        <el-result v-if="statusValid===false" icon="error" title="Thất bại" subTitle="Chứng chỉ không hợp lệ. Vui lòng kiểm tra lại">
            <!-- <template slot="extra">
                <el-button type="primary" size="medium">Back</el-button>
            </template> -->
        </el-result>
        <el-button hidden         
            v-loading.fullscreen.lock="fullscreenLoading">           
        </el-button>       
        
    </div>
</template>
<script>
    export default{
        name:"ValidQR",
        mounted(){   
           this.statusValid=''       
           this.validKey()         
        },
        data(){
            return{
                statusValid:'',
                loading:true,
            }
        },
        methods:{
          
            validKey() {  
                const {protocol, hostname, port, pathname, search, hash} = window.location;   
                this.loading = this.$loading({
                    // lock: true,
                    // text: 'Loading',
                    // spinner: 'el-icon-loading',
                    // background: 'rgba(0, 0, 0, 0.7)'
                    });                   
                axios({
                    method: 'post',
                    url: 'http://'+hostname+':3000/blocks/isChainValid',
                    data: {
                        publicKey: this.$route.query.key,
                        providedSignature: this.$route.params.sig
                    }
                }).then(({data}) => {
                    setTimeout(() => {
                        this.loading.close();
                    }, 2000);     
                    this.statusValid = data.status
                });
            },
        }
    }
</script>