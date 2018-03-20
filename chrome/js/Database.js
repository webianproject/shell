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
  * @return {Object} The database object.
  */
  start: function(populate) {
    this.db = new PouchDB(this.DB_NAME);
    this.db.info().then((function (info) {
      // If database empty and caller asked to populate it then add some default
      // apps
      if (populate && info.doc_count == 0) {
        this.populate();
      }
      // Listen for database changes
      this.listen();
    }).bind(this));
    return this;
  },

  /**
   * Populate the database with default content.
   */
  populate: function() {
    console.log('Populating database...');
    // XHR can GET file:// URLs but fetch can not
    var request = new XMLHttpRequest();

    request.addEventListener('load', (function() {
      if (!request.responseText) {
        return;
      }
      var manifests = JSON.parse(request.responseText);
      manifests.forEach(function(manifestObject) {
        manifestObject.icons[0].src = __dirname +
          '/../config/defaults/icons/' + manifestObject.icons[0].src;
        var app = new App(manifestObject);
        this.saveApp(app);
      }, this);
    }).bind(this));

    request.addEventListener('error', function(error) {
      console.error('Error fetching default sites ' + error);
    });

    request.open('GET', __dirname + '/../config/defaults/sites.json', true);
    request.send();
  },

  /**
   * Save App.
   *
   * @param App app App to save.
   */
  saveApp: function(app) {
    app.type = 'app'; // Document type for database.
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
   *
   * Get all apps in the database.
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
