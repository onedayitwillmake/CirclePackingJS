declare module "Vector" {
    /**
     * Vector class
     *
     * Most of this code is taken from CirclePackingJS by @onedayitwillmake
     * https://github.com/onedayitwillmake/CirclePackingJS/blob/eb3475b/js-module/web/js/lib/Vector.js
     *
     */
    export class Vector {
        /**
         * Creates an instance of Vector.
         *
         * @constructor
         * @param {number | VectorData} x - The X component of the Vector
         * @param {number} y - The Y component of the Vector
         */
        constructor(x: number | VectorData, y: number);
        x: number;
        y: number;
        /**
         * Returns a cloned instance of the Vector
         *
         * @returns {Vector}
         */
        cp(): Vector;
        /**
         * Multiplies the vector by a scalar
         *
         * @param {number} scalar - The scalar to multiply the Vector components with
         * @returns {this}
         */
        mul(scalar: number): this;
        /**
         * Normalizes the Vector instance
         *
         * @returns {this}
         */
        normalize(): this;
        /**
         * Calculates the length of the Vector instance
         *
         * @returns {number} - The length of the Vector instance
         */
        length(): number;
        /**
         * Calculates the distance to another Vector instance
         *
         * @param {Vector} otherVector - The other Vector instance
         * @returns {number} - The distance to the other Vector instance
         */
        distance(otherVector: Vector): number;
        /**
         * Calculates the distance squared to another Vector instance
         *
         * @param {Vector} otherVector - The other Vector instance
         * @returns {number} - The distance squared to the other Vector instance
         */
        distanceSquared(otherVector: Vector): number;
    }
}
declare module "PackedCircle" {
    /**
     * The Packed circle contains information about a Packed circle
     */
    export default class PackedCircle {
        /**
         * Creates an instance of PackedCircle.
         *
         * @constructor
         * @param {PackedCircleData} - The data to instantiate the PackedCircle with
         */
        constructor({ id, radius, x, y, isPulledToTarget, isPinned }: PackedCircleData);
        /** @type {CircleID} */
        id: CircleID;
        /**
         * Where we would like to be
         *
         * @type {Vector}
         **/
        targetPosition: Vector;
        /**
         * Where we really are
         *
         * @type {Vector}
         **/
        position: Vector;
        /**
         * Where we we were last time
         *
         * @type {Vector}
         **/
        previousPosition: Vector;
        /**
         * Is circle being pulled to center?
         *
         * @type {boolean}
         **/
        isPulledToTarget: boolean;
        /**
         * Is circle pinned inplace
         *
         * @type {VectorData}
         **/
        isPinned: VectorData;
        /**
         * Update the position of the circle
         *
         * @param {Vector} aPosition - The new position of the circle
         */
        setPosition(aPosition: Vector): void;
        /**
         * Updates the radius of the circle
         *
         * @param {number} aRadius - The new radizs
         */
        setRadius(aRadius: number): void;
        radius: number;
        radiusSquared: number;
        /**
         * Returns the distance to the last position of the circle
         *
         * @type {Vector}
         */
        get delta(): Vector;
    }
    import { Vector } from "Vector";
}
declare module "util" {
    /**
     * Generate a random number
     *
     * @export
     * @param {number} min - The lower bound for the generated number
     * @param {number} max - The upper bound for the generated number
     * @param {boolean} intResult - Return int instead of float
     * @returns {number}
     */
    export function random(min: number, max: number, intResult: boolean): number;
    /**
     * Sends data to worker, converts it to JSON first
     *
     * @export
     * @param {Worker} worker - The Worker instance
     * @param {WorkerMessage} message - The message to send to the worker
     */
    export function sendWorkerMessage(worker: Worker, message: WorkerMessage): void;
    /**
     * Handle data received by the web worker: Parse JSON
     *
     * @export
     * @param {MessageEvent<string>} event - The worker event
     * @returns {(WorkerMessage | undefined)}
     */
    export function processWorkerMessage(event: MessageEvent<string>): (WorkerMessage | undefined);
    /**
     * Handle data received by the web worker: Parse JSON
     *
     * @export
     * @param {MessageEvent<string>} event - The worker event
     * @returns {WorkerResponse | undefined}
     */
    export function processWorkerResponse(event: MessageEvent<string>): WorkerResponse | undefined;
    /**
     * Check if circle object is valid
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} circle - The circle to check
     * @returns {boolean}
     */
    export function isCircleValid(circle: object | undefined | number | string | boolean | Function): boolean;
    /**
     * Check if bounds object is valid
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} bounds - The bounds object to check
     * @returns {boolean}
     */
    export function isBoundsValid(bounds: object | undefined | number | string | boolean | Function): boolean;
    /**
     * Converts bounds data to rect
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} bounds - The BoundsData object
     * @returns {BoundsRect | undefined} - The bounds rect
     */
    export function boundsDataToRect(bounds: object | undefined | number | string | boolean | Function): BoundsRect | undefined;
    /**
     * Check if we can use id
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} id - The id tp check
     * @returns {boolean}
     */
    export function isIdValid(id: object | undefined | number | string | boolean | Function): boolean;
    /**
     * Coeck if number is in range
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} number
     * @param {number} min
     * @param {number} max
     * @returns {boolean}
     */
    export function isNumberBetween(number: object | undefined | number | string | boolean | Function, min: number, max: number): boolean;
    /**
     * Check if number is greater than
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} number
     * @param {number} min
     * @returns {boolean}
     */
    export function isNumberGreaterThan(number: object | undefined | number | string | boolean | Function, min: number): boolean;
    /**
     * Check if radius is valid
     *
     * @export
     * @param {object | undefined | number | string | boolean | function} point
     * @returns {boolean}
     */
    export function isPointValid(point: object | undefined | number | string | boolean | Function): boolean;
}
declare module "PackedCircleManager" {
    /**
     * The PackedCircleManager handles updating the state. It runs in a web worker
     */
    export class PackedCircleManager {
        /** @type {PackedCircle[]} */
        allCircles: PackedCircle[];
        /** @type {CircleID[]} */
        pinnedCircleIds: CircleID[];
        /** @type {Vector | undefined} */
        desiredTarget: Vector | undefined;
        /** @type {BoundsRect | undefined} */
        boundsRect: BoundsRect | undefined;
        /** @type {number} */
        damping: number;
        /**
         * Should all items be pulled to the target?
         *
         * @type {boolean}
         * */
        isTargetPullActive: boolean;
        /**
         * Do we want to calculate overlapping circles for each update?
         * It might be an expensive operation and is not always needed
         *
         * @type {boolean}
         * */
        calculateOverlap: boolean;
        /**
         * Number of passes for centering
         * It's (O)logN^2 so use increase at your own risk!
         * Play with these numbers - see what works best for your project
         *
         * @type {number}
         * */
        numberOfCenteringPasses: number;
        /**
         * Number of passes for collision
         * It's (O)logN^2 so use increase at your own risk!
         * Play with these numbers - see what works best for your project
         *
         * @type {number}
         * */
        numberOfCollisionPasses: number;
        /**
         * Number of passes for correcting overlapping circles
         * This is can be a very expensive operation so increase at your own risk!
         * Play with these numbers - see what works best for your project
         *
         * @type {number}
         * */
        numberOfCorrectionPasses: number;
        /**
         * Set the boundary rectangle for the circle packing.
         *
         * @param {BoundsData} aBoundaryObject - The boundary to set
         */
        setBounds(aBoundaryObject: BoundsData): void;
        /**
         * Add a circle
         *
         * @param {CircleData | PackedCircle} aCircle - A Circle to add, should already be created.
         */
        addCircle(aCircle: CircleData | PackedCircle): void;
        /**
         * Remove a circle
         *
         * @param {CircleID} circleToRemoveId - Id of the circle to remove
         */
        removeCircle(circleToRemoveId: CircleID): void;
        /**
         * Recalculate all circle positions
         */
        updatePositions(): void;
        /**
         * Update all circles to move towards a target position
         *
         * @param {VectorData} aTarget
         */
        pushAllCirclesTowardTarget(aTarget: VectorData): void;
        /**
         * Packs the circles towards the center of the bounds.
         * Each circle will have it's own 'targetPosition' later on
         */
        handleCollisions(): void;
        /**
         * Collide circles with boundaries
         */
        handleBoundaryCollisions(): void;
        /**
         * Ensure the circle stays inside the boundaries
         *
         * @param {PackedCircle} aCircle - The circle to check
         */
        handleBoundaryForCircle(aCircle: PackedCircle): void;
        draggedCircle: PackedCircle;
        /**
         * Calculate overlapping circles for each circle
         *
         * @returns {CirclePackerOverlappingCircles}
         */
        getOverlappingCircles(): CirclePackerOverlappingCircles;
        /**
         * Create a positions object that we can send via postmessage
         *
         * @returns {CirclePackerMovementResult}
         */
        getPositions(): CirclePackerMovementResult;
        /**
         * Force a certain circle to be the 'draggedCircle'.
         * Can be used to undrag a circle by calling setDraggedCircle(null)
         * @param {PackedCircle | null} aCircle - Circle to start dragging. It's assumed to be part of our list. No checks in place currently.
         */
        setDraggedCircle(aCircle: PackedCircle | null): void;
        /**
         * Mark circle as dragging
         *
         * @param {CircleID} id - The ID of the circle we're dragging
         */
        dragStart(id: CircleID): void;
        /**
         * Mark dragged circle as no longer dragging
         */
        dragEnd(): void;
        /**
         * Update the position of the circle that is being dragged
         *
         * @param {CircleID} id - The id of the circle being dragged
         * @param {VectorData | Vector} position - The new position of the dragged circle
         */
        drag(id: CircleID, position: VectorData | Vector): void;
        /**
         * Check if circle is marked as pinned
         *
         * @param {CircleID} id - The id of the circle to check
         * @returns {boolean}
         */
        isCirclePinned(id: CircleID): boolean;
        /**
         * Mark circle as pinned
         *
         * @param {CircleID} id - The id of the circle we want to pin
         */
        pinCircle(id: CircleID): void;
        /**
         * Mark circle as no longer pinned
         *
         * @param {CircleID} id - The id of the circle we want to unpin
         */
        unpinCircle(id: CircleID): void;
        /**
         * set the radius of a circle
         *
         * @param {CircleID} id - The id of the circle we want to update the radius of
         * @param {number} radius - The new radius
         */
        setCircleRadius(id: CircleID, radius: number): void;
        /**
         * Update the targetPull value of a circle
         *
         * @param {CircleID} id - The id of the circle
         * @param {boolean} targetPull - The targetPull value
         */
        setCircleTargetPull(id: CircleID, targetPull: boolean): void;
        /**
         * Set a global targetPull value
         *
         * @param {boolean} targetPull - The global canterPull value
         */
        setTargetPull(targetPull: boolean): void;
        /**
         * Gets a circle by its id
         *
         * @param {CircleID} id - The id of the circle we want
         * @returns {PackedCircle | undefined}
         */
        circleById(id: CircleID): PackedCircle | undefined;
        /**
         * Sets the target position where the circles want to be
         *
         * @param {VectorData} aPosition - The position of the targetPull target
         */
        setTarget(aPosition: VectorData): void;
        /**
         * Sets calculate overlap
         *
         * @param {boolean} calculateOverlap
         */
        setCalculateOverlap(calculateOverlap: boolean): void;
    }
    import PackedCircle from "PackedCircle";
    import { Vector } from "Vector";
}
declare module "WorkerLogic" {
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
        circleManager: PackedCircleManager;
        /**
         * Handle message events that were received from the main script
         * and trigger the appropriate actions
         *
         * @param {WorkerMessage} [message]
         * @param {WorkerResponseCallback} [handleResponse]
         */
        handleWorkerMessage(message?: WorkerMessage, handleResponse?: WorkerResponseCallback): void;
        /**
         * Create new circles based on the received circle data
         *
         * @param {PackedCircleData[]} circles - The circles to add
         */
        addCircles(circles: PackedCircleData[]): void;
        /**
         * Update the pull targets position
         *
         * @param {VectorData} target - The new target position
         */
        setTarget(target: VectorData): void;
        /**
         * Calculate the next circle positions
         */
        update(): void;
        /**
         * Send the new circle positions to the main script
         *
         * @param {WorkerResponseCallback} [handleResponse]
         */
        sendPositions(handleResponse?: WorkerResponseCallback): void;
    }
    import { PackedCircleManager } from "PackedCircleManager";
}
declare module "CirclePackWorker" {
    export {};
}
declare module "CirclePackerBrowser" {
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
        constructor(params?: CirclePackerParams);
        /**
         * Is the continuous mode active?
         * In that case, we need to start and stop the animation loop
         *
         * @type {boolean}
         * */
        isContinuousModeActive: boolean;
        /**
         * Callback for when the loop animation starts
         *
         * @type {OnMoveStartCallback | null}
         */
        onMoveStart: OnMoveStartCallback | null;
        /**
         * Callback for when the loop animation end
         *
         * @type {OnMoveEndCallback | null}
         */
        onMoveEnd: OnMoveEndCallback | null;
        /**
         * Is the animation loop running?
         *
         * @type {boolean}
         */
        isLooping: boolean;
        /**
         * Have items moved since the last loop?
         *
         * @type {boolean}
         */
        areItemsMoving: boolean;
        /**
         * Reference to the current animation frame
         *
         * @type {number}
         */
        animationFrameId: number;
        /**
         * Handles Worker response
         * Stops loop if necessary, updates listeners
         *
         * @param {WorkerResponse} response
         */
        handleWorkerResponse(response: WorkerResponse): void;
        /**
         * Circles were added: force loop start
         */
        forceMovement(): void;
        /**
         * Update the callbacks
         *
         * @param {WorkerResponse} response
         */
        updateListeners(response: WorkerResponse): void;
        /**
         * The update loop that calls itself recursively every animation frame
         */
        updateLoop(): void;
        /**
         * Start the update loop
         */
        startLoop(): void;
        /**
         * Stop the update loop
         */
        stopLoop(): void;
        /**
         * Check if an item has moved. Count items that have moved barely as not moved
         *
         * @param {CirclePackerMovementResult} positions
         * @returns {boolean}
         */
        hasItemMoved(positions: CirclePackerMovementResult): boolean;
        /**
         * Tear down worker, remove cllbacks
         */
        destroy(): void;
    }
}
declare module "CirclePacker" {
    /**
     * Pack circles as simple async function. Only works for one-time operations
     *
     * @export
     * @param {PackParams} params - The params for the circlepacker.
     * @returns {PromiseLike<PackResponse>}
     */
    export function pack(params?: PackParams): PromiseLike<PackResponse>;
    /**
     * This class passes messages to the worker and notifies subscribers
     */
    export class CirclePacker extends CirclePackerBrowser {
        id: string;
        useWorker: boolean;
        worker: Worker;
        workerLogic: WorkerLogic;
        /**
         * The onMove callback function. Called whenever the circle positions have changed
         * @type {OnMoveCallback}
         */
        onMove: OnMoveCallback;
        /**
         * Stores the circle positions from last update
         * @type {CirclePackerMovementResult}
         */
        lastCirclePositions: CirclePackerMovementResult;
        /**
         * Handle message that was received from worker
         *
         * @param {MessageEvent<string>} event
         */
        receivedWorkerMessage(event: MessageEvent<string>): void;
        /**
         * Send message to worker
         *
         * @param {WorkerAction} action
         */
        updateWorker(action: WorkerAction): void;
        /**
         * API for adding circles
         *
         * @throws Will throw an error if circles parameter is malformed
         * @param {PackedCircleData[]} circles - The circles to add
         */
        addCircles(circles: PackedCircleData[]): void;
        /**
         * Add a circle
         *
         * @param {PackedCircleData} circle - The circle to add
         */
        addCircle(circle: PackedCircleData): void;
        /**
         * Removes a circle
         *
         * @throws Will throw an error if the circle id is malformed
         * @param {CircleRef} circleRef - The circle to remove
         */
        removeCircle(circleRef: CircleRef): void;
        /**
         * Pins a circle in place
         *
         * @throws Will throw an error if the circle id is malformed
         * @param {CircleRef} circleRef - The circle to pin
         */
        pinCircle(circleRef: CircleRef): void;
        /**
         * Unpins a circle
         *
         * @throws Will throw an error if the circle id is malformed
         * @param {CircleRef} circleRef - The circle to unpin
         */
        unpinCircle(circleRef: CircleRef): void;
        /**
         * Description placeholder
         *
         * @throws Will throw an error if the circle id is malformed
         * @param {CircleRef} circleRef - The circle to pin
         * @param {number} radius - The new radius
         */
        setCircleRadius(circleRef: CircleRef, radius: number): void;
        /**
         * Set targetPull value of a Circle
         *
         * @param {CircleRef} circleRef - The circle
         * @param {boolean} targetPull - The new targetPull value
         */
        setCircleTargetPull(circleRef: CircleRef, targetPull: boolean): void;
        /**
         * Set global center pull value
         *
         * @param {boolean} targetPull - The new targetPull value
         */
        setTargetPull(targetPull: boolean): void;
        /**
         * Set new boundaries for the area
         *
         * @throws Will throw an error if the circle id is malformed
         * @param {BoundsData} bounds - The new bounddaries
         */
        setBounds(bounds: BoundsData): void;
        /**
         * Set the position of the pull target
         *
         * @throws Will throw an error if the target position is malformed
         * @param {VectorData} targetPos - The position of the pull target
         */
        setTarget(targetPos: VectorData): void;
        /**
         * Updates the number of centering passes
         *
         * It's (O)logN^2 so use increase at your own risk.
         * Play with these numbers - see what works best for your project.
         *
         * @throws Will throw an error if the number of centering passes is malformed
         * @param {number} numberOfCenteringPasses - The new number of centering passes. Expects a number >= 1
         */
        setCenteringPasses(numberOfCenteringPasses: number): void;
        /**
         * Sets the number of collision passes
         *
         * It's (O)logN^2 so use increase at your own risk.
         * Play with these numbers - see what works best for your project.
         *
         * @throws Will throw an error if the number of collision passes is malformed
         * @param {number} numberOfCollisionPasses - Sets the new number of collision passes. Expects a number >= 1
         */
        setCollisionPasses(numberOfCollisionPasses: number): void;
        /**
         * Sets the number of correction passes
         *
         * This is can be a very expensive operation so increase at your own risk.
         * Play with these numbers - see what works best for your project.
         *
         * @throws Will throw an error if the number of collision passes is malformed
         * @param {number} numberOfCorrectionPasses - Sets the new number of correction passes. Expects a number >= 0
         */
        setCorrectionPasses(numberOfCorrectionPasses: number): void;
        /**
         * Should we calculate the overlap on each update?
         *
         * @throws Will throw an error if calculateOverlap is not boolean
         * @param {boolean} calculateOverlap - Sets the calculateOverlap value
         */
        setCalculateOverlap(calculateOverlap: boolean): void;
        /**
         * Sets the damping value
         *
         * @throws Will throw an error if damping value is malformed
         * @param {number} damping - The new damping value. Expects a number be between 0 and 1
         */
        setDamping(damping: number): void;
        /**
         * Sends a signal to the worker to update the state
         */
        update(): void;
        /**
         * Mark a circle as being dragged
         *
         * @throws Will throw an error if circle reference is malformed
         * @param {CircleRef} circleRef - The circle reference
         */
        dragStart(circleRef: CircleRef): void;
        /**
         * Update the position of a circle that is being dragged
         *
         * @throws Will throw an error if circle reference or the position is malformed
         * @param {CircleRef} circleRef - The circle reference
         * @param {VectorData} position - The new position of the circle
         */
        drag(circleRef: CircleRef, position: VectorData): void;
        /**
         * Mark a circle as no longer being dragged
         *
         * @throws Will throw an error if circle reference is malformed
         * @param {CircleRef} circleRef - The circle reference
         */
        dragEnd(circleRef: CircleRef): void;
    }
    export namespace CirclePacker {
        export { pack };
    }
    import { CirclePackerBrowser } from "CirclePackerBrowser";
    import { WorkerLogic } from "WorkerLogic";
}
type CirclePackerParams = {
    /**
     * - The onMove callback. Your render function goes here.
     */
    onMove?: OnMoveCallback;
    /**
     * - Function to execute after movement started
     */
    onMoveStart?: OnMoveStartCallback;
    /**
     * - Function to execute after movement ended
     */
    onMoveEnd?: OnMoveEndCallback;
    /**
     * - The boundaries of the area
     */
    bounds?: BoundsData;
    /**
     * - The circles
     */
    circles?: PackedCircleData[];
    /**
     * - The attraction target
     */
    target?: VectorData;
    /**
     * - Update the circle positions in a continuous animation loop?
     */
    continuousMode?: boolean;
    /**
     * - The number of centering passes
     */
    centeringPasses?: number;
    /**
     * - The number of collistion passes
     */
    collisionPasses?: number;
    /**
     * - The number of overlap correction passes
     */
    correctionPasses?: number;
    /**
     * - Calculate overlap for circles
     */
    calculateOverlap?: boolean;
    /**
     * - Set to false to skip using the Web Worker
     */
    useWorker?: boolean;
    /**
     * - The path to the webworker, only relevant if running the uncompiled source
     */
    workerPath?: string;
};
type OnMoveStartCallback = (updatedCircles: CirclePackerMovementResult) => void;
type OnMoveCallback = (updatedCircles: CirclePackerMovementResult, target?: VectorData, overlappingCircles?: CirclePackerOverlappingCircles) => void;
type OnMoveEndCallback = (updatedCircles: CirclePackerMovementResult) => void;
type VectorData = {
    /**
     * - The X component of the vector
     */
    x: number;
    /**
     * - The Y component of the vector
     */
    y: number;
};
type CircleID = number | string;
type PackedCircleData = {
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The X position of the circle
     */
    x: number;
    /**
     * - The Y position of the circle
     */
    y: number;
    /**
     * - The circle radius
     */
    radius: number;
    /**
     * - Is circle pinnd
     */
    isPinned?: boolean;
    /**
     * - Is circle pulled towards the target
     */
    isPulledToTarget?: boolean;
};
type PackedCircle = {
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The position of the circle
     */
    position: VectorData;
    /**
     * - The target position of the circle
     */
    targetPosition?: VectorData;
    /**
     * - The previous position of the circle
     */
    previousPosition: VectorData;
    /**
     * - The circle radius
     */
    radius: number;
    /**
     * - Is circle pinnd
     */
    isPinned?: boolean;
    /**
     * - Is circle pulled towards the target
     */
    isPulledToTarget?: boolean;
};
type CircleRef = PackedCircleData | PackedCircle | CircleID;
type PackedCircleMovementData = {
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The current position of the circle
     */
    position: VectorData;
    /**
     * - The previous position of the circle
     */
    previousPosition: VectorData;
    /**
     * - The radius of the circle
     */
    radius: number;
    /**
     * - The movement vector of the circle
     */
    delta: VectorData;
    /**
     * - Is the circle pulled towards the target
     */
    isPulledToTarget: boolean;
    /**
     * - Is the circle pinned
     */
    isPinned: boolean;
};
type CirclePackerMovementResult = {
    [key: string]: PackedCircleMovementData;
    [key: number]: PackedCircleMovementData;
};
type OverlapData = {
    /**
     * - The ID of the overlapping circle
     */
    overlappingCircleId: CircleID;
    /**
     * - The overlap distance (measured along the line between two circle centers)
     */
    overlapDistance: number;
};
type CirclePackerOverlappingCircles = {
    [key: string]: OverlapData[];
    [key: number]: OverlapData[];
};
type CircleData = {
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The position of the circle
     */
    position: VectorData;
    /**
     * - The circle radius
     */
    radius: number;
    /**
     * - Is the circle pinned? (pinned circles don't move)
     */
    isPinned?: boolean;
};
type WorkerMessage = {
    /**
     * - Unique ID of the message
     */
    messageId: number;
    /**
     * - Action that the worker should take
     */
    action: WorkerAction;
};
type BoundsPoints = {
    /**
     * - The first corner
     */
    point1: VectorData;
    /**
     * - The second corner
     */
    point2: VectorData;
};
type BoundsDimensions = {
    /**
     * - The bounds width
     */
    width: number;
    /**
     * - The bounds height
     */
    height: number;
    /**
     * - The bounds x position
     */
    x?: number;
    /**
     * - The bounds y position
     */
    y?: number;
};
type BoundsRect = {
    /**
     * - The bounds x position
     */
    left: number;
    /**
     * - The bounds y position
     */
    top: number;
    /**
     * - The bounds x2 position
     */
    right: number;
    /**
     * - The bounds y2 position
     */
    bottom: number;
};
type BoundsPositions = {
    /**
     * - The x value of the first corner
     */
    x1: number;
    /**
     * - The y value of the first corner
     */
    y1: number;
    /**
     * - The x value of the second corner
     */
    x2: number;
    /**
     * - The y value of the second corner
     */
    y2: number;
};
/**
 * - Data needed to construct a Bounds instance
 */
