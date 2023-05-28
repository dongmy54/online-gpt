// 用于引入html和相关css 搭建整体结构

// 创建最外层 shadow 挂载点
var onlineGpt = document.createElement('div');
onlineGpt.id = "online-gpt"
document.body.appendChild(onlineGpt);

// 引入html
var chatHTMLFilePath = chrome.runtime.getURL('chat.html');

// 使用 AJAX 请求读取其他 HTML 文件的内容
var xhr = new XMLHttpRequest();
xhr.open('GET', chatHTMLFilePath, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var htmlContent = xhr.responseText;
    console.log("online-gpt html load success");

    // 创建一个 Shadow Root 必须依附于一个外部点
    const shadowRoot = onlineGpt.attachShadow({ mode: 'open' });

    // 创建 Shadow DOM
    shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial; /* 避免原继承相关样式影响到shawdom */
          z-index: 9999; /* 设置一个较大的 z-index 值 */
        }
       </style>
       ${htmlContent}
    `;

    const styleSheetPath = chrome.runtime.getURL('new_style.css');
    // 创建一个<link>元素来加载样式表
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = styleSheetPath;
    shadowRoot.appendChild(linkElement);

    const scriptPath = chrome.runtime.getURL('new_content.js');
    // 创建一个 <script> 元素
    const scriptElement = document.createElement('script');
    scriptElement.src = scriptPath;
    shadowRoot.appendChild(scriptElement);
    console.log("shadow dom complete");
  }
};
xhr.send();





