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
			var textLigne = '<div class="ligne level' + item.level + '"><a name="' + item.name + '" class="lien" '+(item.tooltip ? 'title="'+item.tooltip+'"' : '' )+'>' + item.label + '</a>';
			if (item.level == 1)
			{
				var tooltip = 'Mémoriser dans les '+(addclass == "div.lastpage" ? "pages courantes" : (addclass == "div.savedpages" ? "pages de référence" : "??"));
				textLigne += SVGBuilder.createActionCircle(addclass, item.name, tooltip, true);
				if (addclass == "div.savedpages")
				{
					textLigne += SVGBuilder.createActionRemove(item.name);
				}
			}
			textLigne += '</div>';
			divActions.append(textLigne);
			
			var lien = $("a.lien[name='" + item.name + "']");
			lien.on("click", function () {
				openTab(item.url);
			});
			let upSVG = $("svg[name='up" + item.name + "']");
			upSVG.on("click", function () {
				openTab(item.url);
			});
			let delSVG = $("svg[name='del" + item.name + "']");
			delSVG.on("click", function () {
				actionList.deleteLevel(item.name);
				$("div.ligne.level1 a.lien[name='" + item.name + "']").parent().remove();
				chrome.storage.sync.set({
					'geniusSavedPages': actionList
				}, function () {
					console.log('Dekete ok');
				});
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
function initGraphics() {
	var addClass = 'div.lastpage';
	var textLigne = SVGBuilder.createActionCircle(addClass, 'title1', 'Tune up your Genius', true);
	var divLine = $(".title span");		
	divLine.prepend(textLigne);

	addClass = 'div.savedpages';
	textLigne = SVGBuilder.createActionCircle(addClass, 'subtitle1');
	divLine = $(".s1.subtitle");		
	divLine.prepend(textLigne);

	addClass = 'div.lastpage';
	textLigne = SVGBuilder.createActionCircle(addClass, 'subtitle2');
	divLine = $(".s2.subtitle");
	divLine.prepend(textLigne);

	addClass = 'red';
	textLigne = SVGBuilder.createActionCircle(addClass, 'subtitle3');
	divLine = $(".s3.subtitle");
	divLine.prepend(textLigne);
}

function loadLastPage() {
	chrome.storage.sync.get(['geniusLastPage'], function (items) {
		appendActions("div.lastpage", new ActionList(items.geniusLastPage, 'NavigationLink'));
		console.log('Load last page done');
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initGraphics();
	initLists();
	loadLastPage();
}, false);
