import Konva from 'konva';
import { stage, mainLayer, backgroundImageLayer, currentBackgroundImage, setCurrentBackgroundImage } from './konvaManager';
import { currentlyEditingText, finishTextEditing, addDblClickListenerToText } from './textTool';

export const LOCAL_STORAGE_PROJECT_KEY = 'aeroscheme_saved_project_v2';
export const imageImporterInput = document.getElementById('image-importer-input') as HTMLInputElement;

export function initializeFileManager() {
    document.getElementById('btn-import-image')?.addEventListener('click', () => imageImporterInput.click());
    imageImporterInput.addEventListener('change', handleImageImport);
    document.getElementById('btn-export-png')?.addEventListener('click', exportToPNG);
    document.getElementById('btn-save-project')?.addEventListener('click', saveProjectToLocalStorage);
}

function handleImageImport(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        Konva.Image.fromURL(imageUrl, (konvaImage) => {
            if (!stage || !backgroundImageLayer) return;
            if (currentBackgroundImage) currentBackgroundImage.destroy();

            konvaImage.setAttr('originalWidth', konvaImage.width());
            konvaImage.setAttr('originalHeight', konvaImage.height());
            const stageWidth = stage.width();
            const stageHeight = stage.height();
            const imageAspectRatio = konvaImage.getAttr('originalWidth') / konvaImage.getAttr('originalHeight');
            const stageAspectRatio = stageWidth / stageHeight;
            let newWidth, newHeight;
            if (imageAspectRatio > stageAspectRatio) {
                newWidth = stageWidth; newHeight = stageWidth / imageAspectRatio;
            } else {
                newHeight = stageHeight; newWidth = stageHeight * imageAspectRatio;
            }
            konvaImage.width(newWidth).height(newHeight);
            konvaImage.x((stageWidth - newWidth) / 2).y((stageHeight - newHeight) / 2);
            konvaImage.name('backgroundImage');

            backgroundImageLayer.add(konvaImage);
            setCurrentBackgroundImage(konvaImage);
            backgroundImageLayer.batchDraw();
            // console.log('Image importée.'); // Log optionnel
        });
    };
    reader.readAsDataURL(file);
    imageImporterInput.value = '';
}

function exportToPNG() {
    if (currentlyEditingText) finishTextEditing();
    if (!stage) return;
    const dataURL = stage.toDataURL({ mimeType: 'image/png', quality: 1, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'aeroscheme_export.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function saveProjectToLocalStorage() {
    if (!mainLayer || !backgroundImageLayer) return;
    if (currentlyEditingText) finishTextEditing();

    const projectData = {
        mainLayerObjects: [] as any[], // Typage plus précis
        backgroundImage: null as any
    };

    mainLayer.getChildren().forEach(node => {
        let nodeData: any = { type: node.getClassName(), name: node.name() };
        if (node instanceof Konva.Line) {
            nodeData = { ...nodeData, points: node.points(), stroke: node.stroke(), strokeWidth: node.strokeWidth(), globalCompositeOperation: node.globalCompositeOperation(), lineCap: node.lineCap(), lineJoin: node.lineJoin() };
        } else if (node instanceof Konva.Text) {
            nodeData = { ...nodeData, x: node.x(), y: node.y(), text: node.text(), fontSize: node.fontSize(), fill: node.fill(), draggable: node.draggable(), padding: node.padding() };
        }
        if (nodeData.type === 'Line' || nodeData.type === 'Text') {
            projectData.mainLayerObjects.push(nodeData);
        }
    });

    if (currentBackgroundImage) {
        projectData.backgroundImage = {
            src: (currentBackgroundImage.image() as HTMLImageElement)?.src,
            originalWidth: currentBackgroundImage.getAttr('originalWidth'),
            originalHeight: currentBackgroundImage.getAttr('originalHeight'),
            x: currentBackgroundImage.x(),
            y: currentBackgroundImage.y(),
            width: currentBackgroundImage.width(),
            height: currentBackgroundImage.height(),
        };
    }

    try {
        localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projectData));
        // console.log("Projet sauvegardé dans localStorage.", projectData); // Log optionnel
        alert("Projet sauvegardé localement !");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde dans localStorage:", error);
        alert("Erreur lors de la sauvegarde du projet.");
    }
}

export function loadProjectFromLocalStorage() {
    if (!mainLayer || !backgroundImageLayer || !stage) return;

    const savedJson = localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY);
    if (savedJson) {
        try {
            const projectData = JSON.parse(savedJson);
            // console.log("Chargement du projet depuis localStorage:", projectData); // Log optionnel

            mainLayer.destroyChildren();
            backgroundImageLayer.destroyChildren();
            setCurrentBackgroundImage(null);

            if (projectData.backgroundImage && projectData.backgroundImage.src) {
                Konva.Image.fromURL(projectData.backgroundImage.src, (konvaImage) => {
                    if (!stage || !backgroundImageLayer) return;
                    konvaImage.setAttr('originalWidth', projectData.backgroundImage.originalWidth);
                    konvaImage.setAttr('originalHeight', projectData.backgroundImage.originalHeight);
                    konvaImage.x(projectData.backgroundImage.x || 0);
                    konvaImage.y(projectData.backgroundImage.y || 0);
                    konvaImage.width(projectData.backgroundImage.width || stage.width());
                    konvaImage.height(projectData.backgroundImage.height || stage.height());
                    konvaImage.name('backgroundImage');

                    backgroundImageLayer.add(konvaImage);
                    setCurrentBackgroundImage(konvaImage);
                    backgroundImageLayer.batchDraw();
                });
            }

            if (projectData.mainLayerObjects) {
                projectData.mainLayerObjects.forEach((objData: any) => {
                    let newNode: Konva.Shape | null = null;
                    // Utiliser les noms des classes Konva pour la reconstruction
                    if (objData.type === 'Line') {
                        newNode = new Konva.Line({ ...objData });
                    } else if (objData.type === 'Text') {
                        newNode = new Konva.Text({ ...objData });
                        addDblClickListenerToText(newNode as Konva.Text);
                    }
                    if (newNode) mainLayer.add(newNode);
                });
            }
            mainLayer.batchDraw();
            console.log("Projet chargé."); // Garder ce log, il est utile
        } catch (error) {
            console.error("Erreur lors du chargement depuis localStorage:", error);
        }
    } else {
        console.log("Aucun projet sauvegardé (v2) trouvé dans localStorage."); // Garder ce log
    }
}