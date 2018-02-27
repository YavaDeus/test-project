"use strict";

function openTab(url) {
	console.log('open tab');
	chrome.windows.getLastFocused(function (fenetre) {
		chrome.tabs.query({
			url: url
		}, function (onglets) {
			if (onglets[0]) {
				chrome.tabs.update(onglets[0].id, {
					highlighted: true,
					active: true
				}, function (onglet) {
					console.log(onglet.url);
				});
			} else {
				chrome.tabs.create({
					url: url
				}, function (onglet) {
					console.log(onglet.url);
				});
			}
		});
	});
}

function appendTags(actionList) {
	if (actionList) {
		var divTags = $("div.tags");
		for (let item of actionList.actions) {
			var textLigne = '<div class="ligne"><span name="' + item.name + '">' + item.label + '</span></div>';

			divTags.append(textLigne);
		}
	}
}

function listTags(preLoad, forceReload) {
	console.log('List tags');
	chrome.storage.sync.get(['geniusTags'], function (items) {
		appendTags(new ActionList(items.geniusTags, 'Tag'));
		if ((preLoad && items.tags === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusTags': defaultTags
			}, function () {
				console.log('Preload tags ok');
				chrome.storage.sync.get(['geniusTags'], function (items) {
					appendTags(new ActionList(items.geniusTags, 'Tag'));
				});
			});

		}

	});
}

function appendActions(addclass, actionList) {
	if (actionList) {
		var divActions = $(addclass);
		for (let item of actionList.actions) {
			var textLigne = '<div class="ligne level' + item.level + '"><a name="' + item.name + '" class="lien" '+(item.tooltip ? 'title="'+item.tooltip+'"' : '' )+'>' + item.label + '</a></div>';
			divActions.append(textLigne);
			
			var lien = $("a.lien[name='" + item.name + "']");
			lien.on("click", function () {
				openTab(item.url);
			});
		}
	}
}

function listActions(preLoad, forceReload) {
	console.log('List actions');

	chrome.storage.sync.get(['geniusActions'], function (items) {
		appendActions("div.actions", new ActionList(items.geniusActions, 'GlobalLink'));
		if ((preLoad && items.geniusActions === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusActions': defaultGlobalLinks
			}, function () {
				console.log('Preload actions ok');
				chrome.storage.sync.get(['geniusActions'], function (items) {
					appendActions("div.actions", new ActionList(items.geniusActions, 'GlobalLink'));
				});

			});
		}
	});
}

function listSavedPages(forceReload) {
	console.log('List saved pages');

	chrome.storage.sync.get(['geniusSavedPages'], function (items) {
		appendActions("div.savedpages", new ActionList(items.geniusSavedPages, 'NavigationLink'));
		if (forceReload) {
			chrome.storage.sync.set({
				'geniusSavedPages': {}
			}, function () {
				console.log('reset saved pages ok');

			});
		}
	});
}

function initLists() {
	var preLoad = true;
	var forceReload = false;
	listTags(preLoad, forceReload);
	listActions(preLoad, forceReload);
	listSavedPages(forceReload);
	console.log('Init done ');
}

function loadLastPage() {
	chrome.storage.sync.get(['geniusLastPage'], function (items) {
		appendActions("div.lastpage", new ActionList(items.geniusLastPage, 'NavigationLink'));
		console.log('Load last page done');
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initLists();
	loadLastPage();
}, false);
