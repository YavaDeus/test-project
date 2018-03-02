"use strict";

function createLastPage() {
	var page = $("h1.header_with_cover_art-primary_info-title")[0];
	var artist = $("a.header_with_cover_art-primary_info-primary_artist")[0];
	var album = $("a[ng-bind='album.name']")[0];
	var producedby = $("expandable-list[label='Produced by'] a:not([ng-click=\"ctrl.show_more()\"])");
	var writtenby = $("expandable-list[label='Written By'] a:not([ng-click=\"ctrl.show_more()\"])");
	var featuring = $("expandable-list[label='Featuring'] a:not([ng-click=\"ctrl.show_more()\"])");
	var writers = $("expandable-list[label='Writers'] a:not([ng-click=\"ctrl.show_more()\"])");
	

	var lastPage;
	if (page)
		lastPage = new GlobalLink(0, page.innerText, window.location.href, 'Titre');
	else
	{
		page = $("h1.profile_identity-name_iq_and_role_icon")[0];
		if (page)
			lastPage = new GlobalLink(0, page.firstChild.data, window.location.href, 'Artiste');
	}
	if (artist)
		lastPage.childs.addDedupeLink(new SubLink(0, artist.innerText, artist.href, 'Artiste'));
	if (album)
		lastPage.childs.addDedupeLink(new SubLink(0, album.innerText, album.href, 'Album'));
	if (producedby.length > 0)
	{
		for (let item of producedby)
		{
			lastPage.childs.addDedupeLink(new SubLink(0, item.innerText, item.href, 'Produced by'));
		}
	}
	if (writtenby.length > 0)
	{
		for (let item of writtenby)
		{
			lastPage.childs.addDedupeLink(new SubLink(0, item.innerText, item.href, 'Written by'));
		}
	}
	if (writers.length > 0)
	{
		for (let item of writers)
		{
			lastPage.childs.addDedupeLink(new SubLink(0, item.innerText, item.href, 'Writers'));
		}
	}
	if (featuring.length > 0)
	{
		for (let item of featuring)
		{
			lastPage.childs.addDedupeLink(new SubLink(0, item.innerText, item.href, 'Featuring'));
		}
	}

	return lastPage;
}

function proceed()
{
	var theLastPage = createLastPage();
	if (theLastPage)
	{
		var buttonContainer = $("h1.header_with_cover_art-primary_info-title").parent();

		if (buttonContainer.length == 0)
		{
			buttonContainer = $("div.profile_identity-text");
		}

		let objectButton = $('<button>', {
			id: "savePage"
		});

		let objectCircle = SVGBuilder.createActionCircleObject("orange", "openGEH", "Mémoriser la page dans Genius Editor Helper", true);
		objectCircle.appendTo(objectButton);
		objectButton.appendTo(buttonContainer);

		objectButton.on("click", function () {
			theLastPage = createLastPage();
			savePage(theLastPage);
		});
	}

	console.log('Save last page');
	var lastPages = new ActionList();
	lastPages.name = 'geniusLastPage';
	lastPages.add(theLastPage);
	StorageManager.saveActionList('geniusLastPage', lastPages);
}


function savePage(currentPage)
{
	StorageManager.readActionList('geniusSavedPages', function(saveList) {
		saveList.add(currentPage, 10);
		StorageManager.saveActionList('geniusSavedPages', saveList);
	});
}

window.setTimeout(function() {
	proceed();
}, 3000);