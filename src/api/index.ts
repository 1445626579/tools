import Http from "../http/index"
//import '../mock'
const config = {
  baseURL:'',
  commonData: { a: 10, b: 2, c: 0 },
  
  getToken () {
    return 'token'
  },
  //getToken return的token
  setToken (token) {
    //config.headers.token=token
  },
  //未登录时的响应函数
  notLoginHandle(err) { console.log('未登录'); },
  
  beforeSend (config) {
    //config.headers.aa_tok='token'
    return config
  },
  codes: [
    { code: 504, tips: '替换的文本' },

    {
      code: 507, tips: '替换的文本22', handle(data) {
        console.log('当code码为507时的响应函数',data)
      }
    }
    
  ],
  method: "get",
  requestType:'form',
  needLoading: false,
};
const apiUrls = {
  test: '/test',
  test2: 'test2',
  getUserInfo: '/api/getUserInfo'
}
const apis = new Http({
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
  codes: [
    { code: 504, tips: '替换的文本' },
    { code: 507, tips: '替换的文本22' }
  ],
  setToken () {
    //config.headers.token=token
  },
  method: "get",
  needLoading: false,
}, apiUrls)
console.log(apis)
export default apis
