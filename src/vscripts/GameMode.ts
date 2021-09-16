import { reloadable } from "./lib/tstl-utils";
import { ModifierPanic } from "./modifiers/modifier_panic";

const heroSelectionTime = 20;

declare global {
	/**
	 * This is the object used to define and declare the loaded addon.
	 */
	interface CDOTAGamerules {
		Addon: GameMode;
	}
}

/**
 * This class defines the custom game mode.
 */
@reloadable
export class GameMode {

	/**
	 * Called by the engine to precache resources on game load.
	 *
	 * @param this Unused.
	 * @param context The context for the custom game mode's precaching.
	 */
	public static Precache(this: void, context: CScriptPrecacheContext): void {
		PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
		PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
	}

	/**
	 * Runs when the gamemode is loaded.
	 *
	 * @param this Unused.
	 */
	public static Activate(this: void): void {
		// When the addon activates, create a new instance of this GameMode class.
		GameRules.Addon = new GameMode();
	}

	constructor() {
		this.configure();

		// Register event listeners for dota engine events
		ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
		ListenToGameEvent("npc_spawned", event => this.OnNpcSpawned(event), undefined);

		// Register event listeners for events from the UI
		CustomGameEventManager.RegisterListener("ui_panel_closed", (_, data) => {
			print(`Player ${data.PlayerID} has closed their UI panel.`);

			// Respond by sending back an example event
			const player = PlayerResource.GetPlayer(data.PlayerID);
			if (player === undefined) {
				throw new Error("player not connected");
			}
			CustomGameEventManager.Send_ServerToPlayer(player, "example_event", {
				myArrayOfNumbers: [1.414, 2.718, 3.142],
				myBoolean: true,
				myNumber: 42,
				myString: "Hello!"
			});

			// Also apply the panic modifier to the sending player's hero
			const hero = player.GetAssignedHero();
			hero.AddNewModifier(hero, undefined, ModifierPanic.name, { duration: 5 });
		});
	}

	/**
	 * Sets up the addon's configuration using the global configuration management interface.
	 */
	private configure(): void {
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 3);
		GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 3);

		GameRules.SetShowcaseTime(0);
		GameRules.SetHeroSelectionTime(heroSelectionTime);
	}

	/**
	 * Called when the game's state changes.
	 *
	 * The state must be inspected through the GameRules.
	 */
	public OnStateChange(): void {
		const state = GameRules.State_Get();

		// Add 4 bots to lobby in tools
		if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
			for (let i = 0; i < 4; i++) {
				Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
			}
		}

		if (state === GameState.CUSTOM_GAME_SETUP) {
			// Automatically skip setup in tools
			if (IsInToolsMode()) {
				Timers.CreateTimer(3, () => {
					GameRules.FinishCustomGameSetup();
				});
			}
		}

		// Start game once pregame hits
		if (state === GameState.PRE_GAME) {
			Timers.CreateTimer(0.2, () => this.StartGame());
		}
	}

	/**
	 * Serves no real purpose - this is set up to be called when the game's state changes to
	 * "PRE_GAME".
	 */
	private StartGame(): void {
		print("Game starting!");

		// Do some stuff here
	}

	/**
	 * Called on script_reload.
	 */
	public Reload(): void {
		print("Script reloaded!");

		// Do some stuff here
	}

	/**
	 * This event listener is called when a new unit is spawned.
	 *
	 * It's unclear if that means "spawned into the game" i.e. once at the game's start, or "spawned
	 * in fountain" i.e. after being dead.
	 *
	 * @param event The event data from unit spawning.
	 */
	private OnNpcSpawned(event: NpcSpawnedEvent): void {
		// After a hero unit spawns, apply modifier_panic for 8 seconds
		const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC; // Cast to npc since this is the 'npc_spawned' event
		// Give all real heroes (not illusions) the meepo_earthbind_ts_example spell
		if (unit.IsRealHero()) {
			if (!unit.HasAbility("meepo_earthbind_ts_example")) {
				// Add lua ability to the unit
				unit.AddAbility("meepo_earthbind_ts_example");
			}
		}
	}
}
