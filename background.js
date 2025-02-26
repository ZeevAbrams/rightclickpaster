// includes the code that actually pastes the code via the chrome menu bar (right click)

let urls = {
    linkedin: "",
    personal: "",
    github: ""
  };
  
  // Load saved URLs
  chrome.storage.sync.get(['urls'], function(result) {
    if (result.urls) {
      urls = result.urls;
      setupContextMenu();
    }
  });
  
  // Listen for changes to the URLs
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.urls) {
      urls = changes.urls.newValue;
      setupContextMenu();
    }
  });
  
  function setupContextMenu() {
    // Remove existing menu items to avoid duplicates
    chrome.contextMenus.removeAll(function() {
      // Create parent context menu
      chrome.contextMenus.create({
        id: "pasteUrlsParent",
        title: "Paste URL",
        contexts: ["editable"]
      });
      
      // Create submenu items for each URL type if they exist
      if (urls.linkedin) {
        chrome.contextMenus.create({
          id: "pasteLinkedInUrl",
          parentId: "pasteUrlsParent",
          title: "LinkedIn",
          contexts: ["editable"]
        });
      }
      
      if (urls.personal) {
        chrome.contextMenus.create({
          id: "pastePersonalUrl",
          parentId: "pasteUrlsParent",
          title: "Personal Website",
          contexts: ["editable"]
        });
      }
      
      if (urls.github) {
        chrome.contextMenus.create({
          id: "pasteGithubUrl",
          parentId: "pasteUrlsParent",
          title: "GitHub",
          contexts: ["editable"]
        });
      }
    });
  }
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    let urlToPaste = "";
    
    if (info.menuItemId === "pasteLinkedInUrl") {
      urlToPaste = urls.linkedin;
    } else if (info.menuItemId === "pastePersonalUrl") {
      urlToPaste = urls.personal;
    } else if (info.menuItemId === "pasteGithubUrl") {
      urlToPaste = urls.github;
    }
    
    if (urlToPaste) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: pasteUrl,
        args: [urlToPaste]
      });
    }
  });
  
  // Content script function to paste the URL
  function pasteUrl(url) {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
      if (activeElement.isContentEditable) {
        // For contentEditable elements
        document.execCommand('insertText', false, url);
      } else {
        // For input and textarea elements
        const startPos = activeElement.selectionStart;
        const endPos = activeElement.selectionEnd;
        const beforeText = activeElement.value.substring(0, startPos);
        const afterText = activeElement.value.substring(endPos);
        activeElement.value = beforeText + url + afterText;
        
        // Trigger input event for forms that use event listeners
        const event = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(event);
        
        // Set cursor position after the pasted text
        activeElement.selectionStart = activeElement.selectionEnd = startPos + url.length;
      }
    }
  }