// import * as types from './types.js';
import {
	sendWorkerMessage,
	processWorkerMessage,
	isCircleValid,
	isBoundsValid,
	random,
	isIdValid,
	isNumberGreaterThan,
	isPointValid,
	isNumberBetween,
} from './util.js';

/**
 * This class keeps track of the drawing loop in continuous drawing mode
 * and passes messages to the worker
 */
export default class CirclePacker {
	/**
	 * Creates an instance of CirclePacker.
	 *
	 * @constructor
	 * @param {CirclePackerParams} params - The params to instantiate the CirclePacker with
	 */
	constructor(params) {
		this.worker = new Worker('./CirclePackWorker.js');
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
