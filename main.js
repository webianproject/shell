/**
 * Webian Shell.
 *
 * Main script which loads shell.html as chrome.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow;

function startShell () {
 // Create the main window
 mainWindow = new BrowserWindow({width: 800, height: 600});
 mainWindow.setFullScreen(true);
 // Load shell.html as chrome
 mainWindow.loadURL(url.format({
   pathname: path.join(__dirname, 'chrome/shell.html'),
   protocol: 'file:',
   slashes: true
 }));
 // Open DevTools
 mainWindow.webContents.openDevTools();
 // Emitted when the window is closed.
 mainWindow.on('closed', function () {
   // Dereference the window object
   mainWindow = null;
   // Quit Electron
   app.quit();
 });
};

// Start Shell when Electron is ready
app.on('ready', startShell);
