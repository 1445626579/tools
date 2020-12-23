export declare interface codeItem{
  code: string | number | ((code:any)=>boolean),
  tips?: string,
  handle?: (data) => void,
  visible?:boolean//是否使用toast显示
}
interface Loading{
  show: Function,
  hide: Function,
  [key:string]:any
}
interface rtnValueIsPromise {
  (...rest) :(...rest)=> Promise<any>;
}
type Method = "GET" | "POST" | "get" | "post"
type RequestType = "json" | "upFile" | "form"

export interface Config{
  baseURL?: string;
  timeout?: number;
  getToken?: () => string | boolean;
  setToken?: (config: Config, token: string | boolean) => void;
  notLoginHandle?: Function;
  requestType?: RequestType;
  customInterceptors?: boolean | ((response: any) => any);
  loading?: Loading;
  showLoading?: boolean;
  debounce?: boolean;
  method?: Method;
  unwantedToken?: boolean;
  customPrefixed?: Array<rtnValueIsPromise> | rtnValueIsPromise;
  commonData?: object;//公共data
  toast?: (msg: string, config?) => any;
  codes?: Array<codeItem>;
  [key: string]: any;
}