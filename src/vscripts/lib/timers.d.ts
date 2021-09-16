// Unsure if renaming the global interface is safe.
/* eslint-disable @typescript-eslint/no-redeclare */

/**
 * This is the call signature of a callback used by Timer creation functions that don't accept a
 * context.
 */
type VoidCallback = ((this: void) => void) | ((this: void) => number);

/**
 * This is the call signature of a callback used by Timer creation functions that accept a context.
 */
 type ContextCallback<TThis> = ((this: TThis) => void) | ((this: TThis) => number);

/**
 * Options that can be passed to timer creation functions.
 */
interface CreateTimerOptions {
	callback?: VoidCallback;
	endTime?: number;
	useGameTime?: boolean;
	useOldStyle?: boolean;
}

/**
 * Options that can be passed to a timer creation function that accepts a context.
 */
type CreateTimerOptionsContext<TThis> = CreateTimerOptions & {
	callback?: ContextCallback<TThis>;
};

/**
 * Timers is a global object that controls the creation and removal of Timers.
 */
declare interface Timers {
	CreateTimer(callback: VoidCallback): string;
	CreateTimer<T>(callback: ContextCallback<T>, context: T): string;

	CreateTimer(name: string, options: CreateTimerOptions): string;
	CreateTimer<T>(name: string, options: CreateTimerOptionsContext<T>, context: T): string;

	CreateTimer(options: CreateTimerOptions): string;
	CreateTimer<T>(options: CreateTimerOptionsContext<T>, context: T): string;

	CreateTimer(delay: number, callback: VoidCallback): string;
	CreateTimer<T>(delay: number, callback: ContextCallback<T>, context: T): string;

	RemoveTimer(name: string): void;
	RemoveTimers(killAll: boolean): void;
}

/**
 * Timers is a global object that controls the creation and removal of Timers.
 */
// This is how it was done when I got this file - dunno if it's safe to change.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare var Timers: Timers;
