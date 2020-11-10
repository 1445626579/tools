import Http from "../http/index.js"
import loading from "../utils/loading"
//import '../mock'
const countLoading= (()=>{
  let count=0;
  const Loading=loading()
  return {
      show(){
          if(count===0)
              Loading.show()
          count++;
      },
      hide(){
          if(count===1)
              Loading.hide()
          count--;
      }
  }
})()
//添加一个带配置的loading,
function promiseLoading (promise) {
  if (typeof promise !== 'function') {
    return Promise.reject(new Error('入参非函数'))
  }
  return (...rest) => {
    //needLoading为自定义的配置属性
    if(rest[0].needLoading){
        countLoading.show()
        return promise(...rest).finally(() => {
            countLoading.hide()
        })
    }
    //不做任何操作
    return promise(...rest)

  }
}

const config = {
  baseURL:'',
  commonData: { a: 10, b: 2, c: 0 },
  notLoginHandle () { console.log('未登录') },
  getToken () {
    return 'token'
  },
  beforeSend (config) {
    //config.headers.aa_tok='token'
    return config
  },
  codes: {
    userVisibleCodes: [
      { code: 504, tips: '替换的文本' },
      { code: 507, tips: '替换的文本22' }
    ],
    otherCodes: []
  },
  setToken () {
    //config.headers.token=token
  },
  method: 'post',
  loading: false,
  requestType: 'form',
  customPrefixed:promiseLoading
};
const apiUrls = {
  test: '/test',
  test2: 'test2',
  getUserInfo: '/api/getUserInfo'
}
const apis = new Http(config, apiUrls)
export default apis
