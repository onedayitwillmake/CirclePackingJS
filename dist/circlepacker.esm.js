/*! circlepacker v1.1.7 | MIT (c) 2023 Georg Fischer <hi@snorpey.com> | https://github.com/snorpey/circlepacker#readme */
/**
 * @typedef {Object} CirclePackerParams
 * @prop {OnMoveCallback}[onMove] - The onMove callback. Your render function goes here.
 * @prop {OnMoveStartCallback}[onMoveStart] - Function to execute after movement started
 * @prop {OnMoveEndCallback}[onMoveEnd] - Function to execute after movement ended
 * @prop {BoundsData} [bounds] - The boundaries of the area
 * @prop {PackedCircleData[]} [circles] - The circles
 * @prop {VectorData} [target] - The attraction target
 * @prop {boolean} [continuousMode=true] - Update the circle positions in a continuous animation loop?
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {number} [correctionPasses=3] - The number of overlap correction passes
 * @prop {boolean} [calculateOverlap=false] - Calculate overlap for circles
 * @prop {boolean} [useWorker=true] - Set to false to skip using the Web Worker
 *
 * @callback OnMoveStartCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @returns {void}
 *
 * @callback OnMoveCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @param {VectorData} [target] - The attraction target position
 * @param {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 * @returns {void}
 *
 * @callback OnMoveEndCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @returns {void}
 *
 * @typedef {Object} VectorData
 * @prop {number} x - The X component of the vector
 * @prop {number} y - The Y component of the vector
 *
 * @typedef {number | string} CircleID
 *
 * @typedef {Object} PackedCircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} x - The X position of the circle
 * @prop {number} y - The Y position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToTarget=false] - Is circle pulled towards the target
 *
 * @typedef {Object} PackedCircle
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {VectorData} [targetPosition] - The target position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToTarget=false] - Is circle pulled towards the target
 *
 * @typedef {PackedCircleData | PackedCircle | CircleID} CircleRef
 *
 * @typedef {Object} PackedCircleMovementData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The current position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The radius of the circle
 * @prop {VectorData} delta - The movement vector of the circle
 * @prop {boolean} isPulledToTarget - Is the circle pulled towards the target
 * @prop {boolean} isPinned - Is the circle pinned
 *
 * @typedef {{[key: CircleID]: PackedCircleMovementData}} CirclePackerMovementResult
 *
 * @typedef OverlapData
 * @prop {CircleID} overlappingCircleId - The ID of the overlapping circle
 * @prop {number} overlapDistance - The overlap distance (measured along the line between two circle centers)
 *
 * @typedef {{[key: CircleID]: OverlapData[]}} CirclePackerOverlappingCircles
 *
 * @typedef {Object} CircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is the circle pinned? (pinned circles don't move)
 *
 * @typedef {CircleData | CircleID} CircleRef
 *
 * @typedef {Object} WorkerMessage
 * @prop {number} messageId - Unique ID of the message
 * @prop {WorkerAction} action - Action that the worker should take
 *
 * @typedef {Object} BoundsPoints
 * @prop {VectorData} point1 - The first corner
 * @prop {VectorData} point2 - The second corner
 *
 * @typedef {Object} BoundsDimensions
 * @prop {number} width - The bounds width
 * @prop {number} height - The bounds height
 * @prop {number} [x=0] - The bounds x position
 * @prop {number} [y=0] - The bounds y position
 *
 * @typedef {Object} BoundsRect
 * @prop {number} left - The bounds x position
 * @prop {number} top - The bounds y position
 * @prop {number} right - The bounds x2 position
 * @prop {number} bottom - The bounds y2 position
 *
 * @typedef {Object} BoundsPositions
 * @prop {number} x1 - The x value of the first corner
 * @prop {number} y1 - The y value of the first corner
 * @prop {number} x2 - The x value of the second corner
 * @prop {number} y2 - The y value of the second corner
 *
 * @typedef {BoundsDimensions | BoundsPoints | BoundsRect | BoundsPositions} BoundsData - Data needed to construct a Bounds instance
 *
 * @typedef {Object} SetBoundsAction
 * @prop {'SET_BOUNDS'} type
 * @prop {BoundsData} bounds - The new bounds object
 *
 * @typedef {Object} CenteringPassesAction
 * @prop {'SET_CENTERING_PASSES'} type
 * @prop {number} numberOfCenteringPasses - The new number of centering passes
 *
 * @typedef {Object} CollisionPassesAction
 * @prop {'SET_COLLISION_PASSES'} type
 * @prop {number} numberOfCollisionPasses - The new number of collision passes
 *
 * @typedef {Object} CorrectionPassesAction
 * @prop {'SET_CORRECTION_PASSES'} type
 * @prop {number} numberOfCorrectionPasses - The new number of correction passes
 *
 * @typedef {Object} CalculateOverlapAction
 * @prop {'SET_CALCULATE_OVERLAP'} type
 * @prop {boolean} calculateOverlap - The new calculateOverlap value
 *
 * @typedef {Object} DampingAction
 * @prop {'SET_DAMPING'} type
 * @prop {number} damping - The new damping value
 *
 * @typedef {Object} UpdateAction
 * @prop {'UPDATE'} type
 *
 * @typedef {Object} TargetPullAction
 * @prop {'SET_TARGET_PULL'} type
 * @prop {boolean} targetPull - The new target pull value
 *
 * @typedef {Object} AddCirclesAction
 * @prop {'ADD_CIRCLES'} type
 * @prop {PackedCircleData[]} circles - The new circles to add
 *
 * @typedef {Object} RemoveCircleAction
 * @prop {'REMOVE_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle to remove
 *
 * @typedef {Object} DragStartAction
 * @prop {'DRAG_START'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} DragEndAction
 * @prop {'DRAG_END'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} DragMoveAction
 * @prop {'DRAG_MOVE'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The new position of the circle
 *
 * @typedef {Object} CircleRadiusAction
 * @prop {'SET_CIRCLE_RADIUS'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} radius - The new radius of the circle
 *
 * @typedef {Object} CircleTargetPullAction
 * @prop {'SET_CIRCLE_TARGET_PULL'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {boolean} targetPull - The new targetPull value
 *
 * @typedef {Object} PinCircleAction
 * @prop {'PIN_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} UnpinCircleAction
 * @prop {'UNPIN_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} SetTargetAction
 * @prop {'SET_TARGET'} type
 * @prop {VectorData} target - The new position of the attraction target
 *
 * @typedef { SetBoundsAction | CenteringPassesAction | CollisionPassesAction | CorrectionPassesAction | DampingAction | UpdateAction | TargetPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleTargetPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction } WorkerAction
 *
 * @typedef {Object} MoveResponse
 * @prop {'MOVED'} type
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @prop {VectorData} [target] - The attraction target position
 * @prop {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 *
 * @typedef {Object} MoveStartResponse
 * @prop {'MOVE_START'} type
 *
 * @typedef {Object} MoveEndResponse
 * @prop {'MOVE_END'} type
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 *
 * @typedef { MoveResponse | MoveStartResponse | MoveEndResponse } WorkerResponse
 *
 * @callback WorkerResponseCallback
 * @param {WorkerResponse} workerResponse - The worker response that is sent via postMessage
 * @returns {void}
 *
 * @typedef {Object} PackParams
 * @prop {BoundsData} [bounds] - The boundaries of the area
 * @prop {PackedCircleData[]} [circles] - The circles
 * @prop {VectorData} [target] - The attraction target
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {number} [correctionPasses=3] - The number of overlap correction passes
 * @prop {boolean} [calculateOverlap=false] - Calculate overlap for circles
 * @prop {boolean} [useWorker=true] - Set to false to skip using the Web Worker
 *
 * @typedef {Object} PackResponse
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @prop {VectorData} [target] - The attraction target position
 * @prop {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 */

