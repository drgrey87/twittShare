'use strict';

const port = chrome.runtime.connect({name: "conversation"});

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener("selectionchange", debounce(show_twitter_button, 1000));
  document.addEventListener("click", hide_twitter_button);

  document.getElementsByTagName('html')[0].classList.add('tweet-share-extension-installed-in-this-browser');
  const button = document.createElement("span");
  const iconUrl = chrome.extension.getURL("images/new.png");
  button.classList.add('tooltip');
  button.innerHTML = `<span class="twitter-share-button tooltiptext" data-show-count="false"><img src=${iconUrl}></span>`;
  document.body.appendChild(button);
});

function set_data(key, value) {
  localStorage.setItem(key, value);
}

function get_data(string) {
  return JSON.parse(localStorage.getItem(string));
}

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
  let tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
  }
}

function show_twitter_button() {
  let text = getSelectionText();
  if (text && get_data('is_enable')) {
    let range = window.getSelection().getRangeAt(0),
      rect = range.getBoundingClientRect(),
      button = document.querySelector('.twitter-share-button'),
      tooltip = document.querySelector('.tooltip'),
      shareUrl = 'https://twitter.com/intent/tweet?text=' + text;
    tooltip.style.left = `${window.pageXOffset + (rect.left + (rect.width / 2)) - (button.style.width / 2)}px`;
    tooltip.style.top = `${window.pageYOffset + rect.top - button.style.height - 10}px`;
    tooltip.classList.add('show');

    button.addEventListener('click', (e) => {
      e.preventDefault();
      port.postMessage({type: "create-window", url: shareUrl});
      tooltip.classList.remove('show');
    });
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "get_enabling":
      sendResponse(get_data('is_enable'));
      break;
    case "post_enabling":
      set_data('is_enable', msg.enable);
      break;
  }
});