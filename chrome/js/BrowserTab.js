/**
 * Browser Tab.
 *
 * A Browser Tab includes a tab with a title and close button as well as a
 * tab panel which includes the webview which displays web content.
 */

/**
 * Browser Tab Constructor.
 *
 * @param {number} tabId ID to give to new tab.
 * @param {number} windowId ID of window to add tab to.
 * @param {string} url URL to navigate
 */
var BrowserTab = function(tabId, windowId, url) {
  this.NEW_TAB_URL = 'file://' + __dirname + '/newtab/newtab.html';
  this.ABOUT_BLANK_URL = 'about:blank';

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
       this.windowId + '-' + this.id + '" class="browser-tab-frame">' +
    '</div>';
};

/**
 * Render the tab.
 */
BrowserTab.prototype.renderTab = function() {
  this.newTabButton.insertAdjacentHTML('beforebegin', this.tabView());
  this.tabElement = document.getElementById('tab-' +
    this.windowId + '-' + this.id);
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
      this.handleLocationChange.bind(this));
    this.frame.addEventListener('did-start-loading',
      this.handleLoadStart.bind(this));
    this.frame.addEventListener('did-stop-loading',
      this.handleLoadStop.bind(this));
    this.urlBarButton.addEventListener('click',
      this.handleUrlBarButtonClick.bind(this));
    this.backButton.addEventListener('click',
      this.handleBackClick.bind(this));
    this.forwardButton.addEventListener('click',
      this.handleForwardClick.bind(this));
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
