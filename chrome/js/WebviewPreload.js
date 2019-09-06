/**
 * Webview Preload.
 *
 * This script is injected into web pages loaded in a <webview> and executed
 * before any other scripts in the page in order to gather information needed
 * by browser chrome.
 */
const ipcRenderer = require('electron').ipcRenderer;

var preload = function() {
  // Inform browser chrome if link to web app manifest detected
  var manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    ipcRenderer.sendToHost('manifestdetected', manifestLink.href);
  }
};

document.addEventListener('DOMContentLoaded', preload);
