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

function appendTags(tags) {
	if (tags) {
		var divTags = $("div.tags");
		for (let item of tags.actions) {
			var textLigne = '<div class="ligne"><span name="' + item.name + '">' + item.label + '</span></div>';

			divTags.append(textLigne);
		}
	}
}

function listTags(preLoad, forceReload) {
	console.log('List tags');
	chrome.storage.sync.get(['geniusTags'], function (items) {
		appendTags(items.geniusTags);
		if ((preLoad && items.tags === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusTags': defaultTags
			}, function () {
				console.log('Preload tags ok');
				chrome.storage.sync.get(['geniusTags'], function (items) {
					appendTags(items.geniusTags);
				});
			});

		}

	});
}

function formatTarget(name) {
	var target = name.replace();
	//var re = /[^"/\\*?<>|:\]+_]/gi;
	var re = /[.^ton_caractère_non_desiré]/gi;
	console.log(name);
	console.log(target);
	return target.replace(re, '');

}

function appendActions(addclass, actions) {
	if (actions) {
		var divActions = $(addclass);
		for (let item of actions.actions) {
			var textLigne = '<div class="ligne level' + item.level + '"><a name="' + item.name + '" class="lien">' + item.label + '</a></div>';

			divActions.append(textLigne);
		}
	}
}

function listActions(preLoad, forceReload, initEventsFunction) {
	console.log('List actions');

	chrome.storage.sync.get(['geniusActions'], function (items) {
		appendActions("div.actions", items.geniusActions);
		if ((preLoad && items.geniusActions === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusActions': defaultGlobalLinks
			}, function () {
				console.log('Preload actions ok');
				chrome.storage.sync.get(['geniusActions'], function (items) {
					appendActions("div.actions", items.geniusActions);
					initEventsFunction();
				});

			});
		} else {
			initEventsFunction();
		}

	});
}

function initLists() {
	var preLoad = true;
	var forceReload = false;
	listTags(preLoad, forceReload);
	listActions(preLoad, forceReload, initEventsAction);
	console.log('Init done ');
}

function initEventsAction() {
	chrome.storage.sync.get(['geniusActions'], function (items) {
		appendEvents(items.geniusActions)
	});
}

function initEventsLastPage() {
	chrome.storage.sync.get(['geniusLastPage'], function (items) {
		appendEvents(items.geniusLastPage)
	});
}

function appendEvents(actions) {
	if (actions) {
		for (let action of actions.actions) {
			
			var lien = $("a.lien[name='" + action.name + "']")
				lien.on("click", function () {
					openTab(action.url);
				});
		}
		console.log('Events done');
	}
}

function loadLastPage(initEventsFunction) {
	chrome.storage.sync.get(['geniusLastPage'], function (items) {
		console.log(items);
		appendActions("div.lastpage", items.geniusLastPage);
		initEventsFunction();
		console.log('Load last page done');
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initLists();
	//initEvents();
	loadLastPage(initEventsLastPage);
}, false);
