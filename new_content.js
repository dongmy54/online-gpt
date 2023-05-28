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



