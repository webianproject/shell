/**
 * App.
 *
 * An app object represents an app's metadata.
 */

/**
 * App constructor.
 *
 * @param {Object} manifest A W3C web app manifest parsed as JSON.
 */
var App = function(manifest) {
  this.name = manifest.name;
  this.icons = manifest.icons;
  this.startUrl = manifest.start_url;
  this.backgroundColor = manifest.background_color;
  this.themeColor = manifest.theme_color;
  this.scope = manifest.scope;
  this.display = manifest.display;
  var hostname = new URL(this.startUrl).hostname;

  if (this.scope) {
    this._id = hostname + this.scope;
  } else {
    this._id = hostname;
  }

  return this;
};
