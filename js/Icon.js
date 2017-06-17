/**
 * Icon.
 *
 * An icon represents a web app or website .
 */

/**
 * Icon Constructor.
 *
 * @param {Object} siteObject A SiteObject representing a site.
 * @param {String} target Open in current window (_self) or a new one (_blank).
 * @param {Boolean} pinned Whether or not the site is pinned.
 */
var Icon = function(siteObject, target, pinned) {
  this.container = document.getElementById('top-sites-list');
  this.siteObject = siteObject;
  this.render(target, pinned);
  return this;
};

/**
 * Generate Icon View.
 */
Icon.prototype.view = function() {
  var style = '';
  if (this.siteObject.icons && this.siteObject.icons[0]) {
    style += 'background-image: url(' + this.siteObject.icons[0].src +  ');'
  } else if (this.siteObject.iconUrl) {
    style += 'background-image: url(' + this.siteObject.iconUrl +  ');'
  }
  var label = this.siteObject.name || this.siteObject.id;
  return '<li id="icon-' + this.siteObject.id +'" class="icon" style="' +
  style + '"><span class="icon-name">' + label + '</span></li>';
};

/**
 * Render Icon.
 *
 * @param {String} target Open in current window (_self) or a new one (_blank).
 * @param {Boolean} pinned Whether or not the site is pinned.
 */
Icon.prototype.render = function(target, pinned) {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('icon-' + this.siteObject.id);
  if (target && target == '_self') {
    this.element.addEventListener('click', this.navigate.bind(this));
  } else {
    this.element.addEventListener('click', this.open.bind(this));
  }
  if (pinned) {
    this.element.classList.add('pinned');
  }
};

/**
 * Launch site in a new window.
 */
Icon.prototype.open = function() {
  window.open(this.siteObject.startUrl, '_standalone');
  console.log('opening window at ' + this.siteObject.startUrl);
};

/**
 * Navigate to site in current window.
 */
Icon.prototype.navigate = function() {
  window.location.href = this.siteObject.startUrl;
  console.log('navigating to ' + this.siteObject.startUrl);
};
