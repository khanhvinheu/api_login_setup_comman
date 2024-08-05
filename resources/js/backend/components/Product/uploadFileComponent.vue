<template>
    <vue-upload-multiple-image
        :id="id"
        :ref="id"
        :showEdit="false"
        popupText="Hình ảnh được chọn sẽ sử dụng làm ảnh hiển thị ở banner trang chủ"
        :multiple="false"                                         
        :data-images="image[id]"
        @upload-success="uploadImageSuccess"
        @before-remove="beforeRemove"
    ></vue-upload-multiple-image>       
</template>
<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
export default {
    name:'upload',
    props:{fileListOption_Detail:{default:''}},
    components:{VueUploadMultipleImage},      
    data(){
        return{
            image:[],
            id:new Date().getTime()
        }
    },
    watch:{
        fileListOption_Detail(e){           
            this.image[id]=[{path:e.file}]
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

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    },
    uploadImageSuccess(formData, index, fileList) {            
        let img = this.dataURLtoFile(fileList[0].path, fileList[0].name);
        this.$emit('addFileSuccess',img)         
    },
    beforeRemove(index, done, fileList) {
        done()
        this.$emit('clearImage')
    },
    
}
}
</script>