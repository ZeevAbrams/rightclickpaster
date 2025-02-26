// This is the code that lets you update your URLs/text by clicking on the extension on the browser bar and pressing Save

document.addEventListener('DOMContentLoaded', function() {
    // Load saved URLs
    chrome.storage.sync.get(['urls'], function(result) {
      if (result.urls) {
        document.getElementById('linkedin-url').value = result.urls.linkedin || '';
        document.getElementById('personal-url').value = result.urls.personal || '';
        document.getElementById('github-url').value = result.urls.github || '';
      }
    });
  
    // Save URLs when button is clicked
    document.getElementById('save-button').addEventListener('click', function() {
      const linkedinUrl = document.getElementById('linkedin-url').value.trim();
      const personalUrl = document.getElementById('personal-url').value.trim();
      const githubUrl = document.getElementById('github-url').value.trim();
      
      const urls = {
        linkedin: linkedinUrl,
        personal: personalUrl,
        github: githubUrl
      };
      
      chrome.storage.sync.set({urls: urls}, function() {
        const status = document.getElementById('status');
        status.textContent = 'URLs saved!';
        
        setTimeout(function() {
          status.textContent = '';
        }, 2000);
      });
    });
  });
  