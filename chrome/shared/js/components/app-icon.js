/**
 * App Icon.
 *
 * An icon which represents a web app.
 */
class AppIcon extends HTMLElement {

  /**
   * Constructor.
   *
   * @param {string} id - App ID to associate with icon.
   * @param {string} src - Path of icon image.
   * @param {string} name - Name of app from web app manifest.
   * @param {string} startUrl - Starting URL of app to load.
   * @param {boolean} newWindow - Whether to launch in new or current window.
   */
  constructor(id, src, name, startUrl, newWindow) {
    super();
    this.id = id;
    this.startUrl = startUrl;
    this.newWindow = newWindow;

    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        .app-icon {
          display: block;
          width: 128px;
          height: 128px;
          color: #fff;
          text-align: center;
          float: left;
          margin-left: 0;
          margin-right: 16px;
          margin-bottom: 16px;
        }

        .app-icon-img {
          width: 64px;
          height: 64px;
        }

        .app-icon-name {
          display: block;
          margin-top: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          height: 1.3em;
        }
      </style>

      <span id=${id} class="app-icon">
        <img src="${src}" class="app-icon-img" />
        <span class="app-icon-name">${name}</span>
      </span>
    `;

    const templateClone = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateClone);

    const element = this.shadowRoot.getElementById(id);
    element.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Handle a click on the icon.
   *
   * @param {Event} e - The click event.
   */
  handleClick(e) {
    const target = this.newWindow ? '_blank' : '_self';
    const features = 'appId=' + this.id;
    window.open(this.startUrl, target, features);
  }
}

// Register custom element
customElements.define('app-icon', AppIcon);
