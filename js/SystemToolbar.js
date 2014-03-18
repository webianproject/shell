/**
 * System Toolbar
 *
 * Contains clock.
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

var SystemToolbar = {

  /**
   * Initialise system toolbar.
   */
  init: function systemToolbar_init() {
    this.clock = document.getElementById('clock');
    this.updateClock();
    window.setInterval(this.updateClock.bind(this), 1000);
  },

  /**
   * Update Clock.
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

    this.clock.textContent = hours + ':' + minutes;
  }

};
