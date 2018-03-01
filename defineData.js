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
		//Gestion des doublons
		var name;
		for (let item of this.actions) {
			if (item.url === action.url && item.level === action.level)
			{
				name = item.name;
				break;
			}
		}
		if (name)
			this.deleteByName(name);
			
		if (this.length >= limit)
		{
			this.actions.shift();
		}

		action.id = this.nextId();
		action.listName = this.name;

		this.actions.push(action);
		return action;
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

	static createActionCircle(groupe, name, tooltip, drawArrow){
		var balise = '';
		if (groupe != "div.actions")
		{
			balise += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" preserveAspectRatio="XMidYMid meet" name="up'+name+'">';
			if (tooltip)
				balise += '<title>'+tooltip+'</title>';
			balise += '<circle cx="112" cy="112" r="56" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : "red"))+'" stroke-width="56" fill="transparent" />';
			if (drawArrow)
				balise += '<polygon points="160,224 168,184 216,184 112,112" style="fill:lime;stroke:purple;stroke-width:8" />';
			balise += '</svg>';
		}
		return balise;
	}

	static createActionRemove(name){
		var balise = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 224" preserveAspectRatio="XMidYMid meet" name="del'+name+'">';
		balise += '<title>Supprimer</title>';
		balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';

		balise += '<line x1="72" y1="72" x2="48" y2="48" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
		balise += '<line x1="152" y1="152" x2="176" y2="176" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
		balise += '<line x1="72" y1="152" x2="48" y2="176" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';
		balise += '<line x1="152" y1="72" x2="176" y2="48" style="stroke:rgb(255,0,0);stroke-width:12" filter="url(#f1)" />';

		balise += '<line x1="112" y1="80" x2="112" y2="32" style="stroke:rgb(255,0,0);stroke-width:8" />';
		balise += '<line x1="32" y1="112" x2="80" y2="112" style="stroke:rgb(255,0,0);stroke-width:8"  />';
		balise += '<line x1="112" y1="144" x2="112" y2="192" style="stroke:rgb(255,0,0);stroke-width:8" />';
		balise += '<line x1="144" y1="112" x2="192" y2="112" style="stroke:rgb(255,0,0);stroke-width:8" />';
		balise += '<polygon points="160,224 168,184 216,184 112,112" style="fill:red;stroke:purple;stroke-width:8" />';
		balise += '</svg>';
		return balise;
	}
}