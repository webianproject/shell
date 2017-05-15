/**
 * Home Screen Window.
 *
 * The window in which to load the home screen.
 */

/**
 * Browser Window Constructor.
 *
 * @extends BaseWindow.
 * @param {number} id Window ID to give browser window.
 */
var HomeScreenWindow = function(id) {
  this.HOME_SCREEN_URL = 'home.html';
  BaseWindow.call(this, id);
  this.frame = document.getElementById('home-screen-frame' + this.id);
  return this;
};

HomeScreenWindow.prototype = Object.create(BaseWindow.prototype);

/**
 * Home Screen Window View.
 */
HomeScreenWindow.prototype.view = function() {
  return '<div id="window' + this.id + '"class="home-screen-window">' +
         '  <iframe id="home-screen-frame' + this.id +
             '" class="home-screen-frame" src="' + this.HOME_SCREEN_URL +
             '" mozbrowser remote transparent>' +
         '  </iframe>'+
         '</div>';
};

/**
 * Show the Window.
 */
HomeScreenWindow.prototype.show = function() {
  this.frame.setVisible(true);
  this.frame.setActive(true);
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
HomeScreenWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
  this.frame.setVisible(false);
  this.frame.setActive(false);
};
