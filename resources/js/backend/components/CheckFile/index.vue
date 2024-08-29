<template>
    <div>
        <embed style="width: 100vw; height: 100vh" :src="pdfSrc" 	title="Embedded PDF Viewer" type="application/pdf">              
        </embed> 
    </div>
</template>
<script>
import html2pdf from 'html2pdf.js';
export default {
    data(){
        return{
            data:'',
            pdfSrc:''
        }
    },
    watch:{
        $route(to, from){
            this.getDetail(this.$route.params.id)
        }
    },
    mounted(){
        this.getDetail(this.$route.params.id)
    },
    methods:{
        async getDetail(id) {
            let _this = this
            _this.idUpdate = id
            await axios({
                method: 'get',
                url: '/api/admin/cap-chung-chi/detail/' + id,
            })
                .then(({data}) => {                  
                    if (data['success']) {
                        let res = data['data']
                        this.data = res
                        this.generatePDF(res)
                    }
                 
                });
           
        },
        async generatePDF(item) {         
            const element = `
                  <div style="display: flex;position: relative;width: 785px;height: 540px;">
              
                <img src="/assets/chungchimau/chungchiv2.jpg" style="width: 100%; height: 100%; position: absolute; top: 1px; left: 0;"/>
                
                <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                    <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">RECTOR</span>
                    </div>                    
                    <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRA VINH UNIVERSITY</span>
                    </div>                   
                    <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:24px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.tenKhoaHocEN}</span>
                    </div>                
                    <div class="fromDateEN" style="position: absolute;top:298px; left:192px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 &nbsp&nbsp2016 
                            &nbsp
                            &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                    </div>                
                    <div class="noiDaoTaoEN" style="position: absolute;top:325px; left:46px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.noiDaoTaoEN}</span>
                    </div>
                    <img src="${item.image}" style="position:absolute; top:380px; left:60px; width: 60px; height:75px; object-fit:contain"/>
                </div>
                <div class="right" style="position: relative; width: 50%;height: 100%;">
                    <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">HIỆU TRƯỞNG</span>
                    </div>
                    <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                        <span style="font-size: 13px;font-weight: bold; color: #e92b37;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                    </div>
                    <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.hoTen}</span>
                    </div>
                    <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">Nam</span>
                    </div>
                    <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.namSinh}</span>
                    </div>
                    <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 30px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.tenKhoaHoc}</span>
                    </div>
                    <div class="fromDate" style="position: absolute;top:298px; left: 182px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">01&nbsp 01 2016 
                            &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                            &nbsp 01&nbsp  09&nbsp  2020</span>
                    </div>
                    <div class="noiDaoTao" style="position: absolute;top:325px; left: 48px">
                        <span style="font-size: 13px;font-weight: bold; color: #2c2d29;">${item.khoa_hoc.noiDaoTao}</span>
                    </div>
                </div>
        </div>
            `;
            const pdfBlob = await html2pdf().from(element).outputPdf('blob');
            this.pdfSrc = URL.createObjectURL(pdfBlob);  
           
        },
    }
}
</script>