import { State } from '@nodenogg.in/state';
import { Keyboard } from './Keyboard';
import { Device } from './Device';
import { Screen } from './Screen';
import { FileDrop } from './FileDrop';
export type UIState = {
    menuOpen: boolean;
    filterEvents: boolean;
    showUI: boolean;
};
export declare class UI extends State<UIState> {
    readonly keyboard: Keyboard;
    readonly device: Device;
    readonly filedrop: FileDrop;
    readonly screen: Screen;
    constructor();
    toggleMenu: () => void;
    toggleUI: () => void;
}
//# sourceMappingURL=UI.d.ts.map