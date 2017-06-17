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
  this.id = siteObject.id;
  this.startUrl = siteObject.startUrl;
  this.name = siteObject.name || new URL(this.startUrl).hostname;
  if (siteObject.icons && siteObject.icons[0]) {
    this.iconUrl = siteObject.icons[0].src;
  } else if (siteObject.iconUrl) {
    this.iconUrl = siteObject.iconUrl;
  }
  this.render(target, pinned);
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
 * @param {Boolean} pinned Whether or not the site is pinned.
 */
Icon.prototype.render = function(target, pinned) {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('icon-' + this.id);
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
  var features = 'siteId=' + this.id;
  window.open(this.startUrl, '_blank', features);
  console.log('opening window at ' + this.startUrl);
};

/**
 * Navigate to site in current window.
 */
Icon.prototype.navigate = function() {
  window.location.href = this.startUrl;
  console.log('navigating to ' + this.startUrl);
};
