/**
 * Places Database.
 *
 * Stores top sites, bookmarks and history.
 */

 var Places = {
  DB_NAME: 'places',
  DB_VERSION: 1,
  SITES_STORE: 'sites',
  db: null,
  broadcastChannel: null,

  /**
   * Start the Places Database.
   *
   * @return {Object} The Places object.
   */
  start: function() {
    this.broadcastChannel = new BroadcastChannel('system');
    return this.open();
  },

  /**
   * Open the database.
   *
   * @returns Promise which resolves upon successful database opening.
   */
  open: function() {
    return new Promise((function(resolve, reject) {
      var request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      request.onsuccess = (function(event) {
        this.db = event.target.result;
        resolve();
      }).bind(this);

      request.onerror = function() {
        reject(request.errorCode);
      };

      request.onupgradeneeded = this.upgrade.bind(this);
    }).bind(this));
  },

  /**
   * Upgrade database to new version.
   *
   * @param {Event} upgradeneeded event.
   */
  upgrade: function(event) {
    console.log('Upgrading Places database...');
    this.db = event.target.result;
    if(this.db.objectStoreNames.contains(this.SITES_STORE)) {
      console.log('Sites store already exists');
      return;
    }

    var objectStore = this.db.createObjectStore(this.SITES_STORE,
      { keyPath: 'id' });

    objectStore.createIndex('frecency', 'frecency', { unique: false });

    objectStore.transaction.oncomplete = (function() {
      console.log('Sites store created successfully');
      this.populate();
    }).bind(this);

    objectStore.transaction.onerror = function() {
      console.log('Error creating Sites store');
    };

  },

  /**
   * Populate the database with default content.
   */
  populate: function() {
    fetch('chrome://app/content/config/defaults/sites.json').then(
      (function(response) {
      if (!response.ok) {
        console.error('Bad network response while fetching default sites');
        return;
      }
      response.json().then((function(manifests) {
        var pinnedSites = [];

        manifests.forEach(function(manifestObject) {
          var siteObject = new Site(manifestObject);
          pinnedSites.push(siteObject.id); // Default sites are pinned by default
          this.addSite(siteObject);
        }, this);
        // Persist list of pinned sites in a special record
        this.addSite({
          'id': '{pinnedSites}',
          'list': pinnedSites
        }).then((function() {
          this.broadcastChannel.postMessage('siteupdated');
        }).bind(this));
      }).bind(this));
    }).bind(this))
    .catch(function(error) {
      console.error('Failed to fetch default sites: ' + error.message);
    });
  },

  /*
   * Add a site to the sites database.
   *
   * @param {Object} site A Site object.
   * @return {Promise} A Promise which resolves once the write is complete.
   */
  addSite: function(siteObject) {
    return new Promise((function(resolve, reject) {
      var transaction = this.db.transaction(this.SITES_STORE, 'readwrite');
      var objectStore = transaction.objectStore(this.SITES_STORE);
      var request = objectStore.add(siteObject);
      request.onsuccess = function() {
        console.log('Successfully added site to Places database with id ' + siteObject.id);
        resolve();
      }
      request.onerror = function() {
        console.error('Failed to add site to Places database with id ' + siteObject.id);
        reject();
      }
    }).bind(this));
  },

  /**
   * Get a site by its ID.
   *
   * @param {String} id An id is usually a hostname or hostname + scope path.
   * @return {Promise} A Promise which resolves with a Site object.
   */
  getSite: function(id) {
    return new Promise((function(resolve, reject) {
      var transaction = this.db.transaction(this.SITES_STORE);
      var objectStore = transaction.objectStore(this.SITES_STORE);
      var request = objectStore.get(id);
      request.onsuccess = function() {
        resolve(request.result);
      }
      request.onerror = function() {
        console.error('Error getting site with id ' + id);
        reject();
      }
    }).bind(this));
  },

  /**
   * Add or update site in Sites data store.
   *
   * @param {String} url URL of site.
   * @param {String} iconUrl URL of icon.
   */
  updateSite: function(url, iconUrl) {
    var transaction = this.db.transaction(this.SITES_STORE, 'readwrite');
    var objectStore = transaction.objectStore(this.SITES_STORE);
    var urlObject = new URL(url);
    var id = urlObject.hostname;
    var startUrl = urlObject.origin + '/';
    var readRequest = objectStore.get(id);
    readRequest.onsuccess = (function() {
      // If site doesn't exist, create it
      if (!readRequest.result) {
        var writeRequest = objectStore.add({
          'id': id,
          'startUrl': startUrl,
          'iconUrl': iconUrl,
          'frecency': 1
        });
      // Otherwise update site frecency
      } else {
        var result = readRequest.result;
        result.frecency = (result.frecency ? ++result.frecency : 1);
        var writeRequest = objectStore.put(result);
      }

      writeRequest.onsuccess = (function() {
        this.broadcastChannel.postMessage('siteupdated');
      }).bind(this);

      writeRequest.onerror = function() {
        console.error('Error updating site ' + id);
      };
    }).bind(this);
    readRequest.onerror = function() {
      console.error('Error reading site ' + id);
    }
  },

  /**
   * Get top sites ordered by frecency.
   *
   * @returns {Promise} which resolves to a list of site objects.
   */
  getTopSites: function() {
    return new Promise((function(resolve, reject) {
      var transaction = this.db.transaction(this.SITES_STORE);
      var objectStore = transaction.objectStore(this.SITES_STORE);
      var index = objectStore.index('frecency');
      var topSites = [];
      index.openCursor(null, 'prev').onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          topSites.push(cursor.value);
          cursor.continue();
        } else {
          resolve(topSites);
        }
      }
    }).bind(this));
  },

  /**
   * Get a collection of Site objects for pinned sites.
   *
   * @return {Promise} A Promise which resolves with a list of Site objects.
   */
  getPinnedSites: function() {
    return new Promise((function(resolve, reject) {
      var transaction = this.db.transaction(this.SITES_STORE);
      var objectStore = transaction.objectStore(this.SITES_STORE);
      // Get the list of pinned site IDs
      var request = objectStore.get('{pinnedSites}');
      request.onsuccess = (function() {
        if (!request.result || !request.result.list) {
          console.log('List of pinned sites was empty.');
          return;
        }
        var pinnedSiteIds = request.result.list;
        var pinnedSites = [];
        pinnedSiteIds.forEach(function(id, index, array) {
          this.getSite(id).then((function(site) {
            pinnedSites.push(site);
            // If list is complete, resolve Promise.
            if (index == (array.length - 1)) {
              resolve(pinnedSites);
            }
          }).bind(this));
        }, this);
      }).bind(this);
      request.onerror = function() {
        console.error('Failed to fetch list of pinned sites.');
      }
    }).bind(this));
  },

  /**
   * Clear all data from the Places database.
   */
  clear: function() {
    var transaction = this.db.transaction(this.SITES_STORE, 'readwrite');
    var objectStore = transaction.objectStore(this.SITES_STORE);
    var request = objectStore.clear();
    request.onsuccess = (function() {
      this.populate();
    }).bind(this);
  }
};
