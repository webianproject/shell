/**
 * App Window Button.  
 * 
 * Used for selecting a window.
 */

/**
 * App Window Button Constructor.
 *
 * @param {Integer} id Window ID.
 */
var AppWindowButton = function(id) {
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
 * Window View.
 */
AppWindowButton.prototype.view = function() {
  return '<button type="button" id="window-button' + this.id +
    '"class="app-window-button"></div>';
};

/**
 * Render the window.
 */
AppWindowButton.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window-button' + this.id);
};

/**
 * Put the button in the selected state.
 */
AppWindowButton.prototype.select = function() {
  this.element.classList.add('selected');
};

/**
 * Put the button in the de-selected state.
 */
AppWindowButton.prototype.deselect = function() {
  this.element.classList.remove('selected');
};

/**
 * Handle a click on the button.
 */
AppWindowButton.prototype.handleClick = function() {
  var e = new CustomEvent('_windowrequested', {
    detail: {
      id: this.id
    }
  });
  window.dispatchEvent(e);
};

