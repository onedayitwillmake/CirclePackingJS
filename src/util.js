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
 * @returns {WorkerResponse | undefined}
 */
export function processWorkerMessage(event) {
	return event.data ? JSON.parse(event.data) : undefined;
}

/**
 * Check if circle object is valid
 *
 * @export
 * @param {PackedCircle} circle - The circle to check
 * @returns {boolean}
 */
export function isCircleValid(circle) {
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
export function isBoundsValid(bounds) {
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
export function isIdValid(id) {
	return (typeof id === 'number' && !isNaN(id)) || (typeof id === 'string' && id.length > 0);
}

/**
 * Coeck if number is in range
 *
 * @export
 * @param {any} number
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
 * @param {any} number
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
 * @param {any} point
 * @returns {boolean}
 */
export function isPointValid(point) {
	return typeof point === 'object' && typeof point.x === 'number' && typeof point.y === 'number';
}
