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
 * @param {Object} webApp WebApp with metadata to generate window from.
 */
var StandaloneWindow = function(id, url, webApp) {
  this.currentUrl = url;
  if (webApp && webApp.name) {
    this.name = webApp.name;
  } else if (webApp && webApp.shortName) {
    this.name = webApp.shortName;
  } else {
    try {
      this.name = new URL(url).hostname;
    } catch(e) {
      this.name = '';
    }
  }

  if (webApp && webApp.themeColor) {
    this.themeColor = webApp.themeColor;
  }
  BaseWindow.call(this, id);
  return this;
};

StandaloneWindow.prototype = Object.create(BaseWindow.prototype);

/**
 * Window View.
 */
StandaloneWindow.prototype.view = function() {
  var titleBarStyle = '';
  var titleBarClass = 'standalone-window-title-bar';
  if (this.themeColor) {
    titleBarStyle = 'background-color: ' + this.themeColor + ';';
    var rgb = this.hexToRgb(this.themeColor);
    backgroundBrightness = this.darkOrLight(rgb);
    titleBarClass += ' ' + backgroundBrightness;
  }
  return '<div id="window' + this.id + '"class="standalone-window">' +
    '<div class="' + titleBarClass + '" style="' + titleBarStyle + '">' +
      '<span id="standalone-window-title' + this.id +
      '" class="standalone-window-title">' + this.name + '</span>' +
      '<button type="button" id="close-window-button' + this.id + '" ' +
      'class="close-window-button">' +
    '</div>' +
    '<webview src="' + this.currentUrl + '" id="standalone-window-frame' +
    this.id + '" class="standalone-window-frame">' +
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
  this.frame.addEventListener('did-navigate',
    this.handleLocationChange.bind(this));
  this.frame.addEventListener('did-navigate-in-page',
    this.handleLocationChange.bind(this));
  this.frame.addEventListener('new-window',
    this.handleOpenWindow.bind(this));
};

/**
 * Show the Window.
 */
StandaloneWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
StandaloneWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
};

/**
 * Handle location change.
 *
 * @param {Event} e mozbrowserlocationchange event.
 */
StandaloneWindow.prototype.handleLocationChange = function(e) {
  this.currentUrl = e.url;
};

/**
 * Convert hex color value to rgb.
 *
 * @argument {String} hex color string e.g. #ff0000
 * @returns {Object} RGB object with separate r, g and b properties
 */
StandaloneWindow.prototype.hexToRgb = function(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

/**
 * Measure whether color is dark or light.
 *
 * @param {Object} RGB object with r, g, b properties.
 * @return {String} 'dark' or 'light'.
 */
StandaloneWindow.prototype.darkOrLight = function(rgb) {
  if ((rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186) {
    return 'light';
  } else {
    return 'dark';
  }
};
