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
 */
var WindowSelector = function(id, windowType) {
  if (id === undefined) {
    return null;
  }
  this.id = id;
  this.container = document.getElementById('window-switcher');
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
  if (windowType == WindowManager.WINDOW_TYPES.home) {
    return '<button type="button" id="window-selector' + this.id +
      '"class="window-selector home-button"></div>';
  } else {
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
  var e = new CustomEvent('_openwindow', {
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