type BoundsData = BoundsDimensions | BoundsPoints | BoundsRect | BoundsPositions;
type SetBoundsAction = {
    type: 'SET_BOUNDS';
    /**
     * - The new bounds object
     */
    bounds: BoundsData;
};
type CenteringPassesAction = {
    type: 'SET_CENTERING_PASSES';
    /**
     * - The new number of centering passes
     */
    numberOfCenteringPasses: number;
};
type CollisionPassesAction = {
    type: 'SET_COLLISION_PASSES';
    /**
     * - The new number of collision passes
     */
    numberOfCollisionPasses: number;
};
type CorrectionPassesAction = {
    type: 'SET_CORRECTION_PASSES';
    /**
     * - The new number of correction passes
     */
    numberOfCorrectionPasses: number;
};
type CalculateOverlapAction = {
    type: 'SET_CALCULATE_OVERLAP';
    /**
     * - The new calculateOverlap value
     */
    calculateOverlap: boolean;
};
type DampingAction = {
    type: 'SET_DAMPING';
    /**
     * - The new damping value
     */
    damping: number;
};
type UpdateAction = {
    type: 'UPDATE';
};
type TargetPullAction = {
    type: 'SET_TARGET_PULL';
    /**
     * - The new target pull value
     */
    targetPull: boolean;
};
type AddCirclesAction = {
    type: 'ADD_CIRCLES';
    /**
     * - The new circles to add
     */
    circles: PackedCircleData[];
};
type RemoveCircleAction = {
    type: 'REMOVE_CIRCLE';
    /**
     * - The ID of the circle to remove
     */
    id: CircleID;
};
type DragStartAction = {
    type: 'DRAG_START';
    /**
     * - The ID of the circle
     */
    id: CircleID;
};
type DragEndAction = {
    type: 'DRAG_END';
    /**
     * - The ID of the circle
     */
    id: CircleID;
};
type DragMoveAction = {
    type: 'DRAG_MOVE';
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The new position of the circle
     */
    position: VectorData;
};
type CircleRadiusAction = {
    type: 'SET_CIRCLE_RADIUS';
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The new radius of the circle
     */
    radius: number;
};
type CircleTargetPullAction = {
    type: 'SET_CIRCLE_TARGET_PULL';
    /**
     * - The ID of the circle
     */
    id: CircleID;
    /**
     * - The new targetPull value
     */
    targetPull: boolean;
};
type PinCircleAction = {
    type: 'PIN_CIRCLE';
    /**
     * - The ID of the circle
     */
    id: CircleID;
};
type UnpinCircleAction = {
    type: 'UNPIN_CIRCLE';
    /**
     * - The ID of the circle
     */
    id: CircleID;
};
type SetTargetAction = {
    type: 'SET_TARGET';
    /**
     * - The new position of the attraction target
     */
    target: VectorData;
};
type WorkerAction = SetBoundsAction | CenteringPassesAction | CollisionPassesAction | CorrectionPassesAction | DampingAction | UpdateAction | TargetPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleTargetPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction;
type MoveResponse = {
    type: 'MOVED';
    /**
     * - An object containing all circle data
     */
    updatedCircles: CirclePackerMovementResult;
    /**
     * - The attraction target position
     */
    target?: VectorData;
    /**
     * - An object containing information about overlapping circles
     */
    overlappingCircles?: CirclePackerOverlappingCircles;
};
type MoveStartResponse = {
    type: 'MOVE_START';
};
type MoveEndResponse = {
    type: 'MOVE_END';
    /**
     * - An object containing all circle data
     */
    updatedCircles: CirclePackerMovementResult;
};
type WorkerResponse = MoveResponse | MoveStartResponse | MoveEndResponse;
type WorkerResponseCallback = (workerResponse: WorkerResponse) => void;
type PackParams = {
    /**
     * - The boundaries of the area
     */
    bounds?: BoundsData;
    /**
     * - The circles
     */
    circles?: PackedCircleData[];
    /**
     * - The attraction target
     */
    target?: VectorData;
    /**
     * - The number of centering passes
     */
    centeringPasses?: number;
    /**
     * - The number of collistion passes
     */
    collisionPasses?: number;
    /**
     * - The number of overlap correction passes
     */
    correctionPasses?: number;
    /**
     * - Calculate overlap for circles
     */
    calculateOverlap?: boolean;
    /**
     * - Set to false to skip using the Web Worker
     */
    useWorker?: boolean;
    /**
     * - The path to the webworker, only relevant if running the uncompiled source
     */
    workerPath?: string;
};
type PackResponse = {
    /**
     * - An object containing all circle data
     */
    updatedCircles: CirclePackerMovementResult;
    /**
     * - The attraction target position
     */
    target?: VectorData;
    /**
     * - An object containing information about overlapping circles
     */
    overlappingCircles?: CirclePackerOverlappingCircles;
};
//# sourceMappingURL=types.d.ts.map