"use strict";

$("#nameButton").on("click", addTag);

function addTag() {
	chrome.tabs.create({url:"options.html"});

	var name = $("#nameButton").attr("name");
	console.log("name");
	console.log(name);
	//localStorage[' name '] = [name];
	//localStorage[' links '] = ["bob"];

	// Save it using the Chrome extension storage API.
	chrome.storage.sync.get(['tags'], function (items) {
		var tags = items.tags;
		tags.push({
			'name': name,
			'value': 'op--'
		});

		chrome.storage.sync.set({
			'tags': tags
		}, function () {
			console.log('Settings saved ');
		});
	});

}
