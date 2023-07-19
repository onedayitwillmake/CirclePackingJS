// this code is mostly for message passing between the
// PackedCircleManager and CirclePacker classes
import PackedCircle from './PackedCircle.js';
import PackedCircleManager from './PackedCircleManager.js';
import Vector from './Vector.js';
import { sendWorkerMessage, processWorkerMessage } from './util.js';

self.addEventListener('message', receivedMessage);

const circleManager = new PackedCircleManager();

/**
 * Handle message events that were received from the main script
 * and trigger the appropriate actions
 *
 * @param {WorkerMessage} event
 */
function receivedMessage(event) {
	const message = processWorkerMessage(event);

	if (message) {
		const { action } = message;

		switch (action.type) {
			case 'SET_BOUNDS':
				circleManager.setBounds(action.bounds);
				break;
			case 'SET_CENTERING_PASSES':
				circleManager.numberOfCenteringPasses = action.numberOfCenteringPasses;
				break;
			case 'SET_COLLISION_PASSES':
				circleManager.numberOfCollisionPasses = action.numberOfCollisionPasses;
				break;
			case 'SET_DAMPING':
				circleManager.damping = action.damping;
				break;
			case 'SET_CENTER_PULL':
				circleManager.setCenterPull(action.centerPull);
				break;
			case 'UPDATE':
				update();
				break;
			case 'ADD_CIRCLES':
				addCircles(action.circles);
				break;
			case 'REMOVE_CIRCLE':
				circleManager.removeCircle(action.id);
				break;
			case 'DRAG_START':
				circleManager.dragStart(action.id);
				break;
			case 'DRAG_END':
				circleManager.dragEnd(action.id);
				break;
			case 'DRAG_MOVE':
				circleManager.drag(action.id, action.position);
				break;
			case 'SET_CIRCLE_RADIUS':
				circleManager.setCircleRadius(action.id, action.radius);
				break;
			case 'SET_CIRCLE_CENTER_PULL':
				circleManager.setCircleCenterPull(action.id, action.centerPull);
				break;
			case 'PIN_CIRCLE':
				circleManager.pinCircle(action.id);
				break;
			case 'UNPIN_CIRCLE':
				circleManager.unpinCircle(action.id);
				break;
			case 'SET_TARGET':
				setTarget(action.target);
				break;
			default:
				break;
		}
	}
}

/**
 * Send message back to the main script
 *
 * @param {WorkerResponse} response
 */
function respondWith(response) {
	sendWorkerMessage(self, response);
}

/**
 * Create new circles based on the received circle data
 *
 * @param {PackedCircleData[]} circles - The circles to add
 */
function addCircles(circles) {
	if (Array.isArray(circles) && circles.length) {
		circles.forEach(circleManager.addCircle.bind(circleManager));
	}
}

/**
 * Update the pull targets position
 *
 * @param {VectorData} target - The new target position
 */
function setTarget(target) {
	if (target && typeof target.x === 'number' && typeof target.y === 'number') {
		circleManager.setTarget(new Vector(target));
	}
}

/**
 * Calculate the next circle positions
 */
function update() {
	circleManager.updatePositions();

	sendPositions();
}

/**
 * Send the new circle positions to the main script
 */
function sendPositions() {
	const positions = circleManager.allCircles.reduce((result, circle) => {
		result[circle.id] = {
			id: circle.id,
			position: circle.position,
			previousPosition: circle.previousPosition,
			radius: circle.radius,
			delta: circle.delta,
			isPulledToCenter: circle.isPulledToCenter,
			isPinned: circle.isPinned,
		};

		return result;
	}, {});

	respondWith({ type: 'MOVED', updatedCircles: positions });
}
