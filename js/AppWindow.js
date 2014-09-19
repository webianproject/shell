/**
 * App Window.
 * 
 * Manages the lifetime of a window.
 */

/**
 * App Window Constructor.
 */
var AppWindow = function(id) {
  if (id === undefined) {
    return;
  }
  this.container = document.getElementById('windows');
  this.id = id;
  this.render();
  return this;
};

/** 
 * Window View.
 */
AppWindow.prototype.view = function() {
  return '<div id="window' + this.id + '"class="app-window"></div>';
};

/**
 * Render the window.
 */
AppWindow.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window' + this.id);
};

/**
 * Show the Window.
 */
AppWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
AppWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
};
