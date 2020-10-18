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
class CirclePacker {
	constructor ( params = { } ) {
		this.worker = new Worker( URL.createObjectURL(new Blob(["// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/lib/Vector.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nclass Vector {\n\tconstructor ( x, y ) {\n\t\tif ( typeof x === 'object' ) {\n\t\t\tthis.x = x.x;\n\t\t\tthis.y = x.y;\n\t\t} else {\n\t\t\tthis.x = x;\n\t\t\tthis.y = y;\n\t\t}\n\t}\n\n\tcp () {\n\t\treturn new Vector( this.x, this.y );\n\t}\n\n\tmul ( factor ) {\n\t\tthis.x *= factor;\n\t\tthis.y *= factor;\n\t\treturn this;\n\t}\n\n\tnormalize () {\n\t\tvar l = this.length();\n\t\tthis.x /= l;\n\t\tthis.y /= l;\n\t\treturn this;\n\t}\n\n\tlength () {\n\t\tvar length = Math.sqrt( this.x * this.x + this.y * this.y );\n\t\t\n\t\tif ( length < 0.005 && length > -0.005 ) {\n\t\t\treturn 0.000001;\n\t\t}\n\n\t\treturn length;\n\t}\n\n\tdistance ( vec ) {\n\t\tvar deltaX = this.x - vec.x;\n\t\tvar deltaY = this.y - vec.y;\n\t\treturn Math.sqrt( ( deltaX * deltaX ) + ( deltaY * deltaY ) );\n\t}\n\n\tdistanceSquared ( vec ) {\n\t\tvar deltaX = this.x - vec.x;\n\t\tvar deltaY = this.y - vec.y;\n\t\treturn ( deltaX * deltaX ) + ( deltaY * deltaY );\n\t}\n}\n\n// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nclass PackedCircle {\n\tconstructor ( { id, radius, x, y, isPulledToCenter, isPinned } ) {\n\t\tx = x || 0;\n\t\ty = y || 0;\n\n\t\tthis.id = id;                      \n\n\t\t// Where we would like to be\n\t\tthis.targetPosition = new Vector( 0, 0 );\n\t\t// Where we really are\n\t\tthis.position = new Vector( x, y );\n\t\tthis.previousPosition = new Vector( x, y );\n\n\t\t// For the div stuff  - to avoid superflous movement calls\n\t  \tthis.positionWithOffset = new Vector( x, y );\n\t\tthis.previousPositionWithOffset = new Vector( x, y );\n\n\t\tthis.isPulledToCenter = isPulledToCenter;\n\t\tthis.isPinned = isPinned;\n\n\t\t// Stored because transform3D is relative\n\t\tthis.setRadius( radius );\n\t}\n\n\tsetPosition ( aPosition ) {\n\t\tthis.previousPosition = this.position;\n\t\tthis.position = aPosition.cp();\n\t}\n\n\tdistanceSquaredFromTargetPosition () {\n\t\tvar distanceSquared = this.position.distanceSquared( this.targetPosition );\n\t\t// if it's shorter than either radi, we intersect\n\t\treturn distanceSquared < this.radiusSquared;\n\t}\n\n\tsetRadius ( aRadius ) {\n\t\tthis.radius = aRadius;\n\t\tthis.radiusSquared = aRadius * aRadius;\n\t\tthis.originalRadius = aRadius;\n\t}\n\n\tget delta () {\n\t\treturn new Vector(\n\t\t\tthis.position.x - this.previousPosition.x,\n\t\t\tthis.position.y - this.previousPosition.y\n\t\t);\n\t}\n}\n\n// most of this code is taken from here:\n// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js\n// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey\n\nclass PackedCircleManager {\n\tconstructor () {\n\t\tthis.allCircles = [ ];\n\t\tthis.pinnedCircleIds = [ ];\n\t\tthis.desiredTarget = new Vector( 0, 0 );\n\t\tthis.bounds = { left: 0, top: 0, right: 0, bottom: 0 };\n\t\tthis.damping = 0.025;\n\n\t\t// Number of passes for the centering and collision\n\t\t// algorithms - it's (O)logN^2 so use increase at your own risk!\n\t\t// Play with these numbers - see what works best for your project\n\t\tthis.numberOfCenteringPasses = 1;\n\t\tthis.numberOfCollisionPasses = 3;\n\n\t\tthis.isCenterPullActive = true;\n\t}\n\n\t/**\n\t * Set the boundary rectangle for the circle packing.\n\t * This is used to locate the 'center'\n\t * @param aBoundaryObject\n\t */\n\tsetBounds ( aBoundaryObject ) {\n\t\tif ( typeof aBoundaryObject.left === 'number' ) {\n\t\t\tthis.bounds.left = aBoundaryObject.left;\n\t\t}\n\n\t\tif ( typeof aBoundaryObject.right === 'number' ) {\n\t\t\tthis.bounds.right = aBoundaryObject.right;\n\t\t}\n\n\t\tif ( typeof aBoundaryObject.top === 'number' ) {\n\t\t\tthis.bounds.top = aBoundaryObject.top;\n\t\t}\n\n\t\tif ( typeof aBoundaryObject.bottom === 'number' ) {\n\t\t\tthis.bounds.bottom = aBoundaryObject.bottom;\n\t\t}\n\n\t\tif ( typeof aBoundaryObject.width === 'number' ) {\n\t\t\tthis.bounds.right = this.bounds.left + aBoundaryObject.width;\n\t\t}\n\n\t\tif ( typeof aBoundaryObject.height === 'number' ) {\n\t\t\tthis.bounds.bottom = this.bounds.top + aBoundaryObject.height;\n\t\t}\n\t}\n\n\t/**\n\t * Add a circle\n\t * @param aCircle A Circle to add, should already be created.\n\t */\n\taddCircle ( aCircle ) {\n\t\tif ( ! ( aCircle instanceof PackedCircle ) ) {\n\t\t\taCircle = new PackedCircle( {\n\t\t\t\tid: aCircle.id,\n\t\t\t\tradius: aCircle.radius,\n\t\t\t\tx: aCircle.position.x || 0,\n\t\t\t\ty: aCircle.position.y || 0,\n\t\t\t\tisPinned: aCircle.isPinned || false,\n\t\t\t\tisPulledToCenter: typeof aCircle.isPulledToCenter === 'boolean' ? aCircle.isPulledToCenter : true\n\t\t\t} );\n\t\t}\n\n\t\tthis.allCircles.push( aCircle );\n\t\taCircle.targetPosition = this.desiredTarget.cp();\n\t}\n\n\t/**\n\t * Remove a circle\n\t * @param circleToRemoveId Id of the circle to remove\n\t */\n\tremoveCircle ( circleToRemoveId ) {\n\t\tconst indicesToRemove = this.allCircles.reduce( ( indices, circle, index ) => {\n\t\t\tif ( circle.id === circleToRemoveId ) {\n\t\t\t\tindices.push( index );\n\t\t\t}\n\n\t\t\treturn indices;\n\t\t}, [ ] );\n\n\t\tfor ( let n = indicesToRemove.length - 1; n >= 0; n-- ) {\n\t\t\tthis.allCircles.splice( indicesToRemove[n], 1 );\n\t\t}\n\t}\n\n\t/**\n\t * Recalculate all circle positions\n\t */\n\tupdatePositions () {\n\t\tvar circleList = this.allCircles;\n\t\tvar circleCount = circleList.length;\n\n\t\t// store information about the previous position\n\t\tfor ( let i = 0; i < circleCount; ++i ) {\n\t\t\tconst circle = circleList[i];\n\n\t\t\tcircle.previousPosition = circle.position.cp();\n\t\t}\n\n\t\tif ( this.desiredTarget && this.isCenterPullActive ) {\n\t\t\t// Push all the circles to the target - in my case the center of the bounds\n\t\t\tthis.pushAllCirclesTowardTarget( this.desiredTarget );\n\t\t}\n\t\t\n\t\t// Make the circles collide and adjust positions to move away from each other\n\t\tthis.handleCollisions();\n\n\t\t// store information about the previous position\n\t\tfor ( let i = 0; i < circleCount; ++i ) {\n\t\t\tconst circle = circleList[i];\n\n\t\t\tthis.handleBoundaryForCircle( circle );\n\t\t}\n\t}\n\n\tpushAllCirclesTowardTarget ( aTarget ) {\n\t\tvar v = new Vector( 0, 0 );\n\n\t\tvar dragCircle = this.draggedCircle;\n\t\tvar circleList = this.allCircles;\n\t\tvar circleCount = circleList.length;\n\n\t\tfor ( var n = 0; n < this.numberOfCenteringPasses; n++ ) {\t\t\t\n\t\t\tfor ( var i = 0; i < circleCount; i++ ) {\n\t\t\t\tvar circle = circleList[i];\n\t\t\t\t\n\t\t\t\tif ( circle.isPulledToCenter ) {\n\t\t\t\t\t// Kinematic circles can't be pushed around.\n\t\t\t\t\tconst isCircleKinematic = circle === dragCircle || this.isCirclePinned( circle.id );\n\n\t\t\t\t\tif ( isCircleKinematic ) {\n\t\t\t\t\t\tcontinue;\n\t\t\t\t\t}\n\n\t\t\t\t\tv.x = circle.position.x - aTarget.x;\n\t\t\t\t\tv.y = circle.position.y - aTarget.y;\n\t\t\t\t\tv.mul ( this.damping );\n\t\t\t\t\t\n\t\t\t\t\tcircle.position.x -= v.x;\n\t\t\t\t\tcircle.position.y -= v.y;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\t/**\n\t * Packs the circles towards the center of the bounds.\n\t * Each circle will have it's own 'targetPosition' later on\n\t */\n\thandleCollisions () {\n\t\tvar v = new Vector( 0, 0 );\n\n\t\tvar dragCircle = this.draggedCircle;\n\t\tvar circleList = this.allCircles;\n\t\tvar circleCount = circleList.length;\n\n\t\t// Collide circles\n\t\tfor ( var n = 0; n < this.numberOfCollisionPasses; n++ ) {\n\t\t\tfor ( var i = 0; i < circleCount; i++ ) {\n\t\t\t\tvar circleA = circleList[i];\n\t\t\t\t\n\t\t\t\tfor ( var j = i + 1; j < circleCount; j++ ) {\n\t\t\t\t\tvar circleB = circleList[j];\n\n\t\t\t\t\tconst isCircleAPinned = this.isCirclePinned( circleA.id );\n\t\t\t\t\tconst isCircleBPinned = this.isCirclePinned( circleB.id );\n\n\t\t\t\t\t// Kinematic circles can't be pushed around.\n\t\t\t\t\tconst isCircleAKinematic = circleA === dragCircle || isCircleAPinned;\n\t\t\t\t\tconst isCircleBKinematic = circleB === dragCircle || isCircleBPinned;\n\t\t\t\t\t\n\t\t\t\t\tif (\n\t\t\t\t\t\t// It's us!\n\t\t\t\t\t\tcircleA === circleB ||\n\n\t\t\t\t\t\t// Kinematic circles don't interact with eachother\n\t\t\t\t\t\t( isCircleAKinematic && isCircleBKinematic )\n\t\t\t\t\t) {\n\t\t\t\t\t\tcontinue; \n\t\t\t\t\t}\n\n\t\t\t\t\tvar dx = circleB.position.x - circleA.position.x;\n\t\t\t\t\tvar dy = circleB.position.y - circleA.position.y;\n\n\t\t\t\t\t// The distance between the two circles radii, \n\t\t\t\t\t// but we're also gonna pad it a tiny bit \n\t\t\t\t\tvar r = ( circleA.radius + circleB.radius ) * 1.08;\n\t\t\t\t\tvar d = circleA.position.distanceSquared( circleB.position );\n\n\t\t\t\t\tif ( d < ( r * r ) - 0.02 ) {\n\t\t\t\t\t\tv.x = dx;\n\t\t\t\t\t\tv.y = dy;\n\t\t\t\t\t\tv.normalize();\n\n\t\t\t\t\t\tvar inverseForce = ( r - Math.sqrt( d ) ) * 0.5;\n\t\t\t\t\t\tv.mul( inverseForce );\n\t\t\t\t\t\t\n\t\t\t\t\t\tif ( ! isCircleBKinematic ) {\n\t\t\t\t\t\t\tif ( isCircleAKinematic ) {\n\t\t\t\t\t\t\t\t// Double inverse force to make up \n\t\t\t\t\t\t\t\t// for the fact that the other object is fixed\n\t\t\t\t\t\t\t\tv.mul( 2.2 );\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tcircleB.position.x += v.x;\n\t\t\t\t\t\t\tcircleB.position.y += v.y;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif ( ! isCircleAKinematic ) {\n\t\t\t\t\t\t\tif ( isCircleBKinematic ) {\n\t\t\t\t\t\t\t\t// Double inverse force to make up \n\t\t\t\t\t\t\t\t// for the fact that the other object is fixed\n\t\t\t\t\t\t\t\tv.mul( 2.2 );\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tcircleA.position.x -= v.x;\n\t\t\t\t\t\t\tcircleA.position.y -= v.y;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\thandleBoundaryForCircle ( aCircle ) {\t\t\n\t\tconst x = aCircle.position.x;\n\t\tconst y = aCircle.position.y;\n\t\tconst radius = aCircle.radius;\n\t\t\n\t\tlet overEdge = false;\n\n\t\tif ( x + radius >= this.bounds.right ) {\n\t\t\taCircle.position.x = this.bounds.right - radius;\n\t\t\toverEdge = true;\n\t\t} else if ( x - radius < this.bounds.left ) {\n\t\t\taCircle.position.x = this.bounds.left + radius;\n\t\t\toverEdge = true;\n\t\t}\n\n\t\tif ( y + radius > this.bounds.bottom ) {\n\t\t\taCircle.position.y = this.bounds.bottom - radius;\n\t\t\toverEdge = true;\n\t\t} else if ( y - radius < this.bounds.top ) {\n\t\t\taCircle.position.y = this.bounds.top + radius;\n\t\t\toverEdge = true;\n\t\t}\n\n\t\t// end dragging if user dragged over edge\n\t\tif ( overEdge && aCircle === this.draggedCircle ) {\n\t\t\tthis.draggedCircle = null;\n\t\t}\n\t}\n\n\t/**\n\t * Force a certain circle to be the 'draggedCircle'.\n\t * Can be used to undrag a circle by calling setDraggedCircle(null)\n\t * @param aCircle  Circle to start dragging. It's assumed to be part of our list. No checks in place currently.\n\t */\n\tsetDraggedCircle ( aCircle ) {\n\t\t// Setting to null, and we had a circle before.\n\t\t// Restore the radius of the circle as it was previously\n\t\tif ( this.draggedCircle && this.draggedCircle !== aCircle ) {\n\t\t\tthis.draggedCircle.radius = this.draggedCircle.originalRadius;\n\t\t}\n\n\t\tthis.draggedCircle = aCircle;\n\t}\n\n\tdragStart ( id ) {\n\t\tconst draggedCircle = this.allCircles.filter( circle => circle.id === id )[0];\n\t\tthis.setDraggedCircle( draggedCircle );\n\t}\n\n\tdragEnd ( id ) {\n\t\tif ( this.draggedCircle ) {\n\t\t\tthis.setDraggedCircle( null );\n\t\t}\n\t}\n\n\tdrag ( id, position ) {\n\t\tif ( this.draggedCircle && position ) {\n\t\t\tthis.draggedCircle.position.x = position.x;\n\t\t\tthis.draggedCircle.position.y = position.y;\n\t\t}\n\t}\n\n\tisCirclePinned ( id ) {\n\t\tconst circle = this.circleById( id );\n\n\t\tif ( circle ) {\n\t\t\treturn circle.isPinned;\n\t\t}\n\n\t\treturn false;\n\t}\n\n\tpinCircle ( id ) {\n\t\tconst circle = this.circleById( id );\n\n\t\tif ( circle ) {\n\t\t\tcircle.isPinned = true;\n\t\t}\n\t}\n\n\tunpinCircle ( id ) {\n\t\tconst circle = this.circleById( id );\n\n\t\tif ( circle ) {\n\t\t\tcircle.isPinned = false;\n\t\t}\n\t}\n\n\tsetCircleRadius ( id, radius ) {\n\t\tconst circle = this.circleById( id );\n\n\t\tif ( circle ) {\n\t\t\tcircle.setRadius( radius );\n\t\t}\n\t}\n\n\tsetCircleCenterPull ( id, centerPull ) {\n\t\tconst circle = this.circleById( id );\n\n\t\tif ( circle ) {\n\t\t\tcircle.isPulledToCenter = centerPull;\n\t\t}\n\t}\n\n\tsetCenterPull ( centerPull ) {\n\t\tthis.isCenterPullActive = centerPull;\n\t}\n\n\tcircleById ( id ) {\n\t\treturn this.allCircles.filter( circle => circle.id === id )[0];\n\t}\n\n\t/**\n\t * Sets the target position where the circles want to be\n\t * @param aPosition\n\t */\n\tsetTarget ( aPosition ) {\n\t\tthis.desiredTarget = aPosition;\n\t}\n}\n\nfunction sendWorkerMessage ( worker, msg ) {\n\tworker.postMessage( JSON.stringify( msg ) );\n}\n\nfunction processWorkerMessage ( event ) {\n\treturn event.data ? JSON.parse( event.data ) : { };\n}\n\n// this code is mostly for message passing between the \n// PackedCircleManager and CirclePacker classes\n\nself.addEventListener( 'message', receivedMessage );\n\nconst circleManager = new PackedCircleManager();\n\nfunction receivedMessage ( event ) {\n\tconst { type, message } = processWorkerMessage( event );\n\n\tif ( type === 'bounds' )  {\n\t\tcircleManager.setBounds( message );\n\t}\n\n\tif ( type === 'target' )  {\n\t\tsetTarget( message );\n\t}\n\n\tif ( type === 'addcircles' ) {\n\t\taddCircles( message );\n\t}\n\n\tif ( type === 'removecircle' ) {\n\t\tcircleManager.removeCircle( message );\n\t}\n\n\tif ( type === 'update' ) {\n\t\tupdate();\n\t}\n\n\tif ( type === 'dragstart' ) {\n\t\tcircleManager.dragStart( message.id, message.position );\n\t}\n\n\tif ( type === 'drag' ) {\n\t\tcircleManager.drag( message.id, message.position );\n\t}\n\n\tif ( type === 'dragend' ) {\n\t\tcircleManager.dragEnd( message.id );\n\t}\n\n\tif ( type === 'pincircle' ) {\n\t\tcircleManager.pinCircle( message );\n\t}\n\n\tif ( type === 'unpincircle' ) {\n\t\tcircleManager.unpinCircle( message );\n\t}\n\n\tif ( type === 'centeringpasses' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.numberOfCenteringPasses = message;\n\t\t}\n\t}\n\n\tif ( type === 'collisionpasses' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.numberOfCollisionPasses = message;\n\t\t}\n\t}\n\n\tif ( type === 'damping' ) {\n\t\tif ( typeof message === 'number' && message > 0 ) {\n\t\t\tcircleManager.damping = message;\n\t\t}\n\t}\n\n\tif ( type === 'circleradius' ) {\n\t\tcircleManager.setCircleRadius( message.id, message.radius );\n\t}\n\n\tif ( type === 'circlecenterpull' ) {\n\t\tcircleManager.setCircleCenterPull( message.id, message.centerPull );\n\t}\n\n\tif ( type === 'centerpull' ) {\n\t\tcircleManager.setCenterPull( message.centerPull );\n\t}\n}\n\nfunction updatePage ( type, message ) {\n\tsendWorkerMessage( self, { type, message } );\n}\n\nfunction addCircles ( circles ) {\n\tif ( Array.isArray( circles ) && circles.length ) {\n\t\tcircles.forEach( circleManager.addCircle.bind( circleManager ) );\n\t}\n}\n\nfunction setTarget ( target ) {\n\tif ( target && typeof target.x === 'number' && typeof target.y === 'number' ) {\n\t\tcircleManager.setTarget( new Vector( target ) );\n\t}\n}\n\nfunction update () {\n\tcircleManager.updatePositions();\n\n\tsendPositions();\n}\n\nfunction sendPositions () {\n\tconst positions = circleManager.allCircles.reduce( ( result, circle ) => {\n\t\tresult[circle.id] = {\n\t\t\tposition: circle.position,\n\t\t\tpreviousPosition: circle.previousPosition,\n\t\t\tradius: circle.radius,\n\t\t\tdelta: circle.delta,\n\t\t\tisPulledToCenter: circle.isPulledToCenter,\n\t\t\tisPinned: circle.isPinned\n\t\t};\n\n\t\treturn result;\n\t}, { } );\n\n\tupdatePage( 'move', positions );\n}\n"],{type:'text/javascript'})) );
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
	}

