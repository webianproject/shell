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

var Shell = {

  /**
   * Initialise system toolbar
   */
  init: function shell_init() {
    SystemToolbar.init();
  }
}

window.addEventListener('load', function shell_onLoad() {
  window.removeEventListener('load', shell_onLoad);
  Shell.init();
});
