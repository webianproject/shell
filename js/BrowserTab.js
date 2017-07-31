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
  this.NEW_TAB_URL = 'chrome://app/content/newtab/newtab.html';
  this.ABOUT_BLANK_URL = 'about:blank';
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
    '" class="browser-tab-panel"><menu class="browser-toolbar">' +
    '<form class="url-bar"><input type="text" class="url-bar-input">' +
    '<button class="url-bar-button" type="submit"/></form></menu>' +
    '<iframe src="' + this.currentUrl + '" id="browser-tab-frame' +
    this.windowId + '-' + this.id + '" class="browser-tab-frame" mozbrowser ' +
    ' remote></div>';
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
  this.urlBar = this.tabPanelElement.getElementsByClassName('url-bar')[0];
  this.urlBarInput = this.tabPanelElement.getElementsByClassName(
    'url-bar-input')[0];
  this.urlBarButton = this.tabPanelElement.getElementsByClassName(
    'url-bar-button')[0];
  this.urlBar.addEventListener('submit', this.handleSubmit.bind(this));
  this.frame.addEventListener('mozbrowsertitlechange',
    this.handleTitleChange.bind(this));
  this.frame.addEventListener('mozbrowserlocationchange',
      this.handleLocationChange.bind(this));
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
 * Handle URL bar submit.
 */
BrowserTab.prototype.handleSubmit = function(e) {
  // stop form submission reloading top level document
  e.preventDefault();
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
 * Handle a change in document title.
 *
 * @param Event e mozbrowsertitlechange event.
 */
BrowserTab.prototype.handleTitleChange = function(e) {
  this.tabTitle.textContent = e.detail;
};

/**
 * Handle a change in document location.
 *
 * @param Event e mozbrowserlocationchange event.
 */
BrowserTab.prototype.handleLocationChange = function(e) {
  if (e.detail.url == this.NEW_TAB_URL) {
    this.urlBarInput.value = '';
    this.urlBarInput.focus();
  } else {
    this.urlBarInput.value = e.detail.url;
  }
  this.currentUrl = e.detail.url;
};
