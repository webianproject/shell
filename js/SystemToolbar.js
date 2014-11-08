/**
 * System Toolbar.
 *
 * UI element containing the clock and window switcher.
 */

var SystemToolbar = {

  /**
   * Start the system toolbar.
   */
  start: function() {

    // Get DOM elements
    this.element = document.getElementById('system-toolbar');
    this.newWindowButton = document.getElementById('new-window-button');
    this.clock = document.getElementById('clock');

    // Add event listeners
    this.newWindowButton.addEventListener('click',
      this.handleNewWindowButtonClick.bind(this));

    // Set the clock going
    this.updateClock();
    window.setInterval(this.updateClock.bind(this), 1000);

    return this;
  },

  /**
   * Update Clock.
   */
  updateClock: function() {
    var date = new Date(),
    hours = date.getHours() + '', // get hours as string
    minutes = date.getMinutes() + ''; // get minutes as string

    // pad with zero if needed
    if (hours.length < 2)
      hours = '0' + hours;
    if (minutes.length < 2)
      minutes = '0' + minutes;

    this.clock.textContent = hours + ':' + minutes;
  },

  /**
   * Handle clicks of the new window button.
   */
  handleNewWindowButtonClick: function() {
    window.dispatchEvent(new CustomEvent('_openwindow'));
  }

};
