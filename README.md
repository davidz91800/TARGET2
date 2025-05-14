# AeroScheme PWA - Conception d'Application de Création de Schémas Aériens

Ce projet vise à développer une Progressive Web App (PWA) ergonomique pour la création de schémas de briefing de missions aériennes. L'application sera optimisée pour iPad (avec support du stylet) et compatible avec PC, Mac, et autres tablettes via les navigateurs modernes.

## Contexte et Avancement

Ce `README.md` sert de document de suivi central pour le développement. L'objectif est de pouvoir reprendre le projet à n'importe quelle étape en ayant une vue claire de ce qui a été fait et ce qui reste à faire.

## Structure des Fichiers (à la racine du projet)

Pour améliorer la maintenabilité, le code JavaScript/TypeScript a été scindé en plusieurs modules :

*   `index.html`: Point d'entrée HTML de l'application.
*   `style.css`: Styles CSS globaux.
*   `main.ts`: Point d'entrée principal TypeScript, orchestre l'initialisation des modules.
*   `konvaManager.ts`: Gère l'initialisation et l'état du stage Konva, des calques principaux (`mainLayer`, `backgroundImageLayer`). Exporte les références `stage`, `mainLayer`, etc.
*   `toolManager.ts`: Gère la sélection des outils depuis le panneau latéral, active/désactive les fonctionnalités des outils et gère l'état de l'outil courant (`currentTool`).
*   `pencilTool.ts`: Contient la logique spécifique à l'outil Crayon (dessin à main levée).
*   `eraserTool.ts`: Contient la logique spécifique à l'outil Gomme.
*   `textTool.ts`: Contient la logique spécifique à l'outil Texte, y compris l'affichage et la gestion du `textarea` pour l'édition.
*   `propertyManager.ts`: Gère l'affichage des panneaux de propriétés pour chaque outil et maintient l'état des valeurs de ces propriétés (couleur, épaisseur, taille, etc.).
*   `fileManager.ts`: Gère les fonctionnalités liées aux fichiers : importation d'images, exportation en PNG, et la sauvegarde/chargement du projet via `localStorage`.
*   `uiManager.ts`: Gère les aspects généraux de l'interface utilisateur non couverts par les autres modules, comme le redimensionnement de la fenêtre et les interactions globales sur le canvas (ex: désélection d'outil).
*   `vite.config.ts`: Configuration de Vite.
*   `tsconfig.json`: Configuration de TypeScript.
*   `package.json`: Dépendances et scripts du projet.
*   `public/`: Dossier pour les assets statiques (icônes PWA, etc.).
    *   `public/icons/`: Icônes pour la PWA.

## Fonctionnalités Principales (Plan de Développement)

**Phase 1 : Bases et Dessin Initial (MVP)**
*   [X] **1. Importation et Dessin sur Images :**
    *   [X] Importer des images au format PNG.
    *   [X] Dessiner (outil Crayon) et annoter directement sur ces images.
    *   [X] Enregistrer le résultat et l’exporter au format PNG.
*   [X] **4. Outils d’Annotation et de Dessin (Basiques) :**
    *   [X] Outil Crayon. (Avec propriétés couleur/épaisseur)
    *   [X] Outil Gomme. (Avec propriété taille)
    *   [X] Outil Texte simple avec personnalisation (taille, couleur). (Améliorations édition)
*   [X] **8. Interface Utilisateur (Structure Initiale) :**
    *   [X] Menu latéral pour les outils (dessin).
    *   [X] Bandeau supérieur pour les actions (importer, exporter, sauvegarder).
    *   [X] Zone de canvas centrale.
    *   [X] Panneau de propriétés de base pour les outils.
*   [X] **10. Sauvegarde et Gestion des Fichiers (Local Très Basique) :**
    *   [X] Sauvegarde manuelle du projet en cours (état du canvas + image de fond basique) dans `localStorage`.
    *   [X] Chargement du projet depuis `localStorage` au démarrage.
*   [X] **PWA Initiale :**
    *   [X] Manifeste Web App de base.
    *   [X] Service Worker de base.
    *   [X] Icônes d'application de base.
*   [X] **Modularisation du code TypeScript** pour une meilleure organisation.

**Phase 2 : Améliorations Stylet, Avions et Calques**
*   [ ] **5. Gestion des Calques (Basique) :** <!-- EN COURS -->
    *   [X] Créer un nouveau module `layerManager.ts`.
    *   [X] Ajouter un panneau "Objets" dans `index.html`.
    *   [X] Afficher les objets de `mainLayer` dans ce panneau.
    *   [X] Implémenter la sélection d'objet depuis le panneau.
    *   [X] Implémenter la suppression d'objet.
    *   [X] Implémenter le changement d'ordre (monter/descendre).
    *   [ ] Implémenter la sélection d'objet depuis le canvas qui met à jour la liste.
    *   [ ] Verrouiller/Déverrouiller un objet.
    *   [ ] Afficher/Masquer un objet.
*   [ ] **2. Compatibilité Stylet (iPad) :**
    *   [ ] Reconnaissance de la pression pour ajuster l'épaisseur du trait.
    *   [ ] Gestes spécifiques : double-tap pour activer la gomme.
    *   [ ] Différenciation entre l'usage du doigt (déplacement) et du stylet (dessin).
    *   [ ] Mode "dessin uniquement" pour éviter les déplacements accidentels.
*   [ ] **3. Gestion des Avions (icônes PNG) :**
    *   [ ] Bibliothèque accessible via un menu latéral.
    *   [ ] Ajouter, rotation, redimensionnement et suppression des avions.
    *   [ ] Gestion de la superposition (via le système de calques/objets).

...(Le reste du plan de développement reste inchangé pour l'instant)...

## Stack Technique

*   **Langage :** TypeScript
*   **Outil de Build / Serveur de Dev :** Vite
*   **Librairie Canvas :** Konva.js
*   **Styles :** CSS pur
*   **PWA :** `vite-plugin-pwa`
*   **Stockage local :** `localStorage` (sauvegarde de base), `IndexedDB` (pour gestion avancée)

## Pour Commencer

1.  Node.js et npm/yarn installés.
2.  Créez tous les fichiers listés dans la section "Structure des Fichiers".
3.  `npm install`
4.  `npm run dev`
5.  Ouvrez `http://localhost:3000` (ou le port indiqué par Vite).

## Prochaines Étapes Immédiates

1.  ~~**Outil Crayon (Finalisation) :**~~ FAIT
2.  ~~**Outil Gomme basique :**~~ FAIT
3.  ~~**Outil Texte (Améliorations) :**~~ FAIT
4.  ~~**Sauvegarde locale très basique du projet** :~~ FAIT
5.  ~~**Modularisation du code TypeScript**~~ FAIT
6.  **Gestion des Calques (Basique) :**
    *   ~~[X] Créer un nouveau module `layerManager.ts`.~~
    *   ~~[X] Ajouter un panneau "Objets" dans `index.html`.~~
    *   ~~[X] Afficher les objets de `mainLayer` dans ce panneau.~~
    *   ~~[X] Implémenter la sélection d'objet depuis le panneau.~~
    *   ~~[X] Implémenter la suppression d'objet.~~
    *   ~~[X] Implémenter le changement d'ordre (monter/descendre).~~
    *   [ ] Synchroniser la sélection : cliquer sur un objet Konva sur le canvas doit le sélectionner dans la liste (et vice-versa est déjà fait).
    *   [ ] Ajouter un `Konva.Transformer` pour visualiser l'objet sélectionné sur le canvas.