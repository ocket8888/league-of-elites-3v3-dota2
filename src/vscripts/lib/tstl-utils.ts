// Fixing this is a task to which I am not equal, not now, anyway.
/* eslint-disable @typescript-eslint/no-explicit-any */
const global = globalThis as typeof globalThis & { reloadCache: Record<string, any> };
if (global.reloadCache === undefined) {
	global.reloadCache = {};
}

/**
 * Caches any reloadable resource. Must be constructable (a class).
 *
 * @param constructor Any object that can be instantiated with `new` that shall be cached as a
 * resource reloader. If a reloader is already cached for the same resource, then it will be
 * extended by this object.
 * @returns The full reloader for the resource reloaded by `constructor` - after any and all
 * extension has taken place.
 */
export function reloadable<T extends new (...args: any[]) => {}>(constructor: T): T {
	const className = constructor.name;
	if (global.reloadCache[className] === undefined) {
		global.reloadCache[className] = constructor;
	}

	Object.assign(global.reloadCache[className].prototype, constructor.prototype);
	return global.reloadCache[className];
}
