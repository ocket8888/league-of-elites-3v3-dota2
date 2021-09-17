/**
 * This file contains some general types related to your game that can be shared between
 * front-end (Panorama) and back-end (VScripts). Only put stuff in here you need to share.
 */
/**
 * A Color represents a defined color.
 */
interface Color {
	r: number;
	g: number;
	b: number;
}

/**
 * UnitData describes a unit.
 */
interface UnitData {
	name: string;
	level: number;
}
