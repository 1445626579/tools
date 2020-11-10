/**
 * loading功能
 * @param {Object} config
 * @prop {ColorString} bgColor default rgba(255,255,255,.4)
 * @prop {pointColor} pointColor default #1890ff
 * @prop {String} pointSize default 24px
 * @prop {NodeString} parentNode default body
 * @prop {ColorString} bgColor default rgba(255,255,255,.4)
 * @prop {String} width default 100vw
 * @prop {String} height default 100vh
 */
export default function (config = {}) {
  const defaults = {
    bgColor: "rgba(255,255,255,.4)", //loading背景色
    pointColor: "#1890ff", //点颜色
    pointSize: "24px", //loading元素大小
    parentNode: "body", //loading挂载的父元素
    width: "100vw", //loading的宽度
    height: "100vh", //loading的高度
  };
  const setting = Object.assign({}, defaults, config);
  const element = document.createElement("div");
  const body = document.querySelector(setting.parentNode);
  const cDiv = (i) => {
    const div = document.createElement("div");
    div.style = `width:50%;height:50%;border-radius:50%;transform:scale(0.6);background-color:${
      setting.pointColor
      };animation:fry_opacity 1s linear infinite alternate;animation-delay:${
      i * 400
      }ms;opacity:.3;`;
    return div;
  };
  const parentDiv = document.createElement("div");
  parentDiv.style = `width:${setting.pointSize};height:${setting.pointSize};transform:rotate(45deg);display:flex;flex-wrap:wrap;animation:fry_rotate 1.2s linear infinite`;
  if (document.querySelector("#fry_animate_style") === null) {
    const animationStyle = document.createElement("style");
    animationStyle.id = "fry_animate_style";
    animationStyle.type = "text/css";
    animationStyle.innerHTML = `
      @keyframes fry_rotate {
        0%{
          transform: rotate(45deg);
        }
        100%{
          transform: rotate(405deg);
        }
      }
      @keyframes fry_opacity{
        0%{
          opacity: 0.3;
        }
        100%{
          opacity: 1;
        }
      }
    `;
    document.querySelector("head").appendChild(animationStyle);
  }
  for (let i = 0; i < 4; i++) {
    parentDiv.appendChild(cDiv(i));
  }
  element.appendChild(parentDiv);
  element.id="fry_loading"
  element.style = `display:flex;align-items:center;justify-content:center;width:${setting.width};height:${setting.height};position:absolute;top:0;left:0;background-color:${setting.bgColor}`;
  return {
    // 显示
    show () {
      body.appendChild(element);
    },
    // 隐藏
    hide () {
      if (body.querySelector("#fry_loading")!==null) body.removeChild(element);
    },
  };
}