/**
 * Vector class
 *
 * Most of this code is taken from CirclePackingJS by @onedayitwillmake
 * https://github.com/onedayitwillmake/CirclePackingJS/blob/eb3475b/js-module/web/js/lib/Vector.js
 *
 */
class Vector {
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

// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey


/**
 * The Packed circle contains information about a Packed circle
 */
class PackedCircle {
	/**
	 * Creates an instance of PackedCircle.
	 *
	 * @constructor
	 * @param {PackedCircleData} - The data to instantiate the PackedCircle with
	 */
	constructor({ id, radius, x, y, isPulledToTarget, isPinned }) {
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
		this.isPulledToTarget = isPulledToTarget;

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

/**
 * Sends data to worker, converts it to JSON first
 *
 * @export
 * @param {Worker} worker - The Worker instance
 * @param {WorkerMessage} message - The message to send to the worker
 */
function sendWorkerMessage(worker, message) {
	worker.postMessage(JSON.stringify(message));
}

/**
 * Handle data received by the web worker: Parse JSON
 *
 * @export
 * @param {MessageEvent<string>} event - The worker event
 * @returns {WorkerResponse | undefined}
 */
function processWorkerResponse(event) {
	return event.data ? JSON.parse(event.data) : undefined;
}

/**
 * Check if circle object is valid
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} circle - The circle to check
 * @returns {boolean}
 */
function isCircleValid(circle) {
	return (
		circle &&
		typeof circle === 'object' &&
		circle !== null &&
		isIdValid(circle.id) &&
		circle.radius &&
		circle.position &&
		typeof circle.position.x === 'number' &&
		typeof circle.position.y === 'number'
	);
}

/**
 * Check if bounds object is valid
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} bounds - The bounds object to check
 * @returns {boolean}
 */
function isBoundsValid(bounds) {
	if (!typeof bounds === 'object') {
		return false;
	}

	if (
		bounds.point1 &&
		bounds.point2 &&
		isPointValid(bounds.point1) &&
		isPointValid(bounds.point2)
	) {
		return true;
	}

	if (typeof bounds.width === 'number' && typeof bounds.height === 'number') {
		return true;
	}

	if (
		typeof bounds.left === 'number' &&
		typeof bounds.top === 'number' &&
		typeof bounds.bottom === 'number' &&
		typeof bounds.right === 'number'
	) {
		return true;
	}

	if (
		typeof bounds.x1 === 'number' &&
		typeof bounds.y1 === 'number' &&
		typeof bounds.x2 === 'number' &&
		typeof bounds.y2 === 'number'
	) {
		return true;
	}

	return false;
}

/**
 * Converts bounds data to rect
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} bounds - The BoundsData object
 * @returns {BoundsRect | undefined} - The bounds rect
 */
function boundsDataToRect(bounds) {
	if (!isBoundsValid(bounds)) {
		return;
	}

	let left = 0;
	let top = 0;
	let right = 0;
	let bottom = 0;

	if (typeof bounds.left === 'number') {
		left = bounds.left;
		right = bounds.right;
		top = bounds.top;
		bottom = bounds.bottom;
	} else if (typeof bounds.width == 'number') {
		if (typeof bounds.x === 'number') {
			left = bounds.x;
		}

		if (typeof bounds.y === 'number') {
			top = bounds.y;
		}

		right = left + bounds.width;
		bottom = top + bounds.height;
	} else if (typeof bounds.x1 === 'number') {
		left = bounds.x1;
		right = bounds.x2;
		top = bounds.y1;
		bottom = bounds.y2;
	} else if (bounds.point1) {
		left = bounds.point1.x;
		right = bounds.point2.x;
		top = bounds.point1.y;
		bottom = bounds.point2.y;
	}

	return { left, top, right, bottom };
}

/**
 * Check if we can use id
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} id - The id tp check
 * @returns {boolean}
 */
function isIdValid(id) {
	return (typeof id === 'number' && !isNaN(id)) || (typeof id === 'string' && id.length > 0);
}

/**
 * Check if number is greater than
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} number
 * @param {number} min
 * @returns {boolean}
 */
function isNumberGreaterThan(number, min) {
	return typeof number === 'number' && number >= min;
}

/**
 * Check if radius is valid
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} point
 * @returns {boolean}
 */
function isPointValid(point) {
	return typeof point === 'object' && typeof point.x === 'number' && typeof point.y === 'number';
}

// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey


/**
 * The PackedCircleManager handles updating the state. It runs in a web worker
 */
class PackedCircleManager {
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
		this.desiredTarget = undefined;

		/** @type {BoundsRect | undefined} */
		this.boundsRect = undefined;

		/** @type {number} */
		this.damping = 0.025;

		/**
		 * Should all items be pulled to the target?
		 *
		 * @type {boolean}
		 * */
		this.isTargetPullActive = true;

		/**
		 * Do we want to calculate overlapping circles for each update?
		 * It might be an expensive operation and is not always needed
		 *
		 * @type {boolean}
		 * */
		this.calculateOverlap = false;

		/**
		 * Number of passes for centering
		 * It's (O)logN^2 so use increase at your own risk!
		 * Play with these numbers - see what works best for your project
		 *
		 * @type {number}
		 * */
		this.numberOfCenteringPasses = 1;

		/**
		 * Number of passes for collision
		 * It's (O)logN^2 so use increase at your own risk!
		 * Play with these numbers - see what works best for your project
		 *
		 * @type {number}
		 * */
		this.numberOfCollisionPasses = 3;

		/**
		 * Number of passes for correcting overlapping circles
		 * This is can be a very expensive operation so increase at your own risk!
		 * Play with these numbers - see what works best for your project
		 *
		 * @type {number}
		 * */
		this.numberOfCorrectionPasses = 0;
	}

	/**
	 * Set the boundary rectangle for the circle packing.
	 *
	 * @param {BoundsData} aBoundaryObject - The boundary to set
	 */
	setBounds(aBoundaryObject) {
		const newBoundsRect = boundsDataToRect(aBoundaryObject);

		if (newBoundsRect) {
			this.boundsRect = newBoundsRect;
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
				isPulledToTarget:
					typeof aCircle.isPulledToTarget === 'boolean' ? aCircle.isPulledToTarget : true,
			});
		}

		this.allCircles.push(aCircle);

		if (this.desiredTarget) {
			aCircle.targetPosition = this.desiredTarget.cp();
		}
	}

