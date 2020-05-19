// this code is mostly for message passing between the 
// PackedCircleManager and CirclePacker classes

import PackedCircle from './PackedCircle.js';
import PackedCircleManager from './PackedCircleManager.js';
import Vector from './Vector.js';
import { sendWorkerMessage, processWorkerMessage } from './util.js';

self.addEventListener( 'message', receivedMessage );

const circleManager = new PackedCircleManager();

function receivedMessage ( event ) {
	const { type, message } = processWorkerMessage( event );

	if ( type === 'bounds' )  {
		circleManager.setBounds( message );
	}

	if ( type === 'target' )  {
		setTarget( message );
	}

	if ( type === 'addcircles' ) {
		addCircles( message );
	}

	if ( type === 'removecircle' ) {
		circleManager.removeCircle( message );
	}

	if ( type === 'update' ) {
		update();
	}

	if ( type === 'dragstart' ) {
		circleManager.dragStart( message.id, message.position );
	}

	if ( type === 'drag' ) {
		circleManager.drag( message.id, message.position );
	}

	if ( type === 'dragend' ) {
		circleManager.dragEnd( message.id );
	}

	if ( type === 'pincircle' ) {
		circleManager.pinCircle( message );
	}

	if ( type === 'unpincircle' ) {
		circleManager.unpinCircle( message );
	}

	if ( type === 'centeringpasses' ) {
		if ( typeof message === 'number' && message > 0 ) {
			circleManager.numberOfCenteringPasses = message;
		}
	}

	if ( type === 'collisionpasses' ) {
		if ( typeof message === 'number' && message > 0 ) {
			circleManager.numberOfCollisionPasses = message;
		}
	}

	if ( type === 'damping' ) {
		if ( typeof message === 'number' && message > 0 ) {
			circleManager.damping = message;
		}
	}
}

function updatePage ( type, message ) {
	sendWorkerMessage( self, { type, message } );
}

function addCircles ( circles ) {
	if ( Array.isArray( circles ) && circles.length ) {
		circles.forEach( circleManager.addCircle.bind( circleManager ) );
	}
}

function setTarget ( target ) {
	if ( target && typeof target.x === 'number' && typeof target.y === 'number' ) {
		circleManager.setTarget( new Vector( target ) );
	}
}

function update () {
	circleManager.updatePositions();

	sendPositions();
}

function sendPositions () {
	const positions = circleManager.allCircles.reduce( ( result, circle ) => {
		result[circle.id] = {
			position: circle.position,
			previousPosition: circle.previousPosition,
			radius: circle.radius,
			delta: circle.delta
		};

		return result;
	}, { } );

	updatePage( 'move', positions );
}