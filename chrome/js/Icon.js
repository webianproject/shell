/**
 * Icon.
 *
 * An icon represents a web app .
 */

/**
 * Icon Constructor.
 *
 * @param {Object} appObject An AppObject representing an app.
 * @param {String} target Open in current window (_self) or a new one (_blank).
 */
var Icon = function(appObject, target) {
  this.container = document.getElementById('app-grid');
  this.id = appObject._id;
  this.startUrl = appObject.startUrl;
  this.name = appObject.name || new URL(this.startUrl).hostname;
  if (appObject.icons && appObject.icons[0]) {
    this.iconUrl = appObject.icons[0].src;
  } else {
    this.iconUrl = null;
  }
  this.render(target);
  return this;
};

/**
 * Generate Icon View.
 */
Icon.prototype.view = function() {
  var style = 'background-image: url(' + this.iconUrl +  ');';
  return '<li id="icon-' + this.id +'" class="icon" style="' +
  style + '"><span class="icon-name">' + this.name + '</span></li>';
};

/**
 * Render Icon.
 *
 * @param {String} target Open in current window (_self) or a new one (_blank).
 */
Icon.prototype.render = function(target) {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('icon-' + this.id);
  if (target && target == '_self') {
    this.element.addEventListener('click', this.navigate.bind(this));
  } else {
    this.element.addEventListener('click', this.open.bind(this));
  }
};

/**
 * Launch app in a new window.
 */
Icon.prototype.open = function() {
  var features = 'appId=' + this.id;
  window.open(this.startUrl, '_blank', features);
  console.log('opening window at ' + this.startUrl);
};

/**
 * Navigate to app in current window.
 */
Icon.prototype.navigate = function() {
  window.location.href = this.startUrl;
  console.log('navigating to ' + this.startUrl);
};