	/**
	 * Remove a circle
	 *
	 * @param {CircleID} circleToRemoveId - Id of the circle to remove
	 */
	removeCircle(circleToRemoveId) {
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

		if (this.desiredTarget && this.isTargetPullActive) {
			// Push all the circles to the target - in my case the center of the bounds
			this.pushAllCirclesTowardTarget(this.desiredTarget);
		}

		// Make the circles collide and adjust positions to move away from each other
		this.handleCollisions();

		// Collide all circles with bounds (if possible)
		if (this.boundsRect) {
			this.handleBoundaryCollisions();

			// console.log();

			// In case any circles are overlapping after colliding with the bounds,
			// run the collisions a few more times.
			if (this.numberOfCorrectionPasses > 0) {
				let overlapCorrectionTries = 0;
				let overlappingCirclesCount = Object.keys(this.getOverlappingCircles()).length;

				while (
					overlappingCirclesCount > 0 &&
					overlapCorrectionTries < this.numberOfCorrectionPasses
				) {
					this.handleCollisions();
					this.handleBoundaryCollisions();

					overlappingCirclesCount = Object.keys(this.getOverlappingCircles()).length;
					overlapCorrectionTries += 1;
				}
			}
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

				if (circle.isPulledToTarget) {
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
				const circleA = circleList[circleAIndex];

				for (
					let circleBIndex = circleAIndex + 1;
					circleBIndex < circleCount;
					circleBIndex++
				) {
					const circleB = circleList[circleBIndex];
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
	 * Collide circles with boundaries
	 */
	handleBoundaryCollisions() {
		if (this.boundsRect) {
			this.allCircles.forEach(circle => {
				this.handleBoundaryForCircle(circle);
			});
		}
	}

	/**
	 * Ensure the circle stays inside the boundaries
	 *
	 * @param {PackedCircle} aCircle - The circle to check
	 */
	handleBoundaryForCircle(aCircle) {
		const { x, y } = aCircle.position;
		const radius = aCircle.radius;

		let isOverEdge = false;

		if (this.boundsRect) {
			if (x + radius >= this.boundsRect.right) {
				aCircle.position.x = this.boundsRect.right - radius;
				isOverEdge = true;
			} else if (x - radius < this.boundsRect.left) {
				aCircle.position.x = this.boundsRect.left + radius;
				isOverEdge = true;
			}

			if (y + radius > this.boundsRect.bottom) {
				aCircle.position.y = this.boundsRect.bottom - radius;
				isOverEdge = true;
			} else if (y - radius < this.boundsRect.top) {
				aCircle.position.y = this.boundsRect.top + radius;
				isOverEdge = true;
			}

			// end dragging if user dragged over edge
			if (isOverEdge && aCircle === this.draggedCircle) {
				this.draggedCircle = null;
			}
		}
	}

	/**
	 * Calculate overlapping circles for each circle
	 *
	 * @returns {CirclePackerOverlappingCircles}
	 */
	getOverlappingCircles() {
		/** @type {CirclePackerOverlappingCircles} */
		const overlappingCircles = {};

		this.allCircles.forEach(circleA => {
			const overlappingCirclesForCircle = this.allCircles
				.filter(circleB => circleA.id !== circleB.id)
				.map(circleB => {
					const distanceBetweenCirclePositions = new Vector(circleA.position).distance(
						circleB.position
					);

					const isOverlapping =
						distanceBetweenCirclePositions < circleA.radius + circleB.radius;

					const overlapDistance = isOverlapping
						? circleA.radius + circleB.radius - distanceBetweenCirclePositions
						: 0;

					return { overlappingCircleId: circleB.id, overlapDistance };
				})
				.filter(overlapData => {
					return overlapData.overlapDistance > 0;
				});

			if (overlappingCirclesForCircle.length) {
				overlappingCircles[circleA.id] = overlappingCirclesForCircle;
			}
		});

		return overlappingCircles;
	}

	/**
	 * Create a positions object that we can send via postmessage
	 *
	 * @returns {CirclePackerMovementResult}
	 */
	getPositions() {
		const positions = this.allCircles.reduce((result, circle) => {
			result[circle.id] = {
				id: circle.id,
				position: circle.position,
				previousPosition: circle.previousPosition,
				radius: circle.radius,
				delta: circle.delta,
				isPulledToTarget: circle.isPulledToTarget,
				isPinned: circle.isPinned,
			};

			return result;
		}, {});

		return positions;
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
	 * Update the targetPull value of a circle
	 *
	 * @param {CircleID} id - The id of the circle
	 * @param {boolean} targetPull - The targetPull value
	 */
	setCircleTargetPull(id, targetPull) {
		const circle = this.circleById(id);

		if (circle) {
			circle.isPulledToTarget = targetPull;
		}
	}

	/**
	 * Set a global targetPull value
	 *
	 * @param {boolean} targetPull - The global canterPull value
	 */
	setTargetPull(targetPull) {
		this.isTargetPullActive = targetPull;
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
	 *
	 * @param {VectorData} aPosition - The position of the targetPull target
	 */
	setTarget(aPosition) {
		this.desiredTarget = aPosition;
	}

	/**
	 * Sets calculate overlap
	 *
	 * @param {boolean} calculateOverlap
	 */
	setCalculateOverlap(calculateOverlap) {
		this.calculateOverlap = calculateOverlap;
	}
}

// this code is mostly for message passing between the
// PackedCircleManager and CirclePacker classes

/**
 * This class handles all logic that can
 * live inside of a web worker. It needs to be a class
 * so that we can instantiate it multiple times for instances of
 * CirclePacker with useWorker = false. We don't want to reuse an
 * WorkerLogic instances for multiple CirclePackers.
 *
 * @export
 * @class WorkerLogic
 * @typedef {WorkerLogic}
 */
class WorkerLogic {
	constructor() {
		this.circleManager = new PackedCircleManager();
	}

	/**
	 * Handle message events that were received from the main script
	 * and trigger the appropriate actions
	 *
	 * @param {WorkerMessage} [message]
	 * @param {WorkerResponseCallback} [handleResponse]
	 */
	handleWorkerMessage(message, handleResponse) {
		if (message) {
			const { action } = message;

			switch (action.type) {
				case 'SET_BOUNDS':
					this.circleManager.setBounds(action.bounds);
					break;
				case 'SET_CENTERING_PASSES':
					this.circleManager.numberOfCenteringPasses = action.numberOfCenteringPasses;
					break;
				case 'SET_COLLISION_PASSES':
					this.circleManager.numberOfCollisionPasses = action.numberOfCollisionPasses;
					break;
				case 'SET_CORRECTION_PASSES':
					this.circleManager.numberOfCorrectionPasses = action.numberOfCorrectionPasses;
					break;
				case 'SET_DAMPING':
					this.circleManager.damping = action.damping;
					break;
				case 'SET_TARGET_PULL':
					this.circleManager.setTargetPull(action.targetPull);
					break;
				case 'UPDATE':
					this.update();
					this.sendPositions(handleResponse);
					break;
				case 'ADD_CIRCLES':
					this.addCircles(action.circles);
					break;
				case 'REMOVE_CIRCLE':
					this.circleManager.removeCircle(action.id);
					break;
				case 'DRAG_START':
					this.circleManager.dragStart(action.id);
					break;
				case 'DRAG_END':
					this.circleManager.dragEnd(action.id);
					break;
				case 'DRAG_MOVE':
					this.circleManager.drag(action.id, action.position);
					break;
				case 'SET_CIRCLE_RADIUS':
					this.circleManager.setCircleRadius(action.id, action.radius);
					break;
				case 'SET_CIRCLE_TARGET_PULL':
					this.circleManager.setCircleTargetPull(action.id, action.targetPull);
					break;
				case 'SET_CALCULATE_OVERLAP':
					this.circleManager.setCalculateOverlap(action.calculateOverlap);
					break;
				case 'PIN_CIRCLE':
					this.circleManager.pinCircle(action.id);
					break;
				case 'UNPIN_CIRCLE':
					this.circleManager.unpinCircle(action.id);
					break;
				case 'SET_TARGET':
					this.setTarget(action.target);
					break;
			}
		}
	}

	/**
	 * Create new circles based on the received circle data
	 *
	 * @param {PackedCircleData[]} circles - The circles to add
	 */
	addCircles(circles) {
		if (Array.isArray(circles) && circles.length) {
			circles.forEach(circle => this.circleManager.addCircle(circle));
		} else {
			throw new Error('Circles array is malformed.');
		}
	}

	/**
	 * Update the pull targets position
	 *
	 * @param {VectorData} target - The new target position
	 */
	setTarget(target) {
		if (target && typeof target.x === 'number' && typeof target.y === 'number') {
			this.circleManager.setTarget(new Vector(target));
		}
	}

	/**
	 * Calculate the next circle positions
	 */
	update() {
		this.circleManager.updatePositions();
	}

	/**
	 * Send the new circle positions to the main script
	 *
	 * @param {WorkerResponseCallback} [handleResponse]
	 */
	sendPositions(handleResponse) {
		if (handleResponse) {
			/** @type {WorkerResponse} */
			const responseData = {
				type: 'MOVED',
				updatedCircles: this.circleManager.getPositions(),
				target: this.circleManager.desiredTarget,
			};

			if (this.circleManager.calculateOverlap) {
				responseData['overlappingCircles'] = this.circleManager.getOverlappingCircles();
			}

			handleResponse(responseData);
		}
	}
}

/**
 * This class keeps track of the drawing loop in continuous drawing mode.
 * It is not available in node.
 */
class CirclePackerBrowser {
	/**
	 * Creates an instance of CirclePacker.
	 *
	 * @constructor
	 * @param {CirclePackerParams} params - The params to instantiate the CirclePacker with
	 */
	constructor(params = {}) {
		/**
		 * Is the continuous mode active?
		 * In that case, we need to start and stop the animation loop
		 *
		 * @type {boolean}
		 * */
		this.isContinuousModeActive =
			typeof params.continuousMode === 'boolean' ? params.continuousMode : true;

		/**
		 * Callback for when the loop animation starts
		 *
		 * @type {OnMoveStartCallback | null}
		 */
		this.onMoveStart = params.onMoveStart || null;

		/**
		 * Callback for when the loop animation end
		 *
		 * @type {OnMoveEndCallback | null}
		 */
		this.onMoveEnd = params.onMoveEnd || null;

		/**
		 * Is the animation loop running?
		 *
		 * @type {boolean}
		 */
		this.isLooping = false;

		/**
		 * Have items moved since the last loop?
		 *
		 * @type {boolean}
		 */
		this.areItemsMoving = false;

		/**
		 * Reference to the current animation frame
		 *
		 * @type {number}
		 */
		this.animationFrameId = NaN;
	}

	/**
	 * Handles Worker response
	 * Stops loop if necessary, updates listeners
	 *
	 * @param {WorkerResponse} response
	 */
	handleWorkerResponse(response) {
		if (response.type === 'MOVED') {
			const movedCircles = response.updatedCircles;

			this.areItemsMoving = this.hasItemMoved(movedCircles);

			if (!this.areItemsMoving && this.isLooping && this.isContinuousModeActive) {
				this.stopLoop();
			}
		}
	}

	/**
	 * Circles were added: force loop start
	 */
	forceMovement() {
		if (this.isContinuousModeActive) {
			this.areItemsMoving = true;
		}
	}

	/**
	 * Update the callbacks
	 *
	 * @param {WorkerResponse} response
	 */
	updateListeners(response) {
		if (response.type === 'MOVE_START' && typeof this.onMoveStart === 'function') {
			this.onMoveStart();
		}

		if (response.type === 'MOVE_END' && typeof this.onMoveEnd === 'function') {
			this.onMoveEnd(response.updatedCircles);
		}
	}

	/**
	 * The update loop that calls itself recursively every animation frame
	 */
	updateLoop() {
		this.update();

		if (this.isLooping) {
			if (this.areItemsMoving) {
				this.animationFrameId = requestAnimationFrame(() => this.updateLoop());
			} else {
				this.stopLoop();
			}
		}
	}

	/**
	 * Start the update loop
	 */
	startLoop() {
		if (!this.isLooping && this.isContinuousModeActive) {
			this.isLooping = true;
			this.updateListeners({ type: 'MOVE_START' });
			this.animationFrameId = requestAnimationFrame(() => this.updateLoop());
		}
	}

	/**
	 * Stop the update loop
	 */
	stopLoop() {
		if (this.isLooping) {
			this.isLooping = false;
			this.updateListeners({ type: 'MOVE_END', updatedCircles: this.lastCirclePositions });
			cancelAnimationFrame(this.animationFrameId);
		}
	}

	/**
	 * Check if an item has moved. Count items that have moved barely as not moved
	 *
	 * @param {CirclePackerMovementResult} positions
	 * @returns {boolean}
	 */
	hasItemMoved(positions) {
		let result = false;

		for (let id in positions) {
			if (
				Math.abs(positions[id].delta.x) > 0.005 ||
				Math.abs(positions[id].delta.y) > 0.005
			) {
				result = true;
			}
		}

		return result;
	}

	/**
	 * Tear down worker, remove cllbacks
	 */
	destroy() {
		this.stopLoop();
		this.onMoveStart = null;
		this.onMoveEnd = null;
	}
}

/**
 * This class passes messages to the worker and notifies subscribers
 */
class CirclePacker extends CirclePackerBrowser {
	/**
	 * Creates an instance of CirclePacker.
	 *
	 * @constructor
	 * @param {CirclePackerParams} params - The params to instantiate the CirclePacker with
	 */
	constructor(params = {}) {
		super(params);

		this.useWorker = params.useWorker === false ? false : true;

		if (this.useWorker) {
			if (!Worker) {
				throw new Error('Web workers are not supported.');
			}

			

			this.worker = new Worker(URL.createObjectURL(new Blob(["class Vector {\n\tconstructor(x, y) {\n\t\tif (typeof x === 'object') {\n\t\t\tthis.x = x.x;\n\t\t\tthis.y = x.y;\n\t\t} else {\n\t\t\tthis.x = x;\n\t\t\tthis.y = y;\n\t\t}\n\t}\n\tcp() {\n\t\treturn new Vector(this.x, this.y);\n\t}\n\tmul(scalar) {\n\t\tthis.x *= scalar;\n\t\tthis.y *= scalar;\n\t\treturn this;\n\t}\n\tnormalize() {\n\t\tvar l = this.length();\n\t\tthis.x /= l;\n\t\tthis.y /= l;\n\t\treturn this;\n\t}\n\tlength() {\n\t\tvar length = Math.sqrt(this.x * this.x + this.y * this.y);\n\t\tif (length < 0.005 && length > -0.005) {\n\t\t\treturn 0.000001;\n\t\t}\n\t\treturn length;\n\t}\n\tdistance(otherVector) {\n\t\tvar deltaX = this.x - otherVector.x;\n\t\tvar deltaY = this.y - otherVector.y;\n\t\treturn Math.sqrt(deltaX * deltaX + deltaY * deltaY);\n\t}\n\tdistanceSquared(otherVector) {\n\t\tvar deltaX = this.x - otherVector.x;\n\t\tvar deltaY = this.y - otherVector.y;\n\t\treturn deltaX * deltaX + deltaY * deltaY;\n\t}\n}\n\nclass PackedCircle {\n\tconstructor({ id, radius, x, y, isPulledToTarget, isPinned }) {\n\t\tx = x || 0;\n\t\ty = y || 0;\n\t\tthis.id = id;\n\t\tthis.targetPosition = new Vector(0, 0);\n\t\tthis.position = new Vector(x, y);\n\t\tthis.previousPosition = new Vector(x, y);\n\t\tthis.isPulledToTarget = isPulledToTarget;\n\t\tthis.isPinned = isPinned;\n\t\tthis.setRadius(radius);\n\t}\n\tsetPosition(aPosition) {\n\t\tthis.previousPosition = this.position;\n\t\tthis.position = aPosition.cp();\n\t}\n\tsetRadius(aRadius) {\n\t\tthis.radius = aRadius;\n\t\tthis.radiusSquared = aRadius * aRadius;\n\t}\n\tget delta() {\n\t\treturn new Vector(\n\t\t\tthis.position.x - this.previousPosition.x,\n\t\t\tthis.position.y - this.previousPosition.y\n\t\t);\n\t}\n}\n\nfunction sendWorkerMessage(worker, message) {\n\tworker.postMessage(JSON.stringify(message));\n}\nfunction processWorkerMessage(event) {\n\treturn event.data ? JSON.parse(event.data) : undefined;\n}\nfunction isBoundsValid(bounds) {\n\tif (!typeof bounds === 'object') {\n\t\treturn false;\n\t}\n\tif (\n\t\tbounds.point1 &&\n\t\tbounds.point2 &&\n\t\tisPointValid(bounds.point1) &&\n\t\tisPointValid(bounds.point2)\n\t) {\n\t\treturn true;\n\t}\n\tif (typeof bounds.width === 'number' && typeof bounds.height === 'number') {\n\t\treturn true;\n\t}\n\tif (\n\t\ttypeof bounds.left === 'number' &&\n\t\ttypeof bounds.top === 'number' &&\n\t\ttypeof bounds.bottom === 'number' &&\n\t\ttypeof bounds.right === 'number'\n\t) {\n\t\treturn true;\n\t}\n\tif (\n\t\ttypeof bounds.x1 === 'number' &&\n\t\ttypeof bounds.y1 === 'number' &&\n\t\ttypeof bounds.x2 === 'number' &&\n\t\ttypeof bounds.y2 === 'number'\n\t) {\n\t\treturn true;\n\t}\n\treturn false;\n}\nfunction boundsDataToRect(bounds) {\n\tif (!isBoundsValid(bounds)) {\n\t\treturn;\n\t}\n\tlet left = 0;\n\tlet top = 0;\n\tlet right = 0;\n\tlet bottom = 0;\n\tif (typeof bounds.left === 'number') {\n\t\tleft = bounds.left;\n\t\tright = bounds.right;\n\t\ttop = bounds.top;\n\t\tbottom = bounds.bottom;\n\t} else if (typeof bounds.width == 'number') {\n\t\tif (typeof bounds.x === 'number') {\n\t\t\tleft = bounds.x;\n\t\t}\n\t\tif (typeof bounds.y === 'number') {\n\t\t\ttop = bounds.y;\n\t\t}\n\t\tright = left + bounds.width;\n\t\tbottom = top + bounds.height;\n\t} else if (typeof bounds.x1 === 'number') {\n\t\tleft = bounds.x1;\n\t\tright = bounds.x2;\n\t\ttop = bounds.y1;\n\t\tbottom = bounds.y2;\n\t} else if (bounds.point1) {\n\t\tleft = bounds.point1.x;\n\t\tright = bounds.point2.x;\n\t\ttop = bounds.point1.y;\n\t\tbottom = bounds.point2.y;\n\t}\n\treturn { left, top, right, bottom };\n}\nfunction isPointValid(point) {\n\treturn typeof point === 'object' && typeof point.x === 'number' && typeof point.y === 'number';\n}\n\nclass PackedCircleManager {\n\tconstructor() {\n\t\tthis.allCircles = [];\n\t\tthis.pinnedCircleIds = [];\n\t\tthis.desiredTarget = undefined;\n\t\tthis.boundsRect = undefined;\n\t\tthis.damping = 0.025;\n\t\tthis.isTargetPullActive = true;\n\t\tthis.calculateOverlap = false;\n\t\tthis.numberOfCenteringPasses = 1;\n\t\tthis.numberOfCollisionPasses = 3;\n\t\tthis.numberOfCorrectionPasses = 0;\n\t}\n\tsetBounds(aBoundaryObject) {\n\t\tconst newBoundsRect = boundsDataToRect(aBoundaryObject);\n\t\tif (newBoundsRect) {\n\t\t\tthis.boundsRect = newBoundsRect;\n\t\t}\n\t}\n\taddCircle(aCircle) {\n\t\tif (!(aCircle instanceof PackedCircle)) {\n\t\t\taCircle = new PackedCircle({\n\t\t\t\tid: aCircle.id,\n\t\t\t\tradius: aCircle.radius,\n\t\t\t\tx: aCircle.position.x || 0,\n\t\t\t\ty: aCircle.position.y || 0,\n\t\t\t\tisPinned: aCircle.isPinned || false,\n\t\t\t\tisPulledToTarget:\n\t\t\t\t\ttypeof aCircle.isPulledToTarget === 'boolean' ? aCircle.isPulledToTarget : true,\n\t\t\t});\n\t\t}\n\t\tthis.allCircles.push(aCircle);\n\t\tif (this.desiredTarget) {\n\t\t\taCircle.targetPosition = this.desiredTarget.cp();\n\t\t}\n\t}\n\tremoveCircle(circleToRemoveId) {\n\t\tthis.allCircles = this.allCircles.filter(circle => circle.id !== circleToRemoveId);\n\t}\n\tupdatePositions() {\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (let i = 0; i < circleCount; ++i) {\n\t\t\tconst circle = circleList[i];\n\t\t\tcircle.previousPosition = circle.position.cp();\n\t\t}\n\t\tif (this.desiredTarget && this.isTargetPullActive) {\n\t\t\tthis.pushAllCirclesTowardTarget(this.desiredTarget);\n\t\t}\n\t\tthis.handleCollisions();\n\t\tif (this.boundsRect) {\n\t\t\tthis.handleBoundaryCollisions();\n\t\t\tif (this.numberOfCorrectionPasses > 0) {\n\t\t\t\tlet overlapCorrectionTries = 0;\n\t\t\t\tlet overlappingCirclesCount = Object.keys(this.getOverlappingCircles()).length;\n\t\t\t\twhile (\n\t\t\t\t\toverlappingCirclesCount > 0 &&\n\t\t\t\t\toverlapCorrectionTries < this.numberOfCorrectionPasses\n\t\t\t\t) {\n\t\t\t\t\tthis.handleCollisions();\n\t\t\t\t\tthis.handleBoundaryCollisions();\n\t\t\t\t\toverlappingCirclesCount = Object.keys(this.getOverlappingCircles()).length;\n\t\t\t\t\toverlapCorrectionTries += 1;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\tpushAllCirclesTowardTarget(aTarget) {\n\t\tconst circleMovement = new Vector(0, 0);\n\t\tconst dragCircle = this.draggedCircle;\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (\n\t\t\tlet centeringPassNumber = 0;\n\t\t\tcenteringPassNumber < this.numberOfCenteringPasses;\n\t\t\tcenteringPassNumber++\n\t\t) {\n\t\t\tfor (let circleIndex = 0; circleIndex < circleCount; circleIndex++) {\n\t\t\t\tconst circle = circleList[circleIndex];\n\t\t\t\tif (circle.isPulledToTarget) {\n\t\t\t\t\tconst isCircleKinematic =\n\t\t\t\t\t\tcircle === dragCircle || this.isCirclePinned(circle.id);\n\t\t\t\t\tif (isCircleKinematic) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tcircleMovement.x = circle.position.x - aTarget.x;\n\t\t\t\t\tcircleMovement.y = circle.position.y - aTarget.y;\n\t\t\t\t\tcircleMovement.mul(this.damping);\n\t\t\t\t\tcircle.position.x -= circleMovement.x;\n\t\t\t\t\tcircle.position.y -= circleMovement.y;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\thandleCollisions() {\n\t\tconst circleCollisionMovement = new Vector(0, 0);\n\t\tconst dragCircle = this.draggedCircle;\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (\n\t\t\tlet collisionPassNumber = 0;\n\t\t\tcollisionPassNumber < this.numberOfCollisionPasses;\n\t\t\tcollisionPassNumber++\n\t\t) {\n\t\t\tfor (let circleAIndex = 0; circleAIndex < circleCount; circleAIndex++) {\n\t\t\t\tconst circleA = circleList[circleAIndex];\n\t\t\t\tfor (\n\t\t\t\t\tlet circleBIndex = circleAIndex + 1;\n\t\t\t\t\tcircleBIndex < circleCount;\n\t\t\t\t\tcircleBIndex++\n\t\t\t\t) {\n\t\t\t\t\tconst circleB = circleList[circleBIndex];\n\t\t\t\t\tconst isCircleAPinned = this.isCirclePinned(circleA.id);\n\t\t\t\t\tconst isCircleBPinned = this.isCirclePinned(circleB.id);\n\t\t\t\t\tconst isCircleAKinematic = circleA === dragCircle || isCircleAPinned;\n\t\t\t\t\tconst isCircleBKinematic = circleB === dragCircle || isCircleBPinned;\n\t\t\t\t\tif (\n\t\t\t\t\t\tcircleA === circleB ||\n\t\t\t\t\t\t(isCircleAKinematic && isCircleBKinematic)\n\t\t\t\t\t) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tconst dx = circleB.position.x - circleA.position.x;\n\t\t\t\t\tconst dy = circleB.position.y - circleA.position.y;\n\t\t\t\t\tconst combinedRadii = (circleA.radius + circleB.radius) * 1.08;\n\t\t\t\t\tconst distanceSquared = circleA.position.distanceSquared(circleB.position);\n\t\t\t\t\tif (distanceSquared < combinedRadii * combinedRadii - 0.02) {\n\t\t\t\t\t\tcircleCollisionMovement.x = dx;\n\t\t\t\t\t\tcircleCollisionMovement.y = dy;\n\t\t\t\t\t\tcircleCollisionMovement.normalize();\n\t\t\t\t\t\tconst inverseForce = (combinedRadii - Math.sqrt(distanceSquared)) * 0.5;\n\t\t\t\t\t\tcircleCollisionMovement.mul(inverseForce);\n\t\t\t\t\t\tif (!isCircleBKinematic) {\n\t\t\t\t\t\t\tif (isCircleAKinematic) {\n\t\t\t\t\t\t\t\tcircleCollisionMovement.mul(2.2);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcircleB.position.x += circleCollisionMovement.x;\n\t\t\t\t\t\t\tcircleB.position.y += circleCollisionMovement.y;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (!isCircleAKinematic) {\n\t\t\t\t\t\t\tif (isCircleBKinematic) {\n\t\t\t\t\t\t\t\tcircleCollisionMovement.mul(2.2);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcircleA.position.x -= circleCollisionMovement.x;\n\t\t\t\t\t\t\tcircleA.position.y -= circleCollisionMovement.y;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\thandleBoundaryCollisions() {\n\t\tif (this.boundsRect) {\n\t\t\tthis.allCircles.forEach(circle => {\n\t\t\t\tthis.handleBoundaryForCircle(circle);\n\t\t\t});\n\t\t}\n\t}\n\thandleBoundaryForCircle(aCircle) {\n\t\tconst { x, y } = aCircle.position;\n\t\tconst radius = aCircle.radius;\n\t\tlet isOverEdge = false;\n\t\tif (this.boundsRect) {\n\t\t\tif (x + radius >= this.boundsRect.right) {\n\t\t\t\taCircle.position.x = this.boundsRect.right - radius;\n\t\t\t\tisOverEdge = true;\n\t\t\t} else if (x - radius < this.boundsRect.left) {\n\t\t\t\taCircle.position.x = this.boundsRect.left + radius;\n\t\t\t\tisOverEdge = true;\n\t\t\t}\n\t\t\tif (y + radius > this.boundsRect.bottom) {\n\t\t\t\taCircle.position.y = this.boundsRect.bottom - radius;\n\t\t\t\tisOverEdge = true;\n\t\t\t} else if (y - radius < this.boundsRect.top) {\n\t\t\t\taCircle.position.y = this.boundsRect.top + radius;\n\t\t\t\tisOverEdge = true;\n\t\t\t}\n\t\t\tif (isOverEdge && aCircle === this.draggedCircle) {\n\t\t\t\tthis.draggedCircle = null;\n\t\t\t}\n\t\t}\n\t}\n\tgetOverlappingCircles() {\n\t\tconst overlappingCircles = {};\n\t\tthis.allCircles.forEach(circleA => {\n\t\t\tconst overlappingCirclesForCircle = this.allCircles\n\t\t\t\t.filter(circleB => circleA.id !== circleB.id)\n\t\t\t\t.map(circleB => {\n\t\t\t\t\tconst distanceBetweenCirclePositions = new Vector(circleA.position).distance(\n\t\t\t\t\t\tcircleB.position\n\t\t\t\t\t);\n\t\t\t\t\tconst isOverlapping =\n\t\t\t\t\t\tdistanceBetweenCirclePositions < circleA.radius + circleB.radius;\n\t\t\t\t\tconst overlapDistance = isOverlapping\n\t\t\t\t\t\t? circleA.radius + circleB.radius - distanceBetweenCirclePositions\n\t\t\t\t\t\t: 0;\n\t\t\t\t\treturn { overlappingCircleId: circleB.id, overlapDistance };\n\t\t\t\t})\n\t\t\t\t.filter(overlapData => {\n\t\t\t\t\treturn overlapData.overlapDistance > 0;\n\t\t\t\t});\n\t\t\tif (overlappingCirclesForCircle.length) {\n\t\t\t\toverlappingCircles[circleA.id] = overlappingCirclesForCircle;\n\t\t\t}\n\t\t});\n\t\treturn overlappingCircles;\n\t}\n\tgetPositions() {\n\t\tconst positions = this.allCircles.reduce((result, circle) => {\n\t\t\tresult[circle.id] = {\n\t\t\t\tid: circle.id,\n\t\t\t\tposition: circle.position,\n\t\t\t\tpreviousPosition: circle.previousPosition,\n\t\t\t\tradius: circle.radius,\n\t\t\t\tdelta: circle.delta,\n\t\t\t\tisPulledToTarget: circle.isPulledToTarget,\n\t\t\t\tisPinned: circle.isPinned,\n\t\t\t};\n\t\t\treturn result;\n\t\t}, {});\n\t\treturn positions;\n\t}\n\tsetDraggedCircle(aCircle) {\n\t\tthis.draggedCircle = aCircle;\n\t}\n\tdragStart(id) {\n\t\tconst draggedCircle = this.allCircles.filter(circle => circle.id === id)[0];\n\t\tthis.setDraggedCircle(draggedCircle);\n\t}\n\tdragEnd() {\n\t\tif (this.draggedCircle) {\n\t\t\tthis.draggedCircle = null;\n\t\t}\n\t}\n\tdrag(id, position) {\n\t\tif (this.draggedCircle && position) {\n\t\t\tthis.draggedCircle.position.x = position.x;\n\t\t\tthis.draggedCircle.position.y = position.y;\n\t\t}\n\t}\n\tisCirclePinned(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\treturn circle.isPinned;\n\t\t}\n\t\treturn false;\n\t}\n\tpinCircle(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPinned = true;\n\t\t}\n\t}\n\tunpinCircle(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPinned = false;\n\t\t}\n\t}\n\tsetCircleRadius(id, radius) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.setRadius(radius);\n\t\t}\n\t}\n\tsetCircleTargetPull(id, targetPull) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPulledToTarget = targetPull;\n\t\t}\n\t}\n\tsetTargetPull(targetPull) {\n\t\tthis.isTargetPullActive = targetPull;\n\t}\n\tcircleById(id) {\n\t\treturn this.allCircles.filter(circle => circle.id === id)[0];\n\t}\n\tsetTarget(aPosition) {\n\t\tthis.desiredTarget = aPosition;\n\t}\n\tsetCalculateOverlap(calculateOverlap) {\n\t\tthis.calculateOverlap = calculateOverlap;\n\t}\n}\n\nclass WorkerLogic {\n\tconstructor() {\n\t\tthis.circleManager = new PackedCircleManager();\n\t}\n\thandleWorkerMessage(message, handleResponse) {\n\t\tif (message) {\n\t\t\tconst { action } = message;\n\t\t\tswitch (action.type) {\n\t\t\t\tcase 'SET_BOUNDS':\n\t\t\t\t\tthis.circleManager.setBounds(action.bounds);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_CENTERING_PASSES':\n\t\t\t\t\tthis.circleManager.numberOfCenteringPasses = action.numberOfCenteringPasses;\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_COLLISION_PASSES':\n\t\t\t\t\tthis.circleManager.numberOfCollisionPasses = action.numberOfCollisionPasses;\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_CORRECTION_PASSES':\n\t\t\t\t\tthis.circleManager.numberOfCorrectionPasses = action.numberOfCorrectionPasses;\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_DAMPING':\n\t\t\t\t\tthis.circleManager.damping = action.damping;\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_TARGET_PULL':\n\t\t\t\t\tthis.circleManager.setTargetPull(action.targetPull);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'UPDATE':\n\t\t\t\t\tthis.update();\n\t\t\t\t\tthis.sendPositions(handleResponse);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'ADD_CIRCLES':\n\t\t\t\t\tthis.addCircles(action.circles);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'REMOVE_CIRCLE':\n\t\t\t\t\tthis.circleManager.removeCircle(action.id);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'DRAG_START':\n\t\t\t\t\tthis.circleManager.dragStart(action.id);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'DRAG_END':\n\t\t\t\t\tthis.circleManager.dragEnd(action.id);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'DRAG_MOVE':\n\t\t\t\t\tthis.circleManager.drag(action.id, action.position);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_CIRCLE_RADIUS':\n\t\t\t\t\tthis.circleManager.setCircleRadius(action.id, action.radius);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_CIRCLE_TARGET_PULL':\n\t\t\t\t\tthis.circleManager.setCircleTargetPull(action.id, action.targetPull);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_CALCULATE_OVERLAP':\n\t\t\t\t\tthis.circleManager.setCalculateOverlap(action.calculateOverlap);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'PIN_CIRCLE':\n\t\t\t\t\tthis.circleManager.pinCircle(action.id);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'UNPIN_CIRCLE':\n\t\t\t\t\tthis.circleManager.unpinCircle(action.id);\n\t\t\t\t\tbreak;\n\t\t\t\tcase 'SET_TARGET':\n\t\t\t\t\tthis.setTarget(action.target);\n\t\t\t\t\tbreak;\n\t\t\t}\n\t\t}\n\t}\n\taddCircles(circles) {\n\t\tif (Array.isArray(circles) && circles.length) {\n\t\t\tcircles.forEach(circle => this.circleManager.addCircle(circle));\n\t\t} else {\n\t\t\tthrow new Error('Circles array is malformed.');\n\t\t}\n\t}\n\tsetTarget(target) {\n\t\tif (target && typeof target.x === 'number' && typeof target.y === 'number') {\n\t\t\tthis.circleManager.setTarget(new Vector(target));\n\t\t}\n\t}\n\tupdate() {\n\t\tthis.circleManager.updatePositions();\n\t}\n\tsendPositions(handleResponse) {\n\t\tif (handleResponse) {\n\t\t\tconst responseData = {\n\t\t\t\ttype: 'MOVED',\n\t\t\t\tupdatedCircles: this.circleManager.getPositions(),\n\t\t\t\ttarget: this.circleManager.desiredTarget,\n\t\t\t};\n\t\t\tif (this.circleManager.calculateOverlap) {\n\t\t\t\tresponseData['overlappingCircles'] = this.circleManager.getOverlappingCircles();\n\t\t\t}\n\t\t\thandleResponse(responseData);\n\t\t}\n\t}\n}\n\nconst workerLogic = new WorkerLogic();\nfunction sendResponse(response) {\n\tsendWorkerMessage(self, response);\n}\nself.addEventListener('message', event => {\n\tconst message = processWorkerMessage(event);\n\tworkerLogic.handleWorkerMessage(message, sendResponse);\n});\n"],{type:'text/javascript'})));
			this.worker.addEventListener('message', this.receivedWorkerMessage.bind(this));
		} else {
			this.workerLogic = new WorkerLogic();
		}

		/**
		 * The onMove callback function. Called whenever the circle positions have changed
		 * @type {OnMoveCallback}
		 */
		this.onMove = params.onMove || null;

		/**
		 * Stores the circle positions from last update
		 * @type {CirclePackerMovementResult}
		 */
		this.lastCirclePositions = {};

		if (params.centeringPasses) {
			this.setCenteringPasses(params.centeringPasses);
		}

		if (params.collisionPasses) {
			this.setCollisionPasses(params.collisionPasses);
		}

		if (params.correctionPasses) {
			this.setCorrectionPasses(params.correctionPasses);
		}

		if (typeof params.calculateOverlap === 'boolean') {
			this.setCalculateOverlap(params.calculateOverlap);
		}

		if (params.bounds) {
			this.setBounds(params.bounds);
		}

		if (params.target) {
			this.setTarget(params.target);
		}

		if (params.circles && params.circles.length) {
			this.addCircles(params.circles);
		}

		if (!this.isContinuousModeActive) {
			this.update();
		}
	}

	/**
	 * Handle message that was received from worker
	 *
	 * @param {MessageEvent<string>} event
	 */
	receivedWorkerMessage(event) {
		const response = processWorkerResponse(event);

		if (response) {
			super.handleWorkerResponse(response);
			this.updateListeners(response);
		}
	}

	/**
	 * Send message to worker
	 *
	 * @param {WorkerAction} action
	 */
	updateWorker(action) {
		const workerMessage = { messageId: Date.now(), action };

		if (this.useWorker) {
			sendWorkerMessage(this.worker, workerMessage);
		} else {
			// If no worker is used, we get the result directly via callback
			this.workerLogic.handleWorkerMessage(workerMessage, response => {
				super.handleWorkerResponse(response);
				this.updateListeners(response);
			});
		}
	}

	/**
	 * Update the callbacks
	 *
	 * @param {WorkerResponse} response
	 */
	updateListeners(response) {
		if (response.type === 'MOVED' && typeof this.onMove === 'function') {
			this.lastCirclePositions = response.updatedCircles;
			this.onMove(response.updatedCircles, response.target, response.overlappingCircles);
		}

		super.updateListeners(response);

		if (!this.isContinuousModeActive) {
			this.destroy();
		}
	}

	/**
	 * API for adding circles
	 *
	 * @throws Will throw an error if circles parameter is malformed
	 * @param {PackedCircleData[]} circles - The circles to add
	 */
	addCircles(circles) {
		if (!Array.isArray(circles)) {
			throw new Error(`Can't add circles: the circles parameter is not an array.`);
		}

		if (circles.length) {
			if (!circles.every(isCircleValid)) {
				throw new Error(`Can't add circles: some of the items are not well formatted.`);
			}

			this.updateWorker({ type: 'ADD_CIRCLES', circles });
			super.forceMovement();
			super.startLoop();
		}
	}

	/**
	 * Add a circle
	 *
	 * @param {PackedCircleData} circle - The circle to add
	 */
	addCircle(circle) {
		this.addCircles([circle]);
	}

	/**
	 * Removes a circle
	 *
	 * @throws Will throw an error if the circle id is malformed
	 * @param {CircleRef} circleRef - The circle to remove
	 */
	removeCircle(circleRef) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't remove circle: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'REMOVE_CIRCLE', id: circleId });
			super.startLoop();
		}
	}

	/**
	 * Pins a circle in place
	 *
	 * @throws Will throw an error if the circle id is malformed
	 * @param {CircleRef} circleRef - The circle to pin
	 */
	pinCircle(circleRef) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't pin circle: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'PIN_CIRCLE', id: circleId });
			super.startLoop();
		}
	}

	/**
	 * Unpins a circle
	 *
	 * @throws Will throw an error if the circle id is malformed
	 * @param {CircleRef} circleRef - The circle to unpin
	 */
	unpinCircle(circleRef) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't unpin circle: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'UNPIN_CIRCLE', id: circleId });
			super.startLoop();
		}
	}

