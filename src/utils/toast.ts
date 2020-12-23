
interface ToastConfig{
  showTime?: number,
  bgColor?: string,
  fontColor?: string,
  fontSize?: string,
  lineHeight?: string,
  bottom?:string
}
export default (function (): (msg:string,config?:object) =>void{
  const cDiv = document.createElement('div');
  cDiv.classList.add('fry_toast')
  const body = document.querySelector('body');
  if (document.querySelector("#fry_toast_style") === null) {
    const toastStyle = document.createElement('style');
    toastStyle.id = "fry_toast_style";
    toastStyle.innerHTML = `
    .fry_toast{
      max-width: 200px;
      border-radius: 3px;
      line-height: 18px;
      text-align:center;
      font-size:14px;
      padding:8px 16px;
      position:fixed;
      left:50%;
      transform:translateX(-50%);
      bottom:10%;
    }
    .fry_toast.hide{
      animation:fry_hide_toast .5s linear alternate;;
    }
    @keyframes fry_hide_toast {
      from{
        opacity: 1;
      }
      to{
        opacity: 0;
      }
    }
    @media screen and (min-width: 768px) {
      .fry_toast {
        max-width: 768px;
      }
    }
  `
    document.querySelector('head').appendChild(toastStyle)
  }
  cDiv.addEventListener('animationend', (e) => {
    if (e.animationName === 'fry_hide_toast') {
      cDiv.classList.remove('hide')
      body.removeChild(cDiv)
    }
  })
  let timer = null;

  return function (msg:string, { showTime = 3000, bgColor = 'rgba(0,0,0,.4)', fontColor = '#fff', fontSize = '12px', lineHeight = '18px', bottom = "10%" }:ToastConfig = {}) {
    const el = document.querySelector('.fry_toast') || cDiv
    el.setAttribute('style',`background-color:${bgColor};color:${fontColor};font-size:${fontSize};line-height:${lineHeight};bottom:${bottom}`)
    el.innerHTML = msg
    body.appendChild(el)
    if (timer) clearTimeout(timer)
    timer = setTimeout(function () {
      el.classList.add('hide')
    }, showTime)
  }
})()