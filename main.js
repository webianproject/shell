/**
 * Webian Shell browser logic
 * http://webian.org
 * 
 * Copyright @authors 2011
 *
 * @author Ben Francis http://tola.me.uk
 * 
 * Webian Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Webian Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Webian Shell in the LICENSE file. If not, see 
 * <http://www.gnu.org/licenses/>.
 */

// Import Chromeless libraries
var favicon = require("favicon");
const url = require("url");

// Set up console for debugging
//console.log('hello world');

// History of URLs
var urlHistory = [];
// Index of current point in URL history
var currentUrlIndex = 0;

/**
 * Clock
 * 
 * Updates the time on the clock when called
 */
function clock() {
	var date = new Date();
	// get hours as string
	var hours = date.getHours()+'';
	// pad with zero if needed
	if(hours.length < 2) { hours = "0" + hours; }
	// get minutes as string
	var minutes = date.getMinutes()+'';
	// pad with zero if needed
	if(minutes.length < 2) { minutes = "0" + minutes; }
	var time = hours + ":" + minutes;
	$('#clock').text(time);
}

/**
 * Make iFrame
 * 
 * Creates a special iFrame which acts like a browser and will contain the
 * content of a new window. Event listeners are added to monitor progress
 * of page loading.
 * 
 * @return new iFrame object
 */
function makeIframe(windowId) {
	var iFrame = document.createElement("iframe");
	$(iFrame).attr("privilege", "content");
	$(iFrame).attr("class", "window_iframe");
	
	var url_input = $('#window_' + windowId + ' .url_input');

	// Add event listeners to iFrame...	

	// Check progress of page load...
	iFrame.addEventListener("ChromelessDOMProgress", function (e) {
		$(url_input).addClass('loading');
		$(url_input).css('-moz-background-size', e.percent+"%");
		$(url_input).css('background-size', e.percent+"%");
		}
	,false);

	// When page starts to load...
	iFrame.addEventListener("ChromelessDOMLoadStart", function(e) {
		// Update address bar
		$(url_input).val(e.url);
		// Set go button as stop button
		$("#window_" + windowId + " .go_button").attr("src", "stop.png");
		// If URL has changed, add to history and update index
		if (e.url !== urlHistory[windowId][urlHistory[windowId][0]]) {
			// Remove previous future if new future being created!
			if (urlHistory[windowId][0] < urlHistory[windowId].length) {
				urlHistory[windowId].splice(
					urlHistory[windowId][0] + 1,
					urlHistory[windowId].length - urlHistory[windowId][0]);
			}
			
			// Add new URL to history
			urlHistory[windowId].push(e.url);
			
			// Update index
			urlHistory[windowId][0]++;
		}
	}, false, true);

	// When page and contents are completely loaded...
	iFrame.addEventListener("ChromelessDOMLoadStop", function(e) {
		// Set URL input textbox to loaded state
		$(url_input).removeClass('loading');
		$(url_input).addClass('loaded');
		// Change "Go" button to "Refresh"
		$('#window_' + windowId + ' .go_button').attr("src", "refresh.png");
		// Display document title if set
	}, false, true);

	// When page and contents are completely loaded...
	iFrame.addEventListener("ChromelessDOMTitleChange", function(e) {
		var document_title = e.title;
		if(document_title) {
			$('#window_' + windowId + ' .document_title').addClass("active");
			$('#window_' + windowId + ' .document_title').text(document_title);
		} else {
			$('#window_' + windowId + ' .document_title').removeClass("active");
		}
	}, false, true);

	return iFrame;
}

/**
 * Fix Up Iframe with CommonsJS ( web-content ) to DOM interfaces. 
 * 
 * Call this function for each iframe if you want to get standard DOM events ( Chromeless 0.1 ) 
 */