	receivedWorkerMessage ( event ) {
		const msg = processWorkerMessage( event );

		if ( msg.type === 'move' ) {
			const newPositions = msg.message;						
			this.areItemsMoving = this.hasItemMoved( newPositions );
		}

		this.updateListeners( msg );
	}

	updateWorker ( type, message ) {
		sendWorkerMessage( this.worker, { type, message } );
	}

	updateListeners ( { type, message } ) {
		if ( type === 'movestart' && typeof this.onMoveStart === 'function' ) {
			this.onMoveStart( message );
		}
		
		if ( type === 'move' && typeof this.onMove === 'function' ) {
			this.onMove( message );
		}

		if ( type === 'moveend' && typeof this.onMoveEnd === 'function' ) {
			this.onMoveEnd( message );
		}
	}

	addCircles ( circles ) {
		if ( Array.isArray( circles ) && circles.length ) {
			const circlesToAdd = circles.filter( isCircleValid );

			if ( circlesToAdd.length ) {
				this.updateWorker( 'addcircles', circlesToAdd );
			}
		}

		this.startLoop();
	}

	addCircle ( circle ) {
		this.addCircles( [ circle ] );
	}

	removeCircle ( circle ) {
		if ( circle ) {
			if ( circle.id ) {
				this.updateWorker( 'removecircle', circle.id );
			} else {
				this.updateWorker( 'removecircle', circle );
			}

			this.startLoop();
		}
	}

