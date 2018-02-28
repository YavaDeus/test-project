"use strict";

class Action {
	constructor(id, label, level) {
		this.id = id;
		this.label = label;
		this.level = level;
		this.type = 'action';
		this.name = this.getName(); ;
	}

	getName() {
		return this.type + this.id;
	}

}

class Tag extends Action {
	constructor(id, label, level, value) {
		super(id, label, level);
		this.type = 'tag';
		this.value = value;
		this.name = this.getName();
	}
}

class Link extends Action {
	constructor(id, label, level, url) {
		super(id, label, level);
		this.type = 'link';
		this.url = url;
		this.name = this.getName();
	}
}

class GlobalLink extends Link {
	constructor(id, label, level, url) {
		super(id, label, level, url);
		this.type = 'global';
		this.name = this.getName();
	}
}

class NavigationLink extends Link {
	constructor(id, label, level, url, tooltip) {
		super(id, label, level, url);
		this.type = 'navigation';
		this.tooltip = tooltip;
		this.name = this.getName();
	}
}

class ActionList {
	constructor(flatObject, type) {
		this.actions = new Array(0);
		if (flatObject !== undefined) {
			switch (type) {
			case 'Tag':
				this.actions = flatObject.actions.map(x => new Tag(x.id, x.label, x.level, x.value));
				break;
			case 'Link':
				this.actions = flatObject.actions.map(x => new Link(x.id, x.label, x.level, x.url));
				break;
			case 'GlobalLink':
				this.actions = flatObject.actions.map(x => new GlobalLink(x.id, x.label, x.level, x.url));
				break;
			case 'NavigationLink':
				this.actions = flatObject.actions.map(x => new NavigationLink(x.id, x.label, x.level, x.url, x.tooltip));
				break;
			default:
				this.actions = flatObject.actions.map(x => new Action(x.id, x.label, x.level));
			}
		}
	}

	length() {
		return this.actions.length;
	}

	nextId() {
		if (this.actions.length > 0) {
			let idArray = this.actions.map(x => x.id);
			return Math.max(...idArray) + 1;
		} else {
			return 0;
		}
	}

	add(action) {
		if (action.id == 0) {
			action.id = this.nextId();
			action.name = action.getName();
		}
		this.actions.push(action);
	}

	addDedupe(action)
	{
		for (let item of this.actions) {
			if (item.url == action.url && item.level == action.level && item.tooltip != action.tooltip)
			{
				item.tooltip = item.tooltip + ', ' + action.tooltip;
				return;
			}
		}
		this.add(action);
	}

	deleteLevel(name)
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
	}

	countLevel(level)
	{
		const reducerLevel = (accumulator, currentValue) => accumulator + (currentValue.level == level ? 1 : 0);
		return this.actions.reduce(reducerLevel, 0);
	}

	merge(list, nbMaxLevel1)
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

	}

}

class StorageManager {
	constructor() {

	}

	static addElement(storageName, element, callback)
	{

	}

	static removeElement(storageName, element, callback)
	{

	}
}

class SVGMaker {
	constructor() {
	}

	static createActionCircle(size, groupe, name){
		var balise = '';
		if (groupe != "div.actions")
		{
			balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'" name="up'+name+'">';
			balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : ""))+'" stroke-width="'+(size/2)+'" fill="transparent" />';
			balise += '<polygon points="20,28 21,23 27,23 14,14" style="fill:lime;stroke:purple;stroke-width:1" />';
			balise += '</svg>';
		}
		return balise;
	}

	static createActionCircleGauche(size, groupe){
		var balise = '';
		if (groupe != "div.actions")
		{
			balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'">';
			balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" stroke="'+(groupe == "div.lastpage" ? "orange" : (groupe == "div.savedpages" ? "green" : ""))+'" stroke-width="'+(size/2)+'" fill="transparent" />';
			balise += '<polygon points="0,20 5,21 5,27 14,14" style="fill:lime;stroke:purple;stroke-width:1" />';
			balise += '</svg>';
		}
		return balise;
	}

	static createActionRemove(size, groupe, name){
		var balise = '';
		if (groupe != "div.actions")
		{
			balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'" name="del'+name+'">';
			balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';

			balise += '<line x1="9" y1="9" x2="6" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="19" y1="19" x2="22" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="9" y1="19" x2="6" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="19" y1="9" x2="22" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

			balise += '<line x1="14" y1="10" x2="14" y2="4" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<line x1="4" y1="14" x2="10" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
			balise += '<line x1="14" y1="18" x2="14" y2="24" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<line x1="18" y1="14" x2="24" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<polygon points="20,28 21,23 27,23 14,14" style="fill:red;stroke:purple;stroke-width:1" />';
			balise += '</svg>';
		}
		return balise;
	}

	static createActionRemoveGauche(size, groupe){
		var balise = '';
		if (groupe != "div.actions")
		{
			balise += '<svg width="'+(size * 2)+'" height="'+(size * 2)+'">';
			balise += '<filter id="f1"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter>';
			//balise += '<circle cx="'+size+'" cy="'+size+'" r="'+(size/2)+'" fill="red" filter="url(#f1)" />';

			// balise += '<line x1="11" y1="11" x2="4" y2="4" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			// balise += '<line x1="17" y1="17" x2="24" y2="24" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			// balise += '<line x1="11" y1="17" x2="4" y2="24" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			// balise += '<line x1="17" y1="11" x2="24" y2="4" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

			// balise += '<line x1="14" y1="12" x2="14" y2="2" style="stroke:rgb(255,0,0);stroke-width:1" />';
			// balise += '<line x1="2" y1="14" x2="12" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
			// balise += '<line x1="14" y1="16" x2="14" y2="28" style="stroke:rgb(255,0,0);stroke-width:1" />';
			// balise += '<line x1="16" y1="14" x2="28" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';

			balise += '<line x1="9" y1="9" x2="6" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="19" y1="19" x2="22" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="9" y1="19" x2="6" y2="22" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';
			balise += '<line x1="19" y1="9" x2="22" y2="6" style="stroke:rgb(255,0,0);stroke-width:2" filter="url(#f1)" />';

			balise += '<line x1="14" y1="10" x2="14" y2="4" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<line x1="4" y1="14" x2="10" y2="14" style="stroke:rgb(255,0,0);stroke-width:1"  />';
			balise += '<line x1="14" y1="18" x2="14" y2="24" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<line x1="18" y1="14" x2="24" y2="14" style="stroke:rgb(255,0,0);stroke-width:1" />';
			balise += '<polygon points="0,20 5,21 5,27 14,14" style="fill:red;stroke:purple;stroke-width:1" />';
			balise += '</svg>';
		}
		return balise;
	}
}