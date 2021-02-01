import Axios from "axios";
import qs from "qs";
import { Toast } from "vant"
import { promiseDebounce, promiseLoading } from "./index"
const customToast = (txt) => {
  Toast(
    {
      message:txt,
      icon: require('@/assets/imgs/fail.svg'),
      className: 'customStyle'
    })
}
class Http{
  //默认设置
  config = {
    baseURL: "", //根地址
    timeout: 10 * 1000, //超时时间
    getToken: () => false, //获取token的函数返回值为token
    setToken: () => { }, //在请求中设置token，如果没有从getToken中获取到token则不会执行
    notLoginHandle: () => { }, //如果未登录的响应函数
    customInterceptors: false, //自定义请求拦截
    codes: [],//code的扩展
    requestType: "json",
    loading:promiseLoading,
    showLoading: false,
    debounce: false,
    method: 'get',
    unwantedToken: false,
    commonData: {},//公共data,可选值为函数参数为config
    toast:customToast
  }
  //数据转换为表单格式
  dataToFormFormat(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return formData
  }
  // 未登录的响应函数
  notLoginHandle(config) {
    //判断是否有token,有token时调用setToken，设置到请求中
    const token = typeof config.getToken === "function" ? config.getToken() : false;
    if (token) {
      if (typeof config.setToken === "function") config.setToken(config, token);
    }
    
    else if (!config.unwantedToken) {
      const source = Axios.CancelToken.source();
      config.cancelToken = source.token;
      if (typeof config.notLoginHandle === "function") {
        config.notLoginHandle();
      }
      source.cancel("用户未登录")
    }
  }
  // 请求类型非json时
  setRequsetType(config) {
    //如果请求类型是否为form表单类型
    if (config.requestType === "form") {
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      config.headers["Access-Control-Allow-Origin"] = "*";
      config.data = qs.stringify(config.data);
    }
    else if (config.requestType === "upFile") {
      //是否为文件上传
      config.headers["Content-Type"] = "multipart/form-data";
      config.data = this.dataToFormFormat(config.data);
    }
  }
  //请求发送前的拦截器
  interceptor(config) {
    const _this = this;
    return {
      beforeRequest (axiosConfig) {
        _this.notLoginHandle(axiosConfig)
        _this.setRequsetType(axiosConfig)
        if (typeof axiosConfig.beforeSend === "function") {
          axiosConfig = axiosConfig.beforeSend(axiosConfig);
        }
        return axiosConfig;
      },
      beforeError(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
      },
      //响应的拦截
      response(response) {
        if (typeof config.customInterceptors === "function") {
          return config.customInterceptors(response);
        }
        const { code, message: msg = "未知错误" } = response.data;
        const { codes } = config
        if (code !== 200) {
          //是否在用户可见信息内找到
          if (code === undefined) return Promise.reject(msg);
          codes.some((item) =>{
            const { data } = response
            if ((typeof item.code === "function" && item.code(code)) || code === item.code) {
              if (item.visible) {
                config.toast(msg, response)
              }
              if(typeof item.handle === "function") {
                item.handle(data)
                return true
              }
              if (!item.visible&&!item.handle) {
                console.error(msg);
              }
              return true;
            } 
          });
          return Promise.reject(response.data);
        }
        return response.data;
      },
      // 响应错误的拦截
      responseError (err) {
        // 对响应错误做点什么
        return Promise.reject(err);
      },
    }
  }
  request (url, data, config) {
    const { showLoading, ...restConfig } = config
    //前置函数列表
    const prefixedHandle = []
    if (showLoading) prefixedHandle.push(this.config.loading)
    if (typeof config.customPrefixed !== "undefined") {
      if (typeof config.customPrefixed === "function") {
        prefixedHandle.push(config.customPrefixed)
      } else if (Object.prototype.toString.call(config.customPrefixed) === '[object Array]') {
        prefixedHandle.push(...config.customPrefixed.filter(item => typeof item === 'function'))
      }
    }
    const http = prefixedHandle.length > 1 ? prefixedHandle.reduce((prev, next) => next(prev(this.axios))) :
      prefixedHandle.length === 1 ? prefixedHandle[0](this.axios) : this.axios
    return http({ [restConfig.method === "post" ? 'data' : 'params']: data, url, ...restConfig })
  }
  createApis(apis,setting={}) {
    if (typeof apis === "object" && apis) {
      /**
       * 如果该请求需要防抖，把加了防抖的方法放入debounceObj，第二次调用时返回该方法
       */
      const debounceList = {}
      return Object.keys(apis).reduce((api, key) => {
        api[key] = (data={},config = {}) => {
          // 当第一个参数为显式声明为config时，将data对象置为空
          if(data.isConfig){
            config=JSON.parse(JSON.stringify(data));
            data = {}
          }
          config = { ...setting, ...config }
          //参数融合放在请求中
          const commonData = typeof config.commonData === 'function' ? config.commonData(config) : config.commonData;
          const params = { ...commonData, ...data }
          if (config.debounce) {
            if (!debounceList[key]) {
              debounceList[key] = promiseDebounce(this.request)
            }
            return debounceList[key].call(this,apis[key], params, config)
          }
          return this.request(apis[key], params, config);
        }
        return api
      },{})
    }
  }
  init(apis,config) {
    this.config = Object.assign({}, this.config, config);
    //this.config.codes = this.codeArrayConcat()
    // 创建axios对象
    this.axios = Axios.create(this.config);
    const { beforeRequest, beforeError ,response,responseError} = this.interceptor(this.config)
    // 设置拦截器
    this.axios.interceptors.request.use(beforeRequest,beforeError)
    this.axios.interceptors.response.use(response, responseError)
    return this.createApis(apis,config)
  }
}
export default function (config,apis={}) {
  const http = new Http
  const api = http.init(apis, config)
  Object.assign(this,api)
}
