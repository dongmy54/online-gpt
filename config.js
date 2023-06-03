document.addEventListener('DOMContentLoaded', function() {
  // Get the API key from storage
  chrome.storage.local.get('OPENAI_API_KEY', function(result) {
    const apiKey = result.OPENAI_API_KEY;

    // Check if API key exists
    if (apiKey) {
      // Set the API key in the input field
      const apiKeyInput = document.getElementById('api-key');
      apiKeyInput.value = apiKey;
    }
  });

  // Handle the form submission
  const form = document.getElementById('config-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the API key from the input field
    const apiKeyInput = document.getElementById('api-key');
    const apiKey = apiKeyInput.value;

    // Save the API key to storage
    chrome.storage.local.set({ 'OPENAI_API_KEY': apiKey }, function() {
      // 保存成功后显示保存成功的消息
      const saveSuccessMessage = document.getElementById('save-success-message');
      saveSuccessMessage.style.display = 'block';


      // 延迟一段时间后隐藏保存成功的消息
      setTimeout(function() {
        saveSuccessMessage.style.display = 'none';
      }, 2000);
    });
  });
});


