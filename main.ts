import './style.css';

import { initializeKonva } from './konvaManager';
import { initializeToolManager } from './toolManager';
import { initializeProperties } from './propertyManager';
import { initializeFileManager, loadProjectFromLocalStorage } from './fileManager';
import { initializeUIManager } from './uiManager';

const APP_NAME = 'AeroScheme PWA';
const APP_VERSION = '0.0.2';

document.title = `${APP_NAME} v${APP_VERSION}`;

function checkDOMelements(): boolean {
    const idsToVerify = [
        'app-container', 'konva-container', 'tools-panel', 'image-importer-input', 'text-editor',
        'pencil-properties', 'eraser-properties', 'text-properties',
        'pencil-color', 'pencil-thickness', 'pencil-thickness-value',
        'eraser-size', 'eraser-size-value',
        'text-color', 'text-size', 'text-size-value',
        'btn-import-image', 'btn-export-png', 'btn-save-project'
    ];
    for (const id of idsToVerify) {
        if (!document.getElementById(id)) {
            console.error(`Élément DOM essentiel manquant: #${id}`);
            return false;
        }
    }
    return true;
}

function initApp() {
    if (!checkDOMelements()) {
        alert("Erreur critique: Certains éléments de l'interface sont manquants. L'application ne peut pas démarrer.");
        return;
    }

    if (!initializeKonva()) {
        alert("Erreur critique: Impossible d'initialiser la zone de dessin.");
        return;
    }
    initializeProperties();
    initializeToolManager();
    initializeFileManager();
    initializeUIManager();

    loadProjectFromLocalStorage();

    console.log(`${APP_NAME} v${APP_VERSION} initialisée (version modulaire).`);
}

document.addEventListener('DOMContentLoaded', initApp);