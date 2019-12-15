/**
 * Webian Shell Home Screen.
 *
 * The default home screen for Webian Shell.
 */

var HomeScreen = {
  /**
   * Start Home Screen.
   */
  start: function() {
    console.log('Starting home screen...');
    this.webAppManager = WebApps;
    this.searchBar = document.getElementById('search-bar');
    this.appGrid = document.getElementById('app-grid');

    Database.init().then(() => {
      this.webAppManager.init(Database).then(() => {
        this.showApps();
      });
    });

    this.searchBar.addEventListener('focus', this.handleSearchBarClick);

    // TODO: Reload apps from database on change
    window.addEventListener('_databasechanged', this.showApps.bind(this));
  },

  /**
   * Create new window when search bar clicked.
   */
  handleSearchBarClick: function() {
    window.open('', '_blank');
  },

  /*
   * Show grid of app icons.
   */
  showApps: function() {
    this.appGrid.innerHTML = '';
    var apps = this.webAppManager.getApps();
    for (let [appId, app] of Object.entries(apps)) {
      const icon = new WebAppIcon(app, '_blank');
    }
  }
};

/**
  * Start Home Screen on page load.
  */
window.addEventListener('load', function home_onLoad() {
  window.removeEventListener('load', home_onLoad);
  HomeScreen.start();
});
