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
  return (...rest) => {
    if (isLoading) return Promise.reject("loading...");
    isLoading = true;
    return promise(...rest).finally(() => {
      isLoading = false;
    });
  };
}
/**
 * 异步loading函数
 * @param {function} promise 返回值为promise的函数
 */
export function promiseLoading(promise) {
  if (typeof promise !== "function") {
    return Promise.reject(new Error("入参非函数"));
  }
  return (...rest) => {
    Loading.show();
    return promise(...rest).finally(() => {
      Loading.hide();
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