/**
 * Web Apps.
 *
 * Maintains a list of pinned web apps from the database in memory.
 */
const WebApps = {
  /**
   * A map of app IDs (manifest URLs) to WebApp objects.
   */
  apps: {},

  /**
   * Initialise app list from database.
   *
   * @param Object database Initialised Database object.
   */
  init: function(database) {
    return new Promise((resolve, reject) => {
      this.db = database;
      this.db.getApps().then(manifests => {
        manifests.forEach(function(manifest) {
          var app = new WebApp(manifest, manifest.id, manifest.start_url);
          this.apps[app.id] = app;
        }, this);
        resolve();
      });
    });
  },

  /**
   * Get current list of pinned apps.
   *
   * @return Object Map of app IDs to WebApp objects.
   */
  getApps: function() {
    return this.apps;
  },

  /**
   * Get app by app ID.
   *
   * @return WebApp app with ID provided.
   */
  getApp: function(id) {
    return this.apps[id];
  }
}
