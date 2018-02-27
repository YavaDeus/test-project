"use strict";

var page = $("h1.header_with_cover_art-primary_info-title")[0];
var artist = $("a.header_with_cover_art-primary_info-primary_artist")[0];
var album = $("a[ng-bind='album.name']")[0];
var featuring = $("span[innerText='Written By']");

console.log('Save last page');

var lastPage = new ActionList();
if (page)
	lastPage.add(new NavigationLink(0, page.innerText, 1, 'https://genius.com/tags/france', 'Titre'));
if (artist)
	lastPage.add(new NavigationLink(0, artist.innerText, 2, artist.href, 'Artiste'));
if (album)
	lastPage.add(new NavigationLink(0, album.innerText, 2, album.href, 'Album'));
if (writtenby)
	lastPage.add(new NavigationLink(0, writtenby.innerText, 2, '//toto', 'Written by'));
if (featuring)
	lastPage.add(new NavigationLink(0, featuring.innerText, 2, '//titi', 'Featuring'));

chrome.storage.sync.set({
	'geniusLastPage': lastPage
});

	//monElement.append('<button>Click Me!</button>');

	//<script src="data.json"></script>

	//var data = require('./data.json');
	//var data = $.getJSON(chrome.extension.getURL("manifest.json"));
	//var data = JSON.parse(chrome.extension.getURL("data.json"));

	/*chrome.extension.getPackageDirectoryEntry(function(root) {
	root.getFile("data.json", {}, function(fileEntry) {
	fileEntry.file(function(file) {
	var reader = new FileReader();
	reader.onloadend = function(e) {
	var data = JSON.parse(this.result);

	};
	reader.readAsText(file);
	});
	});
	});*/

	/*var xhr = new XMLHttpRequest;
	xhr.open("GET", chrome.runtime.getURL("data.json"));
	xhr.onreadystatechange = function() {
	if (this.readyState == 4) {
	console.log("request finished, now parsing");
	window.json_text = xhr.responseText;
	console.log(xhr.responseText);
	window.parsed_json = JSON.parse(xhr.responseText);
	console.log("parse results:");
	console.dir(window.parsed_json);
	}
	};
	xhr.send();*/
	//var data1;
	//var data2;
	//// Read it using the storage API
	//chrome.storage.sync.get(['name1'], function(items) {
	//  //message('Settings retrieved', items);
	//  data1 = items.name1;
	//  console.log(data1);
	//});
	//
	//chrome.storage.sync.get(['name2'], function(items) {
	//  //message('Settings retrieved', items);
	//  data2 = items.name2;
	//  console.log(data2);
	//});
	//var data2=localStorage.getItem('name');


	//var data=localStorage.getItem('links');  //récupérer la valeur
	/*localStorage.setItem(clef,valeur);  //donner une nouvelle valeur
	localStorage.removeItem(clef);  //supprimer l'item
	var clef=localStorage.key(n);  //récupérer la clef du n item.
	localStorage.clear();  //vider localStorage
	localStorage.length();  //le nombre de clef de localStorage*/

	//});
