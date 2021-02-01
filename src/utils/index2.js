import loading from "./loading";
const Loading = loading();
// 公共方法
export function loadScript(url, callback) {
  var head =
    document.head ||
    document.getElementsByTagName("head")[0] ||
    document.documentElement;
  var script;
  var options;
  var s;
  if (typeof url === "object") {
    options = url;
    url = undefined;
  }
  s = options || {};
  url = url || s.url;
  callback = callback || s.success;
  script = document.createElement("script");
  script.async = s.async || false;
  script.type = "text/javascript";
  if (s.cache === false) {
    url = url + (/\?/.test(url) ? "&" : "?") + "_=" + new Date().getTime();
  }
  script.src = url;
  head.appendChild(script, head.firstChild);
  if (callback) {
    document.addEventListener
      ? script.addEventListener("load", callback, false)
      : (script.onreadystatechange = function () {
          if (/loaded|complete/.test(script.readyState)) {
            script.onreadystatechange = null;
            callback();
          }
        });
  }
}
export function loadCss(url) {
  var head = document.getElementsByTagName("head")[0];
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  head.appendChild(link);
}

// 防抖函数
export function debounce(fn, wait = 500) {
  let timer = null;
  return function () {
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
export function throttle(fn, detalTime = 1000) {
  let initTime = null; // 初始时间
  return function () {
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
export function promiseDebounce(promise) {
  let isLoading = false;
  if (typeof promise !== "function") {
    return Promise.reject(new Error("入参非函数"));
  }
  return function () {
    const context = this
    const arg = arguments
    if (isLoading) return Promise.reject("loading...");
    isLoading = true;
    return promise.apply(context, arg).finally(() => {
      isLoading = false;
    });
  };
}
/**
 * 计数器loading
 * counter值为1时可以隐藏
 * counter值为0时执行展示
 * @param Loading 
 */
export function countLoading(Loading = loading()) {
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
/**
 * 异步loading函数
 * @param {function} promise 返回值为promise的函数
 */
export function promiseLoading(promise, loading) {
  loading = loading || countLoading()
  if (typeof promise !== "function") {
    return Promise.reject(new Error("入参非函数"));
  }
  return function () {
    const _this = this;
    loading.show();
    return promise.apply(_this, arguments).finally(() => {
      loading.hide();
    });
  };
}
/**
 * 除法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accDiv(arg1, arg2) {
  let t1 = 0;
  let t2 = 0;

  // eslint-disable-next-line no-empty
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  // eslint-disable-next-line no-empty
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  const r1 = Number(arg1.toString().replace(".", ""));
  const r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * 10 ** (t2 - t1);
}
/**
 * 乘法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  // eslint-disable-next-line no-empty
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  // eslint-disable-next-line no-empty
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / 10 ** m;
}
/**
 * 加法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accAdd(arg1, arg2) {
  let r1, r2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = 10 ** Math.max(r1, r2);
  //return (arg1*m+arg2*m)/m
  return accDiv(accMul(arg1, m) + accMul(arg2, m), m);
}
/**
 * 减法函数
 * @param {Number} arg1
 * @param {Number} arg2
 */
export function accSubtr(arg1, arg2) {
  let r1, r2;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = 10 ** Math.max(r1, r2);
  return (arg1 * m - arg2 * m) / m;
}
/**
 * 格式化时间 YYYY-MM-DD hh:mm:ss week
 * @param {String} fromat 时间的格式
 * @param {time} time 一个可以被new Date装换为时间的值
 */
export function formatDate(format = "YYYY-MM-DD", time) {
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
/**
 * 自定义定时器
 * 使用requestAnimationFrame实现，当需要离开页面暂停时或者批量DOM操作、重排重绘时，效果比setTimeout或setInterval要好
 * 自定义定时器不属于宏任务也不是微任务，会在浏览器下次重绘前调用
 * requestAnimation说明：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
 * @param {Function} fn 定时器回调函数
 * @param { number } time 定时器执行间隔
 * @param  {any} rest 定时器回调函数的参数
 * @returns { Object } 返回定时器的取消方法 
 * const timer = customTimeout(console.log,1000,1);
 * timer.cancel() 取消定时器
 */
export function customTimeout (fn,time=0,...rest) {
  let start = 0;
  let cancel = false
  const initFn = (timestap) => {
    if (start === 0) {
      start = timestap
    }
    const interval = timestap - start;
    if (cancel) {
      return
    }
    if (interval > time) {
      window.requestAnimationFrame(() => { fn(...rest) });
    } else {
      window.requestAnimationFrame(initFn);
    }
  }
  window.requestAnimationFrame(initFn);
  return {
    cancle () {
      cancel = true
    }
  }
}
/**
 * 自定义定时器
 * 使用requestAnimationFrame实现，当需要离开页面暂停时或者批量DOM操作、重排重绘时，效果比setTimeout或setInterval要好
 * 自定义定时器不属于宏任务也不是微任务，会在浏览器下次重绘前调用
 * requestAnimation说明：https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
 * @param {Function} fn 定时器回调函数
 * @param { number } time 定时器执行间隔
 * @param  {any} rest 定时器回调函数的参数
 * @returns { Object } 返回定时器的取消方法 
 * const timer = customInterval(console.log,1000,1);
 * timer.cancel() 取消定时器
 */
export function customInterval (fn,time,...rest) {
  let start = 0;
  let cancel = false;
  function callback() {
    fn(...rest);
    window.requestAnimationFrame(initFn)
  }
  function initFn  (timestap) {
    if (start === 0) {
      start = timestap
    }
    if (cancel) {
      return
    }
    const interval = timestap - start
    if (interval > time) {
      window.requestAnimationFrame(callback);
      start = timestap
    } else {
      window.requestAnimationFrame(initFn);
    }
  }
  window.requestAnimationFrame(initFn);
  return {
    cancel () {
      cancel = true
    }
  }
}