	pinCircle ( circle ) {
		if ( circle ) {
			if ( circle.id ) {
				this.updateWorker( 'pincircle', circle.id );
			} else {
				this.updateWorker( 'pincircle', circle );
			}

			this.startLoop();
		}
	}

	unpinCircle ( circle ) {
		if ( circle ) {
			if ( circle.id ) {
				this.updateWorker( 'unpincircle', circle.id );
			} else {
				this.updateWorker( 'unpincircle', circle );
			}

			this.startLoop();
		}
	}

	setCircleRadius ( circle, radius ) {
		if ( circle && radius >= 0 ) {
			if ( circle.id ) {
				this.updateWorker( 'circleradius', { id: circle.id, radius } );
			} else {
				this.updateWorker( 'circleradius', { id: circle, radius } );
			}

			this.startLoop();
		}
	}

	setCircleCenterPull ( circle, centerPull ) {
		if ( circle ) {
			if ( circle.id ) {
				this.updateWorker( 'circlecenterpull', { id: circle.id, centerPull: !! centerPull } );
			} else {
				this.updateWorker( 'circlecenterpull', { id: circle, centerPull: !! centerPull } );
			}

			this.startLoop();
		}
	}

	setCenterPull ( centerPull ) {
		this.updateWorker( 'centerpull', { centerPull: !! centerPull } );

		this.startLoop();
	}

