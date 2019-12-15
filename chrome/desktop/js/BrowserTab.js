/**
 * Browser Tab.
 *
 * A Browser Tab includes a tab with a title and close button as well as a
 * tab panel which includes the webview which displays web content.
 */

 const path = require('path');

/**
 * Browser Tab Constructor.
 *
 * @param {number} tabId ID to give to new tab.
 * @param {number} windowId ID of window to add tab to.
 * @param {string} url URL to navigate
 */
var BrowserTab = function(tabId, windowId, url) {
  this.NEW_TAB_URL = 'file://' + path.join(__dirname, '/../newtab/newtab.html');
  this.ABOUT_BLANK_URL = 'about:blank';
  this.FAVICON_PLACEHOLDER = 'images/favicon-placeholder.png';
  this.PRELOAD_SCRIPT = 'file://' +
    path.join(__dirname, '/../shared/js/WebviewPreload.js');

  // Url bar button modes
  this.GO = 0;
  this.STOP = 1;
  this.RELOAD = 2;
  this.urlBarButtonMode = this.GO;

  this.loading = false;
  this.urlBarFocused = false;

  if (url && url.length > 0 && url != this.ABOUT_BLANK_URL) {
    this.currentUrl = url;
  } else {
    this.currentUrl = this.NEW_TAB_URL;
  }
  if (tabId === undefined || windowId === undefined) {
    return;
  }

  // URL and crossOrigin attribute of web app manifest linked from current page
  this.manifestUrl = null;
  this.manifestCrossOrigin = null;

  this.id = tabId;
  this.windowId = windowId;
  this.tabContainer = document.getElementById('tabs' + windowId);
  this.tabPanelContainer  = document.getElementById('tab-panels' + windowId);
  this.newTabButton = document.getElementById('new-tab-button' + windowId);
  this.renderTab();
  this.renderTabPanel();
  return this;
};

/**
 * Browser Tab View.
 */
BrowserTab.prototype.tabView = function() {
  return '<div id="tab-' + this.windowId + '-' + this.id +
    '" class="browser-tab" data-tab-id="'+ this.id + '">' +
      '<img class="tab-favicon" src="images/favicon-placeholder.png"></img>' +
      '<span class="tab-title"></span>' +
      '<button type="button" id="close-tab-button' + this.windowId +
        '-' + this.id + '" class="close-tab-button">' +
    '</div>';
};

/**
 * Browser Tab Panel View.
 */
BrowserTab.prototype.tabPanelView = function() {
  return '<div id="tab-panel' + this.windowId + '-' + this.id +
    '" class="browser-tab-panel">' +
    '  <menu class="browser-toolbar">' +
    '    <button class="back-button" disabled></button>' +
    '    <button class="forward-button" disabled></button>' +
    '    <form class="url-bar">' +
    '      <input type="text" class="url-bar-input">' +
    '      <button class="url-bar-button" type="button" />' +
    '    </form>' +
    '  </menu>' +
    '  <webview src="' + this.currentUrl + '" id="browser-tab-frame' +
       this.windowId + '-' + this.id + '" class="browser-tab-frame" ' +
       'preload="' + this.PRELOAD_SCRIPT + '">' +
    '</div>';
};

/**
 * Render the tab.
 */
BrowserTab.prototype.renderTab = function() {
  this.newTabButton.insertAdjacentHTML('beforebegin', this.tabView());
  this.tabElement = document.getElementById('tab-' +
    this.windowId + '-' + this.id);
  this.favicon = this.tabElement.getElementsByClassName('tab-favicon')[0];
  this.tabTitle = this.tabElement.getElementsByClassName('tab-title')[0];
};

/**
 * Render the Tab Panel.
 */
BrowserTab.prototype.renderTabPanel = function() {
  this.tabPanelContainer.insertAdjacentHTML('beforeend', this.tabPanelView());
  this.tabPanelElement = document.getElementById('tab-panel' + this.windowId +
    '-' + this.id);
  this.frame = document.getElementById('browser-tab-frame' + this.windowId +
    '-' + this.id);
  this.backButton = this.tabPanelElement.getElementsByClassName(
    'back-button')[0];
  this.forwardButton = this.tabPanelElement.getElementsByClassName(
    'forward-button')[0];
  this.urlBar = this.tabPanelElement.getElementsByClassName('url-bar')[0];
  this.urlBarInput = this.tabPanelElement.getElementsByClassName(
    'url-bar-input')[0];
  this.urlBarButton = this.tabPanelElement.getElementsByClassName(
    'url-bar-button')[0];
  this.urlBar.addEventListener('submit', this.handleSubmit.bind(this));
  this.urlBarInput.addEventListener('focus', this.handleUrlBarFocus.bind(this));
  this.urlBarInput.addEventListener('blur', this.handleUrlBarBlur.bind(this));
  this.frame.addEventListener('page-title-updated',
    this.handleTitleChange.bind(this));
    this.frame.addEventListener('did-navigate',
      this.handleLocationChange.bind(this));
    this.frame.addEventListener('did-navigate-in-page',
      this.handleInPageLocationChange.bind(this));
    this.frame.addEventListener('did-start-loading',
      this.handleLoadStart.bind(this));
    this.frame.addEventListener('did-stop-loading',
      this.handleLoadStop.bind(this));
    this.frame.addEventListener('page-favicon-updated',
      this.handleFaviconUpdate.bind(this));
    this.frame.addEventListener('ipc-message',
      this.handleIpcMessage.bind(this));
    this.urlBarButton.addEventListener('click',
      this.handleUrlBarButtonClick.bind(this));
    this.backButton.addEventListener('click',
      this.handleBackClick.bind(this));
    this.forwardButton.addEventListener('click',
      this.handleForwardClick.bind(this));
    // Uncomment the following line to open developer tools for the webview
    //this.frame.addEventListener('dom-ready',
    //  e => { this.frame.openDevTools(); });
};

