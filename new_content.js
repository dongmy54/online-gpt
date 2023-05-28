const onlineGpt = document.getElementById("online-gpt");
// 获取关联的 Shadow Root
const shadowRoot = onlineGpt.shadowRoot;

console.log(shadowRoot);
// chat按钮控制
const chatButton = shadowRoot.getElementById('chat-button');
const chatContainer = shadowRoot.getElementById('chat-container');

// 定义展开/收起聊天框的函数
function toggleChat() {
  chatContainer.classList.toggle('show');
  console.log('点击了');
}

// 点击按钮时触发展开/收起聊天框
chatButton.addEventListener('click', toggleChat);




// 聊天框整体
const messageInput = shadowRoot.getElementById("message-input");
const sendButton = shadowRoot.getElementById("send-button");
const chatMessages = shadowRoot.getElementById("chat-messages");

sendButton.addEventListener("click", sendMessage);

// 清空输入框
function clearMessage() {
  messageInput.value = "";
  messageInput.style.height = "auto";
  messageInput.style.overflowY = "auto"; // 隐藏输入框的垂直滚动条
}

function sendMessage() {
  var message = messageInput.value.trim();
  if (message !== "") {
    addMessage(message, true);
    clearMessage();
    receiveReply(message);
  }
}

function receiveReply(message) {
  // 模拟简单的回复，实际应用中可以通过网络请求获取回复消息
  var reply = "你好，我收到你的消息：" + message;
  setTimeout(function () {
    addMessage(reply);
  }, 1000);
}

function addMessage(text, isSent) {
  var messageContainer = document.createElement("div");
  messageContainer.classList.add("chat-message");

  if (isSent) {
    messageContainer.classList.add("sent");
  } else {
    messageContainer.classList.add("received");
  }

  var avatarElement = document.createElement("div");
  avatarElement.classList.add("avatar");

  var textElement = document.createElement("span");
  textElement.classList.add("text");
  textElement.innerText = text;

  var messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble");
  messageBubble.appendChild(textElement);

  messageContainer.appendChild(avatarElement);
  messageContainer.appendChild(messageBubble);

  chatMessages.appendChild(messageContainer);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

messageInput.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";

  if (this.scrollHeight > parseInt(getComputedStyle(this).maxHeight)) {
    this.style.overflowY = "scroll";
  } else {
    this.style.overflowY = "hidden";
  }
});
