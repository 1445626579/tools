
import loading from "./loading";
const Loading = loading();
const hasPoint = (num: string): boolean => num.indexOf('.') !== -1;
// 公共方法
interface loadScriptConfig{
  url: string,
  success?: (e:Event)=>void,
  async?: boolean,
  cache?:boolean
}
export function loadScript(url:string|loadScriptConfig, callback?:(e:Event)=>void):void {
  const head:Element =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  const script:HTMLScriptElement=document.createElement("script");
  const options:loadScriptConfig = typeof url === "object" ? url:{ url };
  callback = callback || options.success;
  script.async = options.async || false;
  script.type = "text/javascript";
  if (options.cache === false) {
    options.url = options.url + (/\?/.test(options.url) ? "&" : "?") + "_=" + new Date().getTime();
  }
  script.src = options.url ;
  head.appendChild(script);
  if (callback) {
    script.addEventListener("load",callback, false);
  }
}
export function loadCss(url:string) {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  head.appendChild(link);
}

// 防抖函数
export function debounce(fn:Function, wait:number = 500):Function {
  let timer = null;
  return function ():void {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, wait);
  };
}

// 节流函数
export function throttle(fn:Function, detalTime = 1000):Function {
  let initTime = null; // 初始时间
  return function ():void{
    const context = this; // 存放自己的this
    const args = arguments; // 存放参数
    const nowTime = +new Date(); // 获取当前时间
    // 比较差值是否执行函数
    if (nowTime - initTime > detalTime || !initTime) {
      fn.apply(context, args);
      initTime = nowTime;
    }
  };
}
/**
 * 异步防抖函数
 * @param {function} promise 返回值为promise的函数
 */

export function promiseDebounce(promise:(...rest:any)=>Promise<any>) {
  let isLoading = false;
  if (typeof promise !== "function") {
    return Promise.reject(new Error("入参非函数"));
  }
  return function () {
    if (isLoading) return Promise.reject("loading...");
    isLoading = true;
    const _this = this
    return promise.apply(_this,arguments).finally(() => {
      isLoading = false;
    });
  };
}

/**
 * 异步loading函数
 * @param {function} promise 返回值为promise的函数
 */

export function promiseLoading(promise: (...rest) => Promise<any>, loading?) {
  loading=loading||Loading
  if (typeof promise !== "function") {
    return Promise.reject(new Error("入参非函数"));
  }
  return function () {
    const _this = this;
    Loading.show();
    return promise.apply(_this,arguments).finally(() => {
      Loading.hide();
    });
  };
}
/**
 * 除法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accDiv(arg1: number, arg2: number): number {
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  const t1 = hasPoint(s1) ?s1.split(".")[1].length : 0;
  const t2 = hasPoint(s2) ? s2.split(".")[1].length : 0;
  const r1 = Number(s1.replace(".", ""));
  const r2 = Number(s2.replace(".", ""));
  return (r1 / r2) * 10 ** (t2 - t1);
}
/**
 * 乘法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accMul(arg1:number, arg2:number):number {
  let m:number = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  if (hasPoint(s1)) m += s1.split(".")[1].length;
  if (hasPoint(s2)) m += s2.split(".")[1].length;
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / 10 ** m;
}
/**
 * 加法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accAdd(arg1: number, arg2: number): number {
  const r1: number = hasPoint(arg1.toString()) ? arg1.toString().split(".")[1].length:0;
  const r2: number = hasPoint(arg2.toString()) ? arg2.toString().split(".")[1].length:0 ;
  const m = 10 ** Math.max(r1, r2);
  return accDiv(accMul(arg1, m) + accMul(arg2, m), m);
}
/**
 * 减法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accSubtr(arg1:number, arg2:number):number {
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  const r1: number = hasPoint(s1) ? s1.split(".")[1].length : 0;
  const r2: number = hasPoint(s2) ? s2.split(".")[1].length : 0;
  const m = 10 ** Math.max(r1, r2);
  return (arg1 * m - arg2 * m) / m;
}
/**
 * 格式化时间 YYYY-MM-DD hh:mm:ss week
 * @param {String} fromat 时间的格式
 * @param {time} time 一个可以被new Date装换为时间的值
 */
export function formatDate(format = "YYYY-MM-DD", time?):string {
  const date = time ? new Date(time) : new Date();
  const flags = {
    YYYY: date.getFullYear,
    MM() {
      return date.getMonth() + 1;
    },
    DD: date.getDate,
    hh: date.getHours,
    mm: date.getMinutes,
    ss: date.getSeconds,
    week() {
      const week = ["日", "一", "二", "三", "四", "五", "六"];
      return week[date.getDay()];
    }
  };
  return format.replace(/Y{4}|M{2}|D{2}|h{2}|m{2}|s{2}|week/g, key => {
    const value = flags[key].call(date);
    return typeof value !== "number" || value > 9 ? value : "0" + value;
  });
}
interface CountLoading{
  show: Function,
  hide: Function,
  forceHide:Function
}
interface Loading{
  show: Function,
  hide: Function,
  [key:string]:any
}
/**
 * 计数器loading
 * counter值为1时可以隐藏
 * counter值为0时执行展示
 * @param Loading 
 */
export function countLoading(Loading:Loading = loading()):CountLoading{
  let counter = 0;
  return {
    show() {
      if (counter === 0) Loading.show();
      counter++;
    },
    hide() {
      switch (counter) {
        case 0: return;
        case 1:
          Loading.hide();
      }
      counter--;
    },
    forceHide() {
      Loading.hide();
      counter = 0;
    }
  }
}