// 添加 chat 按钮
const chatBtn = document.createElement("button");
chatBtn.id = "chat-btn";
chatBtn.textContent = "Chat";
document.body.appendChild(chatBtn);

// 添加聊天框元素
const chatBoxDiv = document.createElement("div");
chatBoxDiv.id = "chat-box";
document.body.appendChild(chatBoxDiv);

// 添加聊天内容展示区域
const chatShowDiv = document.createElement("div");
chatShowDiv.id = "chat-show";
chatBoxDiv.appendChild(chatShowDiv);

// 添加输入框和发送按钮
const chatInputDiv = document.createElement("div");
chatInputDiv.id = "chat-input";
chatBoxDiv.appendChild(chatInputDiv);
const chatInput = document.createElement("input");
chatInput.type = "text";
chatInput.id = "chat-message";
chatInputDiv.appendChild(chatInput);
const chatSendBtn = document.createElement("button");
chatSendBtn.textContent = "Send";
chatInputDiv.appendChild(chatSendBtn);

// 添加事件监听器，以便点击 chat 按钮显示聊天框
chatBtn.addEventListener("click", function() {
  chatBoxDiv.style.display = "block";
  chatBtn.style.display = "none";
  chatInput.focus(); // 让输入框自动获取焦点
});

// 添加事件监听器，以便发送聊天消息
chatSendBtn.addEventListener("click", function() {
  sendMessage();
});

chatInput.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) { // 如果按下的是enter键
    sendMessage();
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message) {
    addMessageToChat(message, "user");
    sendMessageToBot(message);
    chatInput.value = "";
  }
}

// 默认聊天对话
const defaultChat = [
  {
    sender: "bot",
    message: "Hello, how can I help you?",
    lang: "en"
  },
  {
    sender: "user",
    message: "Hi, I need help with my order.",
    lang: "en"
  },
  {
    sender: "bot",
    message: "Sure, what is the order number?",
    lang: "en"
  },
  {
    sender: "user",
    message: "123456",
    lang: "en"
  },
  {
    sender: "bot",
    message:
      "I'm sorry, we were not able to find your order. Could you please confirm the order number?",
    lang: "en"
  }
];

// 将聊天内容添加到聊天框中
function addMessageToChat(message, sender) {
  const chatBubble = document.createElement("div");
  chatBubble.className = "chat-bubble";
  chatBubble.textContent = message;
  if (sender === "user") {
    chatBubble.classList.add("user-bubble");
  } else {
    chatBubble.classList.add("bot-bubble");
  }
  chatShowDiv.appendChild(chatBubble);
  chatShowDiv.scrollTop = chatShowDiv.scrollHeight;
}

// 发送聊天消息
function sendMessageToBot(message) {
  // 这里可以使用 API 或其他服务器端代码来获取聊天消息的回复
  // 为了演示，我们先直接在前端生成回复消息
  const botMessage =
    "I'm sorry, I'm just a demo bot and I do not have the capability to process your request.";
  addMessageToChat(botMessage, "bot");
}

// 设置 CSS 样式
const style = document.createElement("style");
style.textContent = `
  #chat-btn {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 9999;
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  #chat-box {
    display: none;
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 9999;
    background-color: #fff;
    border: 1px solid #ccc;
    width: 300px;
    max-height: 400px;
    overflow: hidden;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
  #chat-show {
    height: 100%;
    max-height: 350px;
    padding: 10px;
    overflow-y: auto;
  }
  #chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #ccc;
  }
  #chat-message {
    flex-grow: 1;
    border: none;
    border-bottom: 1px solid #ccc;
    margin-right: 10px;
    outline: none;
    font-size: 14px;
  }
  #chat-input button {
    border: none;
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  .chat-bubble {
    display: inline-block;
    max-width: 80%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    line-height: 1.5;
  }
  .user-bubble {
    background-color: #4CAF50;
    color: #fff;
    align-self: flex-end;
  }
  .bot-bubble {
    background-color: #f2f2f2;
    color: #4CAF50;
    align-self: flex-start;
  }
  #chat-close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    width: 25px;
    height: 25px;
    line-height: 20px;
    text-align: center;
    font-size: 20px;
    color: #999;
    cursor: pointer;
    outline: none;
  }
  #chat-close-btn:hover {
    color: #333;
  }
`;

document.head.appendChild(style);

// 显示默认聊天对话
defaultChat.forEach(chat => {
  addMessageToChat(chat.message, chat.sender);
});

// 添加关闭按钮
const chatCloseBtn = document.createElement("button");
chatCloseBtn.textContent = "X";
chatCloseBtn.id = "chat-close-btn";
chatBoxDiv.appendChild(chatCloseBtn);

// 添加事件监听器，以便点击关闭按钮隐藏聊天框
chatCloseBtn.addEventListener("click", function() {
  chatBoxDiv.style.display = "none";
  chatBtn.style.display = "block";
});




