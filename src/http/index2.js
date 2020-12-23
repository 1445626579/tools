import Axios from "axios";
import qs from "qs";
import initCodes from "./code.config";
import toast from '../utils/toast'
import { promiseLoading, promiseDebounce } from "../utils"
//code数组合并
function codeArrayConcat (initCodes, codes) {
  const resultArr = [].concat(initCodes)
  codes.forEach((item) => {
    const searchRes = initCodes.findIndex((initItem) => initItem.code === item.code)
    if (searchRes===-1) {
      resultArr.push(item)
    }else{
      resultArr[searchRes]=item
    }
  })
  return resultArr
}
//遍历的响应函数
const eachHandle = (item, isUserVisible, toast,data) => {
  const {code,message:msg}=data
  const output = (text) => {
    if (isUserVisible) {
      toast(text)
    } else {
      if(typeof item.handle==="function"){
        item.handle(data)
        return
      }
      console.error(text);
    }
  };
  if (typeof item.code === "function") {
    if (item.code(code)) {
      output(msg);
      return true;
    }
  } else if (code === item.code) {
    output(item.tips || msg);
    return true;
  }
};
export default function (config = {}, apis = {}) {
  const defaults = {
    baseURL: "", //根地址
    timeout: 10 * 1000, //超时时间
    getToken: () => true, //获取token的函数返回值为token
    setToken: () => { }, //在请求中设置token，如果没有从getToken中获取到token则不会执行
    notLoginHandle: () => { }, //如果未登录的响应函数
    customInterceptors: false, //自定义请求拦截
    codes: {},//code的扩展
    requestType: "json",
    loading: false,
    debounce: false,
    method: "post",
    noNeedToken: false,
    commonData: {},//公共data
    toast
  };
  const setting = Object.assign({}, defaults, config)
  const { userVisibleCodes = [], otherCodes = [] } = setting.codes;

  setting.codes = {
    ...setting.codes,
    userVisibleCodes: codeArrayConcat(initCodes.userVisibleCodes, userVisibleCodes),
    otherCodes: codeArrayConcat(initCodes.otherCodes, otherCodes)
  }
  const axios = Axios.create(setting);
  //请求拦截器
  axios.interceptors.request.use(
    function (config) {
      //判断是否有token
      const token = typeof config.getToken === "function" ? config.getToken() : false;
      if (token) {
        if (typeof config.setToken === "function") config.setToken(config, token);
      } else if (!config.noNeedToken) {
        const source = Axios.CancelToken.source();
        config.cancelToken = source.token;
        if (typeof config.notLoginHandle === "function") {
          config.notLoginHandle();
        }
        source.cancel("用户未登录")
        return Promise.reject("用户未登录");
      }
      //如果请求类型是否为form表单类型
      if (config.requestType === "form") {
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.data = qs.stringify(config.data);
      } else if (config.requestType === "upFile") {
        //是否为文件上传
        config.headers["Content-Type"] = "multipart/form-data";
        const formData = new FormData();
        Object.keys(config.data).forEach((key) => {
          formData.append(key, config.data[key]);
        });
        config.data = formData;
      }
      if (typeof config.beforeSend === "function") {
        config = config.beforeSend(config);
      }
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  axios.interceptors.response.use(
    function (response) {
      if (typeof response.config.customInterceptors === "function") {
        return response.config.customInterceptors(response);
      }
      const { code, message: msg = "未知错误" } = response.data;
      const { codes } = response.config
      console.log(codes)
      if (code !== 200) {
        /**
         * 如果在定义的code码中找到，以定义的code码对应提示信息提示，如果不存在则以接口返回信息提示
         * 如果没有在提示用户的code与otherCode中找到，则以接口的提示信息进行提示，用户不可见
         */
        //是否在用户可见信息内找到
        if (code === undefined) return Promise.reject(msg);
        const isFind = codes.userVisibleCodes.some((item) =>
          eachHandle(item,  true, response.config.toast,response.data)
        );
        if (!isFind) {
          const isOtherFind = codes.otherCodes.some((item) =>
            eachHandle(item, false, response.config.toast,response.data)
          );
          if (!isOtherFind) {
            return Promise.reject(response.data);
          }
        }
        return Promise.reject(response.data);
      }
      return response.data;
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );
  /**
     * 1.将请求接口写到apis中，将自动生成一个对应AJAX请求函数
     * 2.函数包含两个参数第一个为Data值，第二个为对请求的设置config对象
     * @param {Object} data 请求参数设置
     * @param {Object} config 请求设置，包括请求类型、loading和防抖
     * 3.config属性设置
     * {
     *  requestType:'json || form || upFile' 默认请求类型为json，form为表单方式提交，upFile为文件上传
     *  loading:false || true 是否需要loading
     *  debounce: false || true 是否需要防抖
     *  method:'post' 请求类型 默认post
     *  customPrefixed:function 自定义前置函数，函数接收axios请求函数，返回值必须是一个返回值为promise的函数,可接收一个数组，值为多个前置函数
     *  beforeSend:function 请求发送之前，参数为config  function(config){config.xx=xx; return config}
     * }
     */
  const request = (url = '', data = {}, config = {}) => {
    const { loading, ...restConfig } = config
    //前置函数列表
    const prefixedHandle = []
    if (loading) prefixedHandle.push(promiseLoading)
    if (typeof config.customPrefixed !== "undefined") {
      if (typeof config.customPrefixed === "function") {
        prefixedHandle.push(config.customPrefixed)
      } else if (Object.prototype.toString.call(config.customPrefixed) === '[object Array]') {
        prefixedHandle.push(...config.customPrefixed.filter(item => typeof item === 'function'))
      }
    }
    const http = prefixedHandle.length > 1 ? prefixedHandle.reduce((prev, next) => next(prev(axios))) :
      prefixedHandle.length === 1 ? prefixedHandle[0](axios) : axios
    return http({ [restConfig.method === "post" ? 'data' : 'params']: data, url, ...restConfig })
  }
  if (typeof apis === "object" && apis) {
    /**
     * 如果该请求需要防抖，把加了防抖的方法放入debounceObj，第二次调用时返回该方法
     * 该方法再次发起请求时
     */
    const debounceList = {}
    Object.keys(apis).forEach((key) => {
      this[key] = (data={},config = {}) => {
        // 当第一个参数为显式声明为config时，将data对象置为空
        if(data.isConfig){
          config=JSON.parse(JSON.stringify(data));
          data={}
        }
        config = { ...setting, ...config }
        const params = { ...config.commonData, ...data }
        if (config.debounce) {
          if (!debounceList[key]) {
            debounceList[key] = promiseDebounce(request)
          }
          return debounceList[key](apis[key], params, config)
        }
        delete config.commonData
        delete config.debounce
        return request(apis[key], params, config);
      };
    });
  }
}
