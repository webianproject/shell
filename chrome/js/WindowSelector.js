/**
 * Window Selector.
 *
 * UI element which shows an app icon and is used for selecting a window.
 */

/**
 * Window Selector Constructor.
 *
 * @param {number} id Window ID.
 * @param {number} windowType Type of window from WindowManager.WINDOW_TYPES.
 * @param {Object} siteObject A Site object representing a web app or website.
 */
var WindowSelector = function(id, windowType, siteObject) {
  if (id === undefined) {
    return null;
  }
  this.id = id;
  this.container = document.getElementById('window-switcher');
  if (siteObject && siteObject.icons && siteObject.icons[0]) {
    this.iconUrl = siteObject.icons[0].src;
  } else if (siteObject && siteObject.iconUrl) {
    this.iconUrl = siteObject.iconUrl;
  }
  this.render(windowType);
  this.element.addEventListener('click', this.handleClick.bind(this));
  return this;
};

/**
 * Window Selector View.
 *
 * @param {number} windowType Type of window from WindowManager.WINDOW_TYPES.
 */
WindowSelector.prototype.view = function(windowType) {
  switch(windowType) {
    // Home Screen Window
    case WindowManager.WINDOW_TYPES.home:
      return '<button type="button" id="window-selector' + this.id +
        '"class="window-selector home-button"></div>';
    // Standalone window
    case WindowManager.WINDOW_TYPES.standalone:
      var style = '';
      if (this.iconUrl) {
        style = 'background-image: url(' + this.iconUrl +  ');';
      }
      return '<button type="button" id="window-selector' + this.id +
        '"class="window-selector" style="' + style + '"></div>';
    // Browser window
    default:
      return '<button type="button" id="window-selector' + this.id +
        '"class="window-selector"></div>';
  }
};

/**
 * Render the selector.
 * @param {number} windowType Type of window from WindowManager.WINDOW_TYPES.
 */
WindowSelector.prototype.render = function(windowType) {
  this.container.insertAdjacentHTML('beforeend', this.view(windowType));
  this.element = document.getElementById('window-selector' + this.id);
};

/**
 * Put the selector in the selected state.
 */
WindowSelector.prototype.select = function() {
  this.element.classList.add('selected');
};

/**
 * Put the selector in the de-selected state.
 */
WindowSelector.prototype.deselect = function() {
  this.element.classList.remove('selected');
};

/**
 * Handle a click on the selector.
 */
WindowSelector.prototype.handleClick = function() {
  var e = new CustomEvent('_switchwindow', {
    detail: {
      id: this.id
    }
  });
  window.dispatchEvent(e);
};

/**
 * Delete the element from the DOM.
 */
WindowSelector.prototype.destroy = function() {
  this.container.removeChild(this.element);
};
