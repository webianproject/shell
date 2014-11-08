/**
 * Browser Window.
 * 
 * A Browser Window contains a collection of Browser Tabs.
 */

/**
 * Browser Window Constructor.
 */
var BrowserWindow = function(id) {
  if (id === undefined) {
    return;
  }
  this.container = document.getElementById('windows');
  this.id = id;
  this.render();
  this.tabCount = 0;
  this.tabs = [];
  this.tabPanels = [];
  this.tabs.push(new BrowserTab(this.tabCount, this.id));
  this.tabPanels.push(new BrowserTabPanel(this.tabCount++, this.id));
  return this;
};

/** 
 * Window View.
 */
BrowserWindow.prototype.view = function() {
  return '<div id="window' + this.id + '"class="browser-window">' +
    '<div class="tab-box">' +
      '<div id="tabs' + this.id + '" class="tabs">' +
      '</div>' +
      '<div id="tab-panels' + this.id + '"class="tab-panels">' +
      '</div>' +
    '</div>' +
  '</div>';
};

/**
 * Render the window.
 */
BrowserWindow.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window' + this.id);
};

/**
 * Show the Window.
 */
BrowserWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
BrowserWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
};
