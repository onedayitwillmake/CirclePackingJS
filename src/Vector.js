/**
 * Vector class
 *
 * Most of this code is taken from CirclePackingJS by @onedayitwillmake
 * https://github.com/onedayitwillmake/CirclePackingJS/blob/eb3475b/js-module/web/js/lib/Vector.js
 *
 */
export default class Vector {
	/**
	 * Creates an instance of Vector.
	 *
	 * @constructor
	 * @param {number | VectorData} x - The X component of the Vector
	 * @param {number} y - The Y component of the Vector
	 */
	constructor(x, y) {
		if (typeof x === 'object') {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	/**
	 * Returns a cloned instance of the Vector
	 *
	 * @returns {Vector}
	 */
	cp() {
		return new Vector(this.x, this.y);
	}

	/**
	 * Multiplies the vector by a scalar
	 *
	 * @param {number} scalar - The scalar to multiply the Vector components with
	 * @returns {this}
	 */
	mul(scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	/**
	 * Normalizes the Vector instance
	 *
	 * @returns {this}
	 */
	normalize() {
		var l = this.length();
		this.x /= l;
		this.y /= l;
		return this;
	}

	/**
	 * Calculates the length of the Vector instance
	 *
	 * @returns {number} - The length of the Vector instance
	 */
	length() {
		var length = Math.sqrt(this.x * this.x + this.y * this.y);

		if (length < 0.005 && length > -0.005) {
			return 0.000001;
		}

		return length;
	}

	/**
	 * Calculates the distance to another Vector instance
	 *
	 * @param {Vector} otherVector - The other Vector instance
	 * @returns {number} - The distance to the other Vector instance
	 */
	distance(otherVector) {
		var deltaX = this.x - otherVector.x;
		var deltaY = this.y - otherVector.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}

	/**
	 * Calculates the distance squared to another Vector instance
	 *
	 * @param {Vector} otherVector - The other Vector instance
	 * @returns {number} - The distance squared to the other Vector instance
	 */
	distanceSquared(otherVector) {
		var deltaX = this.x - otherVector.x;
		var deltaY = this.y - otherVector.y;
		return deltaX * deltaX + deltaY * deltaY;
	}
}
