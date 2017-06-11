/**
 * Tile.
 *
 * A tile represents a top site with an icon, site name and background colour.
 */

/**
 * Tile Constructor.
 *
 * @param {Object} siteObject A SiteObject representing a site.
 * @param {String} target Open in current window (_self) or a new one (_blank).
 * @param {Boolean} pinned Whether or not the site is pinned.
 */
var Tile = function(siteObject, target, pinned) {
  this.container = document.getElementById('top-sites-list');
  this.siteObject = siteObject;
  this.render(target, pinned);
  return this;
};

/**
 * Generate Tile View.
 */
Tile.prototype.view = function() {
  var style = '';
  var backgroundBrightness = 'light';
  if (this.siteObject.backgroundColor) {
    style += 'background-color: ' + this.siteObject.backgroundColor + ';';
    var rgb = this._hexToRgb(this.siteObject.backgroundColor);
    backgroundBrightness = this._darkOrLight(rgb);
  }
  if (this.siteObject.icons && this.siteObject.icons[0]) {
    style += 'background-image: url(' + this.siteObject.icons[0].src +  ');'
  } else if (this.siteObject.iconUrl) {
    style += 'background-image: url(' + this.siteObject.iconUrl +  ');'
  }
  var label = this.siteObject.name || this.siteObject.id;
  return '<li id="tile-' + this.siteObject.id +'" class="tile ' + backgroundBrightness
    + '" style="' + style + '"><span class="tile-name">' + label + '</span></li>';
};

/**
 * Render Tile.
 *
 * @param {String} target Open in current window (_self) or a new one (_blank).
 * @param {Boolean} pinned Whether or not the site is pinned.
 */
Tile.prototype.render = function(target, pinned) {
  this.container.insertAdjacentHTML('beforeend', this.view());
  this.element = document.getElementById('tile-' + this.siteObject.id);
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
Tile.prototype.open = function() {
  window.open(this.siteObject.startUrl, '_standalone');
  console.log('opening window at ' + this.siteObject.startUrl);
};

/**
 * Navigate to site in current window.
 */
Tile.prototype.navigate = function() {
  window.location.href = this.siteObject.startUrl;
  console.log('navigating to ' + this.siteObject.startUrl);
};

/**
 * Convert hex color value to rgb.
 *
 * @argument {String} hex color string e.g. #ff0000
 * @returns {Object} RGB object with separate r, g and b properties
 */
Tile.prototype._hexToRgb = function(hex) {
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
Tile.prototype._darkOrLight = function(rgb) {
  if ((rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186) {
    return 'light';
  } else {
    return 'dark';
  }
};
