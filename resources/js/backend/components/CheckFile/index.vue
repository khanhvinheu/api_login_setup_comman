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
                <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_front.jpg');background-position: center;
                    background-repeat: no-repeat; background-size: 100% auto;
                ">
                        <div class="left" style="position: relative; width: 50%;height: 100%;">                    
                            <div class="chucVuEN" style="position: absolute;top:65px; left: 169px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">RECTOR</span>
                            </div>                    
                            <div class="donViCapEN" style="position: absolute;top:90px; left: 125px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">TRA VINH UNIVERSITY</span>
                            </div>                   
                            <div class="hoTenEN" style="position: absolute;top:180px; left: 60px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.hoTen}</span>
                            </div>
                            <div class="ngaySinhEN" style="position: absolute;top:210px; left: 100px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.namSinh}</span>
                            </div>
                            <div class="tenKhoaHocEN" style="position: absolute;top:268px; left:26px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">CN CNTT</span>
                            </div>                
                            <div class="fromDateEN" style="position: absolute;top:298px; left:196px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">01&nbsp 01 &nbsp&nbsp2016 
                                    &nbsp
                                    &nbsp 01&nbsp&nbsp09&nbsp  2020</span>
                            </div>                
                            <div class="noiDaoTaoEN" style="position: absolute;top:328px; left:46px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Trà Vinh University</span>
                            </div>
                        </div>
                        <div class="right" style="position: relative; width: 50%;height: 100%;">
                            <div class="chucVu" style="position: absolute;top:65px; right: 152px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">HIỆU TRƯỞNG</span>
                            </div>
                            <div class="donViCap" style="position: absolute;top:90px; right: 110px">
                                <span style="font-size: 13px;font-weight: bold; color: red;">TRƯỜNG ĐẠI HỌC TRÀ VINH</span>
                            </div>
                            <div class="hoTen" style="position: absolute;top:180px; left: 50px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.hoTen}</span>
                            </div>
                            <div class="gioiTinh" style="position: absolute;top:180px; left: 330px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Nam</span>
                            </div>
                            <div class="ngaySinh" style="position: absolute;top:210px; left:80px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">${item.namSinh}</span>
                            </div>
                            <div class="tenKhoaHoc" style="position: absolute;top:268px; left: 25px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Công nhân CNTT</span>
                            </div>
                            <div class="fromDate" style="position: absolute;top:298px; left: 178px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">01&nbsp 01 2016 
                                    &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
                                    &nbsp 01&nbsp  09&nbsp  2020</span>
                            </div>
                            <div class="noiDaoTao" style="position: absolute;top:328px; left: 45px">
                                <span style="font-size: 13px;font-weight: bold; color: black;">Trường đại học Trà Vinh</span>
                            </div>
                        </div>
                </div>
                <div style="display: flex;position: relative;;width: 795px;height: 540px; background-image: url('/assets/chungchimau/chungchimau_back.jpg');background-position: center;
                            background-repeat: no-repeat; background-size: 100% auto;
                        "></div>
            `;
            const pdfBlob = await html2pdf().from(element).outputPdf('blob');
            this.pdfSrc = URL.createObjectURL(pdfBlob);  
           
        },
    }
}
</script>