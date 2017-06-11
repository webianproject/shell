/**
 * Standalone Window.
 *
 * A window in standalone display mode.
 */

/**
 * Standalone Window Constructor.
 *
 * @extends BaseWindow.
 * @param {number} id Window ID to give standalone window.
 * @param {string} url URL to navigate to.
 */
var StandaloneWindow = function(id, url) {
  this.currentUrl = url;
  BaseWindow.call(this, id);
  return this;
};

StandaloneWindow.prototype = Object.create(BaseWindow.prototype);

/**
 * Window View.
 */
StandaloneWindow.prototype.view = function() {
  return '<div id="window' + this.id + '"class="standalone-window">' +
    '<div class="standalone-window-title-bar">' +
      '<span id="standalone-window-title' + this.id +
      '" class="standalone-window-title"></span>' +
      '<button type="button" id="close-window-button' + this.id + '" ' +
      'class="close-window-button">' +
    '</div>' +
    '<iframe src="' + this.currentUrl + '" id="standalone-window-frame' +
    this.id + '" class="standalone-window-frame" mozbrowser remote>' +
  '</div>';
};

/**
 * Render the window.
 */
StandaloneWindow.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window' + this.id);
  this.title = document.getElementById('standalone-window-title' + this.id);
  this.closeButton = document.getElementById('close-window-button' + this.id);
  this.closeButton.addEventListener('click', this.close.bind(this));
  this.frame = document.getElementById('standalone-window-frame' + this.id);
  this.frame.addEventListener('mozbrowserlocationchange',
    this.handleLocationChange.bind(this));
  this.title.textContent = new URL(this.currentUrl).hostname;
};

/**
 * Show the Window.
 */
StandaloneWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
  this.frame.setVisible(true);
  this.frame.setActive(true);
};

/**
 * Hide the window.
 */
StandaloneWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
  this.frame.setVisible(false);
  this.frame.setActive(false);
};

/**
 * Handle location change.
 *
 * @param {Event} e mozbrowserlocationchange event.
 */
StandaloneWindow.prototype.handleLocationChange = function(e) {
  this.currentUrl = e.detail.url;
  this.title.textContent = new URL(e.detail.url).hostname;
};
