// config.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('config-form');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取用户输入的 API 密钥
    const apiKey = document.getElementById('api-key').value;

    // 将 API 密钥保存到本地存储
    chrome.storage.local.set({ 'OPENAI_API_KEY': apiKey }, function() {
      console.log('API key saved.');
    });
  });
});

