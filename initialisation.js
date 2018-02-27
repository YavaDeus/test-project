"use strict";

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
'label': 'Le r�le de l\'�diteur',
'level': '2'
}, {
'id': 'a7',
'url': 'https://genius.com/Genius-france-effectif-genius-france-annotated',
'label': 'Effectifs genius france',
'level': '2'
}, {
'id': 'a8',
'url': 'https://genius.com/Genius-france-role-des-genius-annotated',
'label': 'R�les des Genius',
'level': '2'
}, {
'id': 'a9',
'url': 'https://genius.com/Education-genius-france-glossaire-des-figures-de-style-annotated',
'label': 'Glossaire des figures de style',
'level': '1'
}, {
'id': 'a10',
'url': 'https://genius.com/Genius-france-bannieres-annotated',
'label': 'Page des banni�res Genius France',
'level': '1'
}
];
 */

var defaultTags = new ActionList();
defaultTags.add(new Tag(0, 'souligné', 1, '__m'));
defaultTags.add(new Tag(0, 'gras', 1, '*'));
defaultTags.add(new Tag(0, 'italique', 1, 'i--'));

/*defaultTags = [{
'id': '1',
'label': 'gras',
'value': '*'
}, {
'id': '2',
'label': 'soulign�',
'value': '__m'
}, {
'id': '3',
'label': 'italique',
'value': 'i--'
}
];
*/
