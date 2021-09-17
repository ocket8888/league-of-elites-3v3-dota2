/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/**
 * BaseAbility is the base type for all abilities.
 */
export interface BaseAbility extends CDOTA_Ability_Lua {
	____constructor(): void;
}
/**
 * This merges with the interface of the same name.
 */
export class BaseAbility {}

/**
 * BaseItem is the base type for all items.
 */
export interface BaseItem extends CDOTA_Item_Lua {}
/**
 * This merges with the interface of the same name.
 */
export class BaseItem {}

/**
 * BaseModifier is the base class for all modifiers.
 */
export interface BaseModifier extends CDOTA_Modifier_Lua {
	____constructor(): void;
}
/**
 * This merges with the interface of the same name.
 */
export class BaseModifier {
	/**
	 * Applies the modifier to an npc.
	 *
	 * @param this The `this` parameter is used to make this a bound method, despite being static
	 * (for some reason).
	 * @param target A reference to the npc being inflicted with the modifier.
	 * @param caster A reference to the source of the modifier infliction - or undefined if there is
	 * no source or the source is not an npc.
	 * @param ability A reference to the ability that is applying the modifier - or undefined if
	 * there was no source or the source was not an ability.
	 * @param modifierTable unknown
	 * @returns A reference to the (de)buff instance that was applied.
	 */
	public static apply<T extends typeof BaseModifier>(
		this: T,
		target: CDOTA_BaseNPC,
		caster?: CDOTA_BaseNPC,
		ability?: CDOTABaseAbility,
		modifierTable?: object,
	): InstanceType<T> {
		return target.AddNewModifier(caster, ability, this.name, modifierTable) as InstanceType<T>;
	}
}

/**
 * A modifier that modifies horizontal motion.
 */
export interface BaseModifierMotionHorizontal extends CDOTA_Modifier_Lua_Horizontal_Motion {}
/**
 * This merges with the interface of the same name.
 */
export class BaseModifierMotionHorizontal extends BaseModifier {}

/**
 * A modifier that modifies vertical motion.
 */
export interface BaseModifierMotionVertical extends CDOTA_Modifier_Lua_Vertical_Motion {}
/**
 * This merges with the interface of the same name.
 */
export class BaseModifierMotionVertical extends BaseModifier {}

/**
 * A modifier that modifies both vertical and horizontal motion.
 */
export interface BaseModifierMotionBoth extends CDOTA_Modifier_Lua_Motion_Both {}
/**
 * This merges with the interface of the same name.
 */
export class BaseModifierMotionBoth extends BaseModifier {}
/* eslint-enable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-empty-interface */

// Add standard base classes to prototype chain to make `super.*` work as `self.BaseClass.*`
setmetatable(BaseAbility.prototype, { __index: CDOTA_Ability_Lua ?? C_DOTA_Ability_Lua });
setmetatable(BaseItem.prototype, { __index: CDOTA_Item_Lua ?? C_DOTA_Item_Lua });
setmetatable(BaseModifier.prototype, { __index: CDOTA_Modifier_Lua ?? C_DOTA_Modifier_Lua });

/**
 * Unknown.
 *
 * @returns unknown.
 * @todo The first call signature in the index property type of the first return element appears to
 * not be well behaved with the registry functions, so it may be wrong and the intent was simply for
 * it to be callable - but it's probable that it was meant to be a class instantiation rather than
 * an unbound function signature.
 */
function getFileScope(): [Record<PropertyKey, ((this: void, ...args: unknown[])=>void) | BaseAbility | BaseModifier | Record<PropertyKey, BaseAbility | BaseModifier | ((this: BaseAbility | BaseModifier, ...angs: unknown[])=>void)>>, string | undefined] {
	let level = 1;
	while (true) {
		const info = debug.getinfo(level, "S");
		if (info && info.what === "main") {
			return [getfenv(level), info.source];
		}

		level += 1;
	}
}

/**
 * Removes all "own" properties from an object, ostensibly one that's being used as a map.
 *
 * @param table A record mapping of any kind.
 */
function clearTable(table: Record<PropertyKey, unknown> | BaseAbility | BaseModifier): void {
	for (const key in table) {
		// We can't use Maps
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete (table as Record<PropertyKey, unknown>)[key];
	}
}

