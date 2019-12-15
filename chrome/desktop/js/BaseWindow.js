/**
 * Base Window.
 *
 * The base class for window classes like BrowserWindow and HomescreenWindow.
 */

/**
 * Window Constructor.
 *
 * @param {number} id ID to give window.
 */
var BaseWindow = function(id) {
  if (id === undefined) {
    return null;
  }
  this.container = document.getElementById('windows');
  this.id = id;
  this.render();
  return this;
};

/**
 * Window View.
 */
BaseWindow.prototype.view = function() {
  console.error('Can not render a BaseWindow.');
  return '';
};

/**
 * Render the window.
 */
BaseWindow.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('window' + this.id);
};

/**
 * Show the Window.
 */
BaseWindow.prototype.show = function() {
  this.element.classList.remove('hidden');
};

/**
 * Hide the window.
 */
BaseWindow.prototype.hide = function() {
  this.element.classList.add('hidden');
};

/**
 * Open a new window.
 *
 * @param {Event} e Open window event.
 */
BaseWindow.prototype.handleOpenWindow = function(e) {
  e.preventDefault();
  window.dispatchEvent(new CustomEvent('_openwindow', {
    'detail': e
  }));
};

/**
 * Close the window.
 */
BaseWindow.prototype.close = function() {
  var e = new CustomEvent('_closewindow', {
    detail: {
      id: this.id
    }
  });
  window.dispatchEvent(e);
};

/**
 * Delete the element from the DOM.
 */
BaseWindow.prototype.destroy = function() {
  this.container.removeChild(this.element);
};
