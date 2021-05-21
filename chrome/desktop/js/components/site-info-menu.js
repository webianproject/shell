/**
 * Site Information Menu.
 *
 * Displays information about the current website or web app.
 */
class SiteInfoMenu extends HTMLElement {

  /**
   * Constructor.
   *
   * @param {string} title - Title of website or web app.
   * @param {string} iconUrl - URL of icon.
   * @param {boolean} isApp - True if web app manifest detected.
   * @param {number} x - left offset in px.
   * @param {number} y - top offset in px.
   */
  constructor(title, iconUrl, isApp, x, y) {
    super();

    const appOrSite = isApp ? 'App' : 'Site';
    const left = x + 'px';
    const top = y + 'px';

    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        .scrim {
          background-color: transparent;
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .site-info {
          left: ${left};
          top: ${top};
          width: 250px;
          display: block;
          background-color: #e5e5e5;
          border-radius: 5px;
          border: solid 1px #bfbfbf;
          position: fixed;
          padding: 10px;
          margin: 7.5px 0;
          z-index: 2;
        }

        .site-info:after {
          content: '';
          position: absolute;
          top: 0;
          left: 14px;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-bottom-color: #e5e5e5;
          border-top: 0;
          margin-left: -10px;
          margin-top: -10px;
        }

        .site-info h1 {
          text-align: center;
          font-style: italic;
          font-weight: normal;
          font-size: 14px;
          padding: 20px auto;
        }

        .site-info .app-icon {
          display: block;
          width: 64px;
          height: 64px;
          margin: 20px auto 10px auto;
        }

        .site-info .app-name {
          display: block;
          font-size: 14px;
          width: 200px;
          margin: 0 auto 10px auto;
          text-align: center;
        }

        .site-info button {
          display: block;
          margin: 2rem auto;
          background-color: #5f8dd3;
          border-radius: 5px;
          border: none;
          padding: 10px 40px;
          color: #fff;
          font-size: 14px;
        }

        .site-info button:hover {
          background-color: #3e76ca;
        }
      </style>

      <div class="scrim"></div>
      <menu class="site-info">
        <h1>Pin ${appOrSite}</h1>
        <img class="app-icon" src="${iconUrl}" />
        <span class="app-name">${title}</span>
        <button class="pin-button">Pin</button>
      </menu>
    `;

    const templateClone = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateClone);

    this.scrim = this.shadowRoot.querySelector('.scrim');
    this.scrim.addEventListener('click', this.handleScrimClick.bind(this));
  }

  /**
   * Handle a click on the scrim.
   *
   * @param {Event} e - The click event.
   */
  handleScrimClick(e) {
    // Remove the site info menu from the DOM
    this.remove();
  }

}

// Register custom element
customElements.define('site-info-menu', SiteInfoMenu);
