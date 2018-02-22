//chrome.extension.sendRequest( function () {
	var monElement = $(".group_icon");
	monElement.append('<button>Click Me!</button>');
	
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
	var data2;
	// Read it using the storage API
    chrome.storage.sync.get(['name'], function(items) {
      //message('Settings retrieved', items);
	  data2 = items.name;
	  console.log(data2);
    });
	//var data2=localStorage.getItem('name');

	
	var data=localStorage.getItem('links');  //récupérer la valeur
	/*localStorage.setItem(clef,valeur);  //donner une nouvelle valeur
	localStorage.removeItem(clef);  //supprimer l'item
	var clef=localStorage.key(n);  //récupérer la clef du n item.
	localStorage.clear();  //vider localStorage
	localStorage.length();  //le nombre de clef de localStorage*/

//});
console.log(data);