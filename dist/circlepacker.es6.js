/*! circlepacker v1.1.7 | MIT (c) 2023 Georg Fischer <hi@snorpey.com> | https://github.com/snorpey/circlepacker#readme */
/**
 * @typedef {Object} VectorData
 * @prop {number} x - The X component
 * @prop {number} y - The Y component
 *
 * @typedef {number | string} CircleID
 *
 * @typedef {Object} PackedCircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} x - The X position of the circle
 * @prop {number} y - The Y position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToCenter=false] - Is circle pulled to center
 *
 * @typedef {Object} PackedCircle
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {VectorData} [targetPosition] - The target position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToCenter=false] - Is circle pulled to center
 *
 * @typedef {PackedCircleData | PackedCircle | CircleID} CircleRef
 *
 * @typedef {Object} PackedCircleMovementData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The current position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The radius of the circle
 * @prop {VectorData} delta - The movement vector of the circle
 * @prop {boolean} isPulledToCenter - Is the circle pulled to center
 * @prop {boolean} isPinned - Is the circle pinned
 *
 * @typedef {{[key: CircleID]: PackedCircleMovementData}} CirclePackerMovementResult
 *
 * @typedef {Object} CirclePackerParams
 * @prop {BoundsData} bounds - The boundaries of the area
 * @prop {PackedCircleData[]} circles - The circles
 * @prop {boolean} [continuousMode=true] - Update the circle positions in a continuous animation loop?
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {string} [workerPath] - The path to the webworker
 *
 * @typedef {Object} CircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is the circle pinned? (pinned circles don't move)
 *
 * @typedef {Object} ForcePoint
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {number} force
 * @prop {number} [minDistance]
 * @prop {number} [maxDistance]
 * @prop {number} [forceAtMaxDistance]
 * @prop {CircleRef[]} [attractedCircles] - References to the attracted circles
 *
 * @typedef {CircleData | CircleID} CircleRef
 *
 * @typedef {Object} WorkerMessage
 * @prop {number} messageId
 * @prop {WorkerAction} action
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
 * @typedef {Object} BoundsDirections
 * @prop {number} left - The bounds x position
 * @prop {number} topt - The bounds y position
 * @prop {number} right - The bounds x2 position
 * @prop {number} bottom - The bounds y2 position
 *
 * @typedef {Object} BoundsPositions
 * @prop {number} x1 - The x value of the first corner
 * @prop {number} y1 - The y value of the first corner
 * @prop {number} x2 - The x value of the second corner
 * @prop {number} y2 - The y value of the second corner
 *
 * @typedef {BoundsDimensions} BoundsData - Data needed to construct a Bounds instance
 *
 * @typedef {Object} SetBoundsAction
 * @prop {'SET_BOUNDS'} type
 * @prop {BoundsData} bounds
 *
 * @typedef {Object} CenteringPassesAction
 * @prop {'SET_CENTERING_PASSES'} type
 * @prop {number} numberOfCenteringPasses
 *
 * @typedef {Object} CollisionPassesAction
 * @prop {'SET_COLLISION_PASSES'} type
 * @prop {number} numberOfCollisionPasses
 *
 * @typedef {Object} DampingAction
 * @prop {'SET_DAMPING'} type
 * @prop {number} damping
 *
 * @typedef {Object} UpdateAction
 * @prop {'UPDATE'} type
 *
 * @typedef {Object} CenterPullAction
 * @prop {'SET_CENTER_PULL'} type
 * @prop {boolean} centerPull
 *
 * @typedef {Object} AddCirclesAction
 * @prop {'ADD_CIRCLES'} type
 * @prop {PackedCircleData[]} circles
 *
 * @typedef {Object} RemoveCircleAction
 * @prop {'REMOVE_CIRCLE'} type
 * @prop {CircleID} id
 * @prop {PackedCircleData[]} circles
 *
 * @typedef {Object} DragStartAction
 * @prop {'DRAG_START'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} DragEndAction
 * @prop {'DRAG_END'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} DragMoveAction
 * @prop {'DRAG_MOVE'} type
 * @prop {CircleID} id
 * @prop {VectorData} position
 * @prop {CircleID} id
 *
 * @typedef {Object} CircleRadiusAction
 * @prop {'SET_CIRCLE_RADIUS'} type
 * @prop {CircleID} id
 * @prop {number} radius
 * @prop {CircleID} id
 *
 * @typedef {Object} CircleCenterPullAction
 * @prop {'SET_CIRCLE_CENTER_PULL'} type
 * @prop {CircleID} id
 * @prop {boolean} centerPull
 * @prop {CircleID} id
 *
 * @typedef {Object} PinCircleAction
 * @prop {'PIN_CIRCLE'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} UnpinCircleAction
 * @prop {'UNPIN_CIRCLE'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} SetTargetAction
 * @prop {'SET_TARGET'} type
 * @prop {VectorData} target
 *
 * @typedef { SetBoundsAction | CenteringPassesAction | CollisionPassesAction | DampingAction | UpdateAction | CenterPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleCenterPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction } WorkerAction
 *
 * @typedef {Object} MoveResponse
 * @prop {'MOVED'} type
 * @prop {CirclePackerMovementResult} updatedCircles
 *
 * @typedef {Object} MoveStartResponse
 * @prop {'MOVE_START'} type
 *
 * @typedef {Object} MoveEndResponse
 * @prop {'MOVE_END'} type
 * @prop {CirclePackerMovementResult} updatedCircles
 *
 * @typedef { MoveResponse | MoveStartResponse | MoveEndResponse } WorkerResponse
 */

