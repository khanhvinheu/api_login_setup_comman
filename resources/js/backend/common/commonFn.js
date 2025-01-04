
export default{
    name:'commonFn',
    methods:{
        checkRoleAction (){
            // console.log(this.$store.getters.user.name, 'role');
            let username = this.$store.getters.user.name
            let role = this.$store.getters.user.roles[0]
            if(username != 'admin'){
                return false
            }
            return true
        }
    }

}