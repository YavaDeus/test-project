"use strict";

class Action {
	constructor(id, label) {
		this.id = id;
		this.label = label;
		this.listName = '';
	}

	get type() {
		return this.constructor.name;
	}

	get name() {
		return this.listName + this.type + this.id;
	}

	toFlatObject()
	{
		var flatObject = {};
		flatObject.id = this.id;
		flatObject.label = this.label;
		flatObject.type = this.type;
		flatObject.name = this.name;

		return flatObject;
	}
}

class Tag extends Action {
	constructor(id, label, value) {
		super(id, label);
		this.value = value;
	}

	toFlatObject()
	{
		var flatObject = super.toFlatObject();
		flatObject.value = this.value;

		return flatObject;
	}
}

class Link extends Action {
	constructor(id, label, url, tooltip) {
		super(id, label);
		this.url = url;
		if (tooltip)
			this.tooltip = tooltip;
	}

	toFlatObject()
	{
		var flatObject = super.toFlatObject();
		flatObject.url = this.url;
		flatObject.tooltip = this.tooltip;

		return flatObject;
	}
}

class GlobalLink extends Link {
	constructor(id, label, url, tooltip, childs) {
		super(id, label, url, tooltip);
		if (childs)
		{
			childs.name = this.listName;
			this.childs = new ActionList({actions:childs.actions.map(x => new SubLink(x.id, x.label, x.url, x.tooltip)), name: label, type:"SubLink"});
		}
		else
		{
			this.childs = new ActionList();
			this.childs.name = label;
		}
	}

	get level() {
		return 1;
	}

	toFlatObject()
	{
		var flatObject = super.toFlatObject();
		flatObject.childs = this.childs.toFlatObject();
		flatObject.level = this.level;

		return flatObject;
	}
}

class SubLink extends Link {
	constructor(id, label, url, tooltip) {
		super(id, label, url, tooltip);
	}

	get level() {
		return 2;
	}

	toFlatObject()
	{
		var flatObject = super.toFlatObject();
		flatObject.level = this.level;

		return flatObject;
	}
}

class ActionList {
	constructor(flatObject) {
		this.actions = new Array(0);
		this.name;

		if (flatObject !== undefined) {
			this.name = flatObject.name;
			switch (flatObject.type) {
			case 'Tag':
				this.actions = flatObject.actions.map(x => new Tag(x.id, x.label, x.value));
				break;
			case 'Link':
				this.actions = flatObject.actions.map(x => new Link(x.id, x.label, x.url, x.toolptip));
				break;
			case 'GlobalLink':
				this.actions = flatObject.actions.map(x => new GlobalLink(x.id, x.label, x.url, x.toolptip, x.childs));

				break;
			case 'SubLink':
				this.actions = flatObject.actions.map(x => new SubLink(x.id, x.label, x.url, x.tooltip));
				break;
			default:
				this.actions = flatObject.actions.map(x => new Action(x.id, x.label));
			}
			for (let item of this.actions)
			{
				item.listName = this.name;
			}
		}
	}

	get length() {
		return this.actions.length;
	}

	get type() {
		return this.actions.length == 0 ? 'Action' : this.actions[0].type;
	}

	nextId() {
		if (this.actions.length > 0) {
			let idArray = this.actions.map(x => x.id);
			return Math.max(...idArray) + 1;
		} else {
			return 0;
		}
	}

	add(action, limit) {
		//Gestion des doublons de liens
		var name;
		if (this.type.endsWith("Link"))
		{
			for (let item of this.actions) {
				if (item.url === action.url && item.level === action.level)
				{
					name = item.name;
					break;
				}
			}
			if (name)
				this.deleteByName(name);

		}
		let shift = 0;
		if (this.length >= limit)
		{
			this.actions.shift();
			shift = 1;
		}

		action.id = this.nextId();
		action.listName = this.name;

		this.actions.push(action);
		return {item : action, shift : shift, nameDuplicate : name};
	}

	addDedupeLink(action)
	{
		for (let item of this.actions) {
			if (item.url === action.url && item.level === action.level && item.tooltip !== action.tooltip)
			{
				item.tooltip = item.tooltip + ', ' + action.tooltip;
				return;
			}
		}
		this.add(action);
	}

	deleteByName(name)
	{
		for (let i=0; i < this.actions.length; i++) {
			let item = this.actions[i];
			if (item.name === name)
			{
				this.actions.splice(i,1);
				break;
			}
		}
	}

	toFlatObject()
	{
		var flatObject = {};
		flatObject.actions = this.actions.map(x => x.toFlatObject());
		flatObject.name = this.name;
		flatObject.type = this.type;
		flatObject.length = this.length;
		return flatObject;
	}

}

class StorageManager {
	constructor() {

	}

