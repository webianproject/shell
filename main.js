/**
 * Webian Shell.
 *
 * Main script which loads shell.html as chrome.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require('path');
const url = require('url');

let mainWindow;

function startShell () {
  // Create the main window
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  });
  
  // Workaround for https://github.com/electron/electron/issues/21259
  Menu.setApplicationMenu(null);

  // Load shell.html as chrome
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'chrome/shell.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
    // Quit Electron
    app.quit();
  });

  // Uncomment the following line to open developer tools for the main window
  //mainWindow.webContents.openDevTools();
};

// Start Shell when Electron is ready
app.on('ready', startShell);
