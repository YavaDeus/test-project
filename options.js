"use strict";

function appendActions(actions) {
	if (actions) {
		var divActions = $("div.actions");
		for (let item of actions) {
			console.log(item);
			var textLigne = '<div class="ligne level'+item.level+'"><input type="text" value="'+item.name+'" /><input type="text" value="'+item.url+'" /></div>';

			divActions.prepend(textLigne);
		}
	}
}

function listActions() {
	console.log('List actions');

	chrome.storage.sync.get(['actions'], function (items) {
		appendActions(items.actions);

	});
}

function initOptions() {
	//listTags(preLoad, forceReload);
	listActions();
	console.log(' Init done ');
}

document.addEventListener("DOMContentLoaded", function () {
	initOptions();
}, false);


//$("#nameButton").on("click", addTag);
//
//function addTag() {
//	chrome.tabs.create({url:"options.html"});
//
//	var name = $("#nameButton").attr("name");
//	console.log("name");
//	console.log(name);
//	//localStorage[' name '] = [name];
//	//localStorage[' links '] = ["bob"];
//
//	// Save it using the Chrome extension storage API.
//	chrome.storage.sync.get(['tags'], function (items) {
//		var tags = items.tags;
//		tags.push({
//			'name': name,
//			'value': 'op--'
//		});
//
//		chrome.storage.sync.set({
//			'tags': tags
//		}, function () {
//			console.log('Settings saved ');
//		});
//	});
//
//}
