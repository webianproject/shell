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
  * @return {Object} The database object.
  */
  start: function() {
    this.db = new PouchDB(this.DB_NAME);
    this.db.info().then((function (info) {
      // If database empty then add some default apps.
      if (info.doc_count == 0) {
        this.populate();
      }
    }).bind(this));
    return this;
  },

  /**
   * Populate the database with default content.
   */
  populate: function() {
    //TODO: Figure out why this gets run twice on first run.
    // XHR can GET file:// URLs but fetch can not
    var request = new XMLHttpRequest();
    request.addEventListener('error', function(error) {
      console.error('Error fetching default sites ' + error);
    });
    request.onreadystatechange = (function() {
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
   }).bind(this);
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
  }
};
