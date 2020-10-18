(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.CirclePacker = factory());
}(this, (function () { 'use strict';

function sendWorkerMessage ( worker, msg ) {
	worker.postMessage( JSON.stringify( msg ) );
}

function processWorkerMessage ( event ) {
	return event.data ? JSON.parse( event.data ) : { };
}

function isCircleValid ( circle ) {
	return circle &&
		circle.id &&
		circle.radius &&
		circle.position &&
		typeof circle.position.x === 'number' &&
		typeof circle.position.y === 'number'
}

function isBoundsValid ( bounds ) {
	return bounds &&
		typeof bounds.width === 'number' &&
		typeof bounds.height === 'number'
}

// this class keeps track of the drawing loop in continuous drawing mode
// and passes messages to the worker
var CirclePacker = function CirclePacker ( params ) {
	if ( params === void 0 ) params = { };

	this.worker = new Worker( URL.createObjectURL(new Blob(["// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/lib/Vector.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nvar Vector = function Vector ( x, y ) {\n\tif ( typeof x === 'object' ) {\n\t\tthis.x = x.x;\n\t\tthis.y = x.y;\n\t} else {\n\t\tthis.x = x;\n\t\tthis.y = y;\n\t}\n};\n\nVector.prototype.cp = function cp () {\n\treturn new Vector( this.x, this.y );\n};\n\nVector.prototype.mul = function mul ( factor ) {\n\tthis.x *= factor;\n\tthis.y *= factor;\n\treturn this;\n};\n\nVector.prototype.normalize = function normalize () {\n\tvar l = this.length();\n\tthis.x /= l;\n\tthis.y /= l;\n\treturn this;\n};\n\nVector.prototype.length = function length () {\n\tvar length = Math.sqrt( this.x * this.x + this.y * this.y );\n\t\t\n\tif ( length < 0.005 && length > -0.005 ) {\n\t\treturn 0.000001;\n\t}\n\n\treturn length;\n};\n\nVector.prototype.distance = function distance ( vec ) {\n\tvar deltaX = this.x - vec.x;\n\tvar deltaY = this.y - vec.y;\n\treturn Math.sqrt( ( deltaX * deltaX ) + ( deltaY * deltaY ) );\n};\n\nVector.prototype.distanceSquared = function distanceSquared ( vec ) {\n\tvar deltaX = this.x - vec.x;\n\tvar deltaY = this.y - vec.y;\n\treturn ( deltaX * deltaX ) + ( deltaY * deltaY );\n};\n\n// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nvar PackedCircle = function PackedCircle ( ref ) {\n\tvar id = ref.id;\n\tvar radius = ref.radius;\n\tvar x = ref.x;\n\tvar y = ref.y;\n\tvar isPulledToCenter = ref.isPulledToCenter;\n\tvar isPinned = ref.isPinned;\n\n\tx = x || 0;\n\ty = y || 0;\n\n\tthis.id = id;                      \n\n\t// Where we would like to be\n\tthis.targetPosition = new Vector( 0, 0 );\n\t// Where we really are\n\tthis.position = new Vector( x, y );\n\tthis.previousPosition = new Vector( x, y );\n\n\t// For the div stuff  - to avoid superflous movement calls\n\t  this.positionWithOffset = new Vector( x, y );\n\tthis.previousPositionWithOffset = new Vector( x, y );\n\n\tthis.isPulledToCenter = isPulledToCenter;\n\tthis.isPinned = isPinned;\n\n\t// Stored because transform3D is relative\n\tthis.setRadius( radius );\n};\n\nvar prototypeAccessors = { delta: {} };\n\nPackedCircle.prototype.setPosition = function setPosition ( aPosition ) {\n\tthis.previousPosition = this.position;\n\tthis.position = aPosition.cp();\n};\n\nPackedCircle.prototype.distanceSquaredFromTargetPosition = function distanceSquaredFromTargetPosition () {\n\tvar distanceSquared = this.position.distanceSquared( this.targetPosition );\n\t// if it's shorter than either radi, we intersect\n\treturn distanceSquared < this.radiusSquared;\n};\n\nPackedCircle.prototype.setRadius = function setRadius ( aRadius ) {\n\tthis.radius = aRadius;\n\tthis.radiusSquared = aRadius * aRadius;\n\tthis.originalRadius = aRadius;\n};\n\nprototypeAccessors.delta.get = function () {\n\treturn new Vector(\n\t\tthis.position.x - this.previousPosition.x,\n\t\tthis.position.y - this.previousPosition.y\n\t);\n};\n\nObject.defineProperties( PackedCircle.prototype, prototypeAccessors );\n\n// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nvar PackedCircleManager = function PackedCircleManager () {\n\tthis.allCircles = [ ];\n\tthis.pinnedCircleIds = [ ];\n\tthis.desiredTarget = new Vector( 0, 0 );\n\tthis.bounds = { left: 0, top: 0, right: 0, bottom: 0 };\n\tthis.damping = 0.025;\n\n\t// Number of passes for the centering and collision\n\t// algorithms - it's (O)logN^2 so use increase at your own risk!\n\t// Play with these numbers - see what works best for your project\n\tthis.numberOfCenteringPasses = 1;\n\tthis.numberOfCollisionPasses = 3;\n\n\tthis.isCenterPullActive = true;\n};\n\n/**\n\t * Set the boundary rectangle for the circle packing.\n\t * This is used to locate the 'center'\n\t * @param aBoundaryObject\n\t */\nPackedCircleManager.prototype.setBounds = function setBounds ( aBoundaryObject ) {\n\tif ( typeof aBoundaryObject.left === 'number' ) {\n\t\tthis.bounds.left = aBoundaryObject.left;\n\t}\n\n\tif ( typeof aBoundaryObject.right === 'number' ) {\n\t\tthis.bounds.right = aBoundaryObject.right;\n\t}\n\n\tif ( typeof aBoundaryObject.top === 'number' ) {\n\t\tthis.bounds.top = aBoundaryObject.top;\n\t}\n\n\tif ( typeof aBoundaryObject.bottom === 'number' ) {\n\t\tthis.bounds.bottom = aBoundaryObject.bottom;\n\t}\n\n\tif ( typeof aBoundaryObject.width === 'number' ) {\n\t\tthis.bounds.right = this.bounds.left + aBoundaryObject.width;\n\t}\n\n\tif ( typeof aBoundaryObject.height === 'number' ) {\n\t\tthis.bounds.bottom = this.bounds.top + aBoundaryObject.height;\n\t}\n};\n\n/**\n\t * Add a circle\n\t * @param aCircle A Circle to add, should already be created.\n\t */\nPackedCircleManager.prototype.addCircle = function addCircle ( aCircle ) {\n\tif ( ! ( aCircle instanceof PackedCircle ) ) {\n\t\taCircle = new PackedCircle( {\n\t\t\tid: aCircle.id,\n\t\t\tradius: aCircle.radius,\n\t\t\tx: aCircle.position.x || 0,\n\t\t\ty: aCircle.position.y || 0,\n\t\t\tisPinned: aCircle.isPinned || false,\n\t\t\tisPulledToCenter: typeof aCircle.isPulledToCenter === 'boolean' ? aCircle.isPulledToCenter : true\n\t\t} );\n\t}\n\n\tthis.allCircles.push( aCircle );\n\taCircle.targetPosition = this.desiredTarget.cp();\n};\n\n/**\n\t * Remove a circle\n\t * @param circleToRemoveId Id of the circle to remove\n\t */\nPackedCircleManager.prototype.removeCircle = function removeCircle ( circleToRemoveId ) {\n\t\tvar this$1 = this;\n\n\tvar indicesToRemove = this.allCircles.reduce( function ( indices, circle, index ) {\n\t\tif ( circle.id === circleToRemoveId ) {\n\t\t\tindices.push( index );\n\t\t}\n\n\t\treturn indices;\n\t}, [ ] );\n\n\tfor ( var n = indicesToRemove.length - 1; n >= 0; n-- ) {\n\t\tthis$1.allCircles.splice( indicesToRemove[n], 1 );\n\t}\n};\n\n/**\n\t * Recalculate all circle positions\n\t */\nPackedCircleManager.prototype.updatePositions = function updatePositions () {\n\t\tvar this$1 = this;\n\n\tvar circleList = this.allCircles;\n\tvar circleCount = circleList.length;\n\n\t// store information about the previous position\n\tfor ( var i = 0; i < circleCount; ++i ) {\n\t\tvar circle = circleList[i];\n\n\t\tcircle.previousPosition = circle.position.cp();\n\t}\n\n\tif ( this.desiredTarget && this.isCenterPullActive ) {\n\t\t// Push all the circles to the target - in my case the center of the bounds\n\t\tthis.pushAllCirclesTowardTarget( this.desiredTarget );\n\t}\n\t\t\n\t// Make the circles collide and adjust positions to move away from each other\n\tthis.handleCollisions();\n\n\t// store information about the previous position\n\tfor ( var i$1 = 0; i$1 < circleCount; ++i$1 ) {\n\t\tvar circle$1 = circleList[i$1];\n\n\t\tthis$1.handleBoundaryForCircle( circle$1 );\n\t}\n};\n\nPackedCircleManager.prototype.pushAllCirclesTowardTarget = function pushAllCirclesTowardTarget ( aTarget ) {\n\t\tvar this$1 = this;\n\n\tvar v = new Vector( 0, 0 );\n\n\tvar dragCircle = this.draggedCircle;\n\tvar circleList = this.allCircles;\n\tvar circleCount = circleList.length;\n\n\tfor ( var n = 0; n < this.numberOfCenteringPasses; n++ ) {\t\t\t\n\t\tfor ( var i = 0; i < circleCount; i++ ) {\n\t\t\tvar circle = circleList[i];\n\t\t\t\t\n\t\t\tif ( circle.isPulledToCenter ) {\n\t\t\t\t// Kinematic circles can't be pushed around.\n\t\t\t\tvar isCircleKinematic = circle === dragCircle || this$1.isCirclePinned( circle.id );\n\n\t\t\t\tif ( isCircleKinematic ) {\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tv.x = circle.position.x - aTarget.x;\n\t\t\t\tv.y = circle.position.y - aTarget.y;\n\t\t\t\tv.mul ( this$1.damping );\n\t\t\t\t\t\n\t\t\t\tcircle.position.x -= v.x;\n\t\t\t\tcircle.position.y -= v.y;\n\t\t\t}\n\t\t}\n\t}\n};\n\n/**\n\t * Packs the circles towards the center of the bounds.\n\t * Each circle will have it's own 'targetPosition' later on\n\t */\nPackedCircleManager.prototype.handleCollisions = function handleCollisions () {\n\t\tvar this$1 = this;\n\n\tvar v = new Vector( 0, 0 );\n\n\tvar dragCircle = this.draggedCircle;\n\tvar circleList = this.allCircles;\n\tvar circleCount = circleList.length;\n\n\t// Collide circles\n\tfor ( var n = 0; n < this.numberOfCollisionPasses; n++ ) {\n\t\tfor ( var i = 0; i < circleCount; i++ ) {\n\t\t\tvar circleA = circleList[i];\n\t\t\t\t\n\t\t\tfor ( var j = i + 1; j < circleCount; j++ ) {\n\t\t\t\tvar circleB = circleList[j];\n\n\t\t\t\tvar isCircleAPinned = this$1.isCirclePinned( circleA.id );\n\t\t\t\tvar isCircleBPinned = this$1.isCirclePinned( circleB.id );\n\n\t\t\t\t// Kinematic circles can't be pushed around.\n\t\t\t\tvar isCircleAKinematic = circleA === dragCircle || isCircleAPinned;\n\t\t\t\tvar isCircleBKinematic = circleB === dragCircle || isCircleBPinned;\n\t\t\t\t\t\n\t\t\t\tif (\n\t\t\t\t\t// It's us!\n\t\t\t\t\tcircleA === circleB ||\n\n\t\t\t\t\t// Kinematic circles don't interact with eachother\n\t\t\t\t\t( isCircleAKinematic && isCircleBKinematic )\n\t\t\t\t) {\n\t\t\t\t\tcontinue; \n\t\t\t\t}\n\n\t\t\t\tvar dx = circleB.position.x - circleA.position.x;\n\t\t\t\tvar dy = circleB.position.y - circleA.position.y;\n\n\t\t\t\t// The distance between the two circles radii, \n\t\t\t\t// but we're also gonna pad it a tiny bit \n\t\t\t\tvar r = ( circleA.radius + circleB.radius ) * 1.08;\n\t\t\t\tvar d = circleA.position.distanceSquared( circleB.position );\n\n\t\t\t\tif ( d < ( r * r ) - 0.02 ) {\n\t\t\t\t\tv.x = dx;\n\t\t\t\t\tv.y = dy;\n\t\t\t\t\tv.normalize();\n\n\t\t\t\t\tvar inverseForce = ( r - Math.sqrt( d ) ) * 0.5;\n\t\t\t\t\tv.mul( inverseForce );\n\t\t\t\t\t\t\n\t\t\t\t\tif ( ! isCircleBKinematic ) {\n\t\t\t\t\t\tif ( isCircleAKinematic ) {\n\t\t\t\t\t\t\t// Double inverse force to make up \n\t\t\t\t\t\t\t// for the fact that the other object is fixed\n\t\t\t\t\t\t\tv.mul( 2.2 );\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tcircleB.position.x += v.x;\n\t\t\t\t\t\tcircleB.position.y += v.y;\n\t\t\t\t\t}\n\n\t\t\t\t\tif ( ! isCircleAKinematic ) {\n\t\t\t\t\t\tif ( isCircleBKinematic ) {\n\t\t\t\t\t\t\t// Double inverse force to make up \n\t\t\t\t\t\t\t// for the fact that the other object is fixed\n\t\t\t\t\t\t\tv.mul( 2.2 );\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tcircleA.position.x -= v.x;\n\t\t\t\t\t\tcircleA.position.y -= v.y;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n};\n\nPackedCircleManager.prototype.handleBoundaryForCircle = function handleBoundaryForCircle ( aCircle ) {\t\t\n\tvar x = aCircle.position.x;\n\tvar y = aCircle.position.y;\n\tvar radius = aCircle.radius;\n\t\t\n\tvar overEdge = false;\n\n\tif ( x + radius >= this.bounds.right ) {\n\t\taCircle.position.x = this.bounds.right - radius;\n\t\toverEdge = true;\n\t} else if ( x - radius < this.bounds.left ) {\n\t\taCircle.position.x = this.bounds.left + radius;\n\t\toverEdge = true;\n\t}\n\n\tif ( y + radius > this.bounds.bottom ) {\n\t\taCircle.position.y = this.bounds.bottom - radius;\n\t\toverEdge = true;\n\t} else if ( y - radius < this.bounds.top ) {\n\t\taCircle.position.y = this.bounds.top + radius;\n\t\toverEdge = true;\n\t}\n\n\t// end dragging if user dragged over edge\n\tif ( overEdge && aCircle === this.draggedCircle ) {\n\t\tthis.draggedCircle = null;\n\t}\n};\n\n/**\n\t * Force a certain circle to be the 'draggedCircle'.\n\t * Can be used to undrag a circle by calling setDraggedCircle(null)\n\t * @param aCircle  Circle to start dragging. It's assumed to be part of our list. No checks in place currently.\n\t */\nPackedCircleManager.prototype.setDraggedCircle = function setDraggedCircle ( aCircle ) {\n\t// Setting to null, and we had a circle before.\n\t// Restore the radius of the circle as it was previously\n\tif ( this.draggedCircle && this.draggedCircle !== aCircle ) {\n\t\tthis.draggedCircle.radius = this.draggedCircle.originalRadius;\n\t}\n\n\tthis.draggedCircle = aCircle;\n};\n\nPackedCircleManager.prototype.dragStart = function dragStart ( id ) {\n\tvar draggedCircle = this.allCircles.filter( function (circle) { return circle.id === id; } )[0];\n\tthis.setDraggedCircle( draggedCircle );\n};\n\nPackedCircleManager.prototype.dragEnd = function dragEnd ( id ) {\n\tif ( this.draggedCircle ) {\n\t\tthis.setDraggedCircle( null );\n\t}\n};\n\nPackedCircleManager.prototype.drag = function drag ( id, position ) {\n\tif ( this.draggedCircle && position ) {\n\t\tthis.draggedCircle.position.x = position.x;\n\t\tthis.draggedCircle.position.y = position.y;\n\t}\n};\n\nPackedCircleManager.prototype.isCirclePinned = function isCirclePinned ( id ) {\n\tvar circle = this.circleById( id );\n\n\tif ( circle ) {\n\t\treturn circle.isPinned;\n\t}\n\n\treturn false;\n};\n\nPackedCircleManager.prototype.pinCircle = function pinCircle ( id ) {\n\tvar circle = this.circleById( id );\n\n\tif ( circle ) {\n\t\tcircle.isPinned = true;\n\t}\n};\n\nPackedCircleManager.prototype.unpinCircle = function unpinCircle ( id ) {\n\tvar circle = this.circleById( id );\n\n\tif ( circle ) {\n\t\tcircle.isPinned = false;\n\t}\n};\n\nPackedCircleManager.prototype.setCircleRadius = function setCircleRadius ( id, radius ) {\n\tvar circle = this.circleById( id );\n\n\tif ( circle ) {\n\t\tcircle.setRadius( radius );\n\t}\n};\n\nPackedCircleManager.prototype.setCircleCenterPull = function setCircleCenterPull ( id, centerPull ) {\n\tvar circle = this.circleById( id );\n\n\tif ( circle ) {\n\t\tcircle.isPulledToCenter = centerPull;\n\t}\n};\n\nPackedCircleManager.prototype.setCenterPull = function setCenterPull ( centerPull ) {\n\tthis.isCenterPullActive = centerPull;\n};\n\nPackedCircleManager.prototype.circleById = function circleById ( id ) {\n\treturn this.allCircles.filter( function (circle) { return circle.id === id; } )[0];\n};\n\n/**\n\t * Sets the target position where the circles want to be\n\t * @param aPosition\n\t */\nPackedCircleManager.prototype.setTarget = function setTarget ( aPosition ) {\n\tthis.desiredTarget = aPosition;\n};\n\nfunction sendWorkerMessage ( worker, msg ) {\n\tworker.postMessage( JSON.stringify( msg ) );\n}\n\nfunction processWorkerMessage ( event ) {\n\treturn event.data ? JSON.parse( event.data ) : { };\n}\n\n// this code is mostly for message passing between the \n// PackedCircleManager and CirclePacker classes\n\nself.addEventListener( 'message', receivedMessage );\n\nvar circleManager = new PackedCircleManager();\n\nfunction receivedMessage ( event ) {\n\tvar ref = processWorkerMessage( event );\n\tvar type = ref.type;\n\tvar message = ref.message;\n\n\tif ( type === 'bounds' )  {\n\t\tcircleManager.setBounds( message );\n\t}\n\n\tif ( type === 'target' )  {\n\t\tsetTarget( message );\n\t}\n\n\tif ( type === 'addcircles' ) {\n\t\taddCircles( message );\n\t}\n\n\tif ( type === 'removecircle' ) {\n\t\tcircleManager.removeCircle( message );\n\t}\n\n\tif ( type === 'update' ) {\n\t\tupdate();\n\t}\n\n\tif ( type === 'dragstart' ) {\n\t\tcircleManager.dragStart( message.id, message.position );\n\t}\n\n\tif ( type === 'drag' ) {\n\t\tcircleManager.drag( message.id, message.position );\n\t}\n\n\tif ( type === 'dragend' ) {\n\t\tcircleManager.dragEnd( message.id );\n\t}\n\n\tif ( type === 'pincircle' ) {\n\t\tcircleManager.pinCircle( message );\n\t}\n\n\tif ( type === 'unpincircle' ) {\n\t\tcircleManager.unpinCircle( message );\n\t}\n\n\tif ( type === 'centeringpasses' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.numberOfCenteringPasses = message;\n\t\t}\n\t}\n\n\tif ( type === 'collisionpasses' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.numberOfCollisionPasses = message;\n\t\t}\n\t}\n\n\tif ( type === 'damping' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.damping = message;\n\t\t}\n\t}\n\n\tif ( type === 'circleradius' ) {\n\t\tcircleManager.setCircleRadius( message.id, message.radius );\n\t}\n\n\tif ( type === 'circlecenterpull' ) {\n\t\tcircleManager.setCircleCenterPull( message.id, message.centerPull );\n\t}\n\n\tif ( type === 'centerpull' ) {\n\t\tcircleManager.setCenterPull( message.centerPull );\n\t}\n}\n\nfunction updatePage ( type, message ) {\n\tsendWorkerMessage( self, { type: type, message: message } );\n}\n\nfunction addCircles ( circles ) {\n\tif ( Array.isArray( circles ) && circles.length ) {\n\t\tcircles.forEach( circleManager.addCircle.bind( circleManager ) );\n\t}\n}\n\nfunction setTarget ( target ) {\n\tif ( target && typeof target.x === 'number' && typeof target.y === 'number' ) {\n\t\tcircleManager.setTarget( new Vector( target ) );\n\t}\n}\n\nfunction update () {\n\tcircleManager.updatePositions();\n\n\tsendPositions();\n}\n\nfunction sendPositions () {\n\tvar positions = circleManager.allCircles.reduce( function ( result, circle ) {\n\t\tresult[circle.id] = {\n\t\t\tposition: circle.position,\n\t\t\tpreviousPosition: circle.previousPosition,\n\t\t\tradius: circle.radius,\n\t\t\tdelta: circle.delta,\n\t\t\tisPulledToCenter: circle.isPulledToCenter,\n\t\t\tisPinned: circle.isPinned\n\t\t};\n\n\t\treturn result;\n\t}, { } );\n\n\tupdatePage( 'move', positions );\n}\n"],{type:'text/javascript'})) );
	this.worker.addEventListener( 'message', this.receivedWorkerMessage.bind( this ) );
		
	this.isContinuousModeActive = typeof params.continuousMode === 'boolean' ? params.continuousMode : true;

	this.onMoveStart = params.onMoveStart || null;
	this.onMove = params.onMove || null;
	this.onMoveEnd = params.onMoveEnd || null;

	if ( params.centeringPasses ) {
		this.setCenteringPasses( params.centeringPasses );
	}

	if ( params.collisionPasses ) {
		this.setCollisionPasses( params.collisionPasses );
	}

	this.addCircles( params.circles || [ ] );
	this.setBounds( params.bounds || { width: 100, height: 100 } );
	this.setTarget( params.target || { x: 50, y: 50 } );

	this.isLooping = false;
	this.areItemsMoving = true;
	this.animationFrameId = NaN;

	this.initialized = true;

	if ( this.isContinuousModeActive ) {
		this.startLoop();
	}
};

CirclePacker.prototype.receivedWorkerMessage = function receivedWorkerMessage ( event ) {
	var msg = processWorkerMessage( event );

	if ( msg.type === 'move' ) {
		var newPositions = msg.message;						
		this.areItemsMoving = this.hasItemMoved( newPositions );
	}

	this.updateListeners( msg );
};

CirclePacker.prototype.updateWorker = function updateWorker ( type, message ) {
	sendWorkerMessage( this.worker, { type: type, message: message } );
};

CirclePacker.prototype.updateListeners = function updateListeners ( ref ) {
		var type = ref.type;
		var message = ref.message;

	if ( type === 'movestart' && typeof this.onMoveStart === 'function' ) {
		this.onMoveStart( message );
	}
		
	if ( type === 'move' && typeof this.onMove === 'function' ) {
		this.onMove( message );
	}

	if ( type === 'moveend' && typeof this.onMoveEnd === 'function' ) {
		this.onMoveEnd( message );
	}
};

CirclePacker.prototype.addCircles = function addCircles ( circles ) {
	if ( Array.isArray( circles ) && circles.length ) {
		var circlesToAdd = circles.filter( isCircleValid );

		if ( circlesToAdd.length ) {
			this.updateWorker( 'addcircles', circlesToAdd );
		}
	}

	this.startLoop();
};

CirclePacker.prototype.addCircle = function addCircle ( circle ) {
	this.addCircles( [ circle ] );
};

CirclePacker.prototype.removeCircle = function removeCircle ( circle ) {
	if ( circle ) {
		if ( circle.id ) {
			this.updateWorker( 'removecircle', circle.id );
		} else {
			this.updateWorker( 'removecircle', circle );
		}

		this.startLoop();
	}
};

CirclePacker.prototype.pinCircle = function pinCircle ( circle ) {
	if ( circle ) {
		if ( circle.id ) {
			this.updateWorker( 'pincircle', circle.id );
		} else {
			this.updateWorker( 'pincircle', circle );
		}

		this.startLoop();
	}
};

CirclePacker.prototype.unpinCircle = function unpinCircle ( circle ) {
	if ( circle ) {
		if ( circle.id ) {
			this.updateWorker( 'unpincircle', circle.id );
		} else {
			this.updateWorker( 'unpincircle', circle );
		}

		this.startLoop();
	}
};

CirclePacker.prototype.setCircleRadius = function setCircleRadius ( circle, radius ) {
	if ( circle && radius >= 0 ) {
		if ( circle.id ) {
			this.updateWorker( 'circleradius', { id: circle.id, radius: radius } );
		} else {
			this.updateWorker( 'circleradius', { id: circle, radius: radius } );
		}

		this.startLoop();
	}
};

CirclePacker.prototype.setCircleCenterPull = function setCircleCenterPull ( circle, centerPull ) {
	if ( circle ) {
		if ( circle.id ) {
			this.updateWorker( 'circlecenterpull', { id: circle.id, centerPull: !! centerPull } );
		} else {
			this.updateWorker( 'circlecenterpull', { id: circle, centerPull: !! centerPull } );
		}

		this.startLoop();
	}
};

CirclePacker.prototype.setCenterPull = function setCenterPull ( centerPull ) {
	this.updateWorker( 'centerpull', { centerPull: !! centerPull } );

	this.startLoop();
};
	
CirclePacker.prototype.setBounds = function setBounds ( bounds ) {
	if ( isBoundsValid( bounds ) ) {
		this.updateWorker( 'bounds', bounds );
		this.startLoop();
	}
};

CirclePacker.prototype.setTarget = function setTarget ( targetPos ) {
	this.updateWorker( 'target', targetPos );
	this.startLoop();
};

CirclePacker.prototype.setCenteringPasses = function setCenteringPasses ( numberOfCenteringPasses ) {
	this.updateWorker( 'centeringpasses', numberOfCenteringPasses );
};

CirclePacker.prototype.setCollisionPasses = function setCollisionPasses ( numberOfCollisionPasses ) {
	this.updateWorker( 'collisionpasses', numberOfCollisionPasses );
};

CirclePacker.prototype.setDamping = function setDamping ( damping ) {
	this.updateWorker( 'damping', damping );
};

CirclePacker.prototype.update = function update () {
	this.updateWorker( 'update' );
};

CirclePacker.prototype.dragStart = function dragStart ( id ) {
	this.updateWorker( 'dragstart', { id: id } );
	this.startLoop();
};

CirclePacker.prototype.drag = function drag ( id, position ) {
	this.updateWorker( 'drag', { id: id, position: position } );
	this.startLoop();
};

CirclePacker.prototype.dragEnd = function dragEnd ( id ) {
	this.updateWorker( 'dragend', { id: id } );
	this.startLoop();
};

CirclePacker.prototype.updateLoop = function updateLoop () {
	this.update();

	if ( this.isLooping ) {
		if ( this.areItemsMoving ) {
			this.animationFrameId = requestAnimationFrame( this.updateLoop.bind( this ) );
		} else {
			this.stopLoop();
		}
	}
};

CirclePacker.prototype.startLoop = function startLoop () {
	if ( ! this.isLooping && this.initialized && this.isContinuousModeActive ) {
		this.isLooping = true;
			
		// in case we just added another circle:
		// keep going, even if nothing has moved since the last message from the worker
		if ( this.isContinuousModeActive ) {
			this.areItemsMoving = true;
		}
			
		this.updateListeners( 'movestart' );
		this.animationFrameId = requestAnimationFrame( this.updateLoop.bind( this ) );
	}
};

CirclePacker.prototype.stopLoop = function stopLoop () {
	if ( this.isLooping ) {
		this.isLooping = false;
		this.updateListeners( 'moveend' );
		cancelAnimationFrame( this.animationFrameId );
	}
};

CirclePacker.prototype.hasItemMoved = function hasItemMoved ( positions ) {
	var result = false;
		
	for ( var id in positions ) {
		if (
			Math.abs( positions[id].delta.x ) > 0.005 && 
			Math.abs( positions[id].delta.y ) > 0.005
		) {
			result = true;
		}
	}

	return result;
};

CirclePacker.prototype.destroy = function destroy () {
	if ( this.worker ) { this.worker.terminate(); }
	this.stopLoop();
		
	this.onMove = null;
	this.onMoveStart = null;
	this.onMoveEnd = null;
};

return CirclePacker;

})));
