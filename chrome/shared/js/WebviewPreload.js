/**
 * Webview Preload.
 *
 * This script is injected into web pages loaded in a <webview> and executed
 * before any other scripts in the page in order to gather information needed
 * by browser chrome.
 */
const ipcRenderer = require('electron').ipcRenderer;

var checkForManifest = function() {
  // Inform browser chrome if link to web app manifest detected and send the
  // values of its href and crossOrigin attributes.
  var manifestLink = document.querySelector('link[rel="manifest"]');
  if (manifestLink) {
    ipcRenderer.sendToHost(
      'manifestdetected',
      manifestLink.href,
      manifestLink.crossOrigin
    );
  }
}

var preload = function() {
  checkForManifest();
};

document.addEventListener('DOMContentLoaded', preload);
