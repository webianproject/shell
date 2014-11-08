/**
 * Window Selector.  
 * 
 * UI element which shows an app icon and is used for selecting a window.
 */

/**
 * Window Selector Constructor.
 *
 * @param {Integer} id Window ID.
 */
var WindowSelector = function(id) {
  if (id === undefined) {
    return;
  }
  this.id = id;
  this.container = document.getElementById('window-switcher');
  this.render();
  this.element.addEventListener('click', this.handleClick.bind(this));
  return this;
};

/** 
 * Window Selector View.
 */
WindowSelector.prototype.view = function() {
  return '<button type="button" id="window-selector' + this.id +
    '"class="window-selector"></div>';
};

/**
 * Render the selector.
 */
WindowSelector.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
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
  var e = new CustomEvent('_windowrequested', {
    detail: {
      id: this.id
    }
  });
  window.dispatchEvent(e);
};

