export const pencilPropertiesPanel = document.getElementById('pencil-properties');
export const eraserPropertiesPanel = document.getElementById('eraser-properties');
export const textPropertiesPanel = document.getElementById('text-properties');

export const pencilColorInput = document.getElementById('pencil-color') as HTMLInputElement;
export const pencilThicknessInput = document.getElementById('pencil-thickness') as HTMLInputElement;
export const pencilThicknessValue = document.getElementById('pencil-thickness-value');

export const eraserSizeInput = document.getElementById('eraser-size') as HTMLInputElement;
export const eraserSizeValue = document.getElementById('eraser-size-value');

export const textColorInput = document.getElementById('text-color') as HTMLInputElement;
export const textSizeInput = document.getElementById('text-size') as HTMLInputElement;
export const textSizeValue = document.getElementById('text-size-value');

export let currentPencilColor = '#df4b26';
export let currentPencilThickness = 5;
export let currentEraserSize = 10;
export let currentTextColor = '#000000';
export let currentTextSize = 20;

export function initializeProperties() {
    if (pencilColorInput) pencilColorInput.value = currentPencilColor;
    if (pencilThicknessInput) pencilThicknessInput.value = currentPencilThickness.toString();
    if (pencilThicknessValue) pencilThicknessValue.textContent = currentPencilThickness.toString();

    if (eraserSizeInput) eraserSizeInput.value = currentEraserSize.toString();
    if (eraserSizeValue) eraserSizeValue.textContent = currentEraserSize.toString();

    if (textColorInput) textColorInput.value = currentTextColor;
    if (textSizeInput) textSizeInput.value = currentTextSize.toString();
    if (textSizeValue) textSizeValue.textContent = currentTextSize.toString();

    addPropertyListeners();
}

function addPropertyListeners() {
    pencilColorInput?.addEventListener('input', (event) => {
        currentPencilColor = (event.target as HTMLInputElement).value;
    });
    pencilThicknessInput?.addEventListener('input', (event) => {
        currentPencilThickness = parseInt((event.target as HTMLInputElement).value, 10);
        if (pencilThicknessValue) pencilThicknessValue.textContent = currentPencilThickness.toString();
    });
    eraserSizeInput?.addEventListener('input', (event) => {
        currentEraserSize = parseInt((event.target as HTMLInputElement).value, 10);
        if (eraserSizeValue) eraserSizeValue.textContent = currentEraserSize.toString();
        console.log("Eraser size changed to:", currentEraserSize);
    });
}

export function hideAllToolPropertiesPanels() {
    document.querySelectorAll('.tool-properties').forEach(panel => {
        (panel as HTMLElement).style.display = 'none';
    });
}

export function showPencilProperties() {
    if (pencilPropertiesPanel) pencilPropertiesPanel.style.display = 'block';
}
export function showEraserProperties() {
    if (eraserPropertiesPanel) eraserPropertiesPanel.style.display = 'block';
}
export function showTextProperties() {
    if (textPropertiesPanel) textPropertiesPanel.style.display = 'block';
}

export function updateTextPropertyControls(fill: string, fontSize: number) {
    if (textColorInput) textColorInput.value = fill;
    currentTextColor = fill;
    if (textSizeInput) textSizeInput.value = fontSize.toString();
    currentTextSize = fontSize;
    if (textSizeValue) textSizeValue.textContent = fontSize.toString();
}