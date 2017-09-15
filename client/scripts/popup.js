'use strict';

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    sendMessage(tabs[0].id, {type: 'get_enabling'}, is_enable => {
      let on = document.getElementById('on'),
        of = document.getElementById('of');

      on.checked = is_enable;
      of.checked = !is_enable;

      on.addEventListener('click', (e) => {
        of.checked = false;
        sendMessage(tabs[0].id, {type: "post_enabling", enable: on.checked});
      });

      of.addEventListener('click', (e) => {
        on.checked = false;
        sendMessage(tabs[0].id, {type: "post_enabling", enable: on.checked});
      });
    });
  });
});

function sendMessage(tab_id, data, callback) {
  chrome.tabs.sendMessage(tab_id, data, callback);
}