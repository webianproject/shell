/**
 * Window Manager.
 *
 * Manages app windows.
 */

var WindowManager = {

  /**
   * The collection of App Windows.
   */
  windows: [],

  /**
   * The collection of App Window Buttons used to select an App Window.
   */
  windowSelectors: [],

  /**
   * The number of windows opened in this session.
   */
  windowCount: 0,

  /**
   * The ID of the currently displayed window.
   */
  currentWindow: null,

  /**
   * Types of window that can be created.
   */
  WINDOW_TYPES: {
    'home': 0,
    'browser' : 1,
    'standalone': 2,
  },

  /**
   * The window ID to designate as the home window.
   */
  HOME_WINDOW_ID: 0,

  /**
   * Start the Window Manager.
   *
   * @return {Object} The WindowManager object.
   */
  start: function() {
    window.addEventListener('_openwindow',
      this.handleOpenWindow.bind(this));
    window.addEventListener('_switchwindow',
      this.handleSwitchWindow.bind(this));
    window.addEventListener('_closewindow',
      this.handleCloseWindow.bind(this));
    this.createWindow(this.WINDOW_TYPES.home);
    return this;
  },

  /**
   * Handle _openwindow event.
   *
   * @param {Event} e _openwindow event.
   */
  handleOpenWindow: function(e) {
    // Check for a site ID in the features property
    if(e.detail && e.detail.features) {
      var siteId = null;
      var features = e.detail.features.split(',');
      features.forEach(function(feature) {
        if (feature.startsWith('siteId=')) {
          siteId = feature.substr(7);
        }
      });
    }
    // If there's a siteId then generate window from Site in Places
    if (siteId) {
      Places.getSite(siteId).then((function(siteObject) {
        // Use window type from siteObject or fall back to browser window
        this.createWindow(this.WINDOW_TYPES[siteObject.display] ||
          this.WINDOW_TYPES['browser'], e.detail.url, siteObject);
      }).bind(this)).catch((function(e) {
        console.error('Failed to get site object to open window ' + e);
        this.createWindow(this.WINDOW_TYPES.browser, e.detail.url);
      }).bind(this));
    // Otherwise create a generic browser window
    } else if (e.detail && e.detail.url) {
      this.createWindow(this.WINDOW_TYPES.browser, e.detail.url);
    } else {
      this.createWindow(this.WINDOW_TYPES.browser);
    }
  },

  /**
   * Handle a request to switch windows.
   *
   * @param {Event} e _switchwindow event.
   */
  handleSwitchWindow: function(e) {
    var id = e.detail.id;
    this.switchWindow(id);
  },

  /**
   * Handle _closewindow event.
   *
   * @param {Event} e _closewindow event.
   */
  handleCloseWindow: function(e) {
    if (!e.detail || e.detail.id === undefined) {
      return;
    }
    this.windows[e.detail.id].destroy();
    delete this.windows[e.detail.id];
    this.windowSelectors[e.detail.id].destroy();
    delete this.windowSelectors[e.detail.id];
    this.currentWindow = null;
    var windowIds = Object.keys(this.windows);
    if (windowIds.length > 0) {
      this.switchWindow(windowIds[windowIds.length-1]);
    }
  },

  /**
   * Create a new window.
   *
   * @param {number} Window type id from this.WINDOW_TYPES.
   * @param {string} url URL to navigate window to.
   * @param {Object} siteObject Website metadata to use in generating a window.
   */
  createWindow: function(windowType, url, siteObject) {
    var newWindow = null;
    var id = this.windowCount;
    switch(windowType) {
      // Home Screen Window
      case this.WINDOW_TYPES.home:
        newWindow = new HomeScreenWindow(this.HOME_WINDOW_ID);
        break;
      // Browser Window
      case this.WINDOW_TYPES.browser:
        newWindow = new BrowserWindow(id, url);
        break;
      // Standalone Window
      case this.WINDOW_TYPES.standalone:
        newWindow = new StandaloneWindow(id, url, siteObject);
        break;
      default:
        console.error('Window type not recognised.');
        return;
    }
    this.windows[id] = newWindow;
    var newWindowSelector = new WindowSelector(id, windowType, siteObject);
    this.windowSelectors[id] = newWindowSelector;
    this.switchWindow(id);
    this.windowCount++;
  },

  /**
   * Switch to a window.
   *
   * @param {Integer} id The ID of the window to switch to.
   */
  switchWindow: function(id) {
    // Hide the current window
    if (this.currentWindow !== null) {
      this.windows[this.currentWindow].hide();
      this.windowSelectors[this.currentWindow].deselect();
    }
    // Dispatch an event if switching to or from homescreen.
    if (id == this.WINDOW_TYPES.home &&
      this.currentWindow != this.WINDOW_TYPES.home) {
      window.dispatchEvent(new CustomEvent('_goinghome'));
    } else if(this.currentWindow == this.WINDOW_TYPES.home &&
      id!=this.WINDOW_TYPES.home) {
      window.dispatchEvent(new CustomEvent('_leavinghome'));
    }
    this.currentWindow = id;
    // Show the selected window
    this.windows[id].show();
    this.windowSelectors[id].select();
  }
};
