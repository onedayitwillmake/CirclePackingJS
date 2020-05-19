// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/PackedCircleManager.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

import PackedCircle from './PackedCircle.js';
import Vector from './Vector.js';

export default class PackedCircleManager {
	constructor () {
		this.allCircles = [ ];
		this.pinnedCircleIds = [ ];
		this.desiredTarget = new Vector( 0, 0 );
		this.bounds = { left: 0, top: 0, right: 0, bottom: 0 };
		this.damping = 0.025;

		// Number of passes for the centering and collision
		// algorithms - it's (O)logN^2 so use increase at your own risk!
		// Play with these numbers - see what works best for your project
		this.numberOfCenteringPasses = 1;
		this.numberOfCollisionPasses = 3;
	}

	/**
	 * Set the boundary rectangle for the circle packing.
	 * This is used to locate the 'center'
	 * @param aBoundaryObject
	 */
	setBounds ( aBoundaryObject ) {
		if ( typeof aBoundaryObject.left === 'number' ) {
			this.bounds.left = aBoundaryObject.left;
		}

		if ( typeof aBoundaryObject.right === 'number' ) {
			this.bounds.right = aBoundaryObject.right;
		}

		if ( typeof aBoundaryObject.top === 'number' ) {
			this.bounds.top = aBoundaryObject.top;
		}

		if ( typeof aBoundaryObject.bottom === 'number' ) {
			this.bounds.bottom = aBoundaryObject.bottom;
		}

		if ( typeof aBoundaryObject.width === 'number' ) {
			this.bounds.right = this.bounds.left + aBoundaryObject.width;
		}

		if ( typeof aBoundaryObject.height === 'number' ) {
			this.bounds.bottom = this.bounds.top + aBoundaryObject.height;
		}
	}

	/**
	 * Add a circle
	 * @param aCircle A Circle to add, should already be created.
	 */
	addCircle ( aCircle ) {
		if ( ! ( aCircle instanceof PackedCircle ) ) {
			aCircle = new PackedCircle( aCircle.id, aCircle.radius, aCircle.position.x, aCircle.position.y );
		}

		this.allCircles.push( aCircle );
		aCircle.targetPosition = this.desiredTarget.cp();
	}

	/**
	 * Remove a circle
	 * @param circleToRemoveId Id of the circle to remove
	 */
	removeCircle ( circleToRemoveId ) {
		const indicesToRemove = this.allCircles.reduce( ( indices, circle, index ) => {
			if ( circle.id === circleToRemoveId ) {
				indices.push( index );
			}

			return indices;
		}, [ ] );

		for ( let n = indicesToRemove.length - 1; n >= 0; n-- ) {
			this.allCircles.splice( indicesToRemove[n], 1 );
		}
	}

	/**
	 * Recalculate all circle positions
	 */
	updatePositions () {
		var circleList = this.allCircles;
		var circleCount = circleList.length;

		// store information about the previous position
		for ( let i = 0; i < circleCount; ++i ) {
			const circle = circleList[i];

			circle.previousPosition = circle.position.cp();
		}

		if ( this.desiredTarget ) {
			// Push all the circles to the target - in my case the center of the bounds
			this.pushAllCirclesTowardTarget( this.desiredTarget );
		}
		
		// Make the circles collide and adjust positions to move away from each other
		this.handleCollisions();

		// store information about the previous position
		for ( let i = 0; i < circleCount; ++i ) {
			const circle = circleList[i];

			this.handleBoundaryForCircle( circle );
		}
	}

	pushAllCirclesTowardTarget ( aTarget ) {
		var v = new Vector( 0, 0 );

		var dragCircle = this.draggedCircle;
		var circleList = this.allCircles;
		var circleCount = circleList.length;

		for ( var n = 0; n < this.numberOfCenteringPasses; n++ ) {			
			for ( var i = 0; i < circleCount; i++ ) {
				var circle = circleList[i];

				// Kinematic circles can't be pushed around.
				const isCircleKinematic = circle === dragCircle || this.isCirclePinned( circle.id );

				if ( isCircleKinematic ) {
					continue;
				}

				v.x = circle.position.x - aTarget.x;
				v.y = circle.position.y - aTarget.y;
				v.mul ( this.damping );
				
				circle.position.x -= v.x;
				circle.position.y -= v.y;
			}
		}
	}

