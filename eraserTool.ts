import Konva from 'konva';
import { stage, mainLayer } from './konvaManager';
import { currentTool } from './toolManager';
import { currentEraserSize } from './propertyManager';

let isErasing = false;
let lastEraserLine: Konva.Line | null = null;

export function activateEraserTool() {
    if (!stage || !mainLayer) {
        // console.error("EraserTool: Stage ou mainLayer non disponible."); // Log optionnel
        return;
    }
    // console.log("Eraser tool activated. Current size:", currentEraserSize); // Log optionnel

    stage.on('mousedown.tool touchstart.tool', () => {
        if (currentTool !== 'eraser' || !stage || !mainLayer) return;
        isErasing = true;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        // console.log(`Eraser: mousedown at ${pos.x}, ${pos.y} with size ${currentEraserSize}`); // Log optionnel
        lastEraserLine = new Konva.Line({
            stroke: 'white',
            strokeWidth: currentEraserSize,
            globalCompositeOperation: 'destination-out',
            points: [pos.x, pos.y, pos.x, pos.y],
            lineCap: 'round',
            lineJoin: 'round',
            name: 'eraserStroke'
        });
        mainLayer.add(lastEraserLine);
    });

    stage.on('mousemove.tool touchmove.tool', () => {
        if (!isErasing || !lastEraserLine || currentTool !== 'eraser' || !stage || !mainLayer) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const newPoints = lastEraserLine.points().concat([pos.x, pos.y]);
        lastEraserLine.points(newPoints);
        mainLayer.batchDraw();
    });

    stage.on('mouseup.tool touchend.tool mouseleave.tool touchleave.tool', () => {
        if (!isErasing || currentTool !== 'eraser') return;
        // console.log("Eraser: mouseup/leave, stopping erase."); // Log optionnel
        isErasing = false;
    });
}