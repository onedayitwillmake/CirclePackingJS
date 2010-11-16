/**
	  ####  #####  ##### ####    ###  #   # ###### ###### ##     ##  #####  #     #      ########    ##    #  #  #####
	 #   # #   #  ###   #   #  #####  ###    ##     ##   ##  #  ##    #    #     #     #   ##   #  #####  ###   ###
	 ###  #   #  ##### ####   #   #   #   ######   ##   #########  #####  ##### ##### #   ##   #  #   #  #   # #####
 -
 File:
 	PackedCircle.js
 Created By:
 	Mario Gonzalez
 Project	:
 	None
 Abstract:
 		 A single packed circle.
	 Contains a reference to it's div, and information pertaining to it state.
 Basic Usage:
	http://onedayitwillmake.com/CirclePackJS/
*/
var init = (function()
{

	PackedCircle = function(div, radius)
	{
		// Data
		this.div = div;                      

		// Where we would like to be
		this.targetPosition = new Vector(0,0);
		// Where we are
		this.position = new Vector(0,0);
		this.previousPosition = new Vector();

		// For the div stuff
	  	this.positionWithOffset = new Vector(0,0);
		this.previousPositionWithOffset = new Vector(0,0);

		
		this.setRadius(radius);
	};

	PackedCircle.prototype.setPosition = function(aPosition)
	{
		this.previousPosition = this.position;
		this.position = aPosition.cp();
	};

	PackedCircle.prototype.getPositionWithRadiusOffset = function()
	{
		// Store previous
		this.previousPositionWithOffset.x = this.positionWithOffset.x;
		this.previousPositionWithOffset.y = this.positionWithOffset.y;

		// Set current
		this.positionWithOffset.x = (this.position.x - this.radius);
		this.positionWithOffset.y = (this.position.y - this.radius);


		return this.positionWithOffset;
	};

	PackedCircle.prototype.containsPoint = function(aPoint)
	{
		var distanceSquared = this.position.distanceSquared(aPoint);
		// if it's shorter than either radi, we intersect
		return distanceSquared < this.radiusSquared;
	};

	PackedCircle.prototype.distanceSquaredFromTargetPosition = function()
	{
		var distanceSquared = this.position.distanceSquared(this.targetPosition);
		// if it's shorter than either radi, we intersect
		return distanceSquared < this.radiusSquared;
	};

	PackedCircle.prototype.intersects = function(aCircle)
	{
		var distanceSquared = this.position.distanceSquared(aCircle.position);
		// if it's shorter than either radi, we intersect
		return (distanceSquared < this.radiusSquared || distanceSquared < aCircle.radiusSquared);
	};

	PackedCircle.prototype.setRadius = function(aRadius)
	{
		// Size
		this.radius = aRadius;
		this.radiusSquared = aRadius * aRadius;
		this.originalRadius = aRadius;
	};

	return PackedCircle;

})();