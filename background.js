"use strict";

	// Save it using the Chrome extension storage API.
	chrome.runtime.onInstalled.addListener(
		function (details) {
			alert(details);
			chrome.storage.sync.set({'name1': 'toto', 'name2: titi'}, function() {
			  console.log('Settings init ok');
			});
		}
	);