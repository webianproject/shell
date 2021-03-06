/**
 * Webian Shell.
 *
 * The main Shell object which starts everything else.
 */

var Shell = {

  /**
   * Start Shell.
   */
  start: function() {
    console.log('Starting Shell...');
    this.webAppManager = WebApps;
    this.windowManager = WindowManager.start();
    this.systemToolbar = SystemToolbar.start();

    Database.init(true).then(() => {
      this.webAppManager.init(Database);
    });

    // Add event listeners
    window.addEventListener('_goinghome', this.handleGoingHome);
    window.addEventListener('_leavinghome', this.handleLeavingHome);
  },

  /**
   * Handle navigating to home screen.
   */
  handleGoingHome: function() {
    document.body.classList.add('home');
  },

  /**
   * Handle navigating away from home screen.
   */
  handleLeavingHome: function() {
    document.body.classList.remove('home');
  }
};

/**
  * Start Shell on page load.
  */
window.addEventListener('load', function shell_onLoad() {
  window.removeEventListener('load', shell_onLoad);
  Shell.start();
});
