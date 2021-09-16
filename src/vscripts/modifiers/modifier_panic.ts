import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

/**
 * Base speed modifier -- Could be moved to a separate file.
 */
class ModifierSpeed extends BaseModifier {
	/**
	 * Declare functions.
	 *
	 * @returns list of properties that will be modified by the modifier.
	 */
	public DeclareFunctions(): ModifierFunction[] {
		return [ModifierFunction.MOVESPEED_ABSOLUTE];
	}

	/**
	 * This is called to obtain the modified movespeed.
	 *
	 * @returns The desired movespeed, in Hammer units.
	 */
	public GetModifierMoveSpeed_Absolute(): number {
		return 300;
	}
}

/**
 * Registration for the "Panic" modifier.
 */
@registerModifier()
export class ModifierPanic extends ModifierSpeed {
	/**
	 * Set state.
	 *
	 * @returns The state modifiers to be applied to the target.
	 */
	public CheckState(): Partial<Record<modifierstate, boolean>> {
		return {
			[ModifierState.COMMAND_RESTRICTED]: true,
		};
	}

	/**
	 * Override speed given by Modifier_Speed.
	 *
	 * @returns The desired movespeed, in Hammer units.
	 */
	public GetModifierMoveSpeed_Absolute(): number {
		return 540;
	}

	/**
	 * Run when modifier instance is created - i.e. when a target unit is inflicted with an instance
	 * of this modifier.
	 */
	public OnCreated(): void {
		if (IsServer()) {
			// Think every 0.3 seconds
			this.StartIntervalThink(0.3);
		}
	}

	/**
	 * Called when intervalThink is triggered
	 */
	public OnIntervalThink(): void {
		const parent = this.GetParent();

		parent.MoveToPosition((parent.GetAbsOrigin() + RandomVector(400)) as Vector);
	}
}
