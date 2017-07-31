/**
 * Home Screen Window.
 *
 * The window in which to load the home screen.
 */

/**
 * Home Screen Window Constructor.
 *
 * @extends BaseWindow.
 * @param {number} id Window ID to give browser window.
 */
var HomeScreenWindow = function(id) {
  this.HOME_SCREEN_URL = 'homescreen/homescreen.html';
  BaseWindow.call(this, id);
  this.frame = document.getElementById('home-screen-frame' + this.id);
  this.frame.addEventListener('mozbrowseropenwindow', this.handleOpenWindow);
  this.powerButton = document.getElementById('power-button');
  this.powerButton.addEventListener('click',
    this.handlePowerButtonClick.bind(this));
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
         '  <button id="power-button"></button>' +
         '</div>';
};

/**
 * Show the Window.
 */
HomeScreenWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
HomeScreenWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
};

/**
 * Handle power button click.
 *
 * @param {Event} e Click event.
 */
HomeScreenWindow.prototype.handlePowerButtonClick = function(e) {
  // Close Shell.
  window.close();
};
