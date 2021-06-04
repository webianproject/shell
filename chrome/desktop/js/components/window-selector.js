/**
 * Window Selector.
 *
 * UI element which shows an app icon and is used for selecting a window.
 */
class WindowSelector extends HTMLElement {

  /**
   * Constructor.
   *
   * @param {number} id Window ID.
   * @param {number} windowType Type of window as defined by WINDOW_TYPES.
   * @param {Object} webApp A WebApp object.
   */
  constructor(id, windowType, webApp) {
    super();

    this.TARGET_ICON_SIZE = 24;
    this.WINDOW_TYPES = {
      'home': 0,
      'browser' : 1,
      'standalone': 2,
    };

    if (id === undefined) {
      return null;
    }
    this.windowId = id;
    // If for a web app, get the best size icon to display
    if (webApp) {
      this.iconUrl = webApp.getBestIconUrl(this.TARGET_ICON_SIZE);
    }
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .window-selector-button {
          width: 32px;
          height: 30px;
          background-color: transparent;
          background-image: url("images/browser-icon.png");
          background-size: 24px;
          background-position: center center;
          background-repeat: no-repeat;
          border: none;
          margin: 0 2px;
          padding: 0;
          border-bottom: solid 2px transparent;
        }

        .window-selector-button:hover {
          border-bottom: solid 2px rgba(255, 255, 255, 0.6);
        }

        .window-selector-button:active {
          border-bottom: solid 2px #fff;
        }

        :host([selected]) .window-selector-button {
          border-bottom: solid 2px rgba(255, 255, 255, 0.9);
        }

        .window-selector-button.home-button {
          background-image: url("images/home.png");
        }
      </style>
      <button type="button" class="window-selector-button">
    `;
    const templateClone = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateClone);
    this.element = this.shadowRoot.querySelector('.window-selector-button');

    // If the window is the homescreen, display the home icon
    if (windowType == this.WINDOW_TYPES.home) {
      this.element.classList.add('home-button');
    }
    // If for a standalone web app, display the app's icon
    if (windowType == this.WINDOW_TYPES.standalone && this.iconUrl) {
      this.element.style.backgroundImage = 'url(' + this.iconUrl + ')';
    }
    // Add the click event listener
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

   /**
    * Handle a click by firing  a _switchwindow event.
    *
    * @param {Event} e - The click event.
    */
   handleClick(e) {
     var e = new CustomEvent('_switchwindow', {
       detail: {
         id: this.windowId
       }
     });
     window.dispatchEvent(e);
   }

   /**
    * Get whether or not the window selector is selected.
    */
   get selected() {
     return this.hasAttribute('selected');
   }

  /**
   * Set the selector's selected state.
   *
   * @param {string} value - Truthy values set selected, falsy set deselected
   */
   set selected(value) {
     if (value) {
       this.setAttribute('selected');
     } else {
       this.removeAttribute('selected');
     }
   }

}

// Register custom element
customElements.define('window-selector', WindowSelector);
