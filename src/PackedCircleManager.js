// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

import PackedCircle from './PackedCircle.js';
import Vector from './Vector.js';

/**
 * The PackedCircleManager handles updating the state. It runs in a web worker
 *
 */
export default class PackedCircleManager {
	/**
	 * Creates an instance of PackedCircleManager.
	 *
	 * @constructor
	 */
	constructor() {
		/** @type {PackedCircle[]} */
		this.allCircles = [];

		/** @type {CircleID[]} */
		this.pinnedCircleIds = [];

		/** @type {Vector | undefined} */
		this.desiredTarget = new Vector(0, 0);

		/** @type {BoundsData} */
		this.bounds = { left: 0, top: 0, right: 0, bottom: 0 };

		/** @type {number} */
		this.damping = 0.025;

		// Number of passes for the centering and collision
		// algorithms - it's (O)logN^2 so use increase at your own risk!
		// Play with these numbers - see what works best for your project

		/** @type {number} */
		this.numberOfCenteringPasses = 1;

		/** @type {number} */
		this.numberOfCollisionPasses = 3;

		/** @type {boolean} */
		this.isCenterPullActive = true;
	}

	/**
	 * Set the boundary rectangle for the circle packing.
	 * This is used to locate the 'center'
	 *
	 * @param {BoundsData} aBoundaryObject - The boundary to set
	 */
	setBounds(aBoundaryObject) {
		if (typeof aBoundaryObject.left === 'number') {
			this.bounds.left = aBoundaryObject.left;
		}

		if (typeof aBoundaryObject.right === 'number') {
			this.bounds.right = aBoundaryObject.right;
		}

		if (typeof aBoundaryObject.top === 'number') {
			this.bounds.top = aBoundaryObject.top;
		}

		if (typeof aBoundaryObject.bottom === 'number') {
			this.bounds.bottom = aBoundaryObject.bottom;
		}

		if (typeof aBoundaryObject.width === 'number') {
			this.bounds.right = this.bounds.left + aBoundaryObject.width;
		}

		if (typeof aBoundaryObject.height === 'number') {
			this.bounds.bottom = this.bounds.top + aBoundaryObject.height;
		}
	}

	/**
	 * Add a circle
	 *
	 * @param {CircleData | PackedCircle} aCircle - A Circle to add, should already be created.
	 */
	addCircle(aCircle) {
		if (!(aCircle instanceof PackedCircle)) {
			aCircle = new PackedCircle({
				id: aCircle.id,
				radius: aCircle.radius,
				x: aCircle.position.x || 0,
				y: aCircle.position.y || 0,
				isPinned: aCircle.isPinned || false,
				isPulledToCenter:
					typeof aCircle.isPulledToCenter === 'boolean' ? aCircle.isPulledToCenter : true,
			});
		}

		this.allCircles.push(aCircle);
		aCircle.targetPosition = this.desiredTarget.cp();
	}

	/**
	 * Remove a circle
	 *
	 * @param {CircleID} circleToRemoveId - Id of the circle to remove
	 */
	removeCircle(circleToRemoveId) {
		const circlesToRemove = this.allCircles.filter(circle => circle.id === circleToRemoveId);
		this.allCircles = this.allCircles.filter(circle => circle.id !== circleToRemoveId);
	}

	/**
	 * Recalculate all circle positions
	 */
	updatePositions() {
		const circleList = this.allCircles;
		const circleCount = circleList.length;

		// store information about the previous position
		for (let i = 0; i < circleCount; ++i) {
			const circle = circleList[i];

			circle.previousPosition = circle.position.cp();
		}

		if (this.desiredTarget && this.isCenterPullActive) {
			// Push all the circles to the target - in my case the center of the bounds
			this.pushAllCirclesTowardTarget(this.desiredTarget);
		}

		// Make the circles collide and adjust positions to move away from each other
		this.handleCollisions();

		// store information about the previous position
		for (let i = 0; i < circleCount; ++i) {
			const circle = circleList[i];

			this.handleBoundaryForCircle(circle);
		}
	}

