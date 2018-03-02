"use strict";

var linkArea = new Array(
	{class:"references", color: "green"},
	{class: "savedpages", color: "orange"},
	{class: "lastpage", color: "red"});
//var colorList = new Array("green","orange","red");

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

			//let objectText = $(item.label);
			//objectText.appendTo(objectLien);
			objectSpan.appendTo(objectLigne);
			//var textLigne = '<div class="ligne"><span name="' + item.name + '">' + item.label + '</span></div>';

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
		//console.log(addclass);
		//console.log(divLinks);
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

			//let objectText = $(item.label);
			//objectText.appendTo(objectLien);
			objectLien.appendTo(objectLigne);

			//let textLigne = '<div class="ligne level' + item.level + '"><a name="' + item.name + '" class="lien" '+(item.tooltip ? 'title="'+item.tooltip+'"' : '' )+'>' + item.label + '</a>';
			if (item.level == 1 && linkAreaIndex > 0)
			{
				let tooltip = 'Mémoriser dans les '+(addClass == ".lastpage" ? "pages courantes" : (addClass == ".savedpages" ? "pages de référence" : "??"));
				let objectCircle = SVGBuilder.createActionCircleObject(linkArea[linkAreaIndex-1].color, item.name, tooltip, true);
				objectCircle.appendTo(objectLigne);

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

				if (linkAreaIndex == 1)
				{
					let objectCircleRemove =  SVGBuilder.createActionRemoveObject(item.name);
					objectCircleRemove.appendTo(objectLigne);

					objectCircleRemove.on("click", function () {
						actionList.deleteByName(item.name);
						StorageManager.saveActionList('geniusSavedPages', actionList);
						objectLigne.remove();
						//$("div.ligne.level1 a.lien[name='" + item.name + "']").parent().remove();
						$(addClass+' div.groupe[name="gr' + item.name+'"]').remove();
					});
				}
			}
			//textLigne += '</div>';
			objectLigne.appendTo(divLinks);
			
			//divLinks.append(textLigne);
			if (item.childs)
			{
				let objectGroupe = $('<div>', {
					class:"ligne groupe",
					name: "gr" + item.name
				});
				//var textgroupe = '<div class="groupe" name="gr' + item.name + '">';
				//textgroupe += '</div>';
				objectGroupe.appendTo(divLinks);
				//divLinks.append(textgroupe);
				//var divGroupe = $(addclass+' div.groupe[name="gr' + item.name+'"]');
				
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
		
					//let objectText = $(item.label);
					//objectText.appendTo(objectLien);
					objectSubLien.appendTo(objectSubLigne);
					//let subtextLigne = '<div class="ligne level' + subitem.level + '"><a name="' + subitem.name + '" class="lien" '+(subitem.tooltip ? 'title="'+subitem.tooltip+'"' : '' )+'>' + subitem.label + '</a>';
					//subtextLigne += '</div>';
					objectSubLigne.appendTo(objectGroupe);
					//divGroupe.append(subtextLigne);

					//var lien = $(addclass+" a.lien[name='" + subitem.name + "']");
					objectSubLien.on("click", function () {
						openTab(subitem.url);
					});
				}
			}
			
			//var lien = $(addclass+" a.lien[name='" + item.name + "']");
			objectLien.on("click", function () {
				openTab(item.url);
			});
			//let upSVG = $(addclass+" svg[name='up" + item.name + "']");
			
			//let delSVG = $(addclass+" svg[name='del" + item.name + "']");
			
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
	//var addClass = 'div.lastpage';
	//var textLigne = SVGBuilder.createActionCircle(addClass, 'title1', 'Tune up your Genius', true);
	var objectLigne = SVGBuilder.createActionCircleObject(linkArea[1].color, 'title1', 'Tune up your Genius', true);
	//console.log(objectLigne);
	var divLine = $(".title span");		
	//divLine.prepend(textLigne);
	divLine.prepend(objectLigne);

	//addClass = 'div.savedpages';
	objectLigne = SVGBuilder.createActionCircleObject(linkArea[0].color, 'subtitle1');
	divLine = $(".s1.subtitle");		
	divLine.prepend(objectLigne);

	//addClass = 'div.lastpage';
	objectLigne = SVGBuilder.createActionCircleObject(linkArea[1].color, 'subtitle2');
	divLine = $(".s2.subtitle");
	divLine.prepend(objectLigne);

	//addClass = 'red';
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
