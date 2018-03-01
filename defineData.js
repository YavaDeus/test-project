"use strict";

class Action {
	constructor(id, label) {
		this.id = id;
		this.label = label;
	}

	get type() {
		return this.constructor.name;
	}

	get name() {
		return this.type + this.id;
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
			this.childs = new ActionList({actions:childs.actions.map(x => new SubLink(x.id, x.label, x.url, x.tooltip)), type:"SubLink"});
		}
		else
		{
			this.childs = new ActionList();
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

		if (flatObject !== undefined) {
			
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
		if (this.length >= limit)
		{
			this.actions.shift();
		}

		if (action.id == 0) {
			action.id = this.nextId();
		}
		this.actions.push(action);
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

	delete(name)
	{
		for (let i=0; i++; i < this.actions.length) {
			let item = this.actions[i];
			if (item.name === name)
			{
				//delete item;
				this.actions.splice(i,1);
				break;
			}
		}
	}

	toFlatObject()
	{
		var flatObject = {};
		flatObject.actions = this.actions.map(x => x.toFlatObject());
		flatObject.type = this.type;
		flatObject.length = this.length;

		return flatObject;
	}

	/*deleteLevel(name)
	{
		let newListActions = new Array(0);
		let level = 0;
		let startDelete = false;
		for (let item of this.actions) {
			if (item.name == name)
			{
				level = item.level;
				startDelete = true;
			}
			else if (!startDelete || item.level <= level) {
				newListActions.push(item);
				startDelete = false;
			}
		}
		this.actions = newListActions;
	}*/

	/*countLevel(level)
	{
		const reducerLevel = (accumulator, currentValue) => accumulator + (currentValue.level == level ? 1 : 0);
		return this.actions.reduce(reducerLevel, 0);
	}*/

	/*merge(list, nbMaxLevel1)
	{
		//Test d'élément déjà existant
		let fisrtLevelAction = list.actions[0];
		if (fisrtLevelAction.url)
		{
			for (let item of this.actions) {
				if (item.url == fisrtLevelAction.url && item.level == fisrtLevelAction.level)
					return;
			}
		}

		//Concatenation
		this.actions = this.actions.concat(list.actions);

		//Recalcul des indexes
		let id = 0;
		for (let item of this.actions) {
			item.id = id;
			item.name = item.getName();
			id ++;
		}

		//Gestion de la taille limite
		let nbLevel1 = this.countLevel(1);
		if (nbMaxLevel1 && nbMaxLevel1 < nbLevel1)
		{
			let difference = nbLevel1 - nbMaxLevel1;
			for (let i = 0; i < difference; i++)
			{
				this.deleteLevel(this.actions[0].name);
			}
		}

	}*/

}

class StorageManager {
	constructor() {

	}

	static save(storageName, element, callback)
	{

	}

	static read(storageName, element, callback)
	{

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

	// static createActionCircle28(size, groupe, name){
	// 	var balise = '';
	// 	if (groupe != "div.actions")
	// 	{
	// 		balise += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" preserveAspectRatio="X200Y200" name="up'+name+'">';
	// 		balise += '<title>Mémoriser dans les '+(groupe == "div.lastpage" ? "pages courantes" : (groupe == "div.savedpages" ? "pages de référence" : "??"))+'</title>';
	// 		balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : ""))+'" stroke-width="'+(size/2)+'" fill="transparent" />';
	// 		balise += '<polygon points="20,28 21,23 27,23 14,14" style="fill:lime;stroke:purple;stroke-width:1" />';
	// 		balise += '</svg>';
	// 	}
	// 	return balise;
	// }

	// static createActionCircleGauche(size, groupe){
	// 	var balise = '';
	// 	if (groupe != "div.actions")
	// 	{
	// 		balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'">';
	// 		balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : ""))+'" stroke-width="'+(size/2)+'" fill="transparent" />';
	// 		balise += '<polygon points="0,20 5,21 5,27 14,14" style="fill:lime;stroke:purple;stroke-width:1" />';
	// 		balise += '</svg>';
	// 	}
	// 	return balise;
	// }

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

	// static createActionRemove28(size, groupe, name){
	// 	var balise = '';
	// 	if (groupe != "div.actions")
	// 	{
	// 		balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'" name="del'+name+'">';
	// 		balise += '<title>Supprimer</title>';
	// 		balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';

	// 		balise += '<line x1="9" y1="9" x2="6" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="19" y1="19" x2="22" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="9" y1="19" x2="6" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="19" y1="9" x2="22" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

	// 		balise += '<line x1="14" y1="10" x2="14" y2="4" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<line x1="4" y1="14" x2="10" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
	// 		balise += '<line x1="14" y1="18" x2="14" y2="24" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<line x1="18" y1="14" x2="24" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<polygon points="20,28 21,23 27,23 14,14" style="fill:red;stroke:purple;stroke-width:1" />';
	// 		balise += '</svg>';
	// 	}
	// 	return balise;
	// }

	// static createActionRemoveGauche(size, groupe){
	// 	var balise = '';
	// 	if (groupe != "div.actions")
	// 	{
	// 		balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'">';
	// 		balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';
	// 		//balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" fill="red" filter="url(#f1)" />';

	// 		// balise += '<line x1="11" y1="11" x2="4" y2="4" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		// balise += '<line x1="17" y1="17" x2="24" y2="24" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		// balise += '<line x1="11" y1="17" x2="4" y2="24" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		// balise += '<line x1="17" y1="11" x2="24" y2="4" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

	// 		// balise += '<line x1="14" y1="12" x2="14" y2="2" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		// balise += '<line x1="2" y1="14" x2="12" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
	// 		// balise += '<line x1="14" y1="16" x2="14" y2="28" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		// balise += '<line x1="16" y1="14" x2="28" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';

	// 		balise += '<line x1="9" y1="9" x2="6" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="19" y1="19" x2="22" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="9" y1="19" x2="6" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
	// 		balise += '<line x1="19" y1="9" x2="22" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

	// 		balise += '<line x1="14" y1="10" x2="14" y2="4" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<line x1="4" y1="14" x2="10" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
	// 		balise += '<line x1="14" y1="18" x2="14" y2="24" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<line x1="18" y1="14" x2="24" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';
	// 		balise += '<polygon points="0,20 5,21 5,27 14,14" style="fill:red;stroke:purple;stroke-width:1" />';
	// 		balise += '</svg>';
	// 	}
	// 	return balise;
	// }
}