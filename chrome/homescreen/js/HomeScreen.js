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
    this.searchBar = document.getElementById('search-bar');
    this.appGrid = document.getElementById('app-grid');
    //Start the Shell Database
    Database.start();
    this.showApps();
    this.searchBar.addEventListener('focus', this.handleSearchBarClick);
    // Update the app grid whenever there's a database change
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

    Database.getApps().then(function(apps) {
      apps.forEach(function(appObject) {
        var icon = new Icon(appObject, '_blank');
      });
    });
  }
};

/**
  * Start Home Screen on page load.
  */
window.addEventListener('load', function home_onLoad() {
  window.removeEventListener('load', home_onLoad);
  HomeScreen.start();
});