	static saveActionList(storageName, element, callback)
	{
		var storeObject = {};
		storeObject[storageName] = element.toFlatObject();
		chrome.storage.sync.set(storeObject, function () {
			if (callback)
				callback();
		});
	}

	static readActionList(storageName, callback)
	{
		chrome.storage.sync.get([storageName], function (items) {
			if (callback)
			{
				if (!items || !items[storageName])
				{
					callback();
				}
				else{
					callback(new ActionList(items[storageName]));
				}
			}
		});
	}
}

class SVGBuilder {
	constructor() {
		
	}

	static get xmlns() {
		return "http://www.w3.org/2000/svg";
	}

	static createTriangleObject(color){
		if (!color) 
			color = "black";

		var domSVG = document.createElementNS(this.xmlns, "svg");
		domSVG.setAttributeNS (null, "viewBox", "0 0 200 200");
		domSVG.setAttributeNS (null, "preserveAspectRatio", "XMidYMid meet");
		domSVG.setAttributeNS (null, "class", "arrow");
		
		var domPolygon = document.createElementNS (this.xmlns, "polygon");
		domPolygon.setAttributeNS (null, "points", "10,10 190,10 100,190");
		domPolygon.setAttributeNS (null, "style", "fill:"+color+";stroke:"+color+";stroke-width:8");
		domSVG.appendChild(domPolygon);
		
		return $(domSVG);
	}
	

	static createActionCircleObject(color, name, tooltip, drawArrow){

		var domSVG = document.createElementNS(this.xmlns, "svg");
		domSVG.setAttributeNS (null, "viewBox", "0 0 224 224");
		domSVG.setAttributeNS (null, "preserveAspectRatio", "XMidYMid meet");
		domSVG.setAttributeNS (null, "name", "up"+name);
		
		if (tooltip)
		{
			var domTooltip = document.createTextNode(tooltip);
			var domTitle = document.createElementNS (this.xmlns, "title");
			domTitle.appendChild(domTooltip);
			domSVG.appendChild(domTitle);
		}
		var domCircle = document.createElementNS (this.xmlns, "circle");
		domCircle.setAttributeNS (null, "cx", "112");
		domCircle.setAttributeNS (null, "cy", "112");
		domCircle.setAttributeNS (null, "r", "56");
		domCircle.setAttributeNS (null, "stroke", color);
		domCircle.setAttributeNS (null, "stroke-width", "56");
		domCircle.setAttributeNS (null, "fill", "transparent");
		domSVG.appendChild(domCircle);
		if (drawArrow)
		{
			var domPolygon = document.createElementNS (this.xmlns, "polygon");
			domPolygon.setAttributeNS (null, "points", "160,224 168,184 216,184 112,112");
			domPolygon.setAttributeNS (null, "style", "fill:lime;stroke:purple;stroke-width:8");
			domSVG.appendChild(domPolygon);
		}

		return $(domSVG);
	}
	// static createActionCircle(groupe, name, tooltip, drawArrow){
	// 	var balise = '';
	// 	if (groupe != "div.references")
	// 	{
	// 		balise += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" preserveAspectRatio="XMidYMid meet" name="up'+name+'">';
	// 		if (tooltip)
	// 			balise += '<title>'+tooltip+'</title>';
	// 		balise += '<circle cx="112" cy="112" r="56" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : "red"))+'" stroke-width="56" fill="transparent" />';
	// 		if (drawArrow)
	// 			balise += '<polygon points="160,224 168,184 216,184 112,112" style="fill:lime;stroke:purple;stroke-width:8" />';
	// 		balise += '</svg>';
	// 	}
	// 	return balise;
	// }

