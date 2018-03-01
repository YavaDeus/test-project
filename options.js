"use strict";

function appendLinks(actionList) {
	if (actionList) {
		var divActions = $("div.actions");
		for (let item of actionList.actions) {
			console.log(item);
			var textLigne = '<div class="ligne level'+item.level+'"><input type="text" value="'+item.label+'" /><input type="text" value="'+item.url+'" /></div>';

			divActions.prepend(textLigne);
		}
	}
}

function listReferences() {
	console.log('List actions');

	chrome.storage.sync.get(['geniusReferences'], function (items) {
		appendLinks(new ActionList(items.geniusReferences));
	});
}

function initOptions() {
	//listTags(preLoad, forceReload);
	listReferences();
	console.log(' Init done ');
}

document.addEventListener("DOMContentLoaded", function () {
	initOptions();
}, false);


