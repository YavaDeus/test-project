"use strict";
function init()
{
	localStorage['links'] = [
		"Genius Editor Helper 2", "toto"
	];
	console.log("test 1");
}
console.log(localStorage['name']);

$("#nameButton").on("click", addTag);

function addTag()
{
	

    
	
	var name = $("#nameButton").attr("name");
	console.log("name");
	console.log(name);
	//localStorage['name'] = [name];
	//localStorage['links'] = ["bob"];
	
	// Save it using the Chrome extension storage API.
    chrome.storage.sync.set({'name1': name}, function() {
      console.log('Settings saved');
    });
	
}