function fixUpIframe(iframeElement) {
      var pm = require('web-content').ProgressMonitor();
      pm.attach(iframeElement);
      pm.on('title-change', function(title) {
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent("ChromelessDOMTitleChange", true, false);
         evt.title = title;
         iframeElement.dispatchEvent(evt);
      });
      pm.on('load-start', function() {
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent("ChromelessDOMLoadStart", true, false);
         iframeElement.dispatchEvent(evt);
      });
      pm.on('progress', function(percent) {
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent("ChromelessDOMProgress", true, false);
         evt.percent = percent;
         iframeElement.dispatchEvent(evt);
      });
      pm.on('load-stop', function() {
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent("ChromelessDOMLoadStop", true, false);
         iframeElement.dispatchEvent(evt);
      });
      pm.on('security-change', function(e) {
         var evt = document.createEvent("HTMLEvents");
         evt.initEvent("ChromelessDOMSecurityChange", true, false);
         evt.state = e.state;
         evt.strength = e.state;
         iframeElement.dispatchEvent(evt);
      });
      var currentIframeElementId = iframeElement.getAttribute("id");
      document.getElementById("window_template").addEventListener("DOMNodeRemoved", function(e){
         if(e.target.getAttribute("id") == currentIframeElementId) {
             console.log("It's me!, detaching ");
             pm.detach();
         }
      }, false);
}

/**
 * Register Window Event Listeners
 * 
 * Registers event listeners for the currently selected window to detect
 * user actions like go, back forward etc.
 * 
 * @param {String} windowId of window to register listeners for
 */
function registerWindowEventListeners(windowId) {
	var url_input = $("#window_" + windowId + " .url_input");
	var go_button = $("#window_" + windowId + " .go_button");

	// When URL input text box is selected, change "Refresh" button to "Go" button and remove loaded state
	$(url_input).focusin(function() {
		$(url_input).removeClass('loaded');
		$(go_button).attr("src", "go.png");
	});

	// When URL input box is de-selected and URL un-changed, change "Go" button back to "Refresh" button and set to loaded state
	$(url_input).focusout(function() {
		if ($(url_input).val() == urlHistory[currentUrlIndex]) {
			$(url_input).addClass('loaded');
			$(go_button).attr("src", "refresh.png");
		}
	});

	// Go/Stop/Refresh (Submit URL form or click go button)
	$("#window_" + windowId + " .url_form").submit(function() { 
		navigate($(this).parents(".window").attr("id").substring(7)); return false; 
	});
	$("#window_" + windowId + " .go_button").click(function() { 
		// If loading then act as stop button
		if($('#windows .selected .url_input').hasClass('loading')) {
			var window_iframe = $("#windows .selected .window_iframe")[0];
			require("iframe-controls").stopload(window_iframe);
			$(go_button).attr("src", "refresh.png");
		} else {
		// otherwise act as go/refresh
			navigate($(this).parents(".window").attr("id").substring(7));
		}
	});

	// Back
	$("#window_" + windowId + " .back_button").click(function() {
		if (urlHistory[windowId][0] < 2) return;
		$("#windows .selected .window_iframe").attr("src", 
			urlHistory[windowId][--urlHistory[windowId][0]]);
		urlHistory[windowId][0] = urlHistory[windowId][0];
    	});

	// Forward
	$("#window_" + windowId + " .forward_button").click(function() {
		if(urlHistory[windowId][0] + 1 >= urlHistory[windowId].length) return;
		$("#windows .selected .window_iframe").attr("src", 
			urlHistory[windowId][++urlHistory[windowId][0]]);
		urlHistory[windowId][0] = urlHistory[windowId][0];
		
	});

	// Select tab
	// TODO(tola): de-generalise this and put it somewhere more sensible
	$(".tab").click(function () {
		var tabId = $(this).attr("id");
		selectTab(tabId.substring(4));
	});

	// Close tab
	$("#window_" + windowId + " .close_button").click(function() {
		closeTab($(this).parents(".window").attr("id").substring(7));
	});
}

/**
 * Select Tab
 * 
 * Select a tab and its corresponding window
 *
 * @param {String} windowId of tab to be selected
 */
function selectTab(windowId) {
	// Activate windows container if not already active
	if (!$("#windows").hasClass("active")) {
		activateWindows();
	} 
	$("#windows .selected").removeClass("selected");
	$("#window_" + windowId).addClass("selected");
	$("#tabs .selected").removeClass("selected");
	$("#tab_" + windowId).addClass("selected");

}

