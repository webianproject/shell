/**
 * Webian Shell.
 *
 * Main script used by qbrt to load index.html as chrome.
 */
'use strict';

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;
const { console } = Cu.import('resource://gre/modules/Console.jsm', {});
const { Runtime } = Cu.import('resource://qbrt/modules/Runtime.jsm', {});
const { Services } = Cu.import('resource://gre/modules/Services.jsm', {});

const WINDOW_URL = 'chrome://app/content/chrome/shell.html';

const WINDOW_FEATURES = [
  'chrome',
  'dialog=no',
  'all',
  'width=1024',
  'height=768',
].join(',');

// On startup, activate ourselves, since starting up from Node doesn't do this.
// TODO: do this by default for all apps started via Node.
if (Services.appinfo.OS === 'Darwin') {
  Cc['@mozilla.org/widget/macdocksupport;1'].getService(Ci.nsIMacDockSupport).activateApplication(true);
}

console.log('Starting Webian Shell...');

const window = Services.ww.openWindow(null, WINDOW_URL, '_blank', WINDOW_FEATURES, null);
window.fullScreen = true;

// Comment this out to disable Dev Tools
Runtime.openDevTools(window);
