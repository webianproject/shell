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
    this.urlButton = document.getElementById('url_button');
    this.urlInput = document.getElementById('url_input');
    this.urlButton.addEventListener('click', this.handleUrlSubmit.bind(this));
    this.urlInput.addEventListener('submit', this.handleUrlSubmit.bind(this));
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
   * Set value of URL bar.
   *
   * @param {string} url The URL to set the address bar to
   */
  setUrl: function windowToolbar_setUrl(url) {
    this.urlInput.value = url;
  }

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
      this.handleLocationChange);
  },

  /**
   * Handle mozbrowserlocationchange event.
   *
   * @param {Event} locationchange event containing URL.
   */
  handleLocationChange: function windowFrame_handleLocationChange(event) {
    WindowToolbar.setUrl(event.detail);
  },

  /**
   * Navigate to a web page.
   *
   * @param {string} URL to navigate to.
   */
  go: function window_go(url) {
    // Navigate the iframe
    this.frame.src = url;
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
