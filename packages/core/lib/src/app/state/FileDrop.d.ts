import { State } from '@nodenogg.in/state';
export type FileDropEvents = {
    drop: [File[] | null, DragEvent];
    enter: [File[] | null, DragEvent];
    over: [File[] | null, DragEvent];
    leave: true;
};
export declare class FileDrop extends State<{
    active: boolean;
    count: number;
}> {
    private readonly mimeTypes;
    private readonly maxSize;
    events: import("@nodenogg.in/state").Events<FileDropEvents, "leave" | "drop" | "enter" | "over">;
    constructor(mimeTypes: string[], maxSize?: number);
    private onDragEnter;
    private onDragLeave;
    private onDragOver;
    private onDrop;
    private filterEvent;
    private getFiles;
}
//# sourceMappingURL=FileDrop.d.ts.map