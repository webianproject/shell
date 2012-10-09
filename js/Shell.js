/**
 * Webian Shell logic
 * http://webian.org
 *
 * Copyright Ben Francis 2012
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
 *
 * Initialises all the other components of Shell.
 */
var Shell = {

  /**
   * Initialise system toolbar
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
    this.urlButton.addEventListener('click', WindowFrame.go.bind(WindowFrame));
    this.urlInput.addEventListener('submit', WindowFrame.go.bind(WindowFrame));
  }

};

/**
 * Window Frame
 *
 * Manages the window iframe.
 */
var WindowFrame = {

  /**
   * Initialises window.
   */
  init: function window_init() {
    this.frame = document.getElementById('window_frame');
  },

  /**
   * Navigates to a web page.
   */
  go: function window_go(event) {

    // Stop form submitting & refreshing the page
    event.preventDefault();
    var url = WindowToolbar.urlInput.value;

    // Trim whitespace
    url = url.trim();

    // Prepend http:// if no protocol specified
    var protocolRegex = /^([a-z]+:)(\/\/)?/i;
    if (!protocolRegex.exec(url))
      url = 'http://' + url;

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
