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
	StorageManager.readActionList('geniusTags', function(tagList) {
		if (tagList !== undefined)
		{
			appendTags(tagList);
			return;
		}
		if ((preLoad && tagList === undefined) || forceReload) {
			StorageManager.saveActionList('geniusTags', defaultTags, function(tagList) {
				appendTags(defaultTags);
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
				var textgroupe = '<div class="groupe" name="gr' + item.name + '">';
				textgroupe += '</div>';
				divActions.append(textgroupe);
				var divGroupe = $(addclass+' div.groupe[name="gr' + item.name+'"]');
				
				for (let subitem of item.childs.actions) {

					let subtextLigne = '<div class="ligne level' + subitem.level + '"><a name="' + subitem.name + '" class="lien" '+(subitem.tooltip ? 'title="'+subitem.tooltip+'"' : '' )+'>' + subitem.label + '</a>';
					subtextLigne += '</div>';

					divGroupe.append(subtextLigne);

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
				var listDestination;
				if (addclass == "div.savedpages")
				{
					StorageManager.readActionList('geniusReferences', function(saveList) {
						item = saveList.add(item);
						StorageManager.saveActionList('geniusReferences', saveList, function() {
							actionList.deleteByName(item.name);
							StorageManager.saveActionList('geniusSavedPages', actionList, function() {
								window.close();
							});
						});
					});
				}
				else
				{
					StorageManager.readActionList('geniusSavedPages', function(saveList) {
						item = saveList.add(item, 3);
						StorageManager.saveActionList('geniusSavedPages', saveList, function() {
							window.close();
						});
					});
				}
			});
			let delSVG = $(addclass+" svg[name='del" + item.name + "']");
			delSVG.on("click", function () {
				actionList.deleteByName(item.name);
				StorageManager.saveActionList('geniusSavedPages', actionList);
				$("div.ligne.level1 a.lien[name='" + item.name + "']").parent().remove();
				$(addclass+' div.groupe[name="gr' + item.name+'"]').remove();
			});
		}
	}
}


function listReferences(preLoad, forceReload) {
	console.log('List references');
	StorageManager.readActionList('geniusReferences', function(referenceList) {
		if (referenceList !== undefined)
		{
			appendLinks("div.actions", referenceList);
			return;
		}
		if ((preLoad && referenceList === undefined) || forceReload) {
			StorageManager.saveActionList('geniusReferences', defaultReferenceLinks, function(referenceList) {
				appendLinks("div.actions", defaultReferenceLinks);
			});
		}
	});
}

function listSavedPages(forceReload) {
	console.log('List saved pages');
	StorageManager.readActionList('geniusSavedPages', function(saveList) {
		if (forceReload || !saveList) {
			saveList = new ActionList();
			saveList.name = 'geniusSavedPages';
			StorageManager.saveActionList('geniusSavedPages', saveList);
		}
		appendLinks("div.savedpages", saveList);
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
	var objectLigne = SVGBuilder.createActionCircleObject(addClass, 'title1', 'Tune up your Genius', true);
	console.log(objectLigne);
	var divLine = $(".title span");		
	//divLine.prepend(textLigne);
	divLine.prepend(objectLigne);

	addClass = 'div.savedpages';
	objectLigne = SVGBuilder.createActionCircleObject(addClass, 'subtitle1');
	divLine = $(".s1.subtitle");		
	divLine.prepend(objectLigne);

	addClass = 'div.lastpage';
	objectLigne = SVGBuilder.createActionCircleObject(addClass, 'subtitle2');
	divLine = $(".s2.subtitle");
	divLine.prepend(objectLigne);

	addClass = 'red';
	objectLigne = SVGBuilder.createActionCircleObject(addClass, 'subtitle3');
	divLine = $(".s3.subtitle");
	divLine.prepend(objectLigne);
}

function loadLastPage() {
	StorageManager.readActionList('geniusLastPage', function(lastList) {
		appendLinks("div.lastpage", lastList);
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initGraphics();
	initLists();
	loadLastPage();
}, false);
