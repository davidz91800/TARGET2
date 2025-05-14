import { stage, resizeKonvaStage } from './konvaManager';
import { currentTool, deselectAllTools } from './toolManager';
import { currentlyEditingText, textEditor } // finishTextEditing n'est pas utilisé directement ici
    from './textTool';

export function initializeUIManager() {
    window.addEventListener('resize', resizeKonvaStage);

    stage?.on('click tap', (e) => {
        if (e.target === stage) {
            if (currentlyEditingText) {
                // Le blur du textarea gère la fin de l'édition
            } else if (currentTool && currentTool !== 'text') {
                deselectAllTools();
            }
        }
        // La logique pour terminer l'édition si on clique sur un autre objet
        // est mieux gérée par le 'blur' du textarea.
    });
}