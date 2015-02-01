/**
 * Browser Tab Panel.
 * 
 * A tab panel contains the browser chrome and webview of a browser tab.
 */

/**
 * Browser Tab Panel Constructor.
 *
 * @param Integer tabId ID to give to new tab panel.
 * @param Integer windowId ID of window to add tab panel to.
 */
var BrowserTabPanel = function(tabId, windowId) {
  if (tabId === undefined || windowId === undefined) {
    return;
  }
  this.container = document.getElementById('tab-panels' + windowId);
  this.id = tabId;
  this.windowId = windowId;
  this.render();
  return this;
};

/** 
 * Browser Tab Panel View.
 */
BrowserTabPanel.prototype.view = function() {
  return '<div id="tab-panel' + this.windowId + '-' + this.id +
    '"class="browser-tab-panel"></div>';
};

/**
 * Render the Tab Panel.
 */
BrowserTabPanel.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('tab-panel' + this.windowId + '-' + this.id);
};

/**
 * Delete the Browser Tab Panel from the DOM.
 */
BrowserTabPanel.prototype.destroy = function() {
  this.container.removeChild(this.element);   
}
