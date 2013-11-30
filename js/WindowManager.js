/**
 * Window Manager.
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

var WindowManager = {

  /**
   * An array of open windows, indexed by manifest URL
   */
  windows: [],

  /**
   *  Initialise window manager.
   */
  init: function windowManager_init() {
    this.windowFrame = document.getElementById('window_frame');
    //window.addEventListener('mozChromeEvent',
      //this.handleChromeEvent);
  },

  /**
   *  mozChromeEvent event handler.
   *
   * @param Event launch event
   */
  /*handleChromeEvent: function windowManager_handleChromeEvent(event) {
    alert('there was a chrome event');
    switch (event.detail.type) {
      case 'webapps-launch':
        alert(event);
        var manifestURL = event.detail.manifestURL;
        if (!manifestURL)
          return;
        var app = Applications.getByManifestURL(manifestURL);
        if (!app)
          return;
        
        break;
    }
  },*/

  /**
   * Create a new window.
   *
   * @param Event launch event
   */
  newWindow: function windowManager_newWindow(app) {
    //var iframe = document.createElement('iframe');
    //iframe.setAttribute('mozbrowser', true);
    //iframe.setAttribute('mozallowfullscreen', true);
    //TODO: check slashes in the right place
    var url = app.origin;
    if (app.launch_path)
      url += app.launch_path;
    WindowFrame.frame.setAttribute('src', url);
    Grid.grid.classList.remove('visible');
    WindowToolbar.toolbar.classList.add('visible');
    WindowFrame.frame.classList.add('visible');
    
    //this.windows[app.manifestURL] = iframe;
    //alert(app.manifestURL);
    //alert(app.origin);
    //alert(app.launch_path);
  },

  /**
   * Does a window with this Manifest URL exist?
   *
   * @param manifestURL string Manifest URL
   * @return true or false for yes or no
   */
  hasWindow: function windowManager_hasWindow(manifestURL) {
    if (this.windows[manifestURL]) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * Select window with given Manifest URL.
   * 
   * @param manifestURL string Manifest URL
   */
  selectWindow: function windowManager_selectWindow(manifestURL) {
    //TODO: Implement
  },


};
