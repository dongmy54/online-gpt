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
const cleanButton = shadowRoot.getElementById("clean-button")

// 定义展开/收起聊天框的函数
function toggleChat() {
  chatContainer.classList.toggle('show');
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

// 目的是保证并发下字符不会乱掉
var isTyping = false;
var textQueue = [];

// 打字机效果
function typeWriterEffect(text, element) {
  textQueue.push({ text: text, element: element });
  // 首次进入打印 触发
  if (!isTyping) {
    isTyping = true;
    processNextText();
  }
}

// 处理字符输出
function processNextText() {
  // 队列还有内容或正在打印 一直循环执行
  if (textQueue.length > 0 || isTyping) {
    if (textQueue.length == 0){
      sleep(300).then(() => {
        processNextText();
      });
    } else {
      var { text, element } = textQueue.shift();
      var index = 0;

      function typeNextChar() {
        if (index < text.length) {
          element.innerHTML += text.charAt(index);
          // 动态调整滚动条
          chatMessages.scrollTop = chatMessages.scrollHeight;
          index++;
          requestAnimationFrame(typeNextChar);
        } else {
          processNextText();
        }
      }

      typeNextChar();
    }
  }
}

// 等待方法
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// 当前回复textElement
let currentReplayTextElement = null;  

// 初始化回复textElement
function iniReplayTextElement(){
  var messageContainer = document.createElement("div");
  messageContainer.classList.add("chat-message");
  messageContainer.classList.add("received");

  var avatarElement = document.createElement("div");
  avatarElement.classList.add("avatar");

  var textElement = document.createElement("span");
  textElement.classList.add("text");
  textElement.classList.add("cursor"); // 加光标闪烁效果

  var messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble");
  messageBubble.appendChild(textElement);

  messageContainer.appendChild(avatarElement);
  messageContainer.appendChild(messageBubble);
  chatMessages.appendChild(messageContainer);

  // 标记当前回复文本元素
  currentReplayTextElement = textElement;
  // 动态调整滚动条
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 用于添加gpt回复的消息
function addReplyMessage(text) {
  // 打字机效果
  typeWriterEffect(text, currentReplayTextElement);
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


// 最终结果输出
let resultText = '';

function processStreamData(data) {
  const results = data.trim().split('\n');
  results.forEach((result) => {
    if (result.substr(6) == '[DONE]') {
      endResponse();
      // 展示下最终结果
      var rawString = JSON.stringify(resultText);
      //console.log(rawString);
      resultText = "";
      // 进行数据传输结束后的逻辑处理
    } else {
      try {
        const resultObj = JSON.parse(result.substr(6));
        const reply = resultObj.choices[0]?.delta?.content;
        if (reply) {
          resultText += reply;
          // 在页面中展示回复消息
          addReplyMessage(reply);
        }
      } catch (error) {
        console.error("解析数据时出错:", error);
      }
    }
  });
}

// 禁用输入框
function disableInput() {
  messageInput.disabled = true;
}

// 启用输入框
function enableInput() {
  messageInput.disabled = false;
}

// 开始响应
function startResponse(){
  iniReplayTextElement();
  showThinkingMessage();
  disableInput();
}

// 结束响应
function endResponse(){
  currentReplayTextElement.classList.remove("cursor");
  hideThinkingMessage();
  enableInput();
  isTyping = false; // 结束打印
}


// 检查apiKey是否存在
function checkApiKey(){
  if (!apiKey){
    addReplyMessage("请先到插件选项中配置 OpenAI API 密钥");
    endResponse();
    return true;
  } else {
    return false;
  }
}


// gpt 请求
function requestGptStream(message) {
  startResponse();
  if (checkApiKey()){ // api key 缺失
    return;
  }

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
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
    if (!response.ok) {
      throw new Error("API request failed.");
    }
    
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
  })
  .catch(error => {
    console.error("Error:", error);
    const errorMessage = `发生了点错误. ${error}`;
    addReplyMessage(errorMessage);
    endResponse();
  })
}




// 功能按钮相关
// 获取按钮和输入框元素
const summaryButton = shadowRoot.getElementById('summaryButton');
const explainButton = shadowRoot.getElementById('explainButton');
const translateButton = shadowRoot.getElementById('translateButton');

// 定义消息模板
const summaryTemplate = '用中文简要概述下面内容,要求体现关键点,不超过100字: \n #{message}';
const explainTemplate = '用专业的方式解释下面的内容，专业词语单独列出解释\n: #{message}';
const translateTemplate = '翻译下面的内容为中文\n: #{message}';

// 监听按钮点击事件
summaryButton.addEventListener('click', sendButtonMessage);
explainButton.addEventListener('click', sendButtonMessage);
translateButton.addEventListener('click', sendButtonMessage);


// 发送消息函数
function sendButtonMessage(event) {
  // 阻止按钮的默认行为
  event.preventDefault();

  // 获取按钮类型和消息内容
  const buttonType = event.target.id;
  const messageContent = messageInput.value.trim();

  // 检查消息内容是否为空
  if (messageContent === '') {
    return;
  }

  // 根据按钮类型选择对应的消息模板
  let messageTemplate = '';
  switch (buttonType) {
    case 'summaryButton':
      messageTemplate = summaryTemplate;
      break;
    case 'explainButton':
      messageTemplate = explainTemplate;
      break;
    case 'translateButton':
      messageTemplate = translateTemplate;
      break;
    default:
      break;
  }

  // 生成消息
  const message = messageTemplate.replace('#{message}', messageContent);

  if (message !== "") {
    addMessage(messageContent, true); // 这里只给出消息框中的内容
    clearMessage();
    requestGptStream(message);
  }
}


let apiKey = null;
// 监听自定义事件 在shadow中是可以监听的
document.addEventListener('apiKeyUpdate', function(event) {
  // 获取传递的变量
  apiKey = event.detail
});


// 监听文本选择事件
document.addEventListener("mouseup", function() {
  var selectedText = window.getSelection().toString();

  // 检查输入框是否可用
  if (!messageInput.disabled && selectedText.length > 0) {
    messageInput.value = selectedText;
  }
});


// 添加聊天框输入框的键盘事件监听器
messageInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.shiftKey) {
    // 如果按下 shift + Enter，则插入一个换行符，而不提交内容。
    e.preventDefault();
    messageInput.value += "\n";
  } else if (e.key === "Enter") {
    // 如果只按下 Enter 键，则提交内容。
    e.preventDefault();
    sendMessage();
  }
});


// 清空事件
cleanButton.addEventListener('click', clearMessage);





// 添加鼠标按下事件监听器
chatContainer.addEventListener('mousedown', dragStart);

// 鼠标按下事件处理函数
function dragStart(event) {
  // 计算初始鼠标位置与聊天窗口位置之间的偏移量
  const offsetX = event.clientX - chatContainer.getBoundingClientRect().left;
  const offsetY = event.clientY - chatContainer.getBoundingClientRect().top;

  // 添加鼠标移动和释放事件监听器
  document.addEventListener('mousemove', dragElement);
  document.addEventListener('mouseup', dragEnd);

  // 阻止事件冒泡和默认行为
  event.stopPropagation();
  event.preventDefault();

  // 元素拖动的回调函数
  function dragElement(event) {
    const newX = event.clientX - offsetX;
    const newY = event.clientY - offsetY;
    chatContainer.style.setProperty('left', newX + 'px');
    chatContainer.style.setProperty('top', newY + 'px');
  }

  // 元素释放的回调函数
  function dragEnd() {
    // 移除鼠标移动和释放事件监听器
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', dragEnd);
  }
}
