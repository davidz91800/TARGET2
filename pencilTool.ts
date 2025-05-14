import Konva from 'konva';
import { stage, mainLayer } from './konvaManager';
import { currentTool } from './toolManager';
import { currentPencilColor, currentPencilThickness } from './propertyManager';

let isPainting = false;
let lastPencilLine: Konva.Line | null = null;

export function activatePencilTool() {
    if (!stage || !mainLayer) return;
    // console.log("Pencil tool activated."); // Log optionnel

    stage.on('mousedown.tool touchstart.tool', () => {
        if (currentTool !== 'pencil' || !stage || !mainLayer) return;
        isPainting = true;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        lastPencilLine = new Konva.Line({
            stroke: currentPencilColor,
            strokeWidth: currentPencilThickness,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y, pos.x, pos.y],
            lineCap: 'round',
            lineJoin: 'round',
            name: 'pencilStroke'
        });
        mainLayer.add(lastPencilLine);
    });

    stage.on('mousemove.tool touchmove.tool', () => {
        if (!isPainting || !lastPencilLine || currentTool !== 'pencil' || !stage || !mainLayer) return;
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const newPoints = lastPencilLine.points().concat([pos.x, pos.y]);
        lastPencilLine.points(newPoints);
        mainLayer.batchDraw();
    });

    stage.on('mouseup.tool touchend.tool mouseleave.tool touchleave.tool', () => {
        if (currentTool !== 'pencil') return;
        isPainting = false;
    });
}