	/**
	 * Update all circles to move towards a target position
	 *
	 * @param {VectorData} aTarget
	 */
	pushAllCirclesTowardTarget(aTarget) {
		const circleMovement = new Vector(0, 0);

		const dragCircle = this.draggedCircle;
		const circleList = this.allCircles;
		const circleCount = circleList.length;

		for (
			let centeringPassNumber = 0;
			centeringPassNumber < this.numberOfCenteringPasses;
			centeringPassNumber++
		) {
			for (let circleIndex = 0; circleIndex < circleCount; circleIndex++) {
				const circle = circleList[circleIndex];

				if (circle.isPulledToCenter) {
					// Kinematic circles can't be pushed around.
					const isCircleKinematic =
						circle === dragCircle || this.isCirclePinned(circle.id);

					if (isCircleKinematic) {
						continue;
					}

					circleMovement.x = circle.position.x - aTarget.x;
					circleMovement.y = circle.position.y - aTarget.y;
					circleMovement.mul(this.damping);

					circle.position.x -= circleMovement.x;
					circle.position.y -= circleMovement.y;
				}
			}
		}
	}

	/**
	 * Packs the circles towards the center of the bounds.
	 * Each circle will have it's own 'targetPosition' later on
	 */
	handleCollisions() {
		const circleCollisionMovement = new Vector(0, 0);

		const dragCircle = this.draggedCircle;
		const circleList = this.allCircles;
		const circleCount = circleList.length;

		// Collide circles
		for (
			let collisionPassNumber = 0;
			collisionPassNumber < this.numberOfCollisionPasses;
			collisionPassNumber++
		) {
			for (let circleAIndex = 0; circleAIndex < circleCount; circleAIndex++) {
				var circleA = circleList[circleAIndex];

				for (
					let circleBIndex = circleAIndex + 1;
					circleBIndex < circleCount;
					circleBIndex++
				) {
					var circleB = circleList[circleBIndex];

					const isCircleAPinned = this.isCirclePinned(circleA.id);
					const isCircleBPinned = this.isCirclePinned(circleB.id);

					// Kinematic circles can't be pushed around.
					const isCircleAKinematic = circleA === dragCircle || isCircleAPinned;
					const isCircleBKinematic = circleB === dragCircle || isCircleBPinned;

					if (
						// It's us!
						circleA === circleB ||
						// Kinematic circles don't interact with eachother
						(isCircleAKinematic && isCircleBKinematic)
					) {
						continue;
					}

					const dx = circleB.position.x - circleA.position.x;
					const dy = circleB.position.y - circleA.position.y;

					// The distance between the two circles radii,
					// but we're also gonna pad it a tiny bit
					const combinedRadii = (circleA.radius + circleB.radius) * 1.08;
					const distanceSquared = circleA.position.distanceSquared(circleB.position);

					if (distanceSquared < combinedRadii * combinedRadii - 0.02) {
						circleCollisionMovement.x = dx;
						circleCollisionMovement.y = dy;
						circleCollisionMovement.normalize();

						const inverseForce = (combinedRadii - Math.sqrt(distanceSquared)) * 0.5;
						circleCollisionMovement.mul(inverseForce);

						if (!isCircleBKinematic) {
							if (isCircleAKinematic) {
								// Double inverse force to make up
								// for the fact that the other object is fixed
								circleCollisionMovement.mul(2.2);
							}

							circleB.position.x += circleCollisionMovement.x;
							circleB.position.y += circleCollisionMovement.y;
						}

						if (!isCircleAKinematic) {
							if (isCircleBKinematic) {
								// Double inverse force to make up
								// for the fact that the other object is fixed
								circleCollisionMovement.mul(2.2);
							}

							circleA.position.x -= circleCollisionMovement.x;
							circleA.position.y -= circleCollisionMovement.y;
						}
					}
				}
			}
		}
	}

