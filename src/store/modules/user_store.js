import axios from '@/axios'
import qs from 'qs'
import { getDate,getCodeState,setSession,setDate2 } from '@/common/common'
import { Dialog,Toast  } from 'vant'

export default {
    // 开启命名空间
    namespaced: true,
    state: {
        info: {
            uname: 'Leo',
            age: 21
        },
        userLevelInfo:{
            data:[],
            sign:false,
        },
        userInviteInfo:{
            data:[],
        },
        /*充值渠道*/
        getpaymenttype:{
            data:[],
            sing:false,
        },
        /*渠道下支付方式*/
        getrechargetypelist:{
            data:[],
            sing:false
        },
        /*充值详情*/
        selepayinfo:{
            data:{},
            sing:false
        },
        /*bankList*/
        bankListData:{
            data:[],
            code:""
        },

        /*提现信息*/
        cashfreetimes:{
            data:{

            }
        },
        teamList:{
            count: 0,
            data: [],
            level: {lv1: 0, lv2: 0, lv3: 0},
            levelData:[],
            page: 1
        },
        financeDetail:{
            list:[],
            data:[],
            page: 0,
            count: 1,
        },
        liqTypes:[],
        /*用户银行卡*/
        userBankData:{
            data:[],
            message:"",
            sign:false,
        },
        digitalList:{
            data:[],
            message:"",
            sign:false
        },
        myBankName:'',
        /*站内信*/
        lists:{
            data:[],
            sing:false,
        },
        overlay:false
    },
    mutations: {
        setOverlay(state,data) {
            state.overlay = data
        },
        setMyBankName(state,data){
            state.myBankName = data || ''
        },
        setUserBankDataData(state,data){
            // state.userBankData={...state.userBankData,...data};
            state.userBankData=data;
        },
        setUserLevelAndInfo(state, val) {
            state.userLevelInfo = val
        },
        setUserInviteInfo(state, val) {
            state.userInviteInfo = val
        },
        setGetpaymenttypeData(state,data){
            state.getpaymenttype = data;
        },
        setGetrechargetypelistData(state,data){
            state.getrechargetypelist = data;
        },
        setSelepayinfoData(state,data){
            state.selepayinfo=data;
        },
        setBankListData(state,data){
            state.bankListData={...state.bankListData,...data};
        },
        setCashfreetimesData(state,data){
            state.cashfreetimes=data;
        },
        setTeamList(state,data) {
            let levelArr = Object.entries(data.data.level)
            if(Object.prototype.toString.call(levelArr) === "[object Array]" && levelArr.length>0 ) {
                let arr = []
                for(let i in levelArr) {
                    let obj = {
                        lv:levelArr[i][0],
                        num:levelArr[i][1]
                    }
                    arr.push(obj)
                }
                state.teamList.levelData = arr
            }
            state.teamList = Object.assign(state.teamList,data.data)
            // state.teamList = Object.assign(...state.teamList.levelData,...data.data)
        },
        setFinanceDetailReset(state) {
            state.financeDetail.list = []
            state.financeDetail.data = []
            state.financeDetail.page = 0
            state.financeDetail.count = 0
        },
        setFinanceList(state,data) {
            state.financeDetail.page = data.data.page
            state.financeDetail.list = state.financeDetail.list.concat(data.data.data)
            state.financeDetail = Object.assign(state.financeDetail,data.data)
        },
        setGetliqTypes(state,data) {
            state.liqTypes = data
        },
        setListsData(state,data){
            state.lists=data;
        },
        setDigitalList(state,data) {
            state.digitalList = data
        }
    },
    actions: {
     /*  初始化提款密码 0.0*/
     newGetpaymenttype(context,data){
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/FinanceApp/newGetpaymenttype",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        // context.dispatch("userHomeDataAction")
                        resolve(res.data)
                        return true;
                    }else {
                        Toast({
                            message: res.data.message,
                        });
                        return false;
                    }
                })
            })
        },
        /*  初始化提款密码 0.0*/
        initPwd(context,data){
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/member/userinsertdrawpass",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        context.dispatch("userHomeDataAction")
                        resolve(res.data)
                        return true;
                    }else {
                        Toast({
                            message: res.data.message,
                        });
                        return false;
                    }
                })
            })
        },
        /*修改提款密码 0.0 */
        usereditdrawpassAction(context,data){
           return new Promise(resolve => {
               axios({
                   method: 'post',
                   url:window.host+"/Api/Member/usereditdrawpass",
                   data:qs.stringify(data)
               }).then(function(res){
                   if(getCodeState(res.data.code)){
                       data.oldcoinpassword = "";
                       data.coinpassword = "";
                       context.dispatch("userHomeDataAction")
                       resolve(res.data)
                       return true;
                   }else {
                       Toast({
                           message: res.data.message,
                       });
                       return false;
                   }
               })
           })
        },
        /*修改登录密码 0.0*/
        setLoginPwd(context,data){
            return new Promise(resolve => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Member/usereditpass",
                    data:qs.stringify(data)

                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        data.oldpassword = '';
                        data.password = '';
                        resolve(res.data)
                        return true;
                    }else {
                        Toast({
                            message: res.data.message,
                        });
                        return false;
                    }
                })
            })
        },
        /*站内信*/
        listsAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/Member/lists",
                data:qs.stringify(data)

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setListsData",res.data.data);
                    return true;
                }else {
                    return false;
                }
            })
        },
        //团队
        getFinanceDetail(context,data){
            return new Promise((resolve,reject) =>{
               axios({
                   method: 'post',
                   url:window.host+"/Api/Member/getUserDetail",
                   data:qs.stringify(data)
               }).then(function(res){
                   context.commit("setFinanceList",res.data)
                   if(getCodeState(res.data.code)){
                       // context.commit("setFinanceList",res.data)
                       resolve(res.data)
                       return true;
                   }else {
                       reject(res.data)
                       return false;
                   }
               })
           })
        },

        //筛选条件
        getliqTypes(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/Member/getliqTypes",
                data:qs.stringify(data)
            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setGetliqTypes",res.data)
                    return true;
                }else {
                    return false;
                }
            })
        },

        //团队
        teamListAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/Agent/teamlist",
                data:qs.stringify(data)
            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setTeamList",res.data)
                    return true;
                }else {
                    return false;
                }
            })
        },

        savetikuanorderActions(context,data){
            context.commit("setOverlay",true)
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/FinanceApp/savetikuanorder",
                    data:qs.stringify(data)
                }).then(function(res){
                    context.commit("setOverlay",false)
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                }).catch(err=>{
                    context.commit("setOverlay",false)
                })
            })
        },

        /*提现申请*/
        savetikuanorderAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/FinanceApp/savetikuanorder",
                data:qs.stringify(data)

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    data.amount="";
                    data.coinPassword = "";
                    Toast({
                        message: res.data.message,
                    })
                    // context.cashfreetimes
                    context.dispatch("cashfreetimesAction")
                    context.dispatch("userHomeDataAction")

                    return true;
                }else {
                    return false;
                }
            })
        },

        getUserBankBtcAction(context,data){
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Member/getUserBankBtc",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                })
            })
        },
        // 合计打码量
        getBetCodeListAction (context, data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/FinanceApp/betsCodeList",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        return false;
                    }
                })
            })

        },
        /*提现信息*/
        cashfreetimesAction(context,data){
            axios({
                method: 'post',
                // url:window.host+"/Api/finance/cashfreetimes",
                url:window.host+"/Api/FinanceApp/cashfreetimes",
                data:qs.stringify(data)

            }).then(function(res){

                if(getCodeState(res.data.code)){
                    context.commit("setCashfreetimesData",res.data);
                    return true;
                }else {
                    return false;
                }

            })
        },
        /*提交新增银行卡*/
        addBankAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/member/userbindbankcard",
                data:qs.stringify(data)
            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.dispatch("userHomeDataAction");
                    data.account="";
                    data.countname="";
                    data.username="";
                    data.coinPassword="";
                    // Toast({
                    //     message: '绑定成功',
                    // });
                    window.location.href="#/card_manage";
                    return true;
                }else {
                    return false;
                }
            })
        },

        getUserBankDataAction(context){
           return new Promise(resolve => {
               axios({
                   method: 'post',
                   url:window.host+"/Api/member/getUserBank",
                   data:qs.stringify({})

               }).then(function(res){
                   if(getCodeState(res.data.code)){
                       context.commit("setUserBankDataData",res.data);
                       try{
                           context.commit("setMyBankName",res.data.data[0].username)
                       }catch (e){
                           console.log(e);
                       }
                       resolve(res.data)
                   }else {
                       context.commit("setUserBankDataData",res.data);
                       context.commit("setMyBankName",'')
                       // Toast({
                       //     message: res.data.message,
                       // })
                       return false;
                   }
               })
           })
        },
        //  银行卡列表
        getbankcardListDataAction(context,data){
            return new Promise(resolve => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Home/bankcardList",
                    data:qs.stringify(data)
                }).then(res =>{
                    if(getCodeState(res.data.code)){
                        if(res.data.data.length > 0){
                            res.data.data.forEach(function (i) {
                                if(!i.logo){
                                    i.logo = ""
                                }
                            })
                        }
                        context.commit("setBankListData",res.data);
                        resolve(res.data)
                        return true;
                    }else {
                        Toast({
                            message: res.data.message,
                        });
                        return false;
                    }
                })
            })
        },
        userbindBtccardAction(context,data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Member/userbindBtccard",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                })
            })
        },
        usereditBtccardAction(context,data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Member/usereditBtccard",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                })
            })
        },

        protocolModeAction(context,data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Home/getProtocolMode",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                })
            })
        },
        bankcardListAction(context,data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/Home/bankcardList",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        resolve(res.data)
                        return true;
                    }else {
                        reject(res.data)
                        return false;
                    }
                })
            })
        },

        getDigitalAction(context,data) {
            return new Promise((resolve, reject) => {
                axios({
                    method: 'post',
                    url:window.host+"/Api/member/getUserBank",
                    data:qs.stringify(data)
                }).then(function(res){
                    if(getCodeState(res.data.code)){
                        context.commit("setDigitalList",res.data)
                        resolve(res.data)
                        return true;
                    }else {
                        context.commit("setDigitalList",res.data)
                        reject(res.data)
                        return false;
                    }
                })
            })
        },
        //设置银行卡
        setDefaultBankcardAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/Member/setDefaultBankcard",
                data:qs.stringify(data)
            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.dispatch("getUserBankDataAction")
                }
            })
        },

        /*支付类型1*/
        pya1Action(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/FinanceApp/addrecharge",
                data:qs.stringify(data)

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    data.amount="";
                    if(res.data.data.type == '1'){
                        Dialog.alert('<img class="pay1ewm" src="'+res.data.data.url+'"/>', "二维码", {
                            dangerouslyUseHTMLString: true
                        });
                        return;
                    }
                    /*2 跳转url*/
                    if(res.data.data.type == '2'){
                        Dialog.alert({title:"操作提示",message:"点击确认,前往支付页面"}).then(action => {
                            window.open(res.data.data.url);
                        });

                        return;
                    }
                    /*返回3表单提交*/
                    if(res.data.data.type == '3'){
                        // Dialog.alert(window.App.$L.t('store.userInfo_store.alert10'),window.App.$L.t('common.alert.handlealert')).then(action => {
                        Dialog.alert({title:"操作提示",message:"点击确认,前往支付页面"}).then(action => {

                            var form = document.createElement('form');
                            form.action =  res.data.data.url;
                            form.method = 'post';

                            for(var i in res.data.data.formdata){

                                var input = document.createElement('input');
                                input.type = 'text';
                                input.name = i;
                                input.value = res.data.data.formdata[i];

                                // console.log("input",input)
                                form.appendChild(input);
                            }


                            document.body.appendChild(form);
                            form.style.display="none";
                            form.submit();
                        });
                        return;
                    }
                    return true;
                }else {
                    Toast({
                        message: res.data.message,
                    })
                    return false;
                }

                // store.commit("increment")
            })
        },

        /*支付2*/
        pya2Action(context,data){
           return new Promise(resolve => {
               axios({
                   method: 'post',
                   url:window.host+"/Api/FinanceApp/addrecharge",
                   data:qs.stringify(data)
               }).then(function(res){
                   if(getCodeState(res.data.code)){
                       resolve(res.data)
                       return true;
                   }else {
                       return false;
                   }

                   // store.commit("increment")
               })
           })
        },

        /*查询充值信息*/
        selepayinfoAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/FinanceApp/selepayinfo",
                data:qs.stringify(data)

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setSelepayinfoData",res.data);
                    return true;
                }else {
                    return false;
                }
            })
        },
        /*充值渠道下_方式  0.0*/
        getrechargetypelistAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/FinanceApp/getrechargetypelist",
                data:qs.stringify(data)

            }).then(function(res){
                context.commit("setGetrechargetypelistData",res.data.data);
                if(getCodeState(res.data.code)){
                    return true;
                }else {
                    // console.log('getrechargetypelistAction',res.data);
                    Toast(res.data.message)
                    return false;
                }
            })
        },

        /*充值渠道 0.0 */
        getpaymenttypeAction(context,data){
            axios({
                method: 'post',
                url:window.host+"/Api/FinanceApp/getpaymenttype",
                data:qs.stringify(data)
            }).then(function(res){
                context.commit("setGetpaymenttypeData",res.data);
                if(getCodeState(res.data.code)){
                    return true;
                }else {
                    Toast(res.data.message)
                    return false;
                }

            })
        },


        /*  个人信息  */
        getUserLevelAndInfo(context){
            axios({
                method: 'post',
                url:window.host+"/Api/Member/getUserLevelAndInfo",
                data:qs.stringify({})

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setUserLevelAndInfo",res.data);
                    return true;
                }else {
                    return false;
                }
            })

        },

        getUserInviteInfo(context){
            axios({
                method: 'post',
                url:window.host+"/Api/Member/getUserInviteInfo",
                data:qs.stringify({})

            }).then(function(res){
                if(getCodeState(res.data.code)){
                    context.commit("setUserInviteInfo",res.data);
                    return true;
                }else {
                    return false;
                }
            })

        },
    },
    getters: {
        // userStore:this.state.digitalList
    }
}
