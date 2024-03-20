import { type Unsubscribe } from '@nodenogg.in/state';
export declare enum Commands {
    all = 0,
    copy = 1,
    cut = 2,
    paste = 3,
    backslash = 4,
    undo = 5,
    redo = 6,
    backspace = 7,
    escape = 8,
    n = 9,
    c = 10,
    m = 11,
    v = 12,
    h = 13,
    space = 14
}
export declare class Keyboard {
    private events;
    private unsubscribe;
    constructor();
    onCommand: <TEventName extends "copy" | "n" | "h" | "v" | "c" | "all" | "cut" | "paste" | "backslash" | "undo" | "redo" | "backspace" | "escape" | "m" | "space">(listeners: Record<TEventName, (eventArg: (typeof Commands)[TEventName]) => void>) => Unsubscribe;
    private key;
    dispose: () => void;
}
//# sourceMappingURL=Keyboard.d.ts.map