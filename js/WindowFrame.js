/**
 * Window Frame
 *
 * Manages the window iframe.
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

var WindowFrame = {

  /**
   * Initialise window.
   */
  init: function windowFrame_init() {
    this.frame = document.getElementById('window_frame');
    this.frame.addEventListener('mozbrowserlocationchange',
      this.handleLocationChange.bind(this));
    this.frame.addEventListener('mozbrowsertitlechange',
      this.handleTitleChange.bind(this));
    this.frame.addEventListener('mozbrowserloadstart',
      this.handleLoadStart.bind(this));
    this.frame.addEventListener('mozbrowserloadend',
      this.handleLoadEnd.bind(this));
  },

  url: null,
  title: null,

  /**
   * Handle mozbrowserlocationchange event.
   *
   * @param {Event} locationchange event containing URL.
   */
  handleLocationChange: function windowFrame_handleLocationChange(event) {
    this.url = event.detail;
    this.title = null;
    WindowToolbar.updateAddressBar(this.url);
  },

  /**
   * Handle mozbrowsertitlechange event.
   *
   * @param {Event} titlechange ever containing URL.
   */
  handleTitleChange: function windowFrame_handleTitleChange(event) {
    this.title = event.detail;
    WindowToolbar.updateAddressBar();
  },

  /**
   * Handle mozbrowserloadstart event.
   */
  handleLoadStart: function windowFrame_handleLoadStart() {
    WindowToolbar.setLoading(true);
  },

  /**
   * Handle mozbrowserloadend event.
   */
  handleLoadEnd: function windowFrame_handleLoadEnd() {
    WindowToolbar.setLoading(false);
  },

  /**
   * Navigate to a web page.
   *
   * @param {string} URL to navigate to.
   */
  go: function windowFrame_go(url) {
    // Navigate the iframe
    this.frame.src = url;
  },

  /**
   * Get current URL
   *
   * @return {string} URL
   */
  getUrl: function windowFrame_getUrl() {
    return this.url;
  },

  /**
   * Get current page title
   *
   * @return {string} title
   */
  getTitle: function windowFrame_getTitle() {
    return this.title;
  }

};