/**
 * Delete the Browser Tab from the DOM.
 */
BrowserTab.prototype.destroy = function() {
  this.tabContainer.removeChild(this.tabElement);
  this.tabPanelContainer.removeChild(this.tabPanelElement);
};

/**
 * Select this tab.
 */
BrowserTab.prototype.select = function() {
  this.tabElement.classList.add('selected');
  this.tabPanelElement.classList.add('selected');
};

/**
 * Deselect this tab.
 */
BrowserTab.prototype.deselect = function() {
  this.tabElement.classList.remove('selected');
  this.tabPanelElement.classList.remove('selected');
};

/**
 * Handle URL bar focus.
 */
BrowserTab.prototype.handleUrlBarFocus = function() {
  this.urlBarFocused = true;
  this.setUrlBarButtonMode(this.GO);
};

/**
 * Handle URL bar blur.
 */
BrowserTab.prototype.handleUrlBarBlur = function() {
  this.urlBarFocused = false;
  if (this.loading) {
    this.setUrlBarButtonMode(this.STOP);
  } else if (this.urlBarInput.value == this.currentUrl) {
    this.setUrlBarButtonMode(this.RELOAD);
  } else {
    this.setUrlBarButtonMode(this.GO);
  }
};

/**
 * Set URL bar button mode.
 *
 * @param {number} mode Mode to switch button to. One of:
 * this.GO (0)
 * this.STOP (1)
 * this.RELOAD (2)
 */
BrowserTab.prototype.setUrlBarButtonMode = function(mode) {
  this.urlBarButtonMode = mode;
  this.urlBarButton.dataset.mode = mode;
};

/**
 * Handle URL bar submit.
 *
 * @param {Event} e Submit event.
 */
BrowserTab.prototype.handleSubmit = function(e) {
  // stop form submission reloading top level document
  if (e) {
    e.preventDefault();
  }
  var url = this.urlBarInput.value;
  // Check for valid URL
  try {
    url = new URL(url).href;
  }
  catch (e) {
    // Otherwise try prepending http://
    try {
      url = new URL('http://' + url).href;
    }
    catch (e) {
      // Otherwise invalid URL, don't navigate
      return;
    }
  }
  this.frame.src = url;
  this.urlBarInput.blur();
};

/**
 * Handle click on URL bar button.
 *
 * @param {Event} e Click event.
 */
BrowserTab.prototype.handleUrlBarButtonClick = function(e) {
  switch(this.urlBarButtonMode) {
    case this.GO:
      this.handleSubmit();
      break;
    case this.STOP:
      this.frame.stop();
      break;
    case this.RELOAD:
      this.frame.reload();
      break;
  }
};

/**
 * Handle start of page load.
 *
 * @param {Event} e did-start-loading event.
 */
BrowserTab.prototype.handleLoadStart = function(e) {
  this.loading = true;
  this.setUrlBarButtonMode(this.STOP);
};

/**
 * Handle page load stopping.
 *
 * @param {Event} e did-stop-loading-event.
 */
BrowserTab.prototype.handleLoadStop = function(e) {
  this.loading = false;
  if (this.urlBarFocused) {
    this.setUrlBarButtonMode(this.GO);
  } else {
    this.setUrlBarButtonMode(this.RELOAD);
  }
};

/**
 * Handle a change in document title.
 *
 * @param Event e page-title-updated event.
 */
BrowserTab.prototype.handleTitleChange = function(e) {
  // No need to sanitize if only setting via textContent
  this.tabTitle.textContent = e.title;
};

/**
 * Handle a change in document location.
 *
 * @param Event e did-navigate event.
 */
BrowserTab.prototype.handleLocationChange = function(e) {
  var url = e.url;
  if (url == this.NEW_TAB_URL) {
    this.urlBarInput.value = '';
    this.urlBarInput.focus();
  } else {
    this.urlBarInput.value = url;
  }
  this.currentUrl = url;

  // Reset favicon
  this.favicon.src = this.FAVICON_PLACEHOLDER;

  // Reset manifest link
  this.manifestUrl = null;
  this.manifestCrossOrigin = null;

  this.updateBackForwardButtons();
};

/**
 * Handle a change in document location within a page.
 *
 * E.g. a hash change.
 *
 * @param Event e did-navigate-in-page event.
 */
