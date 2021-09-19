import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter";

/**
 * Gorgutz's "Grapplin' Klaw" ability.
 */
@registerAbility()
export class grapplin_klaw extends BaseAbility {
	/**
	 * Holds a reference to the particle for the ability's projectile.
	 */
	// public particle?: ParticleID;

	public GetAOERadius(): number {
		return this.GetSpecialValueFor("radius");
	}

	public OnSpellStart(): void {
		print("Fired ability!");
	}

	/**
	 * Calculates the cooldown for the ability.
	 *
	 * @returns The cooldown of the ability.
	 */
	// public GetCooldown(): number {
	// 	return this.GetSpecialValueFor("cooldown");
	// }

	/**
	 * Called when the ability cast starts (at the beginning of the cast point duration).
	 *
	 * @returns Whether the cast succeeds.
	 */
	// public OnAbilityPhaseStart(): true {
	// 	if (IsServer()) {
	// 		this.GetCaster().EmitSound("Hero_Meepo.Earthbind.Cast");
	// 	}

	// 	return true;
	// }

	/**
	 * If the cast is interrupted, this handler will be called.
	 */
	// public OnAbilityPhaseInterrupted(): void {
	// 	this.GetCaster().StopSound("Hero_Meepo.Earthbind.Cast");
	// }

	/**
	 * Called at the end of the cast point duration to start the spell's effects.
	 */
	// public OnSpellStart(): void {
	// 	const caster = this.GetCaster();
	// 	const point = this.GetCursorPosition();
	// 	const projectileSpeed = this.GetSpecialValueFor("speed");

	// 	const direction = ((point - caster.GetAbsOrigin()) as Vector).Normalized();
	// 	direction.z = 0;
	// 	const distance = ((point - caster.GetAbsOrigin()) as Vector).Length();

	// 	const radius = this.GetSpecialValueFor("radius");
	// 	this.particle = ParticleManager.CreateParticle(
	// 		"particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf",
	// 		ParticleAttachment.CUSTOMORIGIN,
	// 		caster,
	// 	);

	// 	ParticleManager.SetParticleControl(this.particle, 0, caster.GetAbsOrigin());
	// 	ParticleManager.SetParticleControl(this.particle, 1, point);
	// 	ParticleManager.SetParticleControl(this.particle, 2, Vector(projectileSpeed, 0, 0));

	// 	ProjectileManager.CreateLinearProjectile({
	// 		Ability: this,
	// 		EffectName: "",
	// 		Source: caster,
	// 		bHasFrontalCone: false,
	// 		bProvidesVision: true,
	// 		fDistance: distance,
	// 		fEndRadius: radius,
	// 		fStartRadius: radius,
	// 		iUnitTargetFlags: UnitTargetFlags.NONE,
	// 		iUnitTargetTeam: UnitTargetTeam.NONE,
	// 		iUnitTargetType: UnitTargetType.NONE,
	// 		iVisionRadius: radius,
	// 		iVisionTeamNumber: caster.GetTeamNumber(),
	// 		vSpawnOrigin: caster.GetAbsOrigin(),
	// 		vVelocity: (direction * projectileSpeed) as Vector,
	// 	});
	// }

	/**
	 * Called when the ability projectile collides with its target.
	 *
	 * @param _target The target that was hit by the projectile.
	 * @param location The coordinates at which the collision occurred.
	 * @returns Unknown.
	 */
	// public OnProjectileHit(_target: CDOTA_BaseNPC, location: Vector): true {
	// 	const caster = this.GetCaster();
		// const duration = this.GetSpecialValueFor("duration");
		// const radius = this.GetSpecialValueFor("radius");

		// const units = FindUnitsInRadius(
		// 	caster.GetTeamNumber(),
		// 	location,
		// 	undefined,
		// 	radius,
		// 	UnitTargetTeam.ENEMY,
		// 	UnitTargetType.BASIC | UnitTargetType.HERO,
		// 	UnitTargetFlags.NONE,
		// 	0,
		// 	false,
		// );

		// for (const unit of units) {
			// unit.AddNewModifier(caster, this, "modifier_meepo_earthbind", { duration });
	// 		unit.EmitSound("Hero_Meepo.Earthbind.Target");
	// 	}

	// 	ParticleManager.DestroyParticle(this.particle as ParticleID, false);
	// 	ParticleManager.ReleaseParticleIndex(this.particle as ParticleID);

	// 	return true;
	// }
}
