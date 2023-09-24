// this code is mostly for message passing between the
// PackedCircleManager and CirclePacker classes
import { PackedCircleManager } from './PackedCircleManager.js';
import { Vector } from './Vector.js';

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
export class WorkerLogic {
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
				default:
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
