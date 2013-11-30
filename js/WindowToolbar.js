/**
 * Window Toolbar
 *
 * Responsible for window navigation.
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

var WindowToolbar = {

  /**
   * Initialises system toolbar.
   */
  init: function windowToolbar_init() {
    this.toolbar = document.getElementById('window_toolbar');
    this.addressBar = document.getElementById('address_bar');
    this.urlButton = document.getElementById('url_button');
    this.urlInput = document.getElementById('url_input');
    this.urlButton.addEventListener('click', this.handleUrlSubmit.bind(this));
    this.urlInput.addEventListener('submit', this.handleUrlSubmit.bind(this));
    this.urlInput.addEventListener('focus', this.handleUrlFocus.bind(this));
    this.urlInput.addEventListener('blur', this.handleUrlBlur.bind(this));
  },

  /**
   * Handle URL bar submit.
   */
  handleUrlSubmit: function windowToolbar_handleUrlSubmit(event) {
    // Stop form submitting & refreshing the page
    event.preventDefault();

    var url = this.urlInput.value;
    url = url.trim();

    // Prepend http:// if no protocol specified
    var protocolRegex = /^([a-z]+:)(\/\/)?/i;
    if (!protocolRegex.exec(url))
      url = 'http://' + url;
    WindowFrame.go(url);
  },

  /**
   * Handle URL bar focus.
   */
  handleUrlFocus: function windowToolbar_handleUrlFocus() {
    this.addressBar.classList.add('selected');
    this.urlInput.value = WindowFrame.getUrl();
  },

  /**
   * Handle URL bar blur.
   */
  handleUrlBlur: function windowToolbar_handleUrlBlur() {
    this.addressBar.classList.remove('selected');
    this.updateAddressBar();
  },


  /**
   * Update address bar
   */
  updateAddressBar: function windowToolbar_updateAddressBar(url) {
    if (WindowFrame.getTitle()) {
      this.urlInput.blur();
      this.urlInput.value = WindowFrame.getTitle();
    } else {
      this.urlInput.value = WindowFrame.getUrl();
    }
  },

  /**
   * Set loading state
   *
   * @param {boolean} true is loading, false is not loading.
   */
  setLoading: function windowToolbar_setLoading(loading) {
    if (loading) {
      this.toolbar.classList.add('loading');
    } else {
      this.toolbar.classList.remove('loading');
      this.urlInput.blur();
    }
  },

};
