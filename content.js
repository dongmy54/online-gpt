// 添加聊天框元素
const chatBoxDiv = document.createElement("div");
chatBoxDiv.id = "chat-box";
chatBoxDiv.style.display = "none" // 首次进入样式 此时css可能没生效
document.body.appendChild(chatBoxDiv);

// 添加默认聊天内容
const defaultChatMsgs = [
  {
    message: "欢迎来到online-gpt!\n 1. 你可以像在使用gpt那样聊天;\n 2. 也可以点击翻译、解释、摘要按钮，对输入框中的内容进行翻译、解释、生成摘要;\n 3. 当你选中网页上任何一段文本后,文本内容将自动填入输入框;\n 4. 摘要支持对网页整个页面内容进行摘要（输入框可以不输入内容）",
    from: "bot",
    time: new Date(),
  },
];
let chatMsgs = defaultChatMsgs;

// 创建聊天框头部
const chatHeader = document.createElement("div");
chatHeader.id = "chat-header";
chatHeader.innerHTML = "<p>Online GPT</p>";
chatBoxDiv.appendChild(chatHeader);

// 创建聊天框关闭按钮
const closeButton = document.createElement("span");
closeButton.id = "close-button";
closeButton.innerHTML = "&#10005;";
chatHeader.appendChild(closeButton);

// 添加关闭按钮的点击事件监听器
closeButton.addEventListener("click", function () {
  closeChatBox();
});

// 创建聊天消息列表
const chatMsgList = document.createElement("ul");
chatMsgList.id = "chat-msg-list";
chatBoxDiv.appendChild(chatMsgList);

// 将默认聊天内容添加到聊天消息列表
renderChatMsgs();

// 创建聊天输入框
const chatInputWrapper = document.createElement("div");
chatInputWrapper.id = "chat-input-wrapper";
const chatInput = document.createElement("textarea");
chatInput.id = "chat-input";
chatInput.placeholder = "Type your message...";
chatInputWrapper.appendChild(chatInput);
chatBoxDiv.appendChild(chatInputWrapper);

// 添加聊天框输入框的键盘事件监听器
chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.shiftKey) {
    // 如果按下 shift + Enter，则插入一个换行符，而不提交内容。
    e.preventDefault();
    chatInput.value += "\n";
  } else if (e.key === "Enter") {
    // 如果只按下 Enter 键，则提交内容。
    e.preventDefault();

    const message = chatInput.value;
    if (message.trim()){
      sendMessage(message);
    }
  }
});

// 添加发送消息的函数
function sendMessage(message) {
  chatMsgs.push({
    message: message,
    from: "user",
    time: new Date(),
  });
  chatInput.value = "";
  renderChatMsgs();
  showLoading();
  respondToMessage(message);
}

// 添加聊天按钮元素并将其添加到页面中
const chatButtonWrapper = document.createElement("div");
chatButtonWrapper.id = "chat-button-wrapper";
const chatButton = document.createElement("button");
chatButton.id = "chat-button";
chatButton.innerText = "Chat";
chatButtonWrapper.appendChild(chatButton);
document.body.appendChild(chatButtonWrapper);

// 添加点击事件监听器以打开/关闭聊天框
chatButton.addEventListener("click", function () {
  if (chatBoxDiv.style.display === "none") {
    openChatBox();
  } else {
    closeChatBox();
  }
});

// 添加打开/关闭聊天框的函数
function openChatBox() {
  if (!document.body.contains(chatBoxDiv)) {
    document.body.appendChild(chatBoxDiv);
  }
  hideLoading();// 一开始加载动画是隐藏的
  chatBoxDiv.style.display = "block";
  chatButtonWrapper.style.display = "none"; // 隐藏聊天按钮
}

function closeChatBox() {
  chatBoxDiv.style.display = "none";
  chatButtonWrapper.style.display = "block"; // 显示聊天按钮 
}

// 渲染聊天消息列表
function renderChatMsgs() {
  chatMsgList.innerHTML = "";
  chatMsgs.forEach((msg) => {
    const li = document.createElement("li");
    li.className = msg.from === "bot" ? "msg-bot" : "msg-user";
    li.innerHTML = parseMarkdown(msg.message); // 解析 Markdown 内容并设置 innerHTML
    chatMsgList.appendChild(li);
  });
  chatMsgList.scrollTop = chatMsgList.scrollHeight;
}

// 解析 Markdown 内容并添加美化样式
function parseMarkdown(content) {
  if (typeof marked === 'object' && marked.parse) {
    const html = marked.parse(content);
    const div = document.createElement('div');
    div.innerHTML = html;

    // 添加自定义 CSS 样式
    div.querySelectorAll('p').forEach((p) => {
      p.classList.add('markdown-p');
    });
    div.querySelectorAll('pre').forEach((pre) => {
      pre.classList.add('markdown-pre');
    });
    div.querySelectorAll('code').forEach((code) => {
      code.classList.add('markdown-code');
    });

    return div.innerHTML;
  } else {
    return content;
  }
}

// 创建加载圆圈元素
const loadingDiv = document.createElement("div");
loadingDiv.id = "loading";
const spinnerDiv = document.createElement("div");
spinnerDiv.classList.add("loading-spinner");
loadingDiv.appendChild(spinnerDiv);
chatInputWrapper.appendChild(loadingDiv);


