"use strict";

var page = $("h1.header_with_cover_art-primary_info-title")[0];
var artist = $("a.header_with_cover_art-primary_info-primary_artist")[0];
var album = $("a[ng-bind='album.name']")[0];
var writtenby = $("span[innerText='Written By']");
var featuring = $("span[innerText='Written By']");

console.log('Save last page');

var lastPage = new ActionList();
if (page)
	lastPage.add(new NavigationLink(0, page.innerText, 1, window.location.href, 'Titre'));
if (artist)
	lastPage.add(new NavigationLink(0, artist.innerText, 2, artist.href, 'Artiste'));
if (album)
	lastPage.add(new NavigationLink(0, album.innerText, 2, album.href, 'Album'));
if (writtenby)
	lastPage.add(new NavigationLink(0, writtenby.innerText, 2, '//toto', 'Written by'));
if (featuring)
	lastPage.add(new NavigationLink(0, featuring.innerText, 2, '//titi', 'Featuring'));

if (lastPage.length() > 0)
{
	var buttonContainer = $("h1.header_with_cover_art-primary_info-title").parent();
	buttonContainer.append('<button id="savePage">Enregistrer la page</button>');

	var saveButton = $("button#savePage");
	saveButton.on("click", function () {
		savePage(lastPage);
	});
}

chrome.storage.sync.set({
	'geniusLastPage': lastPage
});

function savePage(currentPage)
{
	chrome.storage.sync.get(['geniusSavedPages'], function (items) {
		var actionList = new ActionList(items.geniusSavedPages, 'NavigationLink');
		actionList.merge(currentPage, 3);
		chrome.storage.sync.set({
				'geniusSavedPages': actionList
			}, function () {
				console.log('Add page ok');
			});
	});
}
	
chrome.storage.sync.set({
	'geniusLastPage': lastPage
});
