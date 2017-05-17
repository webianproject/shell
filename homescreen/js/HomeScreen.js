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
    this.searchBar = document.getElementById('search-bar');
    this.searchBar.addEventListener('focus', this.handleSearchBarClick);
  },

  /**
   * Create new window when search bar clicked.
   */
  handleSearchBarClick: function() {
    window.open('', '_blank');
  }
};

/**
  * Start Home Screen on page load.
  */
window.addEventListener('load', function home_onLoad() {
  window.removeEventListener('load', home_onLoad);
  HomeScreen.start();
});
