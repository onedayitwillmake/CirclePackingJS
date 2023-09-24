/**
 * @typedef {Object} CirclePackerParams
 * @prop {OnMoveCallback}[onMove] - The onMove callback. Your render function goes here.
 * @prop {OnMoveStartCallback}[onMoveStart] - Function to execute after movement started
 * @prop {OnMoveEndCallback}[onMoveEnd] - Function to execute after movement ended
 * @prop {BoundsData} [bounds] - The boundaries of the area
 * @prop {PackedCircleData[]} [circles] - The circles
 * @prop {VectorData} [target] - The attraction target
 * @prop {boolean} [continuousMode=true] - Update the circle positions in a continuous animation loop?
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {number} [correctionPasses=3] - The number of overlap correction passes
 * @prop {boolean} [calculateOverlap=false] - Calculate overlap for circles
 * @prop {boolean} [useWorker=true] - Set to false to skip using the Web Worker
 * @prop {string} [workerPath] - The path to the webworker, only relevant if running the uncompiled source
 *
 * @callback OnMoveStartCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @returns {void}
 *
 * @callback OnMoveCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @param {VectorData} [target] - The attraction target position
 * @param {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 * @returns {void}
 *
 * @callback OnMoveEndCallback
 * @param {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @returns {void}
 *
 * @typedef {Object} VectorData
 * @prop {number} x - The X component of the vector
 * @prop {number} y - The Y component of the vector
 *
 * @typedef {number | string} CircleID
 *
 * @typedef {Object} PackedCircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} x - The X position of the circle
 * @prop {number} y - The Y position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToTarget=false] - Is circle pulled towards the target
 *
 * @typedef {Object} PackedCircle
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {VectorData} [targetPosition] - The target position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToTarget=false] - Is circle pulled towards the target
 *
 * @typedef {PackedCircleData | PackedCircle | CircleID} CircleRef
 *
 * @typedef {Object} PackedCircleMovementData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The current position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The radius of the circle
 * @prop {VectorData} delta - The movement vector of the circle
 * @prop {boolean} isPulledToTarget - Is the circle pulled towards the target
 * @prop {boolean} isPinned - Is the circle pinned
 *
 * @typedef {{[key: CircleID]: PackedCircleMovementData}} CirclePackerMovementResult
 *
 * @typedef OverlapData
 * @prop {CircleID} overlappingCircleId - The ID of the overlapping circle
 * @prop {number} overlapDistance - The overlap distance (measured along the line between two circle centers)
 *
 * @typedef {{[key: CircleID]: OverlapData[]}} CirclePackerOverlappingCircles
 *
 * @typedef {Object} CircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is the circle pinned? (pinned circles don't move)
 *
 * @typedef {CircleData | CircleID} CircleRef
 *
 * @typedef {Object} WorkerMessage
 * @prop {number} messageId - Unique ID of the message
 * @prop {WorkerAction} action - Action that the worker should take
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
 * @typedef {Object} BoundsRect
 * @prop {number} left - The bounds x position
 * @prop {number} top - The bounds y position
 * @prop {number} right - The bounds x2 position
 * @prop {number} bottom - The bounds y2 position
 *
 * @typedef {Object} BoundsPositions
 * @prop {number} x1 - The x value of the first corner
 * @prop {number} y1 - The y value of the first corner
 * @prop {number} x2 - The x value of the second corner
 * @prop {number} y2 - The y value of the second corner
 *
 * @typedef {BoundsDimensions | BoundsPoints | BoundsRect | BoundsPositions} BoundsData - Data needed to construct a Bounds instance
 *
 * @typedef {Object} SetBoundsAction
 * @prop {'SET_BOUNDS'} type
 * @prop {BoundsData} bounds - The new bounds object
 *
 * @typedef {Object} CenteringPassesAction
 * @prop {'SET_CENTERING_PASSES'} type
 * @prop {number} numberOfCenteringPasses - The new number of centering passes
 *
 * @typedef {Object} CollisionPassesAction
 * @prop {'SET_COLLISION_PASSES'} type
 * @prop {number} numberOfCollisionPasses - The new number of collision passes
 *
 * @typedef {Object} CorrectionPassesAction
 * @prop {'SET_CORRECTION_PASSES'} type
 * @prop {number} numberOfCorrectionPasses - The new number of correction passes
 *
 * @typedef {Object} CalculateOverlapAction
 * @prop {'SET_CALCULATE_OVERLAP'} type
 * @prop {boolean} calculateOverlap - The new calculateOverlap value
 *
 * @typedef {Object} DampingAction
 * @prop {'SET_DAMPING'} type
 * @prop {number} damping - The new damping value
 *
 * @typedef {Object} UpdateAction
 * @prop {'UPDATE'} type
 *
 * @typedef {Object} TargetPullAction
 * @prop {'SET_TARGET_PULL'} type
 * @prop {boolean} targetPull - The new target pull value
 *
 * @typedef {Object} AddCirclesAction
 * @prop {'ADD_CIRCLES'} type
 * @prop {PackedCircleData[]} circles - The new circles to add
 *
 * @typedef {Object} RemoveCircleAction
 * @prop {'REMOVE_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle to remove
 *
 * @typedef {Object} DragStartAction
 * @prop {'DRAG_START'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} DragEndAction
 * @prop {'DRAG_END'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} DragMoveAction
 * @prop {'DRAG_MOVE'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The new position of the circle
 *
 * @typedef {Object} CircleRadiusAction
 * @prop {'SET_CIRCLE_RADIUS'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} radius - The new radius of the circle
 *
 * @typedef {Object} CircleTargetPullAction
 * @prop {'SET_CIRCLE_TARGET_PULL'} type
 * @prop {CircleID} id - The ID of the circle
 * @prop {boolean} targetPull - The new targetPull value
 *
 * @typedef {Object} PinCircleAction
 * @prop {'PIN_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} UnpinCircleAction
 * @prop {'UNPIN_CIRCLE'} type
 * @prop {CircleID} id - The ID of the circle
 *
 * @typedef {Object} SetTargetAction
 * @prop {'SET_TARGET'} type
 * @prop {VectorData} target - The new position of the attraction target
 *
 * @typedef { SetBoundsAction | CenteringPassesAction | CollisionPassesAction | CorrectionPassesAction | DampingAction | UpdateAction | TargetPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleTargetPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction } WorkerAction
 *
 * @typedef {Object} MoveResponse
 * @prop {'MOVED'} type
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @prop {VectorData} [target] - The attraction target position
 * @prop {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 *
 * @typedef {Object} MoveStartResponse
 * @prop {'MOVE_START'} type
 *
 * @typedef {Object} MoveEndResponse
 * @prop {'MOVE_END'} type
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 *
 * @typedef { MoveResponse | MoveStartResponse | MoveEndResponse } WorkerResponse
 *
 * @callback WorkerResponseCallback
 * @param {WorkerResponse} workerResponse - The worker response that is sent via postMessage
 * @returns {void}
 *
 * @typedef {Object} PackParams
 * @prop {BoundsData} [bounds] - The boundaries of the area
 * @prop {PackedCircleData[]} [circles] - The circles
 * @prop {VectorData} [target] - The attraction target
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {number} [correctionPasses=3] - The number of overlap correction passes
 * @prop {boolean} [calculateOverlap=false] - Calculate overlap for circles
 * @prop {boolean} [useWorker=true] - Set to false to skip using the Web Worker
 * @prop {string} [workerPath] - The path to the webworker, only relevant if running the uncompiled source
 *
 * @typedef {Object} PackResponse
 * @prop {CirclePackerMovementResult} updatedCircles - An object containing all circle data
 * @prop {VectorData} [target] - The attraction target position
 * @prop {CirclePackerOverlappingCircles} [overlappingCircles] - An object containing information about overlapping circles
 */
