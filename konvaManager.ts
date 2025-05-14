import Konva from 'konva';

export let stage: Konva.Stage | null = null;
export let mainLayer: Konva.Layer | null = null;
export let backgroundImageLayer: Konva.Layer | null = null;
export let currentBackgroundImage: Konva.Image | null = null;

const konvaContainerId = 'konva-container';
const canvasAreaId = 'canvas-area';

export function initializeKonva(): boolean {
    const konvaContainer = document.getElementById(konvaContainerId);
    if (!konvaContainer) {
        console.error(`Element conteneur Konva #${konvaContainerId} non trouvé!`);
        return false;
    }

    const canvasArea = document.getElementById(canvasAreaId);
    if (!canvasArea) {
        console.error(`#${canvasAreaId} non trouvé`);
        return false;
    }

    let areaWidth = canvasArea.clientWidth > 200 ? canvasArea.clientWidth - 40 : 600;
    let areaHeight = canvasArea.clientHeight > 100 ? canvasArea.clientHeight - 40 : 400;

    konvaContainer.style.width = `${areaWidth}px`;
    konvaContainer.style.height = `${areaHeight}px`;

    stage = new Konva.Stage({
        container: konvaContainerId,
        width: areaWidth,
        height: areaHeight,
    });

    backgroundImageLayer = new Konva.Layer({ name: 'backgroundLayer' });
    stage.add(backgroundImageLayer);

    mainLayer = new Konva.Layer({ name: 'mainDrawingLayer' });
    stage.add(mainLayer);

    stage.draw();
    console.log('Konva initialisé.', stage);
    return true;
}

export function setCurrentBackgroundImage(image: Konva.Image | null) {
    currentBackgroundImage = image;
}

export function getKonvaContainer(): HTMLElement | null {
    return document.getElementById(konvaContainerId);
}

export function getCanvasArea(): HTMLElement | null {
    return document.getElementById(canvasAreaId);
}

export function resizeKonvaStage() {
    if (!stage || !getKonvaContainer() || !getCanvasArea()) return;

    const konvaDiv = getKonvaContainer()!;
    const canvasAreaDiv = getCanvasArea()!;

    let areaWidth = canvasAreaDiv.clientWidth > 200 ? canvasAreaDiv.clientWidth - 40 : 600;
    let areaHeight = canvasAreaDiv.clientHeight > 100 ? canvasAreaDiv.clientHeight - 40 : 400;

    konvaDiv.style.width = `${areaWidth}px`;
    konvaDiv.style.height = `${areaHeight}px`;
    stage.width(areaWidth);
    stage.height(areaHeight);

    if (currentBackgroundImage && backgroundImageLayer) {
        const originalWidth = currentBackgroundImage.getAttr('originalWidth');
        const originalHeight = currentBackgroundImage.getAttr('originalHeight');

        if (originalWidth && originalHeight) {
            const imageAspectRatio = originalWidth / originalHeight;
            const stageAspectRatio = areaWidth / areaHeight;
            let newImgWidth, newImgHeight;

            if (imageAspectRatio > stageAspectRatio) {
                newImgWidth = areaWidth;
                newImgHeight = areaWidth / imageAspectRatio;
            } else {
                newImgHeight = areaHeight;
                newImgWidth = areaHeight * imageAspectRatio;
            }
            currentBackgroundImage.width(newImgWidth);
            currentBackgroundImage.height(newImgHeight);
            currentBackgroundImage.x((areaWidth - newImgWidth) / 2);
            currentBackgroundImage.y((areaHeight - newImgHeight) / 2);
        }
    }
    stage.draw();
}