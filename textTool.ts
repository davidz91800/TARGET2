import Konva from 'konva';
import { stage, mainLayer, getKonvaContainer, getCanvasArea } from './konvaManager';
import { currentTool } from './toolManager';
import { currentTextColor, currentTextSize, textColorInput, textSizeInput, textSizeValue, updateTextPropertyControls } from './propertyManager';

export const textEditor = document.getElementById('text-editor') as HTMLTextAreaElement;
export let currentlyEditingText: Konva.Text | null = null;

export function activateTextTool() {
    if (!stage) return;
    // console.log("Text tool activated."); // Log optionnel
    stage.on('click.tool tap.tool', (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (currentTool === 'text' && e.target === stage) {
            handleStageClickForTextCreation();
        }
    });
}

function handleStageClickForTextCreation() {
    if (!stage || !mainLayer) return;
    if (currentlyEditingText) finishTextEditing();

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const newTextNode = new Konva.Text({
        x: pos.x,
        y: pos.y,
        text: 'Nouveau Texte',
        fontSize: currentTextSize,
        fill: currentTextColor,
        draggable: true,
        padding: 5,
        name: 'textNode'
    });
    mainLayer.add(newTextNode);
    addDblClickListenerToText(newTextNode);
    mainLayer.draw();
    editTextNode(newTextNode);
}

export function editTextNode(textNode: Konva.Text) {
    if (!stage || !getKonvaContainer() || !textEditor || !mainLayer) return;
    currentlyEditingText = textNode;

    textNode.hide();
    mainLayer.draw();

    const textPosition = textNode.getAbsolutePosition();
    const konvaContainerDiv = getKonvaContainer()!;
    const canvasAreaDiv = getCanvasArea()!;
    const scrollTop = canvasAreaDiv.scrollTop || 0;
    const scrollLeft = canvasAreaDiv.scrollLeft || 0;

    textEditor.value = textNode.text();
    textEditor.style.display = 'block';
    textEditor.style.position = 'absolute';
    textEditor.style.top = `${textPosition.y + scrollTop}px`;
    textEditor.style.left = `${textPosition.x + scrollLeft}px`;
    textEditor.style.width = `${Math.max(textNode.width(), 100) + (textNode.padding() * 2)}px`;
    textEditor.style.height = 'auto';
    textEditor.style.minHeight = `${textNode.fontSize() + (textNode.padding() * 2) + 10}px`;
    textEditor.style.fontSize = `${textNode.fontSize()}px`;
    textEditor.style.lineHeight = `${textNode.lineHeight() || 1.2}`;
    textEditor.style.fontFamily = textNode.fontFamily() || 'sans-serif';
    textEditor.style.color = textNode.fill();
    textEditor.style.padding = `${textNode.padding()}px`;
    textEditor.focus();
    textEditor.select();

    textEditor.addEventListener('blur', finishTextEditingOnBlur, { once: true });
    textEditor.addEventListener('keydown', handleTextEditorKeyDown);
}

function finishTextEditingOnBlur() {
    if (currentlyEditingText) finishTextEditing();
}

function handleTextEditorKeyDown(e: KeyboardEvent) {
    if (!currentlyEditingText) return;
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        finishTextEditing();
    } else if (e.key === 'Escape') {
        finishTextEditing();
    } else {
        setTimeout(() => {
            if (!textEditor || !currentlyEditingText) return;
            textEditor.style.height = 'auto';
            textEditor.style.height = `${textEditor.scrollHeight}px`;
            currentlyEditingText.text(textEditor.value);
            textEditor.style.width = `${Math.max(currentlyEditingText.width(), 100) + (currentlyEditingText.padding() * 2)}px`;
        }, 0);
    }
}

export function finishTextEditing() {
    if (!currentlyEditingText || !textEditor || !mainLayer) return;

    currentlyEditingText.text(textEditor.value);
    currentlyEditingText.fill(textColorInput.value);
    currentlyEditingText.fontSize(parseInt(textSizeInput.value, 10));

    currentlyEditingText.show();
    mainLayer.draw();

    textEditor.style.display = 'none';
    textEditor.removeEventListener('blur', finishTextEditingOnBlur);
    textEditor.removeEventListener('keydown', handleTextEditorKeyDown);
    currentlyEditingText = null;
    // console.log("Text editing finished."); // Log optionnel
}

export function addDblClickListenerToText(textNode: Konva.Text) {
    textNode.on('dblclick.tool dbltap.tool', () => {
        // console.log("Double-click on text node, attempting to edit."); // Log optionnel
        if (currentlyEditingText && currentlyEditingText !== textNode) {
            finishTextEditing();
        }
        updateTextPropertyControls(textNode.fill(), textNode.fontSize());
        editTextNode(textNode);
    });
}

textColorInput?.addEventListener('input', (event) => {
    const newColor = (event.target as HTMLInputElement).value;
    if (currentlyEditingText) {
        currentlyEditingText.fill(newColor);
        if (textEditor) textEditor.style.color = newColor;
        mainLayer?.draw();
    }
});

textSizeInput?.addEventListener('input', (event) => {
    const newSize = parseInt((event.target as HTMLInputElement).value, 10);
    if (textSizeValue) textSizeValue.textContent = newSize.toString();
    if (currentlyEditingText) {
        currentlyEditingText.fontSize(newSize);
        if (textEditor) {
            textEditor.style.fontSize = `${newSize}px`;
            setTimeout(() => {
                if(currentlyEditingText && textEditor) {
                    textEditor.style.height = 'auto';
                    textEditor.style.height = `${textEditor.scrollHeight}px`;
                    textEditor.style.width = `${Math.max(currentlyEditingText.width(), 100) + (currentlyEditingText.padding() * 2)}px`;
                    mainLayer?.draw();
                }
            }, 0);
        }
    }
});