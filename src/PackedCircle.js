// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircle.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

import Vector from './Vector.js';

export default class PackedCircle {
	constructor ( { id, radius, x, y, isPulledToCenter, isPinned } ) {
		x = x || 0;
		y = y || 0;

		this.id = id;                      

		// Where we would like to be
		this.targetPosition = new Vector( 0, 0 );
		// Where we really are
		this.position = new Vector( x, y );
		this.previousPosition = new Vector( x, y );

		// For the div stuff  - to avoid superflous movement calls
	  	this.positionWithOffset = new Vector( x, y );
		this.previousPositionWithOffset = new Vector( x, y );

		this.isPulledToCenter = isPulledToCenter;
		this.isPinned = isPinned;

		// Stored because transform3D is relative
		this.setRadius( radius );
	}

	setPosition ( aPosition ) {
		this.previousPosition = this.position;
		this.position = aPosition.cp();
	}

	distanceSquaredFromTargetPosition () {
		var distanceSquared = this.position.distanceSquared( this.targetPosition );
		// if it's shorter than either radi, we intersect
		return distanceSquared < this.radiusSquared;
	}

	setRadius ( aRadius ) {
		this.radius = aRadius;
		this.radiusSquared = aRadius * aRadius;
		this.originalRadius = aRadius;
	}

	get delta () {
		return new Vector(
			this.position.x - this.previousPosition.x,
			this.position.y - this.previousPosition.y
		);
	}
}
