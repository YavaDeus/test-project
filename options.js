"use strict";

function appendActions(actionList) {
	if (actionList) {
		var divActions = $("div.actions");
		for (let item of actionList.actions) {
			console.log(item);
			var textLigne = '<div class="ligne level'+item.level+'"><input type="text" value="'+item.label+'" /><input type="text" value="'+item.url+'" /></div>';

			divActions.prepend(textLigne);
		}
	}
}

function listActions() {
	console.log('List actions');

	chrome.storage.sync.get(['geniusActions'], function (items) {
		appendActions(new ActionList(items.geniusActions, 'GlobalLink'));
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


