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
				this.actions = flatObject.actions.map(x => new NavigationLink(x.id, x.label, x.level, x.url));
				break;
			default:
				this.actions = flatObject.actions.map(x => new Action(x.id, x.label, x.level));
			}
		}
	}

	length() {
		return actions.length;
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

}

var defaultGlobalLinks = new ActionList();
defaultGlobalLinks.add(new GlobalLink(0, 'Ouvrir Genius France', 1, 'https://genius.com/tags/france'))
defaultGlobalLinks.add(new GlobalLink(0, 'Album tutos', 2, 'https://genius.com/albums/Genius-france/Guides-tutoriels'));
defaultGlobalLinks.add(new GlobalLink(0, 'Fonctionnement du site', 2, 'https://genius.com/Genius-france-fonctionnement-du-site-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Comment ajouter des textes', 2, 'https://genius.com/Genius-france-comment-ajouter-des-textes-sur-genius-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Comment annoter correctement', 2, 'https://genius.com/Genius-france-comment-annoter-correctement-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Guide basique HTML', 2, 'https://genius.com/Genius-france-guide-basique-html-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Le rôle de l\'éditeur', 2, 'https://genius.com/Genius-france-le-role-de-lediteur-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Effectifs genius france', 2, 'https://genius.com/Genius-france-effectif-genius-france-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Rôles des Genius', 2, 'https://genius.com/Genius-france-role-des-genius-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Glossaire des figures de style', 1, 'https://genius.com/Education-genius-france-glossaire-des-figures-de-style-annotated'));
defaultGlobalLinks.add(new GlobalLink(0, 'Page des bannières Genius France', 1, 'https://genius.com/Genius-france-bannieres-annotated'));

/*defaultActions = [{
'id': 'a0',
'url': 'https://genius.com/tags/france',
'label': 'Ouvrir Genius France',
'level': '1'
}, {
'id': 'a1',
'url': 'https://genius.com/albums/Genius-france/Guides-tutoriels',
'label': 'Album tutos',
'level': '1'
}, {
'id': 'a2',
'url': 'https://genius.com/Genius-france-fonctionnement-du-site-annotated',
'label': 'Fonctionnement du site',
'level': '2'
}, {
'id': 'a3',
'url': 'https://genius.com/Genius-france-comment-ajouter-des-textes-sur-genius-annotated',
'label': 'Comment ajouter des textes',
'level': '2'
}, {
'id': 'a4',
'url': 'https://genius.com/Genius-france-comment-annoter-correctement-annotated',
'label': 'Comment annoter correctement',
'level': '2'
}, {
'id': 'a5',
'url': 'https://genius.com/Genius-france-guide-basique-html-annotated',
'label': 'Guide basique HTML',
'level': '2'
}, {
'id': 'a6',
'url': 'https://genius.com/Genius-france-le-role-de-lediteur-annotated',
'label': 'Le rôle de l\'éditeur',
'level': '2'
}, {
'id': 'a7',
'url': 'https://genius.com/Genius-france-effectif-genius-france-annotated',
'label': 'Effectifs genius france',
'level': '2'
}, {
'id': 'a8',
'url': 'https://genius.com/Genius-france-role-des-genius-annotated',
'label': 'Rôles des Genius',
'level': '2'
}, {
'id': 'a9',
'url': 'https://genius.com/Education-genius-france-glossaire-des-figures-de-style-annotated',
'label': 'Glossaire des figures de style',
'level': '1'
}, {
'id': 'a10',
'url': 'https://genius.com/Genius-france-bannieres-annotated',
'label': 'Page des bannières Genius France',
'level': '1'
}
];
 */

var defaultTags = new ActionList();
defaultTags.add(new Tag(0, 'souligné', 1, '__m'));
defaultTags.add(new Tag(0, 'gras', 1, '*'));
defaultTags.add(new Tag(0, 'italique', 2, 'i--'));

/*defaultTags = [{
'id': '1',
'label': 'gras',
'value': '*'
}, {
'id': '2',
'label': 'souligné',
'value': '__m'
}, {
'id': '3',
'label': 'italique',
'value': 'i--'
}
];
*/
