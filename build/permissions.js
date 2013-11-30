let secMan = Cc["@mozilla.org/scriptsecuritymanager;1"]
               .getService(Ci.nsIScriptSecurityManager);
var appId = 'foo';
var rootURL = '/';
let principal = secMan.getAppCodebasePrincipal(Services.io.newURI(rootURL, null, null),
                                                 appId, false);
Services.perms.addFromPrincipal(principal, 'browser', Ci.nsIPermissionManager.ALLOW_ACTION);

let secMan = Cc["@mozilla.org/scriptsecuritymanager;1"].getService(Ci.nsIScriptSecurityManager);