	/**
	 * Description placeholder
	 *
	 * @throws Will throw an error if the circle id is malformed
	 * @param {CircleRef} circleRef - The circle to pin
	 * @param {number} radius - The new radius
	 */
	setCircleRadius(circleRef, radius) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't set circle radius: the circleRef parameter is malformed.`);
		} else if (!isNumberGreaterThan(radius, 0)) {
			throw new Error(`Can't set circle radius: the passed radius is malformed.`);
		} else {
			this.updateWorker({ type: 'SET_CIRCLE_RADIUS', id: circleId, radius });
			super.startLoop();
		}
	}

	/**
	 * Set targetPull value of a Circle
	 *
	 * @param {CircleRef} circleRef - The circle
	 * @param {boolean} targetPull - The new targetPull value
	 */
	setCircleTargetPull(circleRef, targetPull) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't set circle center pull: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({
				type: 'SET_CIRCLE_TARGET_PULL',
				id: circleId,
				targetPull: !!targetPull,
			});

			super.startLoop();
		}
	}

	/**
	 * Set global center pull value
	 *
	 * @param {boolean} targetPull - The new targetPull value
	 */
	setTargetPull(targetPull) {
		this.updateWorker({ type: 'SET_TARGET_PULL', targetPull: !!targetPull });
		super.startLoop();
	}

	/**
	 * Set new boundaries for the area
	 *
	 * @throws Will throw an error if the circle id is malformed
	 * @param {BoundsData} bounds - The new bounddaries
	 */
	setBounds(bounds) {
		if (!isBoundsValid(bounds)) {
			throw new Error(`Can't set bounds: the bounds parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'SET_BOUNDS', bounds });
			super.startLoop();
		}
	}

	/**
	 * Set the position of the pull target
	 *
	 * @throws Will throw an error if the target position is malformed
	 * @param {VectorData} targetPos - The position of the pull target
	 */
	setTarget(targetPos) {
		if (!isPointValid(targetPos)) {
			throw new Error(`Can't set target: the targetPos parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'SET_TARGET', target: targetPos });
			super.forceMovement();
			super.startLoop();
		}
	}

	/**
	 * Updates the number of centering passes
	 *
	 * It's (O)logN^2 so use increase at your own risk.
	 * Play with these numbers - see what works best for your project.
	 *
	 * @throws Will throw an error if the number of centering passes is malformed
	 * @param {number} numberOfCenteringPasses - The new number of centering passes. Expects a number >= 1
	 */
	setCenteringPasses(numberOfCenteringPasses) {
		if (!isNumberGreaterThan(numberOfCenteringPasses, 1)) {
			throw new Error(
				`Can't set centering passes: the numberOfCenteringPasses parameter is malformed.`
			);
		} else {
			this.updateWorker({ type: 'SET_CENTERING_PASSES', numberOfCenteringPasses });
		}
	}

	/**
	 * Sets the number of collision passes
	 *
	 * It's (O)logN^2 so use increase at your own risk.
	 * Play with these numbers - see what works best for your project.
	 *
	 * @throws Will throw an error if the number of collision passes is malformed
	 * @param {number} numberOfCollisionPasses - Sets the new number of collision passes. Expects a number >= 1
	 */
	setCollisionPasses(numberOfCollisionPasses) {
		if (!isNumberGreaterThan(numberOfCollisionPasses, 1)) {
			throw new Error(
				`Can't set collisionPasses passes: the numberOfCollisionPasses parameter is malformed.`
			);
		} else {
			this.updateWorker({ type: 'SET_COLLISION_PASSES', numberOfCollisionPasses });
		}
	}

	/**
	 * Sets the number of correction passes
	 *
	 * This is can be a very expensive operation so increase at your own risk.
	 * Play with these numbers - see what works best for your project.
	 *
	 * @throws Will throw an error if the number of collision passes is malformed
	 * @param {number} numberOfCorrectionPasses - Sets the new number of correction passes. Expects a number >= 0
	 */
	setCorrectionPasses(numberOfCorrectionPasses) {
		if (!isNumberGreaterThan(numberOfCorrectionPasses, 0)) {
			throw new Error(
				`Can't set CorrectionPasses passes: the numberOfCorrectionPasses parameter is malformed.`
			);
		} else {
			this.updateWorker({ type: 'SET_CORRECTION_PASSES', numberOfCorrectionPasses });
		}
	}

	/**
	 * Should we calculate the overlap on each update?
	 *
	 * @throws Will throw an error if calculateOverlap is not boolean
	 * @param {boolean} calculateOverlap - Sets the calculateOverlap value
	 */
	setCalculateOverlap(calculateOverlap) {
		if (typeof calculateOverlap !== 'boolean') {
			throw new Error(
				`Can't set calculateOverlap the calculateOverlap parameter is not a boolean.`
			);
		} else {
			this.updateWorker({ type: 'SET_CALCULATE_OVERLAP', calculateOverlap });
		}
	}

	/**
	 * Sets the damping value
	 *
	 * @throws Will throw an error if damping value is malformed
	 * @param {number} damping - The new damping value. Expects a number be between 0 and 1
	 */
	setDamping(damping) {
		if (!(typeof damping === 'number' && damping > 0 && damping < 1)) {
			throw new Error(`Can't set damping: the damping parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'SET_DAMPING', damping });
		}
	}

	/**
	 * Sends a signal to the worker to update the state
	 */
	update() {
		this.updateWorker({ type: 'UPDATE' });
	}

	/**
	 * Mark a circle as being dragged
	 *
	 * @throws Will throw an error if circle reference is malformed
	 * @param {CircleRef} circleRef - The circle reference
	 */
	dragStart(circleRef) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't start dragging circle: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'DRAG_START', id: circleId });
			super.startLoop();
		}
	}

	/**
	 * Update the position of a circle that is being dragged
	 *
	 * @throws Will throw an error if circle reference or the position is malformed
	 * @param {CircleRef} circleRef - The circle reference
	 * @param {VectorData} position - The new position of the circle
	 */
	drag(circleRef, position) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't drag circle: the circleRef parameter is malformed.`);
		} else if (!isPointValid(position)) {
			throw new Error(`Can't drag circle: the position parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'DRAG_MOVE', id: circleId, position });
			super.startLoop();
		}
	}

	/**
	 * Mark a circle as no longer being dragged
	 *
	 * @throws Will throw an error if circle reference is malformed
	 * @param {CircleRef} circleRef - The circle reference
	 */
	dragEnd(circleRef) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't end dragging circle: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({ type: 'DRAG_END', id: circleId });
			super.startLoop();
		}
	}

	/**
	 * Tear down worker, remove cllbacks
	 */
	destroy() {
		super.destroy();

		if (this.worker) {
			this.worker.terminate();
		}

		this.onMove = null;
	}
}

/**
 * Pack circles as simple async function. Only works for one-time operations
 *
 * @export
 * @param {PackParams} params - The params for the circlepacker.
 * @returns {PromiseLike<PackResponse>}
 */
function pack(params = {}) {
	return new Promise((resolve, reject) => {
		/**
		 * @type {CirclePacker | undefined}
		 */

		try {
			let packer;

			const circlePackerParams = {
				...params,
				continuousMode: false,
				onMove: (updatedCircles, target, overlappingCircles) => {
					resolve({
						updatedCircles,
						target,
						overlappingCircles,
					});
				},
			};

			packer = new CirclePacker(circlePackerParams);
		} catch (error) {
			reject(error);
		}
	});
}

CirclePacker.pack = pack;

export { CirclePacker, pack };
