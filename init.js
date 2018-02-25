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
//						'name': 'soulignÃ©',
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
		for (let item of tags) {
			var textLigne = '<div class="ligne"><span name="'+item.id+'">' + item.name + '</span></div>';

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
						'id': '1',
						'name': 'gras',
						'value': '*'
					}, {
						'id': '2',
						'name': 'souligné',
						'value': '__m'
					}, {
						'id': '3',
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

function formatTarget(name) {
	var target = name.replace();
	//var re = /[^"/\\*?<>|:\]+_]/gi;
	var re = /[.^ton_caractÃ¨re_non_desirÃ©]/gi;
	console.log(name);
	console.log(target);
	return target.replace(re, '');

}

function appendActions(actions) {
	if (actions) {
		var divActions = $("div.actions");
		for (let item of actions) {
			console.log(item);
			var textLigne = '<div class="ligne level'+item.level+'"><a name="'+item.id+'" class="lien">' + item.name + '</a></div>';

			divActions.append(textLigne);
		}
	}
}

function listActions(preLoad, forceReload, initEventsFunction) {
	console.log('List actions');

	chrome.storage.sync.get(['actions'], function (items) {
		appendActions(items.actions);
		if ((preLoad && items.actions === undefined) || forceReload) {
			chrome.storage.sync.set({
				'actions': [{
						'id': '0',
						'url': 'https://genius.com/tags/france',
						'name': 'Ouvrir Genius France',
						'level': '1'
					},{
						'id': '1',
						'url': 'https://genius.com/albums/Genius-france/Guides-tutoriels',
						'name': 'Album tutos',
						'level': '1'
					},{
						'id': '2',
						'url': 'https://genius.com/Genius-france-fonctionnement-du-site-annotated',
						'name': 'Fonctionnement du site',
						'level': '2'
					}, {
						'id': '3',
						'url': 'https://genius.com/Genius-france-comment-ajouter-des-textes-sur-genius-annotated',
						'name': 'Comment ajouter des textes',
						'level': '2'
					}, {
						'id': '4',
						'url': 'https://genius.com/Genius-france-comment-annoter-correctement-annotated',
						'name': 'Comment annoter correctement',
						'level': '2'
					}, {
						'id': '5',
						'url': 'https://genius.com/Genius-france-guide-basique-html-annotated',
						'name': 'Guide basique HTML',
						'level': '2'
					}, {
						'id': '6',
						'url': 'https://genius.com/Genius-france-le-role-de-lediteur-annotated',
						'name': 'Le rôle de l\'éditeur',
						'level': '2'
					}, {
						'id': '7',
						'url': 'https://genius.com/Genius-france-effectif-genius-france-annotated',
						'name': 'Effectifs genius france',
						'level': '2'
					}, {
						'id': '8',
						'url': 'https://genius.com/Genius-france-role-des-genius-annotated',
						'name': 'Rôles des Genius',
						'level': '2'
					}, {
						'id': '9',
						'url': 'https://genius.com/Education-genius-france-glossaire-des-figures-de-style-annotated',
						'name': 'Glossaire des figures de style',
						'level': '1'
					}, {
						'id': '10',
						'url': 'https://genius.com/Genius-france-bannieres-annotated',
						'name': 'Page des bannières Genius France',
						'level': '1'
					}
				]
			}, function () {
				console.log('Preload actions ok ');
				chrome.storage.sync.get(['actions'], function (items) {
					appendActions(items.actions);
					initEventsFunction();
				});

			});
		}
		else{
			initEventsFunction();
		}

	});
}

function initLists() {
	var preLoad = true;
	var forceReload = false;
	listTags(preLoad, forceReload);
	listActions(preLoad, forceReload, initEvents);
	console.log(' Init done ');
}

function initEvents() {
	var liens = $(".lien");
	chrome.storage.sync.get(['actions'], function (items) {
		var iLien = 0;
		for (let action of items.actions) {
			var lien = $(".lien[name='" + action.id + "']")
				lien.on("click", function() {openTab(action.url);});
		}
		console.log(' Events done ');
	});
}

//function faireJoujou(fenetre) {
//	console.log(fenetre[0]);
//	//on fait joujou
//	chrome.tabs.update(fenetre[0].id, {
//		highlighted: true,
//		active: true
//	}, function (onglet) {
//		console.log(onglet);
//	});
//
//}
//
//function testFenetre() {
//	chrome.windows.getLastFocused(function (fenetre) {
//		chrome.tabs.query({
//			url: "https://genius.com/tags/france"
//		}, function (onglet) {
//			faireJoujou(onglet);
//		});
//		//chrome.tabs.getSelected(fenetre.id,function(onglet){faireJoujou(onglet);});
//	})
//}

document.addEventListener("DOMContentLoaded", function () {
	initLists();
	//initEvents();
}, false);
