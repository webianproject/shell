/**
 * Site.
 *
 * A site object represents a website's metadata.
 */

/**
 * Site constructor.
 *
 * @param {Object} manifest A W3C web app manifest parsed as JSON.
 */
var Site = function(manifest) {
  this.name = manifest.name;
  this.icons = manifest.icons;
  this.startUrl = manifest.start_url;
  this.backgroundColor = manifest.background_color;
  this.themeColor = manifest.theme_color;
  this.scope = manifest.scope;
  this.display = manifest.display;
  this.frecency = manifest.frecency || 0;
  var hostname = new URL(this.startUrl).hostname;

  if (this.scope) {
    this.id = hostname + this.scope;
  } else {
    this.id = hostname;
  }

  return this;
};