/**
 * Unknown
 *
 * @param instance unknown
 * @param table unknown
 */
function toDotaClassInstance(instance: Record<PropertyKey, unknown> | BaseAbility | BaseModifier, table: new () => unknown): void {
	let { prototype } = table;
	while (prototype) {
		for (const key in prototype) {
			// Using hasOwnProperty to ignore methods from metatable added by ExtendInstance
			// https://github.com/SteamDatabase/GameTracking-Dota2/blob/7edcaa294bdcf493df0846f8bbcd4d47a5c3bd57/game/core/scripts/vscripts/init.lua#L195
			if (!instance.hasOwnProperty(key)) {
				(instance as Record<PropertyKey, unknown>)[key] = prototype[key];
			}
		}

		prototype = getmetatable(prototype);
	}
}

export const registerAbility = (name?: string) => (ability: new () => CDOTA_Ability_Lua | CDOTA_Item_Lua): void => {
	if (name !== undefined) {
		// @ts-ignore
		ability.name = name;
	} else {
		name = ability.name;
	}

	const [env] = getFileScope();
	let fenvEntry = env[name] as BaseAbility;

	if (fenvEntry) {
		clearTable(fenvEntry);
	} else {
		env[name] = {};
		fenvEntry = env[name] as BaseAbility;
	}

	toDotaClassInstance(fenvEntry, ability);

	// This is actually only being referenced in a bound context, even though the scope of this
	// variable is unbound.
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const originalSpawn = fenvEntry.Spawn;
	fenvEntry.Spawn = function (this: BaseAbility): void {
		this.____constructor();
		if (originalSpawn) {
			originalSpawn.call(this);
		}
	};
};

/**
 * ModifierRegisterable objects are viable for registration as a custom modifier.
 */
interface ModifierRegisterable {
	new (): CDOTA_Modifier_Lua;
	____super?: ModifierRegisterable | (new () => BaseModifierMotionBoth | BaseModifierMotionHorizontal | BaseModifierMotionVertical);
}

export const registerModifier = (name?: string) => (modifier: ModifierRegisterable): void => {
	if (name !== undefined) {
		// @ts-ignore
		modifier.name = name;
	} else {
		name = modifier.name;
	}

	const [env, source] = getFileScope();
	const [fileName] = string.gsub(source ?? "", ".*scripts[\\/]vscripts[\\/]", "");
	let fenvEntry = env[name] as BaseModifier;

	if (fenvEntry) {
		clearTable(fenvEntry);
	} else {
		env[name] = {};
		fenvEntry = env[name] as BaseModifier;
	}

	toDotaClassInstance(fenvEntry, modifier);

	// This is actually only being referenced in a bound context, even though the scope of this
	// variable is unbound.
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const originalOnCreated = fenvEntry.OnCreated;
	fenvEntry.OnCreated = function (this: BaseModifier, parameters: object): void {
		this.____constructor();
		if (originalOnCreated) {
			originalOnCreated.call(this, parameters);
		}
	};

	let type = LuaModifierMotionType.NONE;
	let base = modifier.____super;
	while (base) {
		if (base === BaseModifierMotionBoth) {
			type = LuaModifierMotionType.BOTH;
			break;
		} else if (base === BaseModifierMotionHorizontal) {
			type = LuaModifierMotionType.HORIZONTAL;
			break;
		} else if (base === BaseModifierMotionVertical) {
			type = LuaModifierMotionType.VERTICAL;
			break;
		}

		base = (base as ModifierRegisterable).____super;
	}

	LinkLuaModifier(name, fileName, type);
};

/**
 * Use to expose top-level functions in entity scripts.
 *
 * Usage: registerEntityFunction("OnStartTouch", (trigger: TriggerStartTouchEvent) => { <your code here> });
 * @param name The name of the function, presumably.
 * @param f The actual function.
 */
export function registerEntityFunction(name: string, f: (...args: unknown[]) => void): void {
	const [env] = getFileScope();
	env[name] = function (this: void, ...args: unknown[]): void {
		f(...args);
	};
}
