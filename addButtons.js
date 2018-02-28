"use strict";

function createList() {
	var page = $("h1.header_with_cover_art-primary_info-title")[0];
	var artist = $("a.header_with_cover_art-primary_info-primary_artist")[0];
	var album = $("a[ng-bind='album.name']")[0];
	var writtenby = $("expandable-list[label='Written By'] a:not([ng-click=\"ctrl.show_more()\"])");
	var featuring = $("expandable-list[label='Featuring'] a:not([ng-click=\"ctrl.show_more()\"])");
	var writers = $("expandable-list[label='Writers'] a:not([ng-click=\"ctrl.show_more()\"])");
	

	var lastPage = new ActionList();
	if (page)
		lastPage.add(new NavigationLink(0, page.innerText, 1, window.location.href, 'Titre'));
	else
	{
		page = $("h1.profile_identity-name_iq_and_role_icon")[0];
		if (page)
			lastPage.add(new NavigationLink(0, page.firstChild.data, 1, window.location.href, 'Artiste'));
	}
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
	if (writers.length > 0)
	{
		for (let item of writers)
		{
			lastPage.addDedupe(new NavigationLink(0, item.innerText, 2, item.href, 'Writers'));
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

		if (buttonContainer.length == 0)
		{
			buttonContainer = $("div.profile_identity-text");
		}
		var textButton = '<button id="savePage">';
		textButton += SVGBuilder.createActionCircle("div.lastpage", "openGEH", "Mémoriser la page dans Genius Editor Helper", true);
		textButton += '</button>';
		buttonContainer.append(textButton);

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