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




// 添加默认聊天内容
const defaultChatMsgs = `hello,我是多啦A梦!快来和和我玩吧：

1.和我聊天，我会给你热情而有趣的回答！解答问题、聊天互动，让我们一起探索这个神奇的世界吧！
2.魔法瞬译、解解谜：点击翻译或解释按钮，我能帮你把文字翻译成其他语言，或解释一些超棒的词汇。让我们一起解开世界的谜题！
3.抓取网页文字的魔法手：选中网页上的文字，我会把它自动填入输入框。省去你的时间和劳动，让我们更快乐地互动吧！
摘要魔术秀：
4.我能帮你提取网页的要点，生成简洁的摘要。让我们快速捕捉信息的精华，一起掌握重点！
`;
addMessage(defaultChatMsgs);

