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
		appendTags(new ActionList(items.geniusTags));
		if ((preLoad && items.tags === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusTags': defaultTags
			}, function () {
				console.log('Preload tags ok');
				chrome.storage.sync.get(['geniusTags'], function (items) {
					appendTags(new ActionList(items.geniusTags));
				});
			});

		}

	});
}

function appendLinks(addclass, actionList) {
	if (actionList) {
		var divActions = $(addclass);
		for (let item of actionList.actions) {
			let textLigne = '<div class="ligne level' + item.level + '"><a name="' + item.name + '" class="lien" '+(item.tooltip ? 'title="'+item.tooltip+'"' : '' )+'>' + item.label + '</a>';
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
			if (item.childs)
			{
				for (let subitem of item.childs.actions) {
					let subtextLigne = '<div class="ligne level' + subitem.level + '"><a name="' + subitem.name + '" class="lien" '+(subitem.tooltip ? 'title="'+subitem.tooltip+'"' : '' )+'>' + subitem.label + '</a>';
					subtextLigne += '</div>';
					divActions.append(subtextLigne);

					var lien = $(addclass+" a.lien[name='" + subitem.name + "']");
					lien.on("click", function () {
						openTab(subitem.url);
					});
				}
			}
			
			var lien = $(addclass+" a.lien[name='" + item.name + "']");
			lien.on("click", function () {
				openTab(item.url);
			});
			let upSVG = $(addclass+" svg[name='up" + item.name + "']");
			upSVG.on("click", function () {
				openTab(item.url);
			});
			let delSVG = $(addclass+" svg[name='del" + item.name + "']");
			delSVG.on("click", function () {
				actionList.deleteLevel(item.name);
				$("div.ligne.level1 a.lien[name='" + item.name + "']").parent().remove();
				chrome.storage.sync.set({
					'geniusSavedPages': actionList
				}, function () {
					console.log('Delete ok');
				});
			});
		}
	}
}


function listReferences(preLoad, forceReload) {
	console.log('List references');

	chrome.storage.sync.get(['geniusReferences'], function (items) {
		if (items.geniusReferences !== undefined)
		{
			appendLinks("div.actions", new ActionList(items.geniusReferences));
			return;
		}
		if ((preLoad && items.geniusReferences === undefined) || forceReload) {
			chrome.storage.sync.set({
				'geniusReferences': defaultReferenceLinks.toFlatObject()
			}, function () {
				console.log('Preload references ok');
				chrome.storage.sync.get(['geniusReferences'], function (items) {
					appendLinks("div.actions", new ActionList(items.geniusReferences));
				});

			});
		}
	});
}

function listSavedPages(forceReload) {
	console.log('List saved pages');

	chrome.storage.sync.get(['geniusSavedPages'], function (items) {
		appendLinks("div.savedpages", new ActionList(items.geniusSavedPages));
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
	listReferences(preLoad, forceReload);
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
		appendLinks("div.lastpage", new ActionList(items.geniusLastPage));
		console.log('Load last page done');
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initGraphics();
	initLists();
	loadLastPage();
}, false);
