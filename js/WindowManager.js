/**
 * Window Manager.
 *
 * Manages app windows.
 */

var WindowManager = {

  /**
   * The collection of App Windows.
   */
  appWindows: [],

  /**
   * The number of windows opened in this session.
   */
  windowCount: 0,

  /**
   * The currently displayed window.
   */
  currentWindow: null,

  /**
   * Start the Window Manager.
   *
   * @return {Object} The WindowManager object.
   */
  start: function() {
    // Add event listeners
    window.addEventListener('newwindowrequested', this.createWindow.bind(this));
    
    return this;
  },

  /**
   * Create a new window.
   */
  createWindow: function() {
    var newWindow = new AppWindow(this.windowCount);
    this.appWindows.push(newWindow);
    this.switchWindow(newWindow);
    this.windowCount++;
  },

  /**
   * Switch to a window.
   *
   * @param {Object} appWindow The AppWindow to switch to.
   */
  switchWindow: function(appWindow) {
    if (this.currentWindow) {
      this.currentWindow.hide();
    }
    this.currentWindow = appWindow;
    this.currentWindow.show();
  }
};
