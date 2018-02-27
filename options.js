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

	chrome.storage.sync.get(['geniusActions'], function (items) {
		appendActions(items.geniusActions);

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


