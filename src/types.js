/**
 * @typedef {Object} CirclePackerParams
 * @prop {BoundsData} bounds - The boundaries of the area
 * @prop {PackedCircleData[]} circles - The circles
 * @prop {boolean} [continuousMode=true] - Update the circle positions in a continuous animation loop?
 * @prop {number} [centeringPasses=1] - The number of centering passes
 * @prop {number} [collisionPasses=3] - The number of collistion passes
 * @prop {string} [workerPath] - The path to the webworker
 *
 * @typedef {Object} VectorData
 * @prop {number} x - The X component
 * @prop {number} y - The Y component
 *
 * @typedef {number | string} CircleID
 *
 * @typedef {Object} PackedCircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {number} x - The X position of the circle
 * @prop {number} y - The Y position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToCenter=false] - Is circle pulled to center
 *
 * @typedef {Object} PackedCircle
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {VectorData} [targetPosition] - The target position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is circle pinnd
 * @prop {boolean} [isPulledToCenter=false] - Is circle pulled to center
 *
 * @typedef {PackedCircleData | PackedCircle | CircleID} CircleRef
 *
 * @typedef {Object} PackedCircleMovementData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The current position of the circle
 * @prop {VectorData} previousPosition - The previous position of the circle
 * @prop {number} radius - The radius of the circle
 * @prop {VectorData} delta - The movement vector of the circle
 * @prop {boolean} isPulledToCenter - Is the circle pulled to center
 * @prop {boolean} isPinned - Is the circle pinned
 *
 * @typedef {{[key: CircleID]: PackedCircleMovementData}} CirclePackerMovementResult
 *
 * @typedef {Object} CircleData
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {boolean} [isPinned=false] - Is the circle pinned? (pinned circles don't move)
 *
 * @typedef {Object} ForcePoint
 * @prop {CircleID} id - The ID of the circle
 * @prop {VectorData} position - The position of the circle
 * @prop {number} radius - The circle radius
 * @prop {number} force
 * @prop {number} [minDistance]
 * @prop {number} [maxDistance]
 * @prop {number} [forceAtMaxDistance]
 * @prop {CircleRef[]} [attractedCircles] - References to the attracted circles
 *
 * @typedef {CircleData | CircleID} CircleRef
 *
 * @typedef {Object} WorkerMessage
 * @prop {number} messageId
 * @prop {WorkerAction} action
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
 * @typedef {Object} BoundsDirections
 * @prop {number} left - The bounds x position
 * @prop {number} topt - The bounds y position
 * @prop {number} right - The bounds x2 position
 * @prop {number} bottom - The bounds y2 position
 *
 * @typedef {Object} BoundsPositions
 * @prop {number} x1 - The x value of the first corner
 * @prop {number} y1 - The y value of the first corner
 * @prop {number} x2 - The x value of the second corner
 * @prop {number} y2 - The y value of the second corner
 *
 * @typedef {BoundsDimensions} BoundsData - Data needed to construct a Bounds instance
 *
 * @typedef {Object} SetBoundsAction
 * @prop {'SET_BOUNDS'} type
 * @prop {BoundsData} bounds
 *
 * @typedef {Object} CenteringPassesAction
 * @prop {'SET_CENTERING_PASSES'} type
 * @prop {number} numberOfCenteringPasses
 *
 * @typedef {Object} CollisionPassesAction
 * @prop {'SET_COLLISION_PASSES'} type
 * @prop {number} numberOfCollisionPasses
 *
 * @typedef {Object} DampingAction
 * @prop {'SET_DAMPING'} type
 * @prop {number} damping
 *
 * @typedef {Object} UpdateAction
 * @prop {'UPDATE'} type
 *
 * @typedef {Object} CenterPullAction
 * @prop {'SET_CENTER_PULL'} type
 * @prop {boolean} centerPull
 *
 * @typedef {Object} AddCirclesAction
 * @prop {'ADD_CIRCLES'} type
 * @prop {PackedCircleData[]} circles
 *
 * @typedef {Object} RemoveCircleAction
 * @prop {'REMOVE_CIRCLE'} type
 * @prop {CircleID} id
 * @prop {PackedCircleData[]} circles
 *
 * @typedef {Object} DragStartAction
 * @prop {'DRAG_START'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} DragEndAction
 * @prop {'DRAG_END'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} DragMoveAction
 * @prop {'DRAG_MOVE'} type
 * @prop {CircleID} id
 * @prop {VectorData} position
 * @prop {CircleID} id
 *
 * @typedef {Object} CircleRadiusAction
 * @prop {'SET_CIRCLE_RADIUS'} type
 * @prop {CircleID} id
 * @prop {number} radius
 * @prop {CircleID} id
 *
 * @typedef {Object} CircleCenterPullAction
 * @prop {'SET_CIRCLE_CENTER_PULL'} type
 * @prop {CircleID} id
 * @prop {boolean} centerPull
 * @prop {CircleID} id
 *
 * @typedef {Object} PinCircleAction
 * @prop {'PIN_CIRCLE'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} UnpinCircleAction
 * @prop {'UNPIN_CIRCLE'} type
 * @prop {CircleID} id
 *
 * @typedef {Object} SetTargetAction
 * @prop {'SET_TARGET'} type
 * @prop {VectorData} target
 *
 * @typedef { SetBoundsAction | CenteringPassesAction | CollisionPassesAction | DampingAction | UpdateAction | CenterPullAction | AddCirclesAction | RemoveCircleAction | DragStartAction | DragMoveAction | DragEndAction | CircleRadiusAction | CircleCenterPullAction | PinCircleAction | UnpinCircleAction | SetTargetAction } WorkerAction
 *
 * @typedef {Object} MoveResponse
 * @prop {'MOVED'} type
 * @prop {CirclePackerMovementResult} updatedCircles
 *
 * @typedef {Object} MoveStartResponse
 * @prop {'MOVE_START'} type
 *
 * @typedef {Object} MoveEndResponse
 * @prop {'MOVE_END'} type
 * @prop {CirclePackerMovementResult} updatedCircles
 *
 * @typedef { MoveResponse | MoveStartResponse | MoveEndResponse } WorkerResponse
 */
