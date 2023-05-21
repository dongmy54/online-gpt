// 获取样式表文件的绝对路径
const styleSheetPath = chrome.extension.getURL('style.css');

// 创建一个<link>元素来加载样式表
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = styleSheetPath;

// 将<link>元素附加到页面中
document.head.appendChild(linkElement);
