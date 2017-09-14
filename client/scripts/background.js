'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
 console.log('previousVersion', details.previousVersion);
});

//listen click of extension icon
chrome.browserAction.onClicked.addListener(function(tab) {
console.log('aaaaa');
  //change body style of mother page
  //chrome.tabs.sendMessage(tab.id, {type: "change-css-style"});
  //check user loginization
  //chrome.tabs.sendMessage(tab.id, {type: "check-loginization"});
});

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
    }
  });
});