/**
 * New Tab
 * 
 * Creates a new tab & corresponding window and selects that tab
 */
function newTab(url) {
	// Create new window from template
	var newWindow = $("#window_template").clone();
	
	// Generate unique ID for window
	var randomNumberString = Math.random() + "";
	var windowId = randomNumberString.substring(2);
	newWindow.attr("id", "window_" + windowId);

	// Add new window to interface
	$("#windows").append(newWindow);

        

	// Add corresponding tab
	$("#tabs ul").append('<li id="tab_' + windowId + 
		'" class="tab"><a href="javascript:null()"></a></li>');

	// Select new tab
	selectTab(windowId);

	// Add a new iFrame to new window
	var newIframe = makeIframe(windowId);
	$("#windows .selected .window_toolbar").after(newIframe);
	
        //Fixup the iframe with CommonJS to DOM bridge
        fixUpIframe(newIframe);
	// Register window event listeners
	registerWindowEventListeners(windowId);
	
	// Create history array for window, using first element as index
	urlHistory[windowId] = [];
	urlHistory[windowId][0] = 0;
	
	// Navigate to URL if provided
	if(url) {
		$("#windows .selected .url_input").val(url);
		navigate(windowId);
	}
}

/** 
 * Close Tab
 * 
 * Closes tab & window corresponding to provided windowId
 * 
 * @param {String} windowId
 */
function closeTab(windowId) {
	// Remove selected window & corresponding tab
	$("#window_" + windowId).remove();
	$("#tab_" + windowId).remove();

	// If no tabs are open, activate home screen
	if($(".window").length < 2) {
		activateHomeScreen();

	// otherwise, Select last remaining tab (not including the template window!)
	} else {
		var newLastWindowId = $(".window:not(#window_template)").last().attr("id").substring(7);
		selectTab(newLastWindowId);
	}
	
	// Remove browsing history for tab
	urlHistory.splice(windowId, 1);
}

/**
 * Navigate
 * 
 * Sets the src attribute of the iFrame belonging to the window specified by
 * windowId in order to navigate to a resource identified by the URI in the
 * address bar of that window. Also fetches favicon for the resource.
 * 
 * @param windowId of window to use
 */
function navigate(windowId) {
        // invoked when the user hits the go button or hits enter in url box
        var address = url.guess($.trim($("#windows .selected .url_input").val()));
        // trigger navigation        
        $("#windows .selected .window_iframe").attr("src", address);
        // Fetch favicon for window
        favicon.fetch(address, function(faviconUrl) {
        	var img = $("<img>").attr("src", faviconUrl);
        	img.attr("width", 16);
        	img.attr("height", 16);
        	$("#tab_" + windowId + " a").empty();
		$("#tab_" + windowId + " a").append(img);		
        });
}

/**
 * Activate Home Screen
 * 
 * Hides all windows and shows the home screen
 */
function activateHomeScreen() {
	$("#windows .selected").removeClass("selected");
	$("#tabs .selected").removeClass("selected");
	$("#windows").removeClass("active");
	$("#home_screen").addClass("active");
	$("#home_button").removeClass("active");
	$("#tabs").addClass("detached");
}

/**
 * Activate Windows
 * 
 * Hides the home screen and makes the windows container active
 */
function activateWindows() {
	$("#home_screen").removeClass("active");
	$("#windows").addClass("active");
	$("#home_button").addClass("active");
	$("#tabs").removeClass("detached");
}


/**
 * Full Screen
 * 
 * Toggle full screen mode
 */
function fullScreen() {
	const fullscreen = require("fullscreen");
	fullscreen.toggle(window);	
}


// When Shell starts up...
$(document).ready(function() {

	// Set clock to be updated every second	
	self.setInterval("clock()",1000);

	// Create first tab
	newTab("http://webian.org/shell/welcome/0.1");

	// Listen for requested new tabs
	$("#new_tab_button").click(function() {
		newTab();
	});

	// Shut down
	$("#power_button").click(function() {
		window.exit();
	});

	// Home
	$("#home_button").click(function() {
		activateHomeScreen();
	});
	
	// Wait for MS Windows to catch up, then toggle full screen mode
	setTimeout("fullScreen()", 2000);
});
