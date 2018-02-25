"use strict";

//function init()
//{
//	localStorage['links'] = [
//		"Genius Editor Helper 2", "toto"
//	];
//	console.log("test 1");
//}
//console.log(localStorage['name']);
//

//function firstLoadTags() {
//	chrome.storage.sync.get(['tags'], function (items) {
//		if (!items.tags) {
//			chrome.storage.sync.set({
//				'tags': [{
//						'name': 'gras',
//						'value': '*'
//					}, {
//						'name': 'souligné',
//						'value': '__m'
//					}, {
//						'name': 'italique',
//						'value': 'i--'
//					},
//				]
//			}, function () {
//				console.log('Preload tags ok');
//			});
//		}
//	});
//
//}

function appendTags(tags) {
	if (tags) {
		var divTags = $("div.tags");
		for (let item of tags) {
			var textLigne = '<div class="ligne"><span>' + item.name + '</span></div>';

			divTags.append(textLigne);
		}
	}
}

function listTags(preLoad, forceReload) {
	console.log('List tags');
	chrome.storage.sync.get(['tags'], function (items) {
		appendTags(items.tags);
		if ((preLoad && items.tags === undefined) || forceReload) {
			chrome.storage.sync.set({
				'tags': [{
						'name': 'gras',
						'value': '*'
					}, {
						'name': 'souligné',
						'value': '__m'
					}, {
						'name': 'italique',
						'value': 'i--'
					}
				]
			}, function () {
				console.log('Preload tags ok');
				chrome.storage.sync.get(['tags'], function (items) {
					appendTags(items.tags);
				});
			});

		}

	});
}

function appendActions(actions) {
	if (actions) {
		var divActions = $("div.actions");
		for (let item of actions) {
			var textLigne = '<div class="ligne"><a href="' + item.url + '" target="_blank">' + item.name + '</a></div>';

			divActions.append(textLigne);
		}
	}
}

function listActions(preLoad, forceReload) {
	console.log('List actions');

	chrome.storage.sync.get(['actions'], function (items) {
		appendActions(items.actions);
		if ((preLoad && items.actions === undefined) || forceReload) {
			chrome.storage.sync.set({
				'actions': [{
						'url': '//toto',
						'name': 'Guide 1'
					}, {
						'url': '//titi',
						'name': 'Guide 2'
					}, {
						'url': '//tete',
						'name': 'iGuide 3'
					}
				]
			}, function () {
				console.log('Preload actions ok ');
				chrome.storage.sync.get(['actions'], function (items) {
					appendActions(items.actions);
				});
			});

		}

	});

}

function initLists() {
	var preLoad = true;
	var forceReload = false;
	listTags(preLoad, forceReload);
	listActions(preLoad, forceReload);
	console.log(' Init done ');
}

document.addEventListener("DOMContentLoaded", function () {
	initLists();
}, false);

