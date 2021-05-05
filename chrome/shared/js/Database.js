/**
 * Database.
 *
 * The Shell Database is used to persist apps, bookmarks, history and settings.
 */
var Database = {
 DB_NAME: 'database',
 db: null, // The database object

 /**
  * Start the Database.
  *
  * @param {Boolean} populate Whether to populate the database if it's empty.
  * @return Promise Resolves with database object.
  */
  init: function(populate) {
    return new Promise((resolve, reject) => {
      this.db = new PouchDB(this.DB_NAME);
      this.db.info().then((info) => {
        // If database empty and caller asked to populate it then add some default
        // apps
        if (populate && info.doc_count == 0) {
          this.populate().then(() => {
            resolve()
          }).catch(() => {
            console.error('Failed to populate app database.');
            reject();
          });
        }
        // Listen for database changes
        this.listen();
        resolve();
      });
    });

  },

  /**
   * Populate the database with default content.
   *
   * @return Promise resolves when population complete.
   */
  populate: function() {
    console.log('Populating database...');
    return new Promise((resolve, reject) => {
      // XHR can GET file:// URLs but fetch can not
      var request = new XMLHttpRequest();

      request.addEventListener('load', (function() {
        if (!request.responseText) {
          return;
        }
        var manifests = JSON.parse(request.responseText);
        manifests.forEach(function(manifest) {
          manifest.icons[0].src = 'file://' + __dirname +
            '/../../config/defaults/icons/' + manifest.icons[0].src;
          this.saveApp(manifest, manifest._id);
        }, this);
        resolve();
      }).bind(this));

      request.addEventListener('error', function(error) {
        console.error('Error fetching apps from database ' + error);
        reject();
      });

      request.open('GET', __dirname + '/../../config/defaults/apps.json', true);
      request.send();
    });
  },

  /**
   * Save App.
   *
   * @param Object manifest of WebApp to save.
   * @param String URL manifest was fetched from (used as ID).
   */
  saveApp: function(manifest, manifestUrl) {
    var app = manifest;

    // Set id
    if (!app._id) {
      if (manifestUrl) {
        app._id = manifestUrl;
      } else {
        return;
      }
    }

    // Add document type for database
    app.type = 'app';

    this.db.put(app).then(function() {
      console.log('Saved app with ID ' + app._id);
    });
  },

  /**
   * Get Apps.
   *
   * Get all apps in the database.
   */
  getApps: function() {
    return new Promise((function(resolve, reject) {
      var apps = [];
      this.db.allDocs({include_docs: true}).then(function(result) {
        result.rows.forEach(function(row) {
          apps.push(row.doc);
        });
        resolve(apps);
      });
    }).bind(this));
  },

  /**
   * Get App by ID.
   */
  getApp: function(id) {
    return this.db.get(id);
  },

  /**
   * Listen for changes.
   */
  listen: function() {
    var changes = this.db.changes({
      since: 'now',
      live: true
      // Only broadcast change once changes have stopped for 100ms
    }).on('change', this.debounce(this.broadcastChange, 100)
    ).on('error', function(e) {
      console.error('Error listening for database changes ' + e);
    });
  },

  /**
   * Dispatch event to notify app of database change.
   */
  broadcastChange: function() {
    window.dispatchEvent(new CustomEvent('_databasechanged'));
  },

  /**
   * Debounce function calls.
   *
   * @param {function} fn Function to debounce.
   * @param {number} delay Milliseconds to wait.
   */
  debounce: function(fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
};
