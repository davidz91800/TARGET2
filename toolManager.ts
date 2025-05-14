import { stage } from './konvaManager';
import { hideAllToolPropertiesPanels, showPencilProperties, showEraserProperties, showTextProperties } from './propertyManager';
import { activatePencilTool } from './pencilTool';
import { activateEraserTool } from './eraserTool';
import { activateTextTool, currentlyEditingText, finishTextEditing } from './textTool';

export let currentTool: string | null = null;
const toolsPanel = document.getElementById('tools-panel');

export function initializeToolManager() {
    toolsPanel?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'BUTTON' && target.dataset.tool) {
            const tool = target.dataset.tool;
            setCurrentTool(tool, target);
        }
    });
}

export function setCurrentTool(tool: string, buttonElement: HTMLElement) {
    if (currentlyEditingText) {
        finishTextEditing();
    }

    hideAllToolPropertiesPanels();

    if (currentTool === tool && tool !== 'text') {
        currentTool = null;
        buttonElement.classList.remove('active');
        // console.log(`Outil désélectionné: ${tool}`); // Log optionnel
        if (stage) stage.off('.tool');
        return;
    }

    if (currentTool && currentTool !== tool) {
        const previousToolButton = toolsPanel?.querySelector(`button[data-tool="${currentTool}"].active`) as HTMLElement;
        if (previousToolButton) {
            previousToolButton.classList.remove('active');
        }
    }
    
    currentTool = tool;
    toolsPanel?.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');
    // console.log(`Outil sélectionné: ${currentTool}`); // Log optionnel

    if (stage) stage.off('.tool');

    if (currentTool === 'pencil') {
        showPencilProperties();
        activatePencilTool();
    } else if (currentTool === 'eraser') {
        showEraserProperties();
        activateEraserTool();
        // console.log("toolManager: Called activateEraserTool"); // Log optionnel
    } else if (currentTool === 'text') {
        showTextProperties();
        activateTextTool();
    }
}

export function deselectAllTools() {
    if (currentTool) {
        const activeButton = toolsPanel?.querySelector(`button[data-tool="${currentTool}"].active`) as HTMLElement;
        if (activeButton) {
            activeButton.classList.remove('active');
        }
        if (stage) stage.off('.tool');
        currentTool = null;
        hideAllToolPropertiesPanels();
        // console.log("Tous les outils désélectionnés."); // Log optionnel
    }
}