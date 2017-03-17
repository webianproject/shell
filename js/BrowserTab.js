/**
 * Browser Tab.
 *
 * A Browser Tab includes a tab with a title and close button as well as a
 * tab panel which includes the webview which displays web content.
 */

/**
 * Browser Tab Constructor.
 *
 * @param Integer tabId ID to give to new tab.
 * @param Integer windowId ID of window to add tab to.
 */
var BrowserTab = function(tabId, windowId) {
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
    '" class="browser-tab-panel"><iframe src="http://duckduckgo.com" ' +
    'id="browser-tab-frame' + this.windowId + '-' + this.id +
    '" class="browser-tab-frame" mozbrowser remote></div>';
};

/**
 * Render the tab.
 */
BrowserTab.prototype.renderTab = function() {
  this.newTabButton.insertAdjacentHTML('beforebegin', this.tabView());
  this.tabElement = document.getElementById('tab-' +
    this.windowId + '-' + this.id);
  this.tabTitleElement = this.tabElement.getElementsByClassName('tab-title')[0];
};

/**
 * Render the Tab Panel.
 */
BrowserTab.prototype.renderTabPanel = function() {
  this.tabPanelContainer.insertAdjacentHTML('beforeend', this.tabPanelView());
  this.tabPanelElement = document.getElementById('tab-panel' + this.windowId + '-' +
    this.id);
  this.frame = document.getElementById('browser-tab-frame' + this.windowId +
    '-' + this.id);
  this.frame.addEventListener('mozbrowsertitlechange',
    this.handleTitleChange.bind(this));
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
 * Handle a change in document title.
 *
 * @param Event e mozbrowsertitlechange event.
 */
BrowserTab.prototype.handleTitleChange = function(e) {
  this.tabTitleElement.textContent = e.detail;
};
