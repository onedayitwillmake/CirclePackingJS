declare module "Vector" {
    /**
     * Vector class
     *
     * Most of this code is taken from CirclePackingJS by @onedayitwillmake
     * https://github.com/onedayitwillmake/CirclePackingJS/blob/eb3475b/js-module/web/js/lib/Vector.js
     *
     */
    export default class Vector {
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
        constructor({ id, radius, x, y, isPulledToCenter, isPinned }: PackedCircleData);
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
        isPulledToCenter: boolean;
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
    import Vector from "Vector";
}
declare module "PackedCircleManager" {
    /**
     * The PackedCircleManager handles updating the state. It runs in a web worker
     *
     */
    export default class PackedCircleManager {
        /** @type {PackedCircle[]} */
        allCircles: PackedCircle[];
        /** @type {CircleID[]} */
        pinnedCircleIds: CircleID[];
        /** @type {Vector | undefined} */
        desiredTarget: Vector | undefined;
        /** @type {BoundsData} */
        bounds: BoundsData;
        /** @type {number} */
        damping: number;
        /** @type {number} */
        numberOfCenteringPasses: number;
        /** @type {number} */
        numberOfCollisionPasses: number;
        /** @type {boolean} */
        isCenterPullActive: boolean;
        /**
         * Set the boundary rectangle for the circle packing.
         * This is used to locate the 'center'
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
         * Ensure the circle stays inside the boundaries
         *
         * @param {PackedCircle} aCircle - The circle to check
         */
        handleBoundaryForCircle(aCircle: PackedCircle): void;
        draggedCircle: PackedCircle;
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
         * Update the centerPull value of a circle
         *
         * @param {CircleID} id - The id of the circle
         * @param {boolean} centerPull - The centerPull value
         */
        setCircleCenterPull(id: CircleID, centerPull: boolean): void;
        /**
         * Set a global centerPull value
         *
         * @param {boolean} centerPull - The global canterPull value
         */
        setCenterPull(centerPull: boolean): void;
        /**
         * Gets a circle by its id
         *
         * @param {CircleID} id - The id of the circle we want
         * @returns {PackedCircle | undefined}
         */
        circleById(id: CircleID): PackedCircle | undefined;
        /**
         * Sets the target position where the circles want to be
         * @param {VectorData} aPosition - The position of the centerPull target
         */
        setTarget(aPosition: VectorData): void;
    }
    import PackedCircle from "PackedCircle";
    import Vector from "Vector";
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
     * @returns {WorkerResponse | undefined}
     */
    export function processWorkerMessage(event: MessageEvent<string>): WorkerResponse | undefined;
    /**
     * Check if circle object is valid
     *
     * @export
     * @param {PackedCircle} circle - The circle to check
     * @returns {boolean}
     */
    export function isCircleValid(circle: PackedCircle): boolean;
    /**
     * Check if bounds object is valid
     *
     * @export
     * @param {BoundsData} bounds - The bounds object to check
     * @returns {boolean}
     */
    export function isBoundsValid(bounds: BoundsData): boolean;
    /**
     * Check if we can use id
     *
     * @export
     * @param {any} id - The id tp check
     * @returns {boolean}
     */
    export function isIdValid(id: any): boolean;
    /**
     * Coeck if number is in range
     *
     * @export
     * @param {any} number
     * @param {number} min
     * @param {number} max
     * @returns {boolean}
     */
    export function isNumberBetween(number: any, min: number, max: number): boolean;
    /**
     * Check if number is greater than
     *
     * @export
     * @param {any} number
     * @param {number} min
     * @returns {boolean}
     */
    export function isNumberGreaterThan(number: any, min: number): boolean;
    /**
     * Check if radius is valid
     *
     * @export
     * @param {any} point
     * @returns {boolean}
     */
    export function isPointValid(point: any): boolean;
    import PackedCircle from "PackedCircle";
}
declare module "CirclePackWorker" {
    export {};
}
declare module "CirclePacker" {
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
        constructor(params: CirclePackerParams);
        worker: Worker;
        isContinuousModeActive: boolean;
        onMoveStart: any;
        onMove: any;
        onMoveEnd: any;
        lastCirclePositions: any[];
        isLooping: boolean;
        areItemsMoving: boolean;
        animationFrameId: number;
        initialized: boolean;
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
         * Update the callbacks
         *
         * @param {WorkerResponse} response
         */
        updateListeners(response: WorkerResponse): void;
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
         * Set centerPull value of a Circle
         *
         * @param {CircleRef} circleRef - The circle
         * @param {boolean} centerPull - The new centerPull value
         */
        setCircleCenterPull(circleRef: CircleRef, centerPull: boolean): void;
        /**
         * Set global center pull value
         *
         * @param {boolean} centerPull - The new centerPull value
         */
        setCenterPull(centerPull: boolean): void;
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
         * @throws Will throw an error if the number of centering passes is malformed
         * @param {number} numberOfCenteringPasses - The new number of centering passes. Expects a number >= 1
         */
        setCenteringPasses(numberOfCenteringPasses: number): void;
        /**
         * Sets the number of collision passes
         *
         * @throws Will throw an error if the number of collision passes is malformed
         * @param {number} numberOfCollisionPasses - Sets the new number of collision passes. Expects a number >= 1
         */
        setCollisionPasses(numberOfCollisionPasses: number): void;
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
type VectorData = {
    /**
     * - The X component
     */
    x: number;
    /**
     * - The Y component
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
     * - Is circle pulled to center
     */
    isPulledToCenter?: boolean;
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
     * - Is circle pulled to center
     */
    isPulledToCenter?: boolean;
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
     * - Is the circle pulled to center
     */
    isPulledToCenter: boolean;
    /**
     * - Is the circle pinned
     */
    isPinned: boolean;
};
type CirclePackerMovementResult = {
    [key: string]: PackedCircleMovementData;
    [key: number]: PackedCircleMovementData;
};
type CirclePackerParams = {
    /**
     * - The boundaries of the area
     */
    bounds: BoundsData;
    /**
     * - The circles
     */
    circles: PackedCircleData[];
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
     * - The path to the webworker
     */
    workerPath?: string;
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
type ForcePoint = {
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
    force: number;
    minDistance?: number;
    maxDistance?: number;
    forceAtMaxDistance?: number;
    /**
     * - References to the attracted circles
     */
    attractedCircles?: CircleRef[];
};
type WorkerMessage = {
    messageId: number;
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
type BoundsDirections = {
    /**
     * - The bounds x position
     */
    left: number;
    /**
     * - The bounds y position
     */
    topt: number;
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
type BoundsData = BoundsDimensions;
type SetBoundsAction = {
    type: 'SET_BOUNDS';
    bounds: BoundsData;
};
type CenteringPassesAction = {
    type: 'SET_CENTERING_PASSES';
    numberOfCenteringPasses: number;
};
type CollisionPassesAction = {
    type: 'SET_COLLISION_PASSES';
    numberOfCollisionPasses: number;
};
type DampingAction = {
    type: 'SET_DAMPING';
    damping: number;
};
type UpdateAction = {
    type: 'UPDATE';
};
type CenterPullAction = {
    type: 'SET_CENTER_PULL';
    centerPull: boolean;
};
type AddCirclesAction = {
    type: 'ADD_CIRCLES';
    circles: PackedCircleData[];
};
type RemoveCircleAction = {
    type: 'REMOVE_CIRCLE';
    id: CircleID;
    circles: PackedCircleData[];
};
type DragStartAction = {
    type: 'DRAG_START';
    id: CircleID;
};
type DragEndAction = {
    type: 'DRAG_END';
    id: CircleID;
};
type DragMoveAction = {
    type: 'DRAG_MOVE';
    id: CircleID;
    position: VectorData;
};
type CircleRadiusAction = {
    type: 'SET_CIRCLE_RADIUS';
    id: CircleID;
    radius: number;
};
type CircleCenterPullAction = {
    type: 'SET_CIRCLE_CENTER_PULL';
    id: CircleID;
    centerPull: boolean;
};
type PinCircleAction = {
    type: 'PIN_CIRCLE';
    id: CircleID;
};
type UnpinCircleAction = {
    type: 'UNPIN_CIRCLE';
    id: CircleID;
};
type SetTargetAction = {
    type: 'SET_TARGET';
    target: VectorData;
};
type WorkerAction = SetBoundsAction | CenteringPassesAction | CollisionPassesAction | DampingAction | UpdateAction | CenterPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleCenterPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction;
type MoveResponse = {
    type: 'MOVED';
    updatedCircles: CirclePackerMovementResult;
};
type MoveStartResponse = {
    type: 'MOVE_START';
};
type MoveEndResponse = {
    type: 'MOVE_END';
    updatedCircles: CirclePackerMovementResult;
};
type WorkerResponse = MoveResponse | MoveStartResponse | MoveEndResponse;
//# sourceMappingURL=types.d.ts.map