"use strict";

var linkArea = new Array(
	{class:"references", color: "green"},
	{class: "savedpages", color: "orange"},
	{class: "lastpage", color: "red"});

var activeGroupe = false;

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
			let objectLigne = $('<div>', {
				class:"ligne"
			});

			let objectSpan = $('<span>', {
				name: item.name,
				text: item.label
			});

			objectSpan.appendTo(objectLigne);

			divTags.append(objectLigne);
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

function appendLinks(linkAreaIndex, actionList) {
	if (actionList) {
		var addClass = "."+linkArea[linkAreaIndex].class;

		var divLinks = $(addClass);
		for (let item of actionList.actions) {
			let objectLigne = $('<div>', {
				class:"ligne level" + item.level
			});

			let objectLien = $('<a>', {
				name: item.name,
				class:"lien",
				title: item.tooltip,
				text: item.label
			});

			objectLien.appendTo(objectLigne);

			if (item.childs && item.childs.actions.length > 0 && linkAreaIndex < 2)
			{
				var objectTriangle = SVGBuilder.createTriangleObject();
				objectTriangle.appendTo(objectLigne);
			}

			if (item.level == 1 && linkAreaIndex > 0)
			{
				let tooltip = 'Mémoriser dans les '+(addClass == ".lastpage" ? "pages courantes" : (addClass == ".savedpages" ? "pages de référence" : "??"));
				let objectCircle = SVGBuilder.createActionCircleObject(linkArea[linkAreaIndex-1].color, item.name, tooltip, true);
				objectCircle.appendTo(objectLigne);

				let objectCircleRemove;
				if (linkAreaIndex == 1)
				{
					objectCircleRemove =  SVGBuilder.createActionRemoveObject(item.name);
					objectCircleRemove.appendTo(objectLigne);

					objectCircleRemove.on("click", function () {
						actionList.deleteByName(item.name);
						StorageManager.saveActionList('geniusSavedPages', actionList);
						objectLigne.remove();
						$(addClass+' div.groupe[name="gr' + item.name+'"]').remove();
					});
				}

				objectCircle.on("click", function () {
					var listDestination;
					if (linkAreaIndex == 1)
					{
						StorageManager.readActionList('geniusReferences', function(saveList) {
							item = saveList.add(item);
							StorageManager.saveActionList('geniusReferences', saveList, function() {
								actionList.deleteByName(item.name);
								StorageManager.saveActionList('geniusSavedPages', actionList, function() {
									window.close();
								});
								//objectLigne.detach().appendTo($("."+linkArea[linkAreaIndex - 1].class));
								//objectCircle.remove();
								//objectCircleRemove && objectCircleRemove.remove();
								//$(addClass+' div.groupe[name="gr' + item.name+'"]')
								//$(addClass+' div.groupe[name="gr' + item.name+'"]').detach().appendTo($("."+linkArea[linkAreaIndex - 1].class));
							});
						});
					}
					else
					{
						StorageManager.readActionList('geniusSavedPages', function(saveList) {
							item = saveList.add(item, 10);
							StorageManager.saveActionList('geniusSavedPages', saveList, function() {
								window.close();
							});
							//objectLigne.appendTo($("."+linkArea[linkAreaIndex - 1].class));
							//$(addClass+' div.groupe[name="gr' + item.name+'"]').appendTo($("."+linkArea[linkAreaIndex - 1].class));
						});
					}
				});
			}
			objectLigne.appendTo(divLinks);

			let objectGroupe;
			if (item.childs && item.childs.actions.length > 0)
			{

				objectGroupe = $('<div>', {
					class:"ligne groupe"+(linkAreaIndex ==2 ? ' fixe' : ''),
					name: "gr" + item.name
				});
				objectGroupe.appendTo(divLinks);
				
				for (let subitem of item.childs.actions) {
					let objectSubLigne = $('<div>', {
						class:"ligne level" + subitem.level
					});

					let objectSubLien = $('<a>', {
						name: subitem.name,
						class:"lien",
						title: subitem.tooltip,
						text: subitem.label
					});
		
					objectSubLien.appendTo(objectSubLigne);
					objectSubLigne.appendTo(objectGroupe);

					objectSubLien.on("click", function () {
						openTab(subitem.url);
					});
				}
			}

			objectLigne.on("mouseover", function () {
				if (objectGroupe != activeGroupe)
				{
					!activeGroupe || activeGroupe.removeClass("visible");
					if (linkAreaIndex != 2 && objectGroupe)
					{
						objectGroupe.addClass("visible");
						activeGroupe = objectGroupe;
					}
					else
						activeGroupe = undefined;
				}
			});
			
			objectLien.on("click", function () {
				openTab(item.url);
			});
			
		}
	}
}


function listReferences(preLoad, forceReload) {
	console.log('List references');
	StorageManager.readActionList('geniusReferences', function(referenceList) {
		if (referenceList !== undefined)
		{
			appendLinks(0, referenceList);
			return;
		}
		if ((preLoad && referenceList === undefined) || forceReload) {
			StorageManager.saveActionList('geniusReferences', defaultReferenceLinks, function(referenceList) {
				appendLinks(0, defaultReferenceLinks);
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
		appendLinks(1, saveList);
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
	var objectLigne = SVGBuilder.createActionCircleObject(linkArea[1].color, 'title1', 'Tune up your Genius', true);
	var divLine = $(".title span");		
	divLine.prepend(objectLigne);

	objectLigne = SVGBuilder.createActionCircleObject(linkArea[0].color, 'subtitle1');
	divLine = $(".s1.subtitle");		
	divLine.prepend(objectLigne);

	objectLigne = SVGBuilder.createActionCircleObject(linkArea[1].color, 'subtitle2');
	divLine = $(".s2.subtitle");
	divLine.prepend(objectLigne);

	objectLigne = SVGBuilder.createActionCircleObject(linkArea[2].color, 'subtitle3');
	divLine = $(".s3.subtitle");
	divLine.prepend(objectLigne);
}

function loadLastPage() {
	StorageManager.readActionList('geniusLastPage', function(lastList) {
		appendLinks(2, lastList);
	});
}

document.addEventListener("DOMContentLoaded", function () {
	initGraphics();
	initLists();
	loadLastPage();
}, false);
