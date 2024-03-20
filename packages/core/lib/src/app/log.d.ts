import type { ErrorLevel } from '../.';
export declare const logColors: Record<ErrorLevel, string>;
export declare const logStyles: {
    neutral: string;
    none: string;
};
/**
 * Logs an array of messages to the console
 *
 * @param text - An array of strings and styles to log
 */
export declare const log: (text: ([string, string] | [string] | boolean)[]) => void;
//# sourceMappingURL=log.d.ts.map