/**
 * App icon grid.
 *
 * Copyright Ben Francis 2013
 *
 * Webian Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Webian Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Webian Shell in the LICENSE file. If not, see
 * <http://www.gnu.org/licenses/>.
 */

var Grid = {

  apps: [],

  /**
   * Initialise app icon grid.
   */
  init: function grid_init() {
    this.grid = document.getElementById('grid');
    this.appIcons = document.getElementById('app_icons');
    this.appIcons.addEventListener('click', this.handleClick.bind(this));
    this.displayAppIcons();
  },

  /**
   * Display app icons
   */
  displayAppIcons: function grid_displayAppIcons() {
    var getAll = window.navigator.mozApps.mgmt.getAll();
    getAll.onsuccess = (function(event) { 
      var apps = event.target.result;
      var manifests = '';
      apps.forEach(function eachApp(app) {
        //manifests += (' ' + app.manifestURL);
        var manifest = app.manifest ? app.manifest : app.updateManifest;
        if (!manifest || !manifest.icons)
          return;
        if (!manifest.icons["120"])
          return;
        var icon = manifest.icons["120"];
        var src = '';
        if (icon.indexOf('data:') == 0 ||
          icon.indexOf('app://') == 0 ||
          icon.indexOf('http://') == 0 ||
          icon.indexOf('https://') == 0) {
          src = icon;
        } else {
          if (app.origin.slice(-1) == '/') {
            src = app.origin.slice(0, -1) + icon;
          } else {
            src = app.origin + icon;
          }
        }
        var name = '';
        if (manifest.name)
          name = manifest.name;
        this.apps[app.manifestURL] = app;
        this.appIcons.innerHTML += '<a href="' + app.manifestURL + '"><li><img src="' + src + '"><span>' + name + '</span></li></a>';
      }, this);
    }).bind(this);
  },

  /**
   * Click event handler
   *
   * @param event event The click event
   */
  handleClick: function grid_handleClick(event) {
    event.preventDefault();
    var manifestURL = '';
    if(event.target.tagName == 'IMG' || event.target.tagName == 'SPAN') {
      manifestURL = event.target.parentNode.parentNode.href;
    } else if (event.target.tagName == 'IMG') {
      manifestURL = event.target.parentNode.href;
    } else if (event.target.tagName == 'A') {
      manifestURL = event.target.href;
    }
    var app = this.apps[manifestURL];
    //app.launch();
    if (WindowManager.hasWindow(manifestURL)) {
      WindowManager.selectWindow(manifestURL);
    } else {
      WindowManager.newWindow(app);
    }
  }
}
