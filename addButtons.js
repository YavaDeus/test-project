"use strict";

function createList() {
	var page = $("h1.header_with_cover_art-primary_info-title")[0];
	var artist = $("a.header_with_cover_art-primary_info-primary_artist")[0];
	var album = $("a[ng-bind='album.name']")[0];
	var writtenby = $("expandable-list[label='Written By'] a");
	var featuring = $("expandable-list[label='Featuring'] a");

	var lastPage = new ActionList();
	if (page)
		lastPage.add(new NavigationLink(0, page.innerText, 1, window.location.href, 'Titre'));
	if (artist)
		lastPage.addDedupe(new NavigationLink(0, artist.innerText, 2, artist.href, 'Artiste'));
	if (album)
		lastPage.addDedupe(new NavigationLink(0, album.innerText, 2, album.href, 'Album'));
	if (writtenby.length > 0)
	{
		for (let item of writtenby)
		{
			lastPage.addDedupe(new NavigationLink(0, item.innerText, 2, item.href, 'Written by'));
		}
	}
	if (featuring.length > 0)
	{
		for (let item of featuring)
		{
			lastPage.addDedupe(new NavigationLink(0, item.innerText, 2, item.href, 'Featuring'));
		}
	}

	return lastPage;
}

function proceed()
{
	var theList = createList();
	if (theList.length() > 0)
	{
		var buttonContainer = $("h1.header_with_cover_art-primary_info-title").parent();
		buttonContainer.append('<button id="savePage">Enregistrer la page</button>');

		var saveButton = $("button#savePage");
		saveButton.on("click", function () {
			theList = createList();
			savePage(theList);
		});
	}

	console.log('Save last page');
	chrome.storage.sync.set({
		'geniusLastPage': theList
	});
}


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

window.setTimeout(function() {
	proceed();
}, 3000);