	/**
	 * Packs the circles towards the center of the bounds.
	 * Each circle will have it's own 'targetPosition' later on
	 */
	handleCollisions () {
		var v = new Vector( 0, 0 );

		var dragCircle = this.draggedCircle;
		var circleList = this.allCircles;
		var circleCount = circleList.length;

		// Collide circles
		for ( var n = 0; n < this.numberOfCollisionPasses; n++ ) {
			for ( var i = 0; i < circleCount; i++ ) {
				var circleA = circleList[i];
				
				for ( var j = i + 1; j < circleCount; j++ ) {
					var circleB = circleList[j];

					const isCircleAPinned = this.isCirclePinned( circleA.id );
					const isCircleBPinned = this.isCirclePinned( circleB.id );

					// Kinematic circles can't be pushed around.
					const isCircleAKinematic = circleA === dragCircle || isCircleAPinned;
					const isCircleBKinematic = circleB === dragCircle || isCircleBPinned;
					
					if (
						// It's us!
						circleA === circleB ||

						// Kinematic circles don't interact with eachother
						( isCircleAKinematic && isCircleBKinematic )
					) {
						continue; 
					}

					var dx = circleB.position.x - circleA.position.x;
					var dy = circleB.position.y - circleA.position.y;

					// The distance between the two circles radii, 
					// but we're also gonna pad it a tiny bit 
					var r = ( circleA.radius + circleB.radius ) * 1.08;
					var d = circleA.position.distanceSquared( circleB.position );

					if ( d < ( r * r ) - 0.02 ) {
						v.x = dx;
						v.y = dy;
						v.normalize();

						var inverseForce = ( r - Math.sqrt( d ) ) * 0.5;
						v.mul( inverseForce );
						
						if ( ! isCircleBKinematic ) {
							if ( isCircleAKinematic ) {
								// Double inverse force to make up 
								// for the fact that the other object is fixed
								v.mul( 2.2 );
							}

							circleB.position.x += v.x;
							circleB.position.y += v.y;
						}

						if ( ! isCircleAKinematic ) {
							if ( isCircleBKinematic ) {
								// Double inverse force to make up 
								// for the fact that the other object is fixed
								v.mul( 2.2 );
							}

							circleA.position.x -= v.x;
							circleA.position.y -= v.y;
						}
					}
				}
			}
		}
	}

	handleBoundaryForCircle ( aCircle ) {		
		const x = aCircle.position.x;
		const y = aCircle.position.y;
		const radius = aCircle.radius;
		
		let overEdge = false;

		if ( x + radius >= this.bounds.right ) {
			aCircle.position.x = this.bounds.right - radius;
			overEdge = true;
		} else if ( x - radius < this.bounds.left ) {
			aCircle.position.x = this.bounds.left + radius;
			overEdge = true;
		}

		if ( y + radius > this.bounds.bottom ) {
			aCircle.position.y = this.bounds.bottom - radius;
			overEdge = true;
		} else if ( y - radius < this.bounds.top ) {
			aCircle.position.y = this.bounds.top + radius;
			overEdge = true;
		}

		// end dragging if user dragged over edge
		if ( overEdge && aCircle === this.draggedCircle ) {
			this.draggedCircle = null;
		}
	}

	/**
	 * Force a certain circle to be the 'draggedCircle'.
	 * Can be used to undrag a circle by calling setDraggedCircle(null)
	 * @param aCircle  Circle to start dragging. It's assumed to be part of our list. No checks in place currently.
	 */
	setDraggedCircle ( aCircle ) {
		// Setting to null, and we had a circle before.
		// Restore the radius of the circle as it was previously
		if ( this.draggedCircle && this.draggedCircle !== aCircle ) {
			this.draggedCircle.radius = this.draggedCircle.originalRadius;
		}

		this.draggedCircle = aCircle;
	}

	dragStart ( id ) {
		const draggedCircle = this.allCircles.filter( c => { return c.id === id; } )[0];
		this.setDraggedCircle( draggedCircle );
	}

	dragEnd ( id ) {
		if ( this.draggedCircle ) {
			this.setDraggedCircle( null );
		}
	}

	drag ( id, position ) {
		if ( this.draggedCircle && position ) {
			this.draggedCircle.position.x = position.x;
			this.draggedCircle.position.y = position.y;
		}
	}

	isCirclePinned ( id ) {
		return this.pinnedCircleIds.includes( id );
	}

	pinCircle ( id ) {
		if ( ! this.isCirclePinned( id ) ) {
			this.pinnedCircleIds.push( id );
		}
	}

	unpinCircle ( id ) {
		this.pinnedCircleIds = this.pinnedCircleIds.filter( circleId => circleId !== id );
	}

	/**
	 * Sets the target position where the circles want to be
	 * @param aPosition
	 */
	setTarget ( aPosition ) {
		this.desiredTarget = aPosition;
	}
}