// 显示加载动画
function showLoading() {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.style.display = "block";
  }
  chatInput.disabled = true; // 禁用聊天输入框
}

// 隐藏加载动画
function hideLoading() {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.style.display = "none";
  }
  chatInput.disabled = false; // 启用聊天输入框
}


// 设置你的 OpenAI API 密钥
const OPENAI_API_KEY = "";

// 更新 respondToMessage 函数
function respondToMessage(message) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: message }
      ]
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("API request failed.");
      }
      return response.json();
    })
    .then(data => {
      const replyMessage = data.choices[0].message.content;
      console.log(`${replyMessage}`);
      chatMsgs.push({
        message: replyMessage,
        from: "bot",
        time: new Date(),
      });
      renderChatMsgs();
    })
    .catch(error => {
      console.error("Error:", error);
      const errorMessage = "Oops! Something went wrong. Please try again later.";
      chatMsgs.push({
        message: errorMessage,
        from: "bot",
        time: new Date(),
      });
      renderChatMsgs();
    })
    .finally(() => {
      // 隐藏加载动画
      hideLoading();
    });
    ;
}


// 显示默认聊天消息
function showDefaultChatMsgs() {
  chatMsgs = defaultChatMsgs;
  renderChatMsgs();
}
showDefaultChatMsgs();


// 获取页面内容
function getPageContent() {
  // 获取网页中的所有 <p> 标签元素（排除 chat-box 元素）
  var elements = document.querySelectorAll('p:not(#chat-box p)');

  // 创建一个空数组用于存储文本内容
  var contentArray = [];

  // 遍历标签元素，获取文本内容并添加到数组中
  elements.forEach(function(element) {
    var textContent = element.textContent.trim();
    if (textContent.length > 0) {
      contentArray.push(textContent);
    }
  });

  // 将数组中的文本内容整合成一个完整的文本
  var completeContent = contentArray.join('\n');

  return completeContent;
}

// 调用函数获取网页内容
var pageContent = getPageContent();



// 添加按钮容器
const functionButtonContainer = document.createElement("div");
functionButtonContainer.className = "function-button-container";

// 创建按钮的通用函数
function createButton(className, label, clickHandler) {
  const button = document.createElement("button");
  button.className = "function-button " + className;
  button.textContent = label;
  button.addEventListener("click", clickHandler);
  functionButtonContainer.appendChild(button);
}

// 应用模版函数
function applyTemplate(template, message) {
  // 使用正则表达式替换模版中的占位符 %{message} 为实际内容
  var modifiedContent = template.replace("%{message}%", message);
  return modifiedContent;
}

// 翻译按钮的点击处理函数
function translateMessage() {
  const message = chatInput.value.trim();
  if (message !== "") {
    const template = "将下面内容翻译为中文：\n %{message}%";
    const translatedMessage = applyTemplate(template, message);
    sendMessage(translatedMessage);
  }
}

// 解释按钮的点击处理函数
function explainMessage() {
  const message = chatInput.value.trim();
  if (message !== "") {
    const template = "详细解释下面内容：\n %{message}%";
    const explainedMessage = applyTemplate(template, message);
    sendMessage(explainedMessage);
  }
}

// 摘要按钮的点击处理函数
function summarizeMessage() {
  var message = "";
  var chatInput = document.getElementById("chat-input");

  // 检查输入框中是否有内容
  if (chatInput.value.trim().length > 0) {
    message = chatInput.value.trim(); // 从输入框获取文本作为摘要的消息
  } else {
    message = getPageContent(); // 从整个网页获取文本作为摘要的消息
  }

  const template = "将下面内容生成中文摘要：\n %{message}%";
  const summary = applyTemplate(template, message);

  sendMessage(summary);
}


// 创建翻译按钮
createButton("translation-button", "翻译", translateMessage);
// 创建解释按钮
createButton("explanation-button", "解释", explainMessage);
// 创建摘要按钮
createButton("summary-button", "摘要", summarizeMessage);

// 将按钮容器添加到 chat-input-wrapper 元素前面
chatInputWrapper.parentNode.insertBefore(functionButtonContainer, chatInputWrapper);


// 监听文本选择事件
document.addEventListener("mouseup", function(event) {
  var selectedText = window.getSelection().toString();

  // 检查聊天框是否处于显示状态
  var chatBox = document.getElementById("chat-box");
  if (chatBox.style.display === "block" && selectedText.length > 0) {
    var chatInput = document.getElementById("chat-input");
    chatInput.value = selectedText;
  }
});


// 创建清除按钮
const clearButton = document.createElement("span");
clearButton.className = "clear-button";
clearButton.innerHTML = "清除"; // 使用 HTML 实体编码表示 "✕"

// 点击清除按钮时清空聊天输入框
clearButton.addEventListener("click", function () {
  chatInput.value = "";
});

// 将清除按钮添加到聊天输入框中
chatInputWrapper.appendChild(clearButton);
// 添加样式类到聊天输入框容器
chatInputWrapper.classList.add("input-wrapper-with-clear-button");


// 获取样式表文件的绝对路径
const styleSheetPath = chrome.extension.getURL('style.css');

// 创建一个<link>元素来加载样式表
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = styleSheetPath;

// 将<link>元素附加到页面中
document.head.appendChild(linkElement);


