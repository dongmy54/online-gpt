// 添加聊天框元素
const chatBoxDiv = document.createElement("div");
chatBoxDiv.id = "chat-box";
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

// 添加输入框的键盘事件监听器
chatInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    const message = chatInput.value;
    if (message.trim()) {
      chatMsgs.push({
        message: message,
        from: "user",
        time: new Date(),
      });
      chatInput.value = "";
      renderChatMsgs();
      respondToMessage(message);
    }
  }
});

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
  chatBoxDiv.style.display = "block";
}

function closeChatBox() {
  chatBoxDiv.style.display = "none";
}

// 渲染聊天消息列表
function renderChatMsgs() {
  chatMsgList.innerHTML = "";
  chatMsgs.forEach((msg) => {
    const li = document.createElement("li");
    li.className = msg.from === "bot" ? "msg-bot" : "msg-user"; // 根据消息类型分配类
    li.innerText = msg.message;
    chatMsgList.appendChild(li);
  });
  // 将消息列表滚动到底部以便查看新的消息
  chatMsgList.scrollTop = chatMsgList.scrollHeight;
}

// 假装回复消息
function respondToMessage(message) {
  setTimeout(() => {
    chatMsgs.push({
      message: `You said "${message}", right?`,
      from: "bot",
      time: new Date(),
    });
    renderChatMsgs();
  }, 1000);
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
`;
document.head.appendChild(style);

// 显示默认聊天消息
function showDefaultChatMsgs() {
  chatMsgs = defaultChatMsgs;
  renderChatMsgs();
}
showDefaultChatMsgs();






