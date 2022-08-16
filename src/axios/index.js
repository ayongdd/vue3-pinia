import axiosParen from 'axios'
import qs from 'qs'
import {setSession, getSession,cleraSeeion} from '../common/common'
import store from '@/store'

var axios = axiosParen.create({
  // baseURL: 'https://some-domain.com/api/',
  // timeout: 1000,
  // headers: {'user-agent': 'okhttp'}
});

axios.defaults.baseURL = '';

axios.defaults.retry = 5;
axios.defaults.retryDelay = 5000;
axios.defaults.withCredentials  = true;
// axios.defaults.headers.userAgent = "okhttp";
axios.interceptors.request.use(
  config => {
    /*携带token*/
    if (getSession('token')) {

        let temp={};
      temp=qs.parse(config.data) || {};
      temp.token=getSession('token');
      temp.auth=
      temp=qs.stringify(temp)
      config.data=temp;
    }
    // config.headers['user-agent'] = "okhttp"
    if(getSession('token_api')) {
        config.headers['Api-Token'] = getSession('token_api');

    }
      // config.headers['User-Agent'] = "okhttp";
      // config.headers.userAgent ="okhttp"
      store.commit("indexStore/setLoading",true)
      return config;
  },


  err => {
    return Promise.reject(err);
  });



axios.interceptors.response.use(
  response => {
      store.commit("indexStore/setLoading",false)
      try {
      var url=window.location.href;
      if(response.data.code == "12"){
        //判断是否有历史登录状态
        var loginState = getSession('token');
        if(loginState){
          //在痕迹下
          cleraSeeion("token");
          cleraSeeion("RoomIdData");

          /*非注册页面跳转*/
          if(url.indexOf("registered")<0 && url.indexOf("/index/user/r")<0){
            window.location.assign("#/login");
          }
          // parent.location.reload();
        }else {
          /*非注册页面跳转*/
          if(url.indexOf("registered")<0 && url.indexOf("/index/user/r")<0){
            window.location.assign("#/login");
          }
        }
        // console.error("登录超时",response)
      }

      if(response.data.code == "9999"){
          window.location.assign("#/web_stop");
          console.error("网站维护",response)
      }
    }
    catch (e){
      console.log(e)
    }


    return response;
  });

// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
/*  */
export default axios
