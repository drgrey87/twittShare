'use strict';

//listen events from content script
chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    switch (msg.type) {
      case "create-window":
        var width = 300;
        var height = 300;

        chrome.windows.create({
          url: msg.url,
          type: "popup",
          width: width,
          height: height,
          left: Math.round((screen.availWidth - width) / 2),
          top: Math.round((screen.availHeight - height) / 2)
          //"focused": true
        });
        break;

      case "enabling":
        chrome.tabs.sendMessage({type: "check-loginization"});
        break;
    }
  });
});