const onlineGpt = document.getElementById("online-gpt");
// 获取关联的 Shadow Root
const shadowRoot = onlineGpt.shadowRoot;

// chat按钮控制
const chatButton = shadowRoot.getElementById('chat-button');
const chatContainer = shadowRoot.getElementById('chat-container');
// 聊天框整体
const messageInput = shadowRoot.getElementById("message-input");
const sendButton = shadowRoot.getElementById("send-button");
const chatMessages = shadowRoot.getElementById("chat-messages");
const thinkingMessage = shadowRoot.getElementById('thinkingMessage');

// 定义展开/收起聊天框的函数
function toggleChat() {
  chatContainer.classList.toggle('show');
  console.log('点击了');
}

// 点击按钮时触发展开/收起聊天框
chatButton.addEventListener('click', toggleChat);






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
    // receiveReply(message);
    // addReplyMessage("你好，我收到你的消息：" + message)
    requestGptStream(message);
  }
}

function receiveReply(message) {
  // 模拟简单的回复，实际应用中可以通过网络请求获取回复消息
  var reply = "你好，我收到你的消息：" + message;
  setTimeout(function () {
    addMessage(reply);
  }, 1000);
}

// 打字机效果
function typeWriterEffect(text, element) {
  var index = 0;
  var speed = 50; // 打字速度
  var timer = setInterval(function () {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      // 动态调整滚动条
      chatMessages.scrollTop = chatMessages.scrollHeight;
      index++;
    }
  }, speed);
}

// 最后的回复span元素
function lastReplySpanElement(){
  var receivedMessages = chatMessages.getElementsByClassName("chat-message received");
  // 获取最后一条 chat-message received 元素
  var lastReceivedMessage = receivedMessages[receivedMessages.length - 1];
  messageBubble = lastReceivedMessage.querySelector('.message-bubble');
  textSpan = messageBubble.querySelector('span');
  return textSpan;
}

// 用于添加发送的消息
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

let firstStageReply = true;  // 是否为第一个阶段回复 - 控制是否新增头像和回复文本span
let replyComplete   = false; // 回复是否完成 - 控制光标展示和生成动画

// 用于添加gpt回复的消息
function addReplyMessage(text) {
  if (firstStageReply){ // 新增
    var messageContainer = document.createElement("div");
    messageContainer.classList.add("chat-message");
    messageContainer.classList.add("received");

    var avatarElement = document.createElement("div");
    avatarElement.classList.add("avatar");

    var textElement = document.createElement("span");
    textElement.classList.add("text");

    var messageBubble = document.createElement("div");
    messageBubble.classList.add("message-bubble");
    messageBubble.appendChild(textElement);

    messageContainer.appendChild(avatarElement);
    messageContainer.appendChild(messageBubble);

    chatMessages.appendChild(messageContainer);
    firstStageReply = false;
  } else {
    textElement = lastReplySpanElement();
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 打字机效果
  typeWriterEffect(text, textElement);
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

// 显示思考中消息
function showThinkingMessage() {
  thinkingMessage.style.display = 'flex';
}

// 隐藏思考中消息
function hideThinkingMessage() {
  thinkingMessage.style.display = 'none';
}



// 添加默认聊天内容
const defaultChatMsgs = `hello,我是多啦A梦!快来和和我玩吧：

1.和我聊天，我会给你热情而有趣的回答！解答问题、聊天互动，让我们一起探索这个神奇的世界吧！
2.魔法瞬译、解解谜：点击翻译或解释按钮，我能帮你把文字翻译成其他语言，或解释一些超棒的词汇。让我们一起解开世界的谜题！
3.抓取网页文字的魔法手：选中网页上的文字，我会把它自动填入输入框。省去你的时间和劳动，让我们更快乐地互动吧！
摘要魔术秀：
4.我能帮你提取网页的要点，生成简洁的摘要。让我们快速捕捉信息的精华，一起掌握重点！
`;
addMessage(defaultChatMsgs);


let resultText = '';

function processStreamData(data) {
  const results = data.trim().split('\n');
  results.forEach((result) => {
    if (result.substr(6) == '[DONE]') {
      console.log('数据传输结束');
      firstStageReply = false;
      replyComplete   = true;
      // 进行数据传输结束后的逻辑处理
    } else {
      try {
        const resultObj = JSON.parse(result.substr(6));
        const reply = resultObj.choices[0]?.delta?.content;
        if (reply) {
          resultText += reply;
          console.log(resultText);
          // 在页面中展示回复消息
          addReplyMessage(reply);
        } 
      } catch (error) {
        console.log(`当前数据：----${result.substr(6)}----`);
        console.error("解析数据时出错:", error);
      }
    }
  });
}

function requestGptStream(message) {
  firstStageReply = true;
  replyComplete   = false;
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer xx",
      "Accept": "text/event-stream",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": message}],
      "stream": true
    })
  })
  .then(response => {
    const stream = response.body;
    const reader = stream.getReader();
    let buffer = '';
    
    function read() {
      reader.read().then(({ done, value }) => {
        if (value) {
          const text = new TextDecoder("utf-8").decode(value);
          buffer += text;
          const results = buffer.split('\n\n');
          buffer = results.pop();
          results.forEach((result) => {
            processStreamData(result);
          });
        }
        if (!done) {
          read();
        }
      });
    }
    read();
  });
}

// 示例用法
// const userInput = "世界上有多少人";
// showUserMessage(userInput);
//requestGptStream(userInput);


