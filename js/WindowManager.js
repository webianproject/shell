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
   * Start the Window Manager.
   *
   * @return {Object} The WindowManager object.
   */
  start: function() {
    window.addEventListener('_openwindow',
      this.handleOpenWindow.bind(this));
    window.addEventListener('_closewindow',
      this.handleCloseWindow.bind(this));
    return this;
  },

  /**
   * Handle _openwindow event.
   *
   * @param {Event} e _openwindow event.
   */
  handleOpenWindow: function(e) {
    if (e.detail && e.detail.id != null) {
      this.switchWindow(e.detail.id);
    } else {
      this.createWindow();
    }
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
   */
  createWindow: function() {
    var id = this.windowCount;

    var newWindow = new BrowserWindow(id);
    this.windows[id] = newWindow;

    var newWindowSelector = new WindowSelector(id);
    this.windowSelectors[id] = newWindowSelector;

    this.switchWindow(id);
    this.windowCount++;
  },

  /**
   * Switch to a window.
   *
   * @param {Integer} id The ID of the BrowserWindow to switch to.
   */
  switchWindow: function(id) {
    if (this.currentWindow != null) {
      this.windows[this.currentWindow].hide();
      this.windowSelectors[this.currentWindow].deselect();
    }
    this.currentWindow = id;
    this.windows[id].show();
    this.windowSelectors[id].select();
  }
};
