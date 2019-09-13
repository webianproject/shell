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
   * @param string title Title of web page 
   * @param string faviconUrl URL of web page's favicon
   * @return Element The rendered menu HTML element.
   */    
  constructor(browserWindow, x, y, title, faviconUrl) {
    this.browserWindow = browserWindow;
    return this.render(browserWindow, x, y, title, faviconUrl);
  }
  
  /*
   * Generate site info menu view.
   *
   * @param string title Title of web page 
   * @param string faviconUrl URL of web page's favicon
   * @return string View HTML as a string.
   */ 
  view(title, faviconUrl) {
    return `<div class="scrim"></div>
    <menu class="site-info">
      <h1>Pin Site</h1>
      <img class="app-icon" src="${faviconUrl}" />
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
   * @param string title Title of web page 
   * @param string faviconUrl URL of web page's favicon
   * @return Element The rendered menu HTML element.
   */    
  render(browserWindow, x, y, title, faviconUrl) {
    // Add menu to the DOM
    this.browserWindow.insertAdjacentHTML('beforeend', this.view(title,
      faviconUrl));
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