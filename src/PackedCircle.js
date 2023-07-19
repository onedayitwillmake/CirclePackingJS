// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

import Vector from './Vector.js';

/**
 * The Packed circle contains information about a Packed circle
 */
export default class PackedCircle {
	/**
	 * Creates an instance of PackedCircle.
	 *
	 * @constructor
	 * @param {PackedCircleData} - The data to instantiate the PackedCircle with
	 */
	constructor({ id, radius, x, y, isPulledToCenter, isPinned }) {
		x = x || 0;
		y = y || 0;

		/** @type {CircleID} */
		this.id = id;

		/**
		 * Where we would like to be
		 *
		 * @type {Vector}
		 **/

		this.targetPosition = new Vector(0, 0);

		/**
		 * Where we really are
		 *
		 * @type {Vector}
		 **/
		this.position = new Vector(x, y);

		/**
		 * Where we we were last time
		 *
		 * @type {Vector}
		 **/
		this.previousPosition = new Vector(x, y);

		/**
		 * Is circle being pulled to center?
		 *
		 * @type {boolean}
		 **/
		this.isPulledToCenter = isPulledToCenter;

		/**
		 * Is circle pinned inplace
		 *
		 * @type {VectorData}
		 **/
		this.isPinned = isPinned;

		this.setRadius(radius);
	}

	/**
	 * Update the position of the circle
	 *
	 * @param {Vector} aPosition - The new position of the circle
	 */
	setPosition(aPosition) {
		this.previousPosition = this.position;
		this.position = aPosition.cp();
	}

	/**
	 * Updates the radius of the circle
	 *
	 * @param {number} aRadius - The new radizs
	 */
	setRadius(aRadius) {
		this.radius = aRadius;
		this.radiusSquared = aRadius * aRadius;
	}

	/**
	 * Returns the distance to the last position of the circle
	 *
	 * @type {Vector}
	 */
	get delta() {
		return new Vector(
			this.position.x - this.previousPosition.x,
			this.position.y - this.previousPosition.y
		);
	}
}
