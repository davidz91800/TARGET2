import Konva from 'konva';
import { stage, mainLayer } from './konvaManager';
// Plus tard: import de fonctions pour sélectionner/transformer les objets Konva

// Références DOM pour le panneau des calques
const objectListUL = document.getElementById('object-list') as HTMLUListElement;
const btnMoveUp = document.getElementById('btn-move-up') as HTMLButtonElement;
const btnMoveDown = document.getElementById('btn-move-down') as HTMLButtonElement;
const btnDeleteObject = document.getElementById('btn-delete-object') as HTMLButtonElement;

let selectedKonvaNode: Konva.Node | null = null; // L'objet Konva actuellement sélectionné
let selectedListItem: HTMLLIElement | null = null; // L'élément <li> correspondant

export function initializeLayerManager() {
    if (!objectListUL || !btnMoveUp || !btnMoveDown || !btnDeleteObject) {
        console.error("Éléments du panneau des calques non trouvés.");
        return;
    }

    // Écouteurs pour les boutons de contrôle des calques (seront implémentés plus tard)
    btnMoveUp.addEventListener('click', moveSelectedObjectUp);
    btnMoveDown.addEventListener('click', moveSelectedObjectDown);
    btnDeleteObject.addEventListener('click', deleteSelectedObject);

    // Observer les changements dans mainLayer pour mettre à jour la liste
    // Konva n'a pas d'observeur direct, donc nous mettrons à jour la liste
    // après chaque action qui modifie mainLayer (ajout, suppression, changement d'ordre).
    // Pour l'instant, on peuple la liste une fois à l'init et on fournit une fonction pour la rafraîchir.

    // Écouteur d'événement sur la liste pour gérer la sélection d'items
    objectListUL.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const listItem = target.closest('li'); // Trouver l'élément <li> parent cliqué
        if (listItem && listItem.dataset.konvaId) {
            selectObjectFromList(listItem);
        }
    });

    updateObjectList(); // Afficher la liste initiale
    updateLayerControlButtons(); // Mettre à jour l'état des boutons
}

// Fonction pour rafraîchir la liste des objets
export function updateObjectList() {
    if (!mainLayer || !objectListUL) return;

    objectListUL.innerHTML = ''; // Vider la liste actuelle

    const children = mainLayer.getChildren().slice().reverse(); // Afficher de haut en bas (dernier ajouté en haut de la liste)

    if (children.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Aucun objet sur le canevas.";
        li.style.fontStyle = "italic";
        li.style.textAlign = "center";
        li.style.cursor = "default";
        objectListUL.appendChild(li);
        return;
    }

    children.forEach(node => {
        const li = document.createElement('li');
        li.dataset.konvaId = node.id(); // Utiliser l'ID unique de Konva pour lier l'item au nœud

        let objectName = node.name() || node.getClassName(); // Utiliser le nom ou le type de classe
        let icon = '❓';

        if (node instanceof Konva.Line) {
            icon = (node.globalCompositeOperation() === 'destination-out') ? '🧼' : '✏️'; // Gomme ou Crayon
            if (node.name() === 'pencilStroke') objectName = "Trait Crayon";
            else if (node.name() === 'eraserStroke') objectName = "Gommage";
            else objectName = "Ligne";
        } else if (node instanceof Konva.Text) {
            icon = '📄'; // Ou 'T' ou 🔡
            objectName = `Texte: "${(node.text().substring(0, 15) + (node.text().length > 15 ? '...' : ''))}"`;
        }
        // Ajouter d'autres types ici (Rect, Circle, Image...)

        const span = document.createElement('span');
        span.textContent = `${icon} ${objectName}`;
        li.appendChild(span);

        // Si cet objet était celui sélectionné, le marquer comme tel
        if (selectedKonvaNode && node.id() === selectedKonvaNode.id()) {
            li.classList.add('selected');
            selectedListItem = li; // Mettre à jour la référence au li
        }

        objectListUL.appendChild(li);
    });
}

function selectObjectFromList(listItem: HTMLLIElement) {
    if (!mainLayer) return;
    const konvaId = listItem.dataset.konvaId;
    if (!konvaId) return;

    const nodeToSelect = mainLayer.findOne(`#${konvaId}`); // Sélectionner par ID

    if (nodeToSelect) {
        // Désélectionner l'ancien item
        if (selectedListItem) {
            selectedListItem.classList.remove('selected');
        }
        // Sélectionner le nouvel item
        listItem.classList.add('selected');
        selectedListItem = listItem;
        selectedKonvaNode = nodeToSelect;

        console.log("Objet sélectionné depuis la liste:", selectedKonvaNode.name() || selectedKonvaNode.getClassName());
        // Ici, on pourrait ajouter un Transformer Konva pour visualiser la sélection sur le canvas
        // addTransformerToNode(selectedKonvaNode);
    } else {
        // Si le nœud n'est pas trouvé (ne devrait pas arriver si la liste est synchro)
        selectedKonvaNode = null;
        if (selectedListItem) selectedListItem.classList.remove('selected');
        selectedListItem = null;
    }
    updateLayerControlButtons();
}

// TODO: Implémenter la sélection depuis le canvas qui met à jour la liste

function moveSelectedObjectUp() {
    if (selectedKonvaNode) {
        selectedKonvaNode.moveUp();
        mainLayer?.batchDraw();
        updateObjectList(); // Rafraîchir l'ordre dans la liste
        console.log("Objet monté");
    }
    updateLayerControlButtons();
}

function moveSelectedObjectDown() {
    if (selectedKonvaNode) {
        selectedKonvaNode.moveDown();
        mainLayer?.batchDraw();
        updateObjectList();
        console.log("Objet descendu");
    }
    updateLayerControlButtons();
}

function deleteSelectedObject() {
    if (selectedKonvaNode) {
        const nodeName = selectedKonvaNode.name() || selectedKonvaNode.getClassName();
        if (confirm(`Voulez-vous vraiment supprimer l'objet "${nodeName}" ?`)) {
            selectedKonvaNode.destroy(); // Détruit et supprime du calque
            mainLayer?.batchDraw();
            selectedKonvaNode = null;
            selectedListItem = null;
            updateObjectList();
            console.log("Objet supprimé");
        }
    }
    updateLayerControlButtons();
}

function updateLayerControlButtons() {
    const canMove = !!selectedKonvaNode;
    const childrenCount = mainLayer?.getChildren().length || 0;

    if (btnMoveUp) btnMoveUp.disabled = !canMove || (selectedKonvaNode?.getZIndex() ?? 0) >= childrenCount -1 ;
    if (btnMoveDown) btnMoveDown.disabled = !canMove || (selectedKonvaNode?.getZIndex() ?? 0) <= 0;
    if (btnDeleteObject) btnDeleteObject.disabled = !canMove;
}

// Appeler cette fonction après chaque ajout ou suppression d'objet sur mainLayer
// Par exemple, à la fin de la création d'une ligne de crayon/gomme, ou d'un texte.
// Ou, plus simplement, la rappeler manuellement quand on sait que la structure a changé.
// Pour l'instant, elle est appelée à l'init et après les actions de ce manager.