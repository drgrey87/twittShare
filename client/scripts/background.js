'use strict';

chrome.storage.sync.set({is_enable: true});

//listen events from content script
chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener((msg, sendingPort) => {
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
          top: Math.round((screen.availHeight - height) / 2),
          tabId: sendingPort.sender.tab.id
        });
        break;

      case "set_on":
        chrome.browserAction.setIcon({
          path: {
            "16": "images/16.png",
            "48": "images/48.png",
            "128": "images/128.png"
          }
        });
        break;

      case "set_of":
        chrome.browserAction.setIcon({
          path: {
            "16": "images/16_of.png",
            "48": "images/48_of.png",
            "128": "images/128_of.png",
          }
        });
        break;
    }
  });
});