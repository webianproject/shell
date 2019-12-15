/**
 * Web App Icon.
 *
 * An icon represents a web app.
 */
class WebAppIcon {

  /**
    * Web App Icon Constructor.
    *
    * @param {Object} webApp A WebApp object.
    * @param {String} target Open in current window (_self) or a new one (_blank).
    */
  constructor(webApp, target) {
    this.TARGET_ICON_SIZE = 64;
    this.id = webApp.id;
    this.container = document.getElementById('app-grid');
    this.id = webApp.id;
    this.startUrl = webApp.startUrl;
    this.name = webApp.getShortestName();
    this.iconUrl = webApp.getBestIconUrl(this.TARGET_ICON_SIZE);
    this.render(target);
    return this;
  }

  /**
   * Generate icon view.
   */
  view() {
    var style = 'background-image: url(' + this.iconUrl +  ');';
    return '<li id="icon-' + this.id +'" class="icon" style="' +
    style + '"><span class="icon-name">' + this.name + '</span></li>';
  }

  /**
   * Render icon.
   *
   * @param {String} target Open in current window (_self) or a new one (_blank).
   */
  render(target) {
    this.container.insertAdjacentHTML('beforeend', this.view());
    this.element = document.getElementById('icon-' + this.id);
    if (target && target == '_self') {
      this.element.addEventListener('click', this.navigate.bind(this));
    } else {
      this.element.addEventListener('click', this.open.bind(this));
    }
  }

  /**
   * Launch app in a new window.
   */
  open() {
    var features = 'appId=' + this.id;
    window.open(this.startUrl, '_blank', features);
    console.log('opening window at ' + this.startUrl);
  }

  /**
   * Navigate to app in current window.
   */
  navigate() {
    window.location.href = this.startUrl;
    console.log('navigating to ' + this.startUrl);
  }
}
