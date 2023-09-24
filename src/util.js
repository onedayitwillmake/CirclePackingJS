import PackedCircle from './PackedCircle.js';

/**
 * Generate a random number
 *
 * @export
 * @param {number} min - The lower bound for the generated number
 * @param {number} max - The upper bound for the generated number
 * @param {boolean} intResult - Return int instead of float
 * @returns {number}
 */
export function random(min, max, intResult) {
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
export function sendWorkerMessage(worker, message) {
	worker.postMessage(JSON.stringify(message));
}

/**
 * Handle data received by the web worker: Parse JSON
 *
 * @export
 * @param {MessageEvent<string>} event - The worker event
 * @returns {(WorkerMessage | undefined)}
 */
export function processWorkerMessage(event) {
	return event.data ? JSON.parse(event.data) : undefined;
}

/**
 * Handle data received by the web worker: Parse JSON
 *
 * @export
 * @param {MessageEvent<string>} event - The worker event
 * @returns {WorkerResponse | undefined}
 */
export function processWorkerResponse(event) {
	return event.data ? JSON.parse(event.data) : undefined;
}

/**
 * Check if circle object is valid
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} circle - The circle to check
 * @returns {boolean}
 */
export function isCircleValid(circle) {
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
export function isBoundsValid(bounds) {
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
export function boundsDataToRect(bounds) {
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
export function isIdValid(id) {
	return (typeof id === 'number' && !isNaN(id)) || (typeof id === 'string' && id.length > 0);
}

/**
 * Coeck if number is in range
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} number
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
export function isNumberBetween(number, min, max) {
	return typeof number === 'number' && number >= min && number <= max;
}

/**
 * Check if number is greater than
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} number
 * @param {number} min
 * @returns {boolean}
 */
export function isNumberGreaterThan(number, min) {
	return typeof number === 'number' && number >= min;
}

/**
 * Check if radius is valid
 *
 * @export
 * @param {object | undefined | number | string | boolean | function} point
 * @returns {boolean}
 */
export function isPointValid(point) {
	return typeof point === 'object' && typeof point.x === 'number' && typeof point.y === 'number';
}
