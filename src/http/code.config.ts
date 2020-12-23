import { codeItem } from './interface.d'
const initCodes: Array<codeItem> = [
  {
    code: 401,
    tips: "登陆无效", //提示用户的信息,不存在时使用后端返回message信息
    visible:true
  },
  {
    code: 402,
    tips: "登陆过期", //token 已经过期
    visible:true
  },
  {
    code: 429,
    tips: "操作太频繁",
    visible:true
  },
  {
    code: 430,
    tips: "该账号尚未注册",
    visible:true
  },
  {
    code: 500,
    tips: "服务器异常,请联系管理员",
    visible:true
  },
  {
    code: 504,
    tips: "网关超时,请联系管理员",
    visible:true,
    handle(data) {
      console.log(data)
    }
  },
  {
    code: (code) => code > 2000, //为函数时返回值必须是一个布尔值
    visible:true
  },
  {
    code: 400,
    tips: "错误的请求，请求参数或者类型不对",
  },
  {
    code: 403,
    tips: "服务器拒绝请求",
  },
  {
    code: 10001,
    tips: "数据验证失败",
  },
  {
    code: 20001,
    tips: "用户不存在",
  },
  {
    code: (code) => code > 1000 && code < 1999,
  },
]
//错误code码信息
export default initCodes
  //需要提示用户的code码
   