/**
 * Generate a random number
 *
 * @export
 * @param {number} min - The lower bound for the generated number
 * @param {number} max - The upper bound for the generated number
 * @param {boolean} intResult - Return int instead of float
 * @returns {number}
 */
function random(min, max, intResult) {
	if (typeof min !== 'number' && typeof max !== 'number') {
		min = 0;
		max = 1;
	}

	if (typeof max !== 'number') {
		max = min;
		min = 0;
	}

	let result = min + Math.random() * (max - min);

	if (intResult) {
		result = parseInt(result, 10);
	}

	return result;
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
function processWorkerMessage(event) {
	return event.data ? JSON.parse(event.data) : undefined;
}

/**
 * Check if circle object is valid
 *
 * @export
 * @param {PackedCircle} circle - The circle to check
 * @returns {boolean}
 */
function isCircleValid(circle) {
	return (
		circle &&
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
 * @param {BoundsData} bounds - The bounds object to check
 * @returns {boolean}
 */
function isBoundsValid(bounds) {
	return (
		typeof bounds === 'object' &&
		typeof bounds.width === 'number' &&
		typeof bounds.height === 'number'
	);
}

/**
 * Check if we can use id
 *
 * @export
 * @param {any} id - The id tp check
 * @returns {boolean}
 */
function isIdValid(id) {
	return (typeof id === 'number' && !isNaN(id)) || (typeof id === 'string' && id.length > 0);
}

/**
 * Check if number is greater than
 *
 * @export
 * @param {any} number
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
 * @param {any} point
 * @returns {boolean}
 */
function isPointValid(point) {
	return typeof point === 'object' && typeof point.x === 'number' && typeof point.y === 'number';
}

// import * as types from './types.js';

/**
 * This class keeps track of the drawing loop in continuous drawing mode
 * and passes messages to the worker
 */
class CirclePacker {
	/**
	 * Creates an instance of CirclePacker.
	 *
	 * @constructor
	 * @param {CirclePackerParams} params - The params to instantiate the CirclePacker with
	 */
	constructor(params) {
		this.worker = new Worker(URL.createObjectURL(new Blob(["class Vector {\n\tconstructor(x, y) {\n\t\tif (typeof x === 'object') {\n\t\t\tthis.x = x.x;\n\t\t\tthis.y = x.y;\n\t\t} else {\n\t\t\tthis.x = x;\n\t\t\tthis.y = y;\n\t\t}\n\t}\n\tcp() {\n\t\treturn new Vector(this.x, this.y);\n\t}\n\tmul(scalar) {\n\t\tthis.x *= scalar;\n\t\tthis.y *= scalar;\n\t\treturn this;\n\t}\n\tnormalize() {\n\t\tvar l = this.length();\n\t\tthis.x /= l;\n\t\tthis.y /= l;\n\t\treturn this;\n\t}\n\tlength() {\n\t\tvar length = Math.sqrt(this.x * this.x + this.y * this.y);\n\t\tif (length < 0.005 && length > -0.005) {\n\t\t\treturn 0.000001;\n\t\t}\n\t\treturn length;\n\t}\n\tdistance(otherVector) {\n\t\tvar deltaX = this.x - otherVector.x;\n\t\tvar deltaY = this.y - otherVector.y;\n\t\treturn Math.sqrt(deltaX * deltaX + deltaY * deltaY);\n\t}\n\tdistanceSquared(otherVector) {\n\t\tvar deltaX = this.x - otherVector.x;\n\t\tvar deltaY = this.y - otherVector.y;\n\t\treturn deltaX * deltaX + deltaY * deltaY;\n\t}\n}\n\nclass PackedCircle {\n\tconstructor({ id, radius, x, y, isPulledToCenter, isPinned }) {\n\t\tx = x || 0;\n\t\ty = y || 0;\n\t\tthis.id = id;\n\t\tthis.targetPosition = new Vector(0, 0);\n\t\tthis.position = new Vector(x, y);\n\t\tthis.previousPosition = new Vector(x, y);\n\t\tthis.isPulledToCenter = isPulledToCenter;\n\t\tthis.isPinned = isPinned;\n\t\tthis.setRadius(radius);\n\t}\n\tsetPosition(aPosition) {\n\t\tthis.previousPosition = this.position;\n\t\tthis.position = aPosition.cp();\n\t}\n\tsetRadius(aRadius) {\n\t\tthis.radius = aRadius;\n\t\tthis.radiusSquared = aRadius * aRadius;\n\t}\n\tget delta() {\n\t\treturn new Vector(\n\t\t\tthis.position.x - this.previousPosition.x,\n\t\t\tthis.position.y - this.previousPosition.y\n\t\t);\n\t}\n}\n\nclass PackedCircleManager {\n\tconstructor() {\n\t\tthis.allCircles = [];\n\t\tthis.pinnedCircleIds = [];\n\t\tthis.desiredTarget = new Vector(0, 0);\n\t\tthis.bounds = { left: 0, top: 0, right: 0, bottom: 0 };\n\t\tthis.damping = 0.025;\n\t\tthis.numberOfCenteringPasses = 1;\n\t\tthis.numberOfCollisionPasses = 3;\n\t\tthis.isCenterPullActive = true;\n\t}\n\tsetBounds(aBoundaryObject) {\n\t\tif (typeof aBoundaryObject.left === 'number') {\n\t\t\tthis.bounds.left = aBoundaryObject.left;\n\t\t}\n\t\tif (typeof aBoundaryObject.right === 'number') {\n\t\t\tthis.bounds.right = aBoundaryObject.right;\n\t\t}\n\t\tif (typeof aBoundaryObject.top === 'number') {\n\t\t\tthis.bounds.top = aBoundaryObject.top;\n\t\t}\n\t\tif (typeof aBoundaryObject.bottom === 'number') {\n\t\t\tthis.bounds.bottom = aBoundaryObject.bottom;\n\t\t}\n\t\tif (typeof aBoundaryObject.width === 'number') {\n\t\t\tthis.bounds.right = this.bounds.left + aBoundaryObject.width;\n\t\t}\n\t\tif (typeof aBoundaryObject.height === 'number') {\n\t\t\tthis.bounds.bottom = this.bounds.top + aBoundaryObject.height;\n\t\t}\n\t}\n\taddCircle(aCircle) {\n\t\tif (!(aCircle instanceof PackedCircle)) {\n\t\t\taCircle = new PackedCircle({\n\t\t\t\tid: aCircle.id,\n\t\t\t\tradius: aCircle.radius,\n\t\t\t\tx: aCircle.position.x || 0,\n\t\t\t\ty: aCircle.position.y || 0,\n\t\t\t\tisPinned: aCircle.isPinned || false,\n\t\t\t\tisPulledToCenter:\n\t\t\t\t\ttypeof aCircle.isPulledToCenter === 'boolean' ? aCircle.isPulledToCenter : true,\n\t\t\t});\n\t\t}\n\t\tthis.allCircles.push(aCircle);\n\t\taCircle.targetPosition = this.desiredTarget.cp();\n\t}\n\tremoveCircle(circleToRemoveId) {\n\t\tthis.allCircles.filter(circle => circle.id === circleToRemoveId);\n\t\tthis.allCircles = this.allCircles.filter(circle => circle.id !== circleToRemoveId);\n\t}\n\tupdatePositions() {\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (let i = 0; i < circleCount; ++i) {\n\t\t\tconst circle = circleList[i];\n\t\t\tcircle.previousPosition = circle.position.cp();\n\t\t}\n\t\tif (this.desiredTarget && this.isCenterPullActive) {\n\t\t\tthis.pushAllCirclesTowardTarget(this.desiredTarget);\n\t\t}\n\t\tthis.handleCollisions();\n\t\tfor (let i = 0; i < circleCount; ++i) {\n\t\t\tconst circle = circleList[i];\n\t\t\tthis.handleBoundaryForCircle(circle);\n\t\t}\n\t}\n\tpushAllCirclesTowardTarget(aTarget) {\n\t\tconst circleMovement = new Vector(0, 0);\n\t\tconst dragCircle = this.draggedCircle;\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (\n\t\t\tlet centeringPassNumber = 0;\n\t\t\tcenteringPassNumber < this.numberOfCenteringPasses;\n\t\t\tcenteringPassNumber++\n\t\t) {\n\t\t\tfor (let circleIndex = 0; circleIndex < circleCount; circleIndex++) {\n\t\t\t\tconst circle = circleList[circleIndex];\n\t\t\t\tif (circle.isPulledToCenter) {\n\t\t\t\t\tconst isCircleKinematic =\n\t\t\t\t\t\tcircle === dragCircle || this.isCirclePinned(circle.id);\n\t\t\t\t\tif (isCircleKinematic) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tcircleMovement.x = circle.position.x - aTarget.x;\n\t\t\t\t\tcircleMovement.y = circle.position.y - aTarget.y;\n\t\t\t\t\tcircleMovement.mul(this.damping);\n\t\t\t\t\tcircle.position.x -= circleMovement.x;\n\t\t\t\t\tcircle.position.y -= circleMovement.y;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\thandleCollisions() {\n\t\tconst circleCollisionMovement = new Vector(0, 0);\n\t\tconst dragCircle = this.draggedCircle;\n\t\tconst circleList = this.allCircles;\n\t\tconst circleCount = circleList.length;\n\t\tfor (\n\t\t\tlet collisionPassNumber = 0;\n\t\t\tcollisionPassNumber < this.numberOfCollisionPasses;\n\t\t\tcollisionPassNumber++\n\t\t) {\n\t\t\tfor (let circleAIndex = 0; circleAIndex < circleCount; circleAIndex++) {\n\t\t\t\tvar circleA = circleList[circleAIndex];\n\t\t\t\tfor (\n\t\t\t\t\tlet circleBIndex = circleAIndex + 1;\n\t\t\t\t\tcircleBIndex < circleCount;\n\t\t\t\t\tcircleBIndex++\n\t\t\t\t) {\n\t\t\t\t\tvar circleB = circleList[circleBIndex];\n\t\t\t\t\tconst isCircleAPinned = this.isCirclePinned(circleA.id);\n\t\t\t\t\tconst isCircleBPinned = this.isCirclePinned(circleB.id);\n\t\t\t\t\tconst isCircleAKinematic = circleA === dragCircle || isCircleAPinned;\n\t\t\t\t\tconst isCircleBKinematic = circleB === dragCircle || isCircleBPinned;\n\t\t\t\t\tif (\n\t\t\t\t\t\tcircleA === circleB ||\n\t\t\t\t\t\t(isCircleAKinematic && isCircleBKinematic)\n\t\t\t\t\t) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\t\t\t\t\tconst dx = circleB.position.x - circleA.position.x;\n\t\t\t\t\tconst dy = circleB.position.y - circleA.position.y;\n\t\t\t\t\tconst combinedRadii = (circleA.radius + circleB.radius) * 1.08;\n\t\t\t\t\tconst distanceSquared = circleA.position.distanceSquared(circleB.position);\n\t\t\t\t\tif (distanceSquared < combinedRadii * combinedRadii - 0.02) {\n\t\t\t\t\t\tcircleCollisionMovement.x = dx;\n\t\t\t\t\t\tcircleCollisionMovement.y = dy;\n\t\t\t\t\t\tcircleCollisionMovement.normalize();\n\t\t\t\t\t\tconst inverseForce = (combinedRadii - Math.sqrt(distanceSquared)) * 0.5;\n\t\t\t\t\t\tcircleCollisionMovement.mul(inverseForce);\n\t\t\t\t\t\tif (!isCircleBKinematic) {\n\t\t\t\t\t\t\tif (isCircleAKinematic) {\n\t\t\t\t\t\t\t\tcircleCollisionMovement.mul(2.2);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcircleB.position.x += circleCollisionMovement.x;\n\t\t\t\t\t\t\tcircleB.position.y += circleCollisionMovement.y;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tif (!isCircleAKinematic) {\n\t\t\t\t\t\t\tif (isCircleBKinematic) {\n\t\t\t\t\t\t\t\tcircleCollisionMovement.mul(2.2);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tcircleA.position.x -= circleCollisionMovement.x;\n\t\t\t\t\t\t\tcircleA.position.y -= circleCollisionMovement.y;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\thandleBoundaryForCircle(aCircle) {\n\t\tconst x = aCircle.position.x;\n\t\tconst y = aCircle.position.y;\n\t\tconst radius = aCircle.radius;\n\t\tlet isOverEdge = false;\n\t\tif (x + radius >= this.bounds.right) {\n\t\t\taCircle.position.x = this.bounds.right - radius;\n\t\t\tisOverEdge = true;\n\t\t} else if (x - radius < this.bounds.left) {\n\t\t\taCircle.position.x = this.bounds.left + radius;\n\t\t\tisOverEdge = true;\n\t\t}\n\t\tif (y + radius > this.bounds.bottom) {\n\t\t\taCircle.position.y = this.bounds.bottom - radius;\n\t\t\tisOverEdge = true;\n\t\t} else if (y - radius < this.bounds.top) {\n\t\t\taCircle.position.y = this.bounds.top + radius;\n\t\t\tisOverEdge = true;\n\t\t}\n\t\tif (isOverEdge && aCircle === this.draggedCircle) {\n\t\t\tthis.draggedCircle = null;\n\t\t}\n\t}\n\tsetDraggedCircle(aCircle) {\n\t\tthis.draggedCircle = aCircle;\n\t}\n\tdragStart(id) {\n\t\tconst draggedCircle = this.allCircles.filter(circle => circle.id === id)[0];\n\t\tthis.setDraggedCircle(draggedCircle);\n\t}\n\tdragEnd() {\n\t\tif (this.draggedCircle) {\n\t\t\tthis.draggedCircle = null;\n\t\t}\n\t}\n\tdrag(id, position) {\n\t\tif (this.draggedCircle && position) {\n\t\t\tthis.draggedCircle.position.x = position.x;\n\t\t\tthis.draggedCircle.position.y = position.y;\n\t\t}\n\t}\n\tisCirclePinned(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\treturn circle.isPinned;\n\t\t}\n\t\treturn false;\n\t}\n\tpinCircle(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPinned = true;\n\t\t}\n\t}\n\tunpinCircle(id) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPinned = false;\n\t\t}\n\t}\n\tsetCircleRadius(id, radius) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.setRadius(radius);\n\t\t}\n\t}\n\tsetCircleCenterPull(id, centerPull) {\n\t\tconst circle = this.circleById(id);\n\t\tif (circle) {\n\t\t\tcircle.isPulledToCenter = centerPull;\n\t\t}\n\t}\n\tsetCenterPull(centerPull) {\n\t\tthis.isCenterPullActive = centerPull;\n\t}\n\tcircleById(id) {\n\t\treturn this.allCircles.filter(circle => circle.id === id)[0];\n\t}\n\tsetTarget(aPosition) {\n\t\tthis.desiredTarget = aPosition;\n\t}\n}\n\nfunction sendWorkerMessage(worker, message) {\n\tworker.postMessage(JSON.stringify(message));\n}\nfunction processWorkerMessage(event) {\n\treturn event.data ? JSON.parse(event.data) : undefined;\n}\n\nself.addEventListener('message', receivedMessage);\nconst circleManager = new PackedCircleManager();\nfunction receivedMessage(event) {\n\tconst message = processWorkerMessage(event);\n\tif (message) {\n\t\tconst { action } = message;\n\t\tswitch (action.type) {\n\t\t\tcase 'SET_BOUNDS':\n\t\t\t\tcircleManager.setBounds(action.bounds);\n\t\t\t\tbreak;\n\t\t\tcase 'SET_CENTERING_PASSES':\n\t\t\t\tcircleManager.numberOfCenteringPasses = action.numberOfCenteringPasses;\n\t\t\t\tbreak;\n\t\t\tcase 'SET_COLLISION_PASSES':\n\t\t\t\tcircleManager.numberOfCollisionPasses = action.numberOfCollisionPasses;\n\t\t\t\tbreak;\n\t\t\tcase 'SET_DAMPING':\n\t\t\t\tcircleManager.damping = action.damping;\n\t\t\t\tbreak;\n\t\t\tcase 'SET_CENTER_PULL':\n\t\t\t\tcircleManager.setCenterPull(action.centerPull);\n\t\t\t\tbreak;\n\t\t\tcase 'UPDATE':\n\t\t\t\tupdate();\n\t\t\t\tbreak;\n\t\t\tcase 'ADD_CIRCLES':\n\t\t\t\taddCircles(action.circles);\n\t\t\t\tbreak;\n\t\t\tcase 'REMOVE_CIRCLE':\n\t\t\t\tcircleManager.removeCircle(action.id);\n\t\t\t\tbreak;\n\t\t\tcase 'DRAG_START':\n\t\t\t\tcircleManager.dragStart(action.id);\n\t\t\t\tbreak;\n\t\t\tcase 'DRAG_END':\n\t\t\t\tcircleManager.dragEnd(action.id);\n\t\t\t\tbreak;\n\t\t\tcase 'DRAG_MOVE':\n\t\t\t\tcircleManager.drag(action.id, action.position);\n\t\t\t\tbreak;\n\t\t\tcase 'SET_CIRCLE_RADIUS':\n\t\t\t\tcircleManager.setCircleRadius(action.id, action.radius);\n\t\t\t\tbreak;\n\t\t\tcase 'SET_CIRCLE_CENTER_PULL':\n\t\t\t\tcircleManager.setCircleCenterPull(action.id, action.centerPull);\n\t\t\t\tbreak;\n\t\t\tcase 'PIN_CIRCLE':\n\t\t\t\tcircleManager.pinCircle(action.id);\n\t\t\t\tbreak;\n\t\t\tcase 'UNPIN_CIRCLE':\n\t\t\t\tcircleManager.unpinCircle(action.id);\n\t\t\t\tbreak;\n\t\t\tcase 'SET_TARGET':\n\t\t\t\tsetTarget(action.target);\n\t\t\t\tbreak;\n\t\t}\n\t}\n}\nfunction respondWith(response) {\n\tsendWorkerMessage(self, response);\n}\nfunction addCircles(circles) {\n\tif (Array.isArray(circles) && circles.length) {\n\t\tcircles.forEach(circleManager.addCircle.bind(circleManager));\n\t}\n}\nfunction setTarget(target) {\n\tif (target && typeof target.x === 'number' && typeof target.y === 'number') {\n\t\tcircleManager.setTarget(new Vector(target));\n\t}\n}\nfunction update() {\n\tcircleManager.updatePositions();\n\tsendPositions();\n}\nfunction sendPositions() {\n\tconst positions = circleManager.allCircles.reduce((result, circle) => {\n\t\tresult[circle.id] = {\n\t\t\tid: circle.id,\n\t\t\tposition: circle.position,\n\t\t\tpreviousPosition: circle.previousPosition,\n\t\t\tradius: circle.radius,\n\t\t\tdelta: circle.delta,\n\t\t\tisPulledToCenter: circle.isPulledToCenter,\n\t\t\tisPinned: circle.isPinned,\n\t\t};\n\t\treturn result;\n\t}, {});\n\trespondWith({ type: 'MOVED', updatedCircles: positions });\n}\n"],{type:'text/javascript'})));
		this.worker.addEventListener('message', this.receivedWorkerMessage.bind(this));

		this.isContinuousModeActive =
			typeof params.continuousMode === 'boolean' ? params.continuousMode : true;

		this.onMoveStart = params.onMoveStart || null;
		this.onMove = params.onMove || null;
		this.onMoveEnd = params.onMoveEnd || null;

		this.lastCirclePositions = [];

		if (params.centeringPasses) {
			this.setCenteringPasses(params.centeringPasses);
		}

		if (params.collisionPasses) {
			this.setCollisionPasses(params.collisionPasses);
		}

		this.addCircles(params.circles || []);
		this.setBounds(params.bounds || { width: 100, height: 100 });
		this.setTarget(params.target || { x: 50, y: 50 });

		this.isLooping = false;
		this.areItemsMoving = true;
		this.animationFrameId = NaN;

		this.initialized = true;

		if (this.isContinuousModeActive) {
			this.startLoop();
		}
	}

	/**
	 * Handle message that was received from worker
	 *
	 * @param {MessageEvent<string>} event
	 */
	receivedWorkerMessage(event) {
		const response = processWorkerMessage(event);

		if (response.type === 'MOVED') {
			const movedCircles = response.updatedCircles;

			this.areItemsMoving = this.hasItemMoved(movedCircles);

			if (
				!this.areItemsMoving &&
				this.isLooping &&
				this.initialized &&
				this.isContinuousModeActive
			) {
				this.stopLoop();
			}
		}

		this.updateListeners(response);
	}

	/**
	 * Send message to worker
	 *
	 * @param {WorkerAction} action
	 */
	updateWorker(action) {
		sendWorkerMessage(this.worker, { messageId: Date.now() + random(0, 0.001, true), action });
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
		if (response.type === 'MOVED' && typeof this.onMove === 'function') {
			this.lastCirclePositions = response.updatedCircles;
			this.onMove(response.updatedCircles);
		}
		if (response.type === 'MOVE_END' && typeof this.onMoveEnd === 'function') {
			this.onMoveEnd(response.updatedCircles);
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
			this.startLoop();
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
			this.startLoop();
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
			this.startLoop();
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
			this.startLoop();
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
			this.startLoop();
		}
	}

	/**
	 * Set centerPull value of a Circle
	 *
	 * @param {CircleRef} circleRef - The circle
	 * @param {boolean} centerPull - The new centerPull value
	 */
	setCircleCenterPull(circleRef, centerPull) {
		const circleId =
			typeof circleRef === 'object' && circleRef.id !== undefined ? circleRef.id : circleRef;

		if (!isIdValid(circleId)) {
			throw new Error(`Can't set circle center pull: the circleRef parameter is malformed.`);
		} else {
			this.updateWorker({
				type: 'SET_CIRCLE_CENTER_PULL',
				id: circleId,
				centerPull: !!centerPull,
			});

			this.startLoop();
		}
	}

	/**
	 * Set global center pull value
	 *
	 * @param {boolean} centerPull - The new centerPull value
	 */
	setCenterPull(centerPull) {
		this.updateWorker({ type: 'SET_CENTER_PULL', centerPull: !!centerPull });
		this.startLoop();
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
			this.startLoop();
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
			this.startLoop();
		}
	}

	/**
	 * Updates the number of centering passes
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
			this.startLoop();
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
			this.startLoop();
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
			this.startLoop();
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
		if (!this.isLooping && this.initialized && this.isContinuousModeActive) {
			this.isLooping = true;

			// in case we just added another circle:
			// keep going, even if nothing has moved since the last message from the worker
			if (this.isContinuousModeActive) {
				this.areItemsMoving = true;
			}

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
		if (this.worker) {
			this.worker.terminate();
		}
		this.stopLoop();

		this.onMove = null;
		this.onMoveStart = null;
		this.onMoveEnd = null;
	}
}

export { CirclePacker as default };
