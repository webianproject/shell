/**
 * Browser Window.
 *
 * A Browser Window contains a collection of Browser Tabs.
 */

/**
 * Browser Window Constructor.
 *
 * @extends BaseWindow.
 * @param {number} id Window ID to give browser window.
 * @param {string} url URL to navigate to.
 */
var BrowserWindow = function(id, url) {
  BaseWindow.call(this, id);
  this.tabCount = 0; // Total number of tabs ever created in this window
  this.tabs = [];
  this.tabPanels = [];
  this.currentTab = null;
  this.createTab(url);
  return this;
};

BrowserWindow.prototype = Object.create(BaseWindow.prototype);

/**
 * Window View.
 */
BrowserWindow.prototype.view = function() {
  return '<div id="window' + this.id + '"class="browser-window">' +
    '<div class="tab-box">' +
      '<div id="tabs' + this.id + '" class="tabs">' +
        '<button id="new-tab-button' + this.id + '" class="new-tab-button">' +
      '</div>' +
      '<div id="tab-panels' + this.id + '"class="tab-panels">' +
      '</div>' +
    '</div>' +
    '<button type="button" id="close-window-button' + this.id + '" ' +
      'class="close-window-button">' +
  '</div>';
};

/**
 * Render the window.
 */
BrowserWindow.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window' + this.id);
  this.closeButton = document.getElementById('close-window-button' + this.id);
  this.closeButton.addEventListener('click', this.close.bind(this));
  this.tabsElement = document.getElementById('tabs' + this.id);
  this.tabsElement.addEventListener('click', this.handleTabClick.bind(this));
  this.element.addEventListener('mozbrowseropenwindow',
    this.handleOpenWindow.bind(this));
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

/**
 * Create a new Browser Tab.
 *
 * @param {string} url URL to navigate to.
 * @return {number} ID of new Tab.
 */
BrowserWindow.prototype.createTab = function(url) {
  var tabId = this.tabCount;
  this.tabs[tabId] = new BrowserTab(tabId, this.id, url);
  this.tabCount++;
  this.switchTab(tabId);
  return tabId;
};

/**
 * Switch Browser Tab.
 *
 * @param {number} id ID of tab to switch to.
 */
BrowserWindow.prototype.switchTab = function(id) {
  if (this.tabs[this.currentTab]) {
    this.tabs[this.currentTab].deselect();
  }
  this.tabs[id].select();
  this.currentTab = id;
};

/**
 * Handle click on tabs element.
 *
 * @param {Event} e Click event.
 */
BrowserWindow.prototype.handleTabClick = function(e) {
  if (e.target.classList.contains('tab-favicon')) {
    if (e.target.parentNode.dataset.tabId == this.currentTab) {
      // If current tab, show site info menu
      this.showSiteInfo(e.target);
    } else {
      // Otherwise, switch to that tab
      this.switchTab(e.target.parentNode.dataset.tabId);
    }
  } else if (e.target.classList.contains('tab-title')) {
    this.switchTab(e.target.parentNode.dataset.tabId);
  } else if (e.target.classList.contains('close-tab-button')) {
    this.closeTab(e.target.parentNode.dataset.tabId);
  } else if (e.target.classList.contains('new-tab-button')) {
    this.createTab();
  }
};

/**
 * Show site info.
 * 
 * Show a site information window for the current website.
 * 
 * @param Element target The img element of the clicked favicon.
 */
BrowserWindow.prototype.showSiteInfo = function(target) {
  // Get position of favicon to position menu relative to
  var rect = target.getBoundingClientRect();
  var x = rect.left;
  var y = rect.bottom;
  var tabId = target.parentNode.dataset.tabId;
  // Get page metadata to populate site info
  var title = this.tabs[tabId].getTitle();
  var faviconUrl = this.tabs[tabId].getFaviconUrl();
  // Generate site info menu
  var siteInfoMenu = new SiteInfoMenu(this.element, x, y, title, faviconUrl);
};

/**
 * Close Browser Tab.
 *
 * @param {number} tabId tabId of BrowserTab.
 */
BrowserWindow.prototype.closeTab = function(tabId) {
  this.tabs[tabId].destroy();
  delete this.tabs[tabId];
  var tabIds = Object.keys(this.tabs);
  if (this.currentTab != tabId)
    return;
  if (tabIds.length > 0) {
    this.switchTab(tabIds[tabIds.length-1]);
  } else {
    this.close();
  }
};

/**
 * Open a new tab.
 *
 * @param {Event} e Open window event.
 * @override
 */
BrowserWindow.prototype.handleOpenWindow = function(e) {
  e.preventDefault();
  this.createTab(e.url);
};