	/**
	 * Ensure the circle stays inside the boundaries
	 *
	 * @param {PackedCircle} aCircle - The circle to check
	 */
	handleBoundaryForCircle(aCircle) {
		const x = aCircle.position.x;
		const y = aCircle.position.y;
		const radius = aCircle.radius;

		let isOverEdge = false;

		if (x + radius >= this.bounds.right) {
			aCircle.position.x = this.bounds.right - radius;
			isOverEdge = true;
		} else if (x - radius < this.bounds.left) {
			aCircle.position.x = this.bounds.left + radius;
			isOverEdge = true;
		}

		if (y + radius > this.bounds.bottom) {
			aCircle.position.y = this.bounds.bottom - radius;
			isOverEdge = true;
		} else if (y - radius < this.bounds.top) {
			aCircle.position.y = this.bounds.top + radius;
			isOverEdge = true;
		}

		// end dragging if user dragged over edge
		if (isOverEdge && aCircle === this.draggedCircle) {
			this.draggedCircle = null;
		}
	}

	/**
	 * Force a certain circle to be the 'draggedCircle'.
	 * Can be used to undrag a circle by calling setDraggedCircle(null)
	 * @param {PackedCircle | null} aCircle - Circle to start dragging. It's assumed to be part of our list. No checks in place currently.
	 */
	setDraggedCircle(aCircle) {
		// Setting to null, and we had a circle before.
		// Restore the radius of the circle as it was previously
		// if (this.draggedCircle && this.draggedCircle !== aCircle) {
		// 	this.draggedCircle.radius = this.draggedCircle.originalRadius;
		// }

		this.draggedCircle = aCircle;
	}

	/**
	 * Mark circle as dragging
	 *
	 * @param {CircleID} id - The ID of the circle we're dragging
	 */
	dragStart(id) {
		const draggedCircle = this.allCircles.filter(circle => circle.id === id)[0];
		this.setDraggedCircle(draggedCircle);
	}

	/**
	 * Mark dragged circle as no longer dragging
	 */
	dragEnd() {
		if (this.draggedCircle) {
			// this.setDraggedCircle(null);
			this.draggedCircle = null;
		}
	}

	/**
	 * Update the position of the circle that is being dragged
	 *
	 * @param {CircleID} id - The id of the circle being dragged
	 * @param {VectorData | Vector} position - The new position of the dragged circle
	 */
	drag(id, position) {
		if (this.draggedCircle && position) {
			this.draggedCircle.position.x = position.x;
			this.draggedCircle.position.y = position.y;
		}
	}

	/**
	 * Check if circle is marked as pinned
	 *
	 * @param {CircleID} id - The id of the circle to check
	 * @returns {boolean}
	 */
	isCirclePinned(id) {
		const circle = this.circleById(id);

		if (circle) {
			return circle.isPinned;
		}

		return false;
	}

	/**
	 * Mark circle as pinned
	 *
	 * @param {CircleID} id - The id of the circle we want to pin
	 */
	pinCircle(id) {
		const circle = this.circleById(id);

		if (circle) {
			circle.isPinned = true;
		}
	}

	/**
	 * Mark circle as no longer pinned
	 *
	 * @param {CircleID} id - The id of the circle we want to unpin
	 */
	unpinCircle(id) {
		const circle = this.circleById(id);

		if (circle) {
			circle.isPinned = false;
		}
	}

	/**
	 * set the radius of a circle
	 *
	 * @param {CircleID} id - The id of the circle we want to update the radius of
	 * @param {number} radius - The new radius
	 */
	setCircleRadius(id, radius) {
		const circle = this.circleById(id);

		if (circle) {
			circle.setRadius(radius);
		}
	}

	/**
	 * Update the centerPull value of a circle
	 *
	 * @param {CircleID} id - The id of the circle
	 * @param {boolean} centerPull - The centerPull value
	 */
	setCircleCenterPull(id, centerPull) {
		const circle = this.circleById(id);

		if (circle) {
			circle.isPulledToCenter = centerPull;
		}
	}

	/**
	 * Set a global centerPull value
	 *
	 * @param {boolean} centerPull - The global canterPull value
	 */
	setCenterPull(centerPull) {
		this.isCenterPullActive = centerPull;
	}

	/**
	 * Gets a circle by its id
	 *
	 * @param {CircleID} id - The id of the circle we want
	 * @returns {PackedCircle | undefined}
	 */
	circleById(id) {
		return this.allCircles.filter(circle => circle.id === id)[0];
	}

	/**
	 * Sets the target position where the circles want to be
	 * @param {VectorData} aPosition - The position of the centerPull target
	 */
	setTarget(aPosition) {
		this.desiredTarget = aPosition;
	}
}
