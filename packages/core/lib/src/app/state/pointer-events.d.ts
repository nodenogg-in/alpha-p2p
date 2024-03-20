export type PointerInteractionEvent = Event | WheelEvent | PointerEvent | MouseEvent | TouchEvent;
export declare const isPointerEvent: (event: Event) => event is PointerEvent;
export declare const UI_CLASS = "ui";
export declare const allowEvent: (e: Event) => boolean;
export declare const preventEvents: (e: PointerInteractionEvent) => void;
//# sourceMappingURL=pointer-events.d.ts.map