	static createActionRemoveObject(name){

		var domSVG = document.createElementNS(this.xmlns, "svg");
		domSVG.setAttributeNS (null, "viewBox", "0 0 224 224");
		domSVG.setAttributeNS (null, "preserveAspectRatio", "XMidYMid meet");
		domSVG.setAttributeNS (null, "name", "del"+name);

		var domTooltip = document.createTextNode("Supprimer");
		var domTitle = document.createElementNS (this.xmlns, "title");
		domTitle.appendChild(domTooltip);
		domSVG.appendChild(domTitle);

		var domBlur = document.createElementNS (this.xmlns, "feGaussianBlur");
		domBlur.setAttributeNS (null, "in", "SourceGraphic");
		domBlur.setAttributeNS (null, "stdDeviation", "0");
		var domFilter = document.createElementNS (this.xmlns, "filter");
		domFilter.setAttributeNS (null, "id", "f1");
		domFilter.appendChild(domBlur);

		var domLineA1 = document.createElementNS (this.xmlns, "line");
		domLineA1.setAttributeNS (null, "x1", "72");
		domLineA1.setAttributeNS (null, "y1", "72");
		domLineA1.setAttributeNS (null, "x2", "48");
		domLineA1.setAttributeNS (null, "y2", "48");
		domLineA1.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:12");
		domLineA1.setAttributeNS (null, "filter", "url(#f1)");
		domSVG.appendChild(domLineA1);

		var domLineA2 = document.createElementNS (this.xmlns, "line");
		domLineA2.setAttributeNS (null, "x1", "152");
		domLineA2.setAttributeNS (null, "y1", "152");
		domLineA2.setAttributeNS (null, "x2", "176");
		domLineA2.setAttributeNS (null, "y2", "176");
		domLineA2.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:12");
		domLineA2.setAttributeNS (null, "filter", "url(#f1)");
		domSVG.appendChild(domLineA2);

		var domLineA3 = document.createElementNS (this.xmlns, "line");
		domLineA3.setAttributeNS (null, "x1", "72");
		domLineA3.setAttributeNS (null, "y1", "152");
		domLineA3.setAttributeNS (null, "x2", "48");
		domLineA3.setAttributeNS (null, "y2", "176");
		domLineA3.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:12");
		domLineA3.setAttributeNS (null, "filter", "url(#f1)");
		domSVG.appendChild(domLineA3);

		var domLineA4 = document.createElementNS (this.xmlns, "line");
		domLineA4.setAttributeNS (null, "x1", "152");
		domLineA4.setAttributeNS (null, "y1", "72");
		domLineA4.setAttributeNS (null, "x2", "176");
		domLineA4.setAttributeNS (null, "y2", "48");
		domLineA4.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:12");
		domLineA4.setAttributeNS (null, "filter", "url(#f1)");
		domSVG.appendChild(domLineA4);

		var domLineB1 = document.createElementNS (this.xmlns, "line");
		domLineB1.setAttributeNS (null, "x1", "112");
		domLineB1.setAttributeNS (null, "y1", "80");
		domLineB1.setAttributeNS (null, "x2", "112");
		domLineB1.setAttributeNS (null, "y2", "32");
		domLineB1.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:8");
		domSVG.appendChild(domLineB1);

		var domLineB2 = document.createElementNS (this.xmlns, "line");
		domLineB2.setAttributeNS (null, "x1", "32");
		domLineB2.setAttributeNS (null, "y1", "112");
		domLineB2.setAttributeNS (null, "x2", "80");
		domLineB2.setAttributeNS (null, "y2", "112");
		domLineB2.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:8");
		domSVG.appendChild(domLineB2);

		var domLineB3 = document.createElementNS (this.xmlns, "line");
		domLineB3.setAttributeNS (null, "x1", "112");
		domLineB3.setAttributeNS (null, "y1", "144");
		domLineB3.setAttributeNS (null, "x2", "112");
		domLineB3.setAttributeNS (null, "y2", "192");
		domLineB3.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:8");
		domSVG.appendChild(domLineB3);

		var domLineB4 = document.createElementNS (this.xmlns, "line");
		domLineB4.setAttributeNS (null, "x1", "144");
		domLineB4.setAttributeNS (null, "y1", "112");
		domLineB4.setAttributeNS (null, "x2", "192");
		domLineB4.setAttributeNS (null, "y2", "112");
		domLineB4.setAttributeNS (null, "style", "stroke:rgb(255,0,0);stroke-width:8");
		domSVG.appendChild(domLineB4);

		var domPolygon = document.createElementNS (this.xmlns, "polygon");
		domPolygon.setAttributeNS (null, "points", "160,224 168,184 216,184 112,112");
		domPolygon.setAttributeNS (null, "style", "fill:red;stroke:purple;stroke-width:8");
		domSVG.appendChild(domPolygon);

		return $(domSVG);
	}

	// static createActionRemove(name){
	// 	var balise = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" preserveAspectRatio="XMidYMid meet" name="del'+name+'">';
	// 	balise += '<title>Supprimer</title>';
	// 	balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';

	// 	balise += '<line x1="72" y1="72" x2="48" y2="48" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
	// 	balise += '<line x1="152" y1="152" x2="176" y2="176" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
	// 	balise += '<line x1="72" y1="152" x2="48" y2="176" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
	// 	balise += '<line x1="152" y1="72" x2="176" y2="48" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';

	// 	balise += '<line x1="112" y1="80" x2="112" y2="32" style="stroke:rgb(255,0,0);stroke-width:8" />';
	// 	balise += '<line x1="32" y1="112" x2="80" y2="112" style="stroke:rgb(255,0,0);stroke-width:8"  />';
	// 	balise += '<line x1="112" y1="144" x2="112" y2="192" style="stroke:rgb(255,0,0);stroke-width:8" />';
	// 	balise += '<line x1="144" y1="112" x2="192" y2="112" style="stroke:rgb(255,0,0);stroke-width:8" />';
	// 	balise += '<polygon points="160,224 168,184 216,184 112,112" style="fill:red;stroke:purple;stroke-width:8" />';
	// 	balise += '</svg>';
	// 	return balise;
	// }
}