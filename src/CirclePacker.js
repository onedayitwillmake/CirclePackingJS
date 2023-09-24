import {
	sendWorkerMessage,
	processWorkerResponse,
	isCircleValid,
	isBoundsValid,
	random,
	isIdValid,
	isNumberGreaterThan,
	isPointValid,
} from './util.js';

import { WorkerLogic } from './WorkerLogic.js';
import { CirclePackerBrowser } from './CirclePackerBrowser.js';

/**
 * This class passes messages to the worker and notifies subscribers
 */
export class CirclePacker extends CirclePackerBrowser {
	/**
	 * Creates an instance of CirclePacker.
	 *
	 * @constructor
	 * @param {CirclePackerParams} params - The params to instantiate the CirclePacker with
	 */
	constructor(params = {}) {
		super(params);
		this.id = 'PACKA' + Date.now() + Math.round(Math.random() * 100000);

		this.useWorker = params.useWorker === false ? false : true;

		if (this.useWorker) {
			if (!Worker) {
				throw new Error('Web workers are not supported.');
			}

			const workerPath = params.workerPath ? params.workerPath : './CirclePackWorker.js';

			this.worker = new Worker(workerPath, { type: 'module' });
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
export function pack(params = {}) {
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