	setBounds ( bounds ) {
		if ( isBoundsValid( bounds ) ) {
			this.updateWorker( 'bounds', bounds );
			this.startLoop();
		}
	}

	setTarget ( targetPos ) {
		this.updateWorker( 'target', targetPos );
		this.startLoop();
	}

	setCenteringPasses ( numberOfCenteringPasses ) {
		this.updateWorker( 'centeringpasses', numberOfCenteringPasses );
	}

	setCollisionPasses ( numberOfCollisionPasses ) {
		this.updateWorker( 'collisionpasses', numberOfCollisionPasses );
	}

	setDamping ( damping ) {
		this.updateWorker( 'damping', damping );
	}

	update () {
		this.updateWorker( 'update' );
	}

	dragStart( id ) {
		this.updateWorker( 'dragstart', { id } );
		this.startLoop();
	}

	drag ( id, position ) {
		this.updateWorker( 'drag', { id, position } );
		this.startLoop();
	}

	dragEnd ( id ) {
		this.updateWorker( 'dragend', { id } );
		this.startLoop();
	}

	updateLoop () {
		this.update();

		if ( this.isLooping ) {
			if ( this.areItemsMoving ) {
				this.animationFrameId = requestAnimationFrame( this.updateLoop.bind( this ) );
			} else {
				this.stopLoop();
			}
		}
	}

	startLoop () {
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
	}

	stopLoop () {
		if ( this.isLooping ) {
			this.isLooping = false;
			this.updateListeners( 'moveend' );
			cancelAnimationFrame( this.animationFrameId );
		}
	}

	hasItemMoved ( positions ) {
		let result = false;
		
		for ( let id in positions ) {
			if (
				Math.abs( positions[id].delta.x ) > 0.005 && 
				Math.abs( positions[id].delta.y ) > 0.005
			) {
				result = true;
			}
		}

		return result;
	}

	destroy () {
		if ( this.worker ) { this.worker.terminate(); }
		this.stopLoop();
		
		this.onMove = null;
		this.onMoveStart = null;
		this.onMoveEnd = null;
	}
}

export default CirclePacker;
