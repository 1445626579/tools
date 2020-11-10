# utils

## axios请求
  对axios的二次封装，简化调用
```
  import Http from "@abk/utils/http"
  const config = {
    baseURL: 'localhost',
    notLoginHandle () { console.log('未登录') },
    method: 'get'
  }
  const requestUrls= {
    test: 'test',
    test2: 'test2'
  }
  const apis =  new Http(config, requestUrls)
  const data={a:1,b:2}
  const requestConfig={method:'post',loading:true}
  apis.test(data,requestConfig)
```
1. new Http 函数，构造函数接收两个参数，config与requestUrls，config为请求的默认设置，requestUrls为请求的接口列表，接口列表的键将作为请求函数的方法名，值作为请求的路径
  * @param {Object} config 请求默认设置
  * @param {Object} requestUrls 请求的路径
2. 函数包含两个参数第一个为Data值，第二个为对请求的设置config对象,请求设置将会覆盖构造函数的默认config，不传时使用默认的config
  * @param {Object} data 请求参数设置
  * @param {Object} config 请求设置，包括请求类型、loading和防抖
```
//注： 如果同时有多个请求只会出现一个loading，当有请求结束时，loading会被立即删除。如有需求同时多个请求，请自行处理loading的状态。如果想自定义loading，请先关闭默认loading,然后在customPrefixed中自定义前置loading
apis.test({a:1},{loading:true}).then(res=>{
  //正常返回处理
}).catch(e=>{
  //异常处理
})
```

3. 构造函数与请求的config属性设置
  * requestType:'json || form || upFile' 默认请求类型为json，form为表单方式提交，upFile为文件上传
  * loading:false || true 是否需要loading 
  * debounce: false || true 是否需要防抖
  * method:'post' 请求类型 默认post
  * customPrefixed:function 自定义前置函数，函数接收axios请求函数，返回值必须是一个返回值为promise的函数。也可接收一个数组，值为多个前置函数
  * beforeSend:function 请求发送之前，参数为config 
  * getToken:function 函数返回值为token
  * setToken:function token如何设置到请求上，第一个参数为请求的config，第二个参数为getToken的返回值
  * notLoginHandle:function 当getToken没有获取到token时的处理函数
  * customInterceptors:function 自定义的拦截器，如何处理返回值
  * noNeedToken:Boolean 是否可以不需要token也能发起请求
  * toast:function toast提示使用的方法
  ```
    //在请求发送前为请求头添加platform属性
    function(config){
      config.header.platform=1;
      return config
    }
  ```
  * noNeedToken:Boolean 默认为false,值为true时可以不含token发起请求，否则请求会被取消
  ```
   const config={
     requestType:'form',
     loading:true,
     debounce:true,
     method:'get',
     customPrefixed(handle){
       retrun (...rest)=>{
          retrun handle(...rest)
       }
     },
     beforeSend(config){
      config.header.platform=1;
      return config
     },
     noNeedToken:true
   }
   apis.test({a:1},config)
  ```
4. code.config.js 设置code码相应的提示文案。
  * 提醒用户的code：userVisibleCodes
  * 不提醒用户的code：outerCodes

## loading方法

  1. 使用方法

    ```
    import {loading} from "@abk/utils"
    const Loading=loading()
    Loading.show()//显示loading
    Loading.hide()//隐藏loading
    ```

  2. loading参数
    * bgColor:'rgba(255,255,255,.4)',//loading背景色
    * pointColor:'#1890ff',//点颜色
    * pointSize:'24px',//loading元素大小
    * parentNode:'body',//loading挂载的父元素
    * width:'100vw',//loading的宽度
    * height:'100vh',//loading的高度

    ```
      const config={
        bgColor:'rgba(255,255,255,.4)',//loading背景色
        pointColor:'#1890ff',//点颜色
        pointSize:'24px',//loading元素大小
        parentNode:'body',//loading挂载的父元素
        width:'100vw',//loading的宽度
        height:'100vh',//loading的高度
      }
      const Loading=loading(config)
    ```
    
## loadScript与loadCss
  
  utils文件夹下的index.js中的异步加载js或css的方法，当需要异步加载外部资源时请使用该方法
  loadScript方法有两个参数，资源路径与加载完成的回调函数
  loadCss没有加载完成的回调
  ```
  import {loadCss,loadScript} from "@abk/utils"
  loadScript('//static/index.js',()=>{
    //加载成功的回调函数
  })
  loadCss('//static/style.css')
  ```
