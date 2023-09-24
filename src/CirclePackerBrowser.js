/**
 * This class keeps track of the drawing loop in continuous drawing mode.
 * It is not available in node.
 */
export class CirclePackerBrowser {
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
