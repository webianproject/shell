/**
 * Webian Shell logic
 * http://webian.org
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

/**
 * Main Shell Object
 */
var Shell = {

  /**
   * Initialise Shell.
   */
  init: function shell_init() {
    WindowToolbar.init();
    WindowFrame.init();
    SystemToolbar.init();
  }
};

/**
 * Window Toolbar
 *
 * Responsible for window navigation.
 */
var WindowToolbar = {

  /**
   * Initialises system toolbar.
   */
  init: function windowToolbar_init() {
    this.windowToolbar = document.getElementById('window_toolbar');
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
      this.windowToolbar.classList.add('loading');
    } else {
      this.windowToolbar.classList.remove('loading');
      this.urlInput.blur();
    }
  },

};

/**
 * Window Frame
 *
 * Manages the window iframe.
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

/**
 * System Toolbar
 *
 * Contains clock.
 */
var SystemToolbar = {

  /**
   * Initialises system toolbar.
   */
  init: function systemToolbar_init() {
    this.clock = document.getElementById('clock');
    this.updateClock();
    window.setInterval(this.updateClock.bind(this), 1000);
  },

  /**
   * Updates Clock.
   */
  updateClock: function systemToolbar_updateClock() {
    var date = new Date(),
    hours = date.getHours() + '', // get hours as string
    minutes = date.getMinutes() + ''; // get minutes as string

    // pad with zero if needed
    if (hours.length < 2)
      hours = '0' + hours;
    if (minutes.length < 2)
      minutes = '0' + minutes;

    this.clock.innerHTML = hours + ':' + minutes;
  }

};

window.addEventListener('load', function shell_onLoad() {
  window.removeEventListener('load', shell_onLoad);
  Shell.init();
});
