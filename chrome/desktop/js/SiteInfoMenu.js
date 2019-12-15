/**
 * Site Info Menu.
 *
 * Displays information about the current website.
 */
class SiteInfoMenu {

  /*
   * Constructor.
   * 
   * @param Element browserWindow The current browser window element.
   * @param number x x co-ordinate in pixels at which to place menu.
   * @param number y y co-ordinate in pixels at which to place menu.
   * @param string title Title of web page or app name
   * @param string iconUrl URL of web page's icon or app icon
   * @param boolean app True if web app manifest detected
   * @return Element The rendered menu HTML element.
   */    
  constructor(browserWindow, x, y, title, iconUrl, app) {
    this.browserWindow = browserWindow;
    return this.render(browserWindow, x, y, title, iconUrl, app);
  }
  
  /*
   * Generate site info menu view.
   *
   * @param string title Title of web page or app name
   * @param string iconUrl URL of web page's favicon or app icon
   * @return string View HTML as a string.
   */ 
  view(title, iconUrl, app) {
    var appOrSite = app ? 'App' : 'Site';
    return `<div class="scrim"></div>
    <menu class="site-info">
      <h1>Pin ${appOrSite}</h1>
      <img class="app-icon" src="${iconUrl}" />
      <span class="app-name">${title}</span>
      <button class="pin-button">Pin</button>
    </menu>`;
  }

  /*
   * Render site info menu.
   * 
   * @param Element browserWindow The current browser window element.
   * @param number x x co-ordinate in pixels at which to place menu.
   * @param number y y co-ordinate in pixels at which to place menu.
   * @param string title Title of web page or app name 
   * @param string iconUrl URL of web page's favicon or app icon
   * @param boolean app True if app manifest detected.
   * @return Element The rendered menu HTML element.
   */    
  render(browserWindow, x, y, title, iconUrl, app) {
    // Add menu to the DOM
    this.browserWindow.insertAdjacentHTML('beforeend', this.view(title,
      iconUrl, app));
    this.scrimElement = browserWindow.getElementsByClassName('scrim')[0];
    this.menuElement = browserWindow.getElementsByClassName('site-info')[0];
    this.menuElement.style.left = x + 'px';
    this.menuElement.style.top = y + 'px';
    // Close menu if scrim is clicked (scrim covers the whole screen)
    this.scrimElement.addEventListener('click', (function() {
      this.menuElement.remove();
      this.scrimElement.remove();
    }).bind(this));
    return this.element;
  }
   
}
