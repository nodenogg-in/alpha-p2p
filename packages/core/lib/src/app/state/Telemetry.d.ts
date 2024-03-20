import { State } from '@nodenogg.in/state';
export type ErrorLevel = 'info' | 'warn' | 'fail' | 'status';
type EventData = {
    name: string;
    level: ErrorLevel;
    error?: unknown;
    message: string;
    tags?: string[];
};
type TelemetryEvent = Omit<EventData, 'error'> & {
    type: 'telemetry';
    error?: Error;
    created: string;
};
/**
 *
 * @param error
 * @returns
 */
export declare const isTelemetryEvent: (error: unknown) => error is TelemetryEvent;
/**
 *
 * @param error
 * @returns
 */
export declare const isError: (error: unknown) => error is Error;
type AnalyticsOptions = {
    url: string;
    interval?: number;
    levels?: ErrorLevel[];
    count?: number;
};
export type TelemetryOptions = {
    log?: boolean;
    remote?: AnalyticsOptions;
    persist?: boolean;
};
/**
 * Global app Telemetry
 */
export declare class Telemetry extends State<{
    events: TelemetryEvent[];
}> {
    logEvents: boolean;
    events: import("@nodenogg.in/state").Events<Record<ErrorLevel, string>, "status" | "info" | "warn" | "fail">;
    private readonly remote;
    private session_id;
    /**
     *
     * @param TelemetryOptions
     */
    constructor({ log, remote, persist }?: TelemetryOptions);
    private dispatch;
    /**
     * Logs an event
     * @param e - event data
     */
    log: (e: EventData) => void;
    private createEvent;
    private logEvent;
    /**
     * Starts a timed event that is finished by calling .finish()
     * @param e - event data
     * @returns
     */
    time: (e: EventData) => {
        finish: () => void;
    };
    /**
     * Handles a thrown error
     *
     * @param e (optional) - event data
     */
    throw: (e?: EventData) => void;
    /**
     * Catches the final error in a try...catch sequence
     *
     * @param e (optional) - event data
     */
    catch: (e: EventData, origin?: unknown) => void;
}
export declare class TelemetryError extends Error {
}
export {};
//# sourceMappingURL=Telemetry.d.ts.map