BrowserTab.prototype.handleInPageLocationChange = function(e) {
    var url = e.url;
    this.currentUrl = url;
    this.urlBarInput.value = url;
    this.updateBackForwardButtons();
}

/**
 * Updates the state of back and forward buttons based on back/forward history.
 */
BrowserTab.prototype.updateBackForwardButtons = function() {
  // Enable/disable back button
  if (this.frame.canGoBack()) {
    this.backButton.disabled = false;
  } else {
    this.backButton.disabled = true;
  }

  // Enable/disable forward button
  if (this.frame.canGoForward()) {
    this.forwardButton.disabled = false;
  } else {
    this.forwardButton.disabled = true;
  }
}

/**
 * Handle a change in page favicon.
 *
 * @param Event e page-favicon-updated event.
 */
BrowserTab.prototype.handleFaviconUpdate = function(e) {
  // Sanitize just in case
  var faviconUrl = DOMPurify.sanitize(e.favicons[0]);
  // Check for valid URL
  try {
    var faviconUrl = new URL(faviconUrl).href;
  }
  catch (e) {
    return;
  }
  this.favicon.src = faviconUrl;
};

/**
 * Handle a message sent from the webview preload script.
 *
 * @param Event e ipc-message event.
 */
BrowserTab.prototype.handleIpcMessage = function(e) {
  // Detect links to web app manifests in current page
  if (e.channel == 'manifestdetected') {
    this.manifestUrl = e.args[0];
    this.manifestCrossOrigin = e.args[1];
  }
};

/**
 * Go back.
 */
BrowserTab.prototype.handleBackClick = function() {
  this.frame.goBack();
};

/**
 * Go forward.
 */
BrowserTab.prototype.handleForwardClick = function() {
  this.frame.goForward();
};

/**
 * Get title of current page.
 *
 * @return String Title of current page.
 */
 BrowserTab.prototype.getTitle = function() {
   return this.tabTitle.textContent;
 };

/**
 * Get favicon URL for current page.
 *
 *  @return String URL of favicon of current page.
 */
BrowserTab.prototype.getFaviconUrl = function() {
  return this.favicon.src;
};

/**
 * Get document URL.
 *
 *  @return String URL of currently loaded web page.
 */
BrowserTab.prototype.getDocumentUrl = function() {
  return this.currentUrl;
};

/**
 * Get web app manifest URL for current page.
 *
 *  @return String URL of web app manifest for current page.
 */
BrowserTab.prototype.getManifestUrl = function() {
  return this.manifestUrl;
};

/**
 * Fetch web app manifest for current page.
 *
 * Follows "steps for obtaining a manifest" in the W3C Web App Manifest spec
 * https://www.w3.org/TR/appmanifest/#obtaining
 *
 * @return Promise Promise which resolves with parsed web app manifest.
 */
BrowserTab.prototype.fetchManifest = function() {
  var pageUrl = this.currentUrl;
  var manifestUrl = this.manifestUrl;
  var credentialsMode = null;
  return new Promise((resolve, reject) => {
    // "Let origin be the Document's origin"
    var origin = new URL(pageUrl).origin;
    // "If origin is an opaque origin, terminate this algorithm."
    if (origin === null) {
      reject('Manifest linked from opaque origin');
    }
    // "If manifest link is null, terminate this algorithm.""
    if (!manifestUrl) {
      reject('No manifest URL');
    }
    // "If manifest link's href attribute's value is the empty string,
    // then abort these steps."
    if (manifestUrl == '') {
      reject('Manifest URL is an empty string');
    }
    // "Let manifest URL be the result of parsing the value of the href attribute,
    // relative to the element's base URL."
    try {
      var resolvedManifestUrl = new URL(manifestUrl, pageUrl).href;
    } catch(e) {
      // "If parsing fails, then abort these steps."
      reject('Parsing manifest URL resolved against page URL failed.');
    }

    // 'If the manifest link's crossOrigin attribute's value is
    // "use-credentials", then set request's credentials mode to "include".
    // Otherwise, set request's credentials mode to "omit"'.
    if (this.manifestCrossOrigin == 'use-credentials') {
      credentialsMode = 'include';
    } else {
      credentialsMode = 'omit';
    }
    // Note: The following code is executed in the browsing context of the page
    this.frame.executeJavaScript(`
        function fetchManifest() {
          return new Promise((resolve, reject) => {
            // "Let request be a new Request."
            // "Set request's URL to manifest URL."
            var request = new Request('${resolvedManifestUrl}');
            // "Set request's credentials mode..."
            request.credentials = '${credentialsMode}';
            // "Set request's mode is "cors"."
            request.mode = 'cors';
            // "Await the result of performing a fetch with request,
            // letting response be the result."
            fetch(request)
              .then(response => response.json())
              .then(json => {
                resolve(json);
              }).catch(e =>{
                reject(e);
              });
          });
        }
        fetchManifest();
      `
    ).then(
      (manifest) => {
        resolve(manifest);
      }
    ).catch(
      (reason) => {
        console.error('Error fetching manifest' + reason);
        reject(reason);
      }
    );
  });
};
