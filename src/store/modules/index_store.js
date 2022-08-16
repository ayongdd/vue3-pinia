import axios from '@/axios'
import qs from 'qs'
import { getDate,getCodeState,setSession,setDate2,getSession } from '@/common/common'
import { Toast } from 'vant'

export default {
  // 开启命名空间
  namespaced: true,
  // 登录前弹窗
  indexPopup: false,
  state: {
    info: {
      uname: 'Leo',
      age: 21
    },
    indexData:{
      data:[],
      sign:false,
    },
    loginDataInfo:{
      username:"",
      password:""
    },
    /*登录验证码*/
    vcode:{
      val:"",
      flag :false,
      id:'',
      imgUrl:''
    },
    loginData:{
      /*标记是否登录*/
      message:"",
      code:"",
      data:{
        token:null
      }
    },
    /*注册动态字段*/
    getParams:{
      data:[],
      setting:[],
      sing:false,
      vcode:false
    },

    userHomeData:{
      sign:false,
      code: -1,
      data:{
        userlevelid:{
          level: "",
          levelName: ""
        }
      },
      message: "",
    },
    rateData:{
      code: 0,
      data: {level: "", profit_rate: "", isReap: 0, isShow: 0, profit: ""},
      message: ""
    },
    reapData:{},
    orderList:{
      count: 0,
      data:[],
      page:1
    },
    gundongText:'',
    sysNotice:{
      data:[]
    },
    infos:{
      code: 0,
      data: {
        aprofit: "",
        balance: 0,
        brokerage: 0,
        membersNum: 0
      },
      message:""
    },
    loading:false,
    configData:{
      data:{
        appKey: "",
        appName: "",
        icon: ""
      }
    },
    confData:{},
    signInfo:{},
    redDetail:{},
    switchs:{},
    platform:{
      custom_title: "探索.",
      custom_type: "0",
      link: [],
      link_title: "发现",
      link_type: "0",
      team: []
    },
    verifyData:{
      image:"",
      uniqid:""
    },
    emojiSwitch:false,
    otherSwitch:false
  },
  mutations: {
    setSwitchs(state,val) {
      state.switchs = val
    },
    setOtherSwitch(state,val) {
      state.otherSwitch = val
    },
    setEmojiSwitch(state,val) {
      state.emojiSwitch = val
    },
    setRedDetail(state, val) {
      state.redDetail = val
    },
    setLoading(state, val) {
      state.loading = val
    },
    updateUname(state, val) {
      state.info.uname = val
    },
    updateAge(state, val) {
      state.info.age = val
    },
    setLoginDataInfo(state,val) {
      state.loginDataInfo = val
    },

    setIndexDataData(state,data){
      let _i=data.verifySwitch || 0;
      _i=_i*1;
      if(data.verifySwitch>0){
        data.verifySwitch=1;
      }
      state.indexData=data;
    },
    // 登录前弹窗
    indexPopupState (state, data) {
      state.indexPopup = data
    },
    setVcodeData(state,data){
      state.vcode.imgUrl = 'data:image/png;base64,'+data.imageData;
      // state.vcode.val=window.host + "/Api/user/vcode"+"?"+new Date().getTime();
      state.vcode.id = data.uniqueId
    },
    setLoginData(state,data){
      state.loginData={...state.loginData,...data};
    },
    setVcodeShow(state,data) {
      state.vcode.flag = data;
    },
    setSetParamsData(state,data){
      let r = data.data.some(item=>item.name === 'vcode')
      if(r) {
        // let obj = {'vcode':true }
        state.getParams.vcode = true
      }else {
        state.getParams.vcode = false
      }
      state.getParams= {...state.getParams,...data};
    },
    setUserHomeData(state,data){
      if(data.data.userlevelid  === null){
        data.data.userlevelid = {level: "1", levelName: "level 1"}
      }
      state.userHomeData={...state.userHomeData,...data};

      state.userHomeData.sign=true

      // setDate2("groupNumber",data.data.chatGroup );
      // setDate2("username",data.data.username)
      // setDate2("nickname",data.data.nickname)
      // setDate2("pic_attr",data.data.pic_attr)
      // setDate2("userlevelid",data.data.userlevelid.level)
      //
      // setSession("fandian",data.data.fanDian)
    },

    clearToken(state){
      state.loginData={
        sign:false,
        token:null,
        message:"",
        code:""
      };
      window.sessionStorage.removeItem('token');
    },
    setSignInfo(state,data) {
      state.signInfo = data
    },
    setRateData(state,data) {
      state.rateData = data
    },
    setReapData(state,data) {
      state.reapData = data
    },
    setOrderList(state,data) {
      // console.log('data11',data.data);
      state.orderList.data = state.orderList.data.concat(data.data)
      state.orderList.count = data.count
      state.orderList.page = data.page
    },

    setGundongText(state,data){
      state.gundongText = data
    },
    setSysNotice(state,data)  {
      state.sysNotice = data
    },
    setInfos(state,data)  {
      state.infos = data
    },
    setConfig(state,data) {
      state.configData = data
    },
    setConf(state,data) {
      state.confData = data
    },
    setPlatform(state,data) {
      data.isLink = data.link && data.link.length > 0 && data.link.some(item=>item.status == 1)
      data.isTeam = data.team && data.team.length >0 && data.team.some(itm => itm.status == 1)
      state.platform = data
    },

    setVerifyData(state,data) {
      state.verifyData = data
    }
  },
  actions: {
    // 验证码
    captchaAction(context,data ={token:getSession('token'),type:1}){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/im/captcha",
          data:qs.stringify(data)
        }).then((res)=>{
          if(res.data.code === 1) {
            resolve(res.data)
            context.commit('setVerifyData',res.data.data)
          }
        })
      })
    },

    // 设置支付密码
    platformAction(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/link/platform",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          if(res.data.code === 0) {
            context.commit('setPlatform',res.data.data)
          }
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 设置支付密码
    switchs(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/chat/switchs",
          data:qs.stringify(data)
        }).then((res)=>{
          context.commit('setSwitchs',res.data)
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 设置支付密码
    questionList(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/questionList",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 设置支付密码
    resetPass2(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/resetPass2",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 签到
    globalsign_nopwd(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/globalsign_nopwd",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 签到业详情
    signInfo(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/sign/signInfo",
          data:qs.stringify(data)
        }).then((res)=>{
          context.commit("setSignInfo",res.data.data)
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 添加银行卡
    bindBankcard(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/bindBankcard",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 解除绑定银行卡
    unbindBankcard(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/unbindBankcard",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 获取银行卡列表
    getBankcard(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/getBankcard",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    //修改密码
    feedback(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/im/feedback",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    //修改密码
    modifyPass(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/user/modifyPass",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    billList(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/billList",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 充值
    withdrawHandle(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/withdraw",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 充值
    rechargeHandle(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/recharge",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },


    // 获取转账限额
    walletDetail(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/detail",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },

    // 获取转账限额
    transferlimit(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/transferlimit",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 转账
    transferAction (context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/transfer",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 发红包
    giveRedAction (context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/giveRed",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 抢红包
    acceptRed(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/acceptRed",
          data:qs.stringify(data)
        }).then((res)=>{
          resolve(res.data)
          // context.dispatch("getRedDetail",data)
        })
      })
    },
    // 获取红包详情
    getRedDetail(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'Post',
          // url:window.host+"/api/im/conf",
          url:window.host+"/api/wallet/redDetail",
          data:qs.stringify(data)
        }).then((res)=>{
          if(res.data.code === 0) {
            context.commit('setRedDetail',res.data.data)
            resolve(res.data)
          }else {
            Toast(res.data.msg)
          }
        })
      })
    },

    // 获取配置
    getConfigs(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'get',
          // url:window.host+"/api/im/conf",
          url:window.host+"/v6/web/conf",
          data:qs.stringify(data)
        }).then((res)=>{
          console.log('res',res.data);
          if(res.data.code === 1) {
            document.title = res.data.data.appName
          }else {
            document.title = "简聊"
          }
          context.commit("setConfig",res.data)
          resolve(res.data)
        })
      })
    },

    // 获取配置
    getConf(context,data){
      return new Promise((resolve,reject)=>{
        axios({
          method: 'get',
          url:window.host+"/api/im/conf",
          // url:window.host+"/v6/web/conf",
          data:qs.stringify(data)
        }).then((res)=>{
          // console.log('res',res.data);
          context.commit("setConf",res.data)
          resolve(res.data)
        })
      })
    },

    infosAction(context){
      axios({
        method: 'post',
        url:window.host+"/Api/Home/infos",
        data:qs.stringify()
      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit("setInfos",res.data)
        }else {
          return false;
        }

        // store.commit("increment")
      })
    },
    articleSysNotice(context){
      axios({
        method: 'post',
        url:window.host+"/Api/Home/sysNotice",
        data:qs.stringify()

      }).then(function(res){
        if(getCodeState(res.data.code)){
          if(res.data.data.length > 0){
            context.commit("setGundongText",res.data.data[0])
            context.commit("setSysNotice",res.data)
            localStorage.setItem("indexPopupStatus",true)
            context.commit("indexPopupState",true)
          }
        }else {
          return false;
        }

        // store.commit("increment")
      })
    },
    orderListAction(context,data){
      return new Promise(resolve =>{
        axios({
          method: 'post',
          url:window.host+"/Api/mining/orderList",
          data:qs.stringify(data)

        }).then(function(res){
          if(getCodeState(res.data.code)){
            // context.commit("setOrderList",res.data.data);
            resolve(res.data.data)
            return true;
          }else {
            // context.commit("setOrderList",res.data.data);
            return false;
          }
        })
      })
    },

    getReapAction(context,data){
      return new Promise(resolve => {
        axios({
          method: 'post',
          url:window.host+"/Api/mining/reap",
          data:qs.stringify(data)
        }).then(function(res){
          if(getCodeState(res.data.code)){
            context.commit("setReapData",res.data);
          }else {
            console.log('');
          }
          resolve(res.data)
        })
      })
    },
    getRateAction(context,data){
      axios({
        method: 'post',
        url:window.host+"/Api/mining/getRate",
        data:qs.stringify({})

      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit("setRateData",res.data);
          return true;
        }else {
          return false;
        }
      })
    },

    /*  个人信息  */
    userHomeDataAction(context){
      axios({
        method: 'post',
        url:window.host+"/Api/member/index",
        data:qs.stringify({})

      }).then(function(res){

        if(getCodeState(res.data.code)){

          context.commit("setUserHomeData",res.data);
          // context.commit("setHeadImg",res.data.data.pic_attr);

          return true;
        }else {

          // Toast({
          //   message: res.data.message,
          // });
          return false;
        }

        // store.commit("increment")
      })

    },

    /*注册用户*/
    webRegAction(context,data){
      axios({
        method: 'post',
        url:window.host+"/Api/User/reg",
        data:qs.stringify(data)

      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit('setLoginData', res.data)
          setSession('token', res.data.data.token)
          Toast({
            message: res.data.message,
          });
          setTimeout(()=>{
            window.location.assign("#/");
          }, 500)

        }else {
          Toast({
            message: res.data.message,
          })
          context.dispatch("getVsCode")

          // MessageBox.alert(res.data.message, '注册提示').then(action => {
          //
          // });

        }

        // store.commit("increment")
      })
    },
    /*注册动态字段*/
    getParamsAction(context,data){
      axios({
        method: 'post',
        url:window.host+"/Api/user/getParams",
        data:qs.stringify(data)
      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit("setSetParamsData",res.data);

          return true;
        }else {
          return false;
        }

        // store.commit("increment")
      })
    },

    // 退出登录
    cancellation(context,data){
      return new Promise(resolve => {
        axios({
          method: 'post',
          url:window.host+"/Api/User/cancellation",
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
    loginAction(context,data){
      axios({
        method: 'post',
        url:window.host+"/api/im/loginapisnew",
        data:qs.stringify(data)
      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit("setLoginData",res.data.data);
          setSession("token",res.data.data.token);
          setSession("token_api",res.data.data.token_api);
          setTimeout(()=>{
            window.location.assign("#/");
          }, 500)
        }else {
          context.dispatch("captchaAction")
          Toast({
            message: res.data.msg,
          });
        }
      })
    },
    registerAction(context,data){
      axios({
        method: 'post',
        url:window.host+"/api/im/registernew",
        data:qs.stringify(data)
      }).then(function(res){
        if(getCodeState(res.data.code)){
          context.commit('setLoginData', res.data)
          setSession('token', res.data.data.token)
          // Toast({
          //   message: res.data.msg,
          // });
          setTimeout(()=>{
            window.location.assign("#/login");
          }, 500)
        }else {
          context.dispatch("captchaAction")
          Toast({
            message: res.data.msg,
          });
        }
      })

    },

    //获取验证码
    getVsCode(context,data) {
      return new Promise(resolve => {
        axios({
          method: 'post',
          // url:window.host+"/Api/user/logined",
          url:window.host+"/Api/User/vcode",
          data:qs.stringify({data})
        }).then(function(res){
          context.commit("setVcodeData",res.data.data);
          // Indicator.close()
        })
      })
    },

    initIndexAction(context,data){
      /*1.获得main配置*/
      axios.post(window.host+"/Api/home/main").then(function(res){
        if(getCodeState(res.data.code)){
          res.data.data.sign=true;
          context.commit("setIndexDataData",res.data.data)
          document.title = res.data.data.webName || ""
        }
        if(res.data.code == 9999){
          context.commit("setWebWeiHu",res.data.data)
        }

      })
    },

    asyncUpdate(store, val) {
      setTimeout(() => {
        store.commit('updateAge', val)
      }, 2000)
    }
  },
  getters: {
    format(state) {
      return state.info.uname + ',nice to meet you~'
    }
  }
}
