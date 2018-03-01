"use strict";

var defaultReferenceGuideLinks = new ActionList();
defaultReferenceGuideLinks.add(new SubLink(0, 'Fonctionnement du site', 'https://genius.com/Genius-france-fonctionnement-du-site-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Comment ajouter des textes', 'https://genius.com/Genius-france-comment-ajouter-des-textes-sur-genius-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Comment annoter correctement', 'https://genius.com/Genius-france-comment-annoter-correctement-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Guide basique HTML', 'https://genius.com/Genius-france-guide-basique-html-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Le rôle de l\'éditeur', 'https://genius.com/Genius-france-le-role-de-lediteur-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Effectifs genius france', 'https://genius.com/Genius-france-effectif-genius-france-annotated'));
defaultReferenceGuideLinks.add(new SubLink(0, 'Rôles des Genius', 'https://genius.com/Genius-france-role-des-genius-annotated'));

var defaultReferenceLinks = new ActionList();
defaultReferenceLinks.name = 'geniusReferences';
defaultReferenceLinks.add(new GlobalLink(0, 'Accueil Genius France', 'https://genius.com/tags/france'));
defaultReferenceLinks.add(new GlobalLink(0, 'Guides & tutoriels', 'https://genius.com/albums/Genius-france/Guides-tutoriels', '', defaultReferenceGuideLinks));
defaultReferenceLinks.add(new GlobalLink(0, 'Glossaire des figures de style', 'https://genius.com/Education-genius-france-glossaire-des-figures-de-style-annotated'));
defaultReferenceLinks.add(new GlobalLink(0, 'Bannières Genius France', 'https://genius.com/Genius-france-bannieres-annotated'));


var defaultTags = new ActionList();
defaultTags.name = 'geniusTags';
defaultTags.add(new Tag(0, 'souligné', '__m'));
defaultTags.add(new Tag(0, 'gras', '*'));
defaultTags.add(new Tag(0, 'italique', 'i--'));