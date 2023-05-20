// 添加聊天框元素
const chatBoxDiv = document.createElement("div");
chatBoxDiv.id = "chat-box";
chatBoxDiv.style.display = "none" // 首次进入样式 此时css可能没生效
document.body.appendChild(chatBoxDiv);

// 添加默认聊天内容
const defaultChatMsgs = [
  {
    message: "Welcome to our website! How can I assist you today?",
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
    sendMessage();
  }
});

// 添加发送消息的函数
function sendMessage() {
  const message = chatInput.value;
  if (message.trim()) {
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

// 设置样式
const style = document.createElement("style");
style.textContent = `
  #chat-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    display: none;
    max-width: 400px;
  }
  #chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  #close-button {
    color: #ccc;
    cursor: pointer;
    user-select: none;
    transition: color 0.2s ease-in-out;
  }
  #close-button:hover {
    color: #333;
  }
  #chat-msg-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 500px;
    overflow-y: auto;
    margin-bottom: 20px;
  }
  #chat-input-wrapper {
    margin-top: 20px;
    position: relative; /* 添加相对定位 */
  }
  #chat-input {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border-radius: 5px;
    border: none;
    background-color: #f6f6f6;
    /* 新增样式 */
    min-height: 40px; /* 改为 min-height */
    height: auto; /* 改为 auto，以支持多行文本输入 */
    width: 100%;
    box-sizing: border-box;
    margin: 5px 0;
    resize: vertical; /* 允许上下调整输入框的大小 */
  }
  #chat-input::placeholder {
    color: #ccc;
  }
  #chat-input:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.75);
  }
  #chat-button-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }
  #chat-button {
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  #chat-button:hover {
    background-color: #222;
  }
  /* 新增样式 */
  .msg-user,
  .msg-bot {
    display: block;
    clear: both;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 5px;
    position: relative;
  }
  .msg-user {
    float: right;
    background-color: #4caf50;
    color: #fff;
  }
  .msg-bot {
    float: left;
    background-color: #f6f6f6;
    color: #333;
  }
  #chat-header {
    text-align: center;
    padding: 10px;
    background-color: #f2f2f2;
    border-bottom: 1px solid #dcdcdc;
  }

  #chat-header p {
    margin: 0;
    font-weight: bold;
    font-size: 18px;
    color: #444;
  }

  /* 自定义 CSS 样式 */
  pre {
    background-color: #2d2d2d;
    color: #f8f8f8;
    border: 1px solid #444444;
    border-radius: 3px;
    font-size: 14px;
    font-family: 'Consolas', 'Menlo', 'Monaco', 'Courier New', monospace;
    line-height: 1.6;
    padding: 16px;
    margin: 20px 0;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: left;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  code {
    background-color: #272822;
    color: #f8f8f8;
    padding: 2px 6px;
    border-radius: 3px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: inherit;
    color: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  code .keyword {
    color: #f92672;
  }
  code .string {
    color: #a6e22e;
  }
  code .number {
    color: #ae81ff;
  }
  code .comment {
    color: #75715e;
    font-style: italic;
  }
  
  #loading {
    position: absolute;
    top: 50%; /* 将加载圆圈垂直居中 */
    left: 50%; /* 将加载圆圈水平居中 */
    transform: translate(-50%, -50%); /* 调整加载圆圈的位置 */
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 5px solid #f3f3f3;
    border-top: 4px solid #2E3638;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  /* 加载动画样式 */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
      border-color: #D9D9D9; /* 设置起始颜色为聊天框主题色 */
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(style);

// 显示默认聊天消息
function showDefaultChatMsgs() {
  chatMsgs = defaultChatMsgs;
  renderChatMsgs();
}
showDefaultChatMsgs();






