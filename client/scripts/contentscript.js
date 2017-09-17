'use strict';

const port = chrome.runtime.connect({name: "conversation"});
let is_enable = true;
get_data('is_enable', (data) => {
  is_enable = data.is_enable;
});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener("selectionchange", debounce(show_twitter_button, 1000));
  document.addEventListener("click", hide_twitter_button);

  document.getElementsByTagName('html')[0].classList.add('tweet-share-extension-installed-in-this-browser');
  const tooltip = document.createElement("span");
  const iconUrl = chrome.extension.getURL("images/icon_btn.svg");
  tooltip.classList.add('twitter-share-tooltip');
  tooltip.innerHTML = `<span class="twitter-share-tooltip-text" data-show-count="false"><img class="twitter-share-tooltip-text__btn" src=${iconUrl}></span>`;
  document.body.appendChild(tooltip);

  let button = document.querySelector('.twitter-share-tooltip-text__btn');

  button.addEventListener('click', (e) => {
    let text = getSelectionText(),
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    port.postMessage({type: "create-window", url: shareUrl});
    hide_twitter_button();
  });
});

function set_data(data, callback) {
  chrome.storage.sync.set(data, () => {
    is_enable = data.is_enable;
    if (callback) callback();
  });
}

function get_data(string, callback) {
  chrome.storage.sync.get(string, callback);
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (let key in changes) {
    if (key === 'is_enable') {
      let storageChange = changes[key];
      return is_enable = storageChange.newValue;
    }
  }
});

function getSelectionText() {
  let text = "",
    activeEl = document.activeElement,
    activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    (activeElTagName == "textarea") || (activeElTagName == "input" &&
    /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
    (typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }

  return text;
}


function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait)
  };
}

function hide_twitter_button() {
  let tooltip = document.querySelector('.twitter-share-tooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
  }
}

function show_twitter_button() {
  let text = getSelectionText();
  if (text && is_enable) {
    let range = window.getSelection().getRangeAt(0),
      rect = range.getBoundingClientRect(),
      twitter_share = document.querySelector('.twitter-share-tooltip-text'),
      tooltip = document.querySelector('.twitter-share-tooltip');
    tooltip.style.left = `${window.pageXOffset + (rect.left + (rect.width / 2)) - (twitter_share.style.width / 2)}px`;
    tooltip.style.top = `${window.pageYOffset + rect.top - twitter_share.style.height - 10}px`;
    tooltip.classList.add('show');
  }
}

//from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "get_enabling":
      sendResponse(is_enable);
      break;
    case "post_enabling":
      set_data({is_enable: msg.enable}, () => {
        port.postMessage({type: is_enable ? 'set_on' : 'set_of'});
      });
      break;
  }
});