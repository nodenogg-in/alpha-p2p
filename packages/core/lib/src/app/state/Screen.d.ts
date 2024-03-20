import { State } from '@nodenogg.in/state';
import { PointerInteractionEvent } from './pointer-events';
import { PointerState, Size } from '@nodenogg.in/spatialkit';
export type ScreenState = {
    visible: boolean;
    size: Size;
    scale: number;
};
type DOMElement = Window | HTMLElement;
type EventFilter = (event: PointerInteractionEvent, valid: boolean) => void;
type CreatePointer = {
    filterEvents?: EventFilter;
};
export declare class Screen extends State<{
    pointer: PointerState;
    screen: ScreenState;
}> {
    filterEvents: EventFilter;
    target: DOMElement;
    constructor({ filterEvents }?: CreatePointer, target?: DOMElement);
    private resizeListener;
    private onPointerDown;
    private onPointerMove;
    private onPointerUp;
    private onVisibilityChange;
    private prevent;
}
export {};
//# sourceMappingURL=Screen.d.ts.map