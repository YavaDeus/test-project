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
		let fisrtLevelAction = list.actions[0].url;
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