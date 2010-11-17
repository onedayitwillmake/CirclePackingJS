/**
	  ####  #####  ##### ####    ###  #   # ###### ###### ##     ##  #####  #     #      ########    ##    #  #  #####
	 #   # #   #  ###   #   #  #####  ###    ##     ##   ##  #  ##    #    #     #     #   ##   #  #####  ###   ###
	 ###  #   #  ##### ####   #   #   #   ######   ##   #########  #####  ##### ##### #   ##   #  #   #  #   # #####
 -
 File:
 	main.js
 Created By:
 	Mario Gonzalez
 Project	:
 	None
 Abstract:
 	A CirclePack.js example
 Basic Usage:
	http://onedayitwillmake.com/CirclePackJS/
*/
require(['js/lib/Vector.js', 'js/lib/SortedLookupTable.js', 'js/PackedCircle.js', 'js/PackedCircleManager.js'], function() {
		require.ready(function()
		{
			// Catch 'console = undefined' errors in firefox
			if(this['console'] == undefined) this.console = {log: function(args){}};

			var container = document.getElementById("touchArea");//// $("#touchArea");
			var amountOfCircles = 45;

			/**
			 * Create the circles and the PackingCircleManager
			 */
			// Use the whole window size
			this.bounds= {left: 0, top: 0, right: $(window).width(), bottom: $(window).height()};
			// Or Use the container size
//			this.bounds= {left: 0, top: 0, right: container.style.width, bottom:  600 };

			// Initialize the PackedCircleManager
			this.circleManager = new PackedCircleManager();
			this.circleManager.setBounds(this.bounds);

			// Create N circles
			for(var i = 0; i < amountOfCircles; i++)
			{
				var radius = Math.floor(Math.random() * 50) + 20;
				var diameter = radius*2;

				var aCircleDiv = document.createElement('div');
          		aCircleDiv.className = 'packedCircle';
				aCircleDiv.id = 'circ_'+i;
				aCircleDiv.style.width = diameter+"px";
				aCircleDiv.style.height = diameter+"px";

				$(aCircleDiv).css('background-image', "url(./images/circle-"+Math.floor(Math.random() * 7)+".png)");
				$(aCircleDiv).css('background-position', 'center');
				// [Mozilla] : Scale the background width
				$(aCircleDiv).css('-moz-background-size', (radius*2) + "px" + " " + (radius*2) + "px");

				// Create the packed circle, and add it to our lists
				var aPackedCircle = new PackedCircle(aCircleDiv, radius);
				this.circleManager.addCircle(aPackedCircle);
				container.appendChild(aCircleDiv);
			}
			
			/**
			 * Updates the positions of the circles divs and runs the collision & target chasing
			 */
			function updateCircles()
			{
				this.circleManager.pushAllCirclesTowardTarget(this.circleManager.desiredTarget);
				this.circleManager.handleCollisions();

				// Position circles based on new position

				var circleArray = this.circleManager.allCircles;
				var len = circleArray.length;
				for(var i = 0; i < len; i++)
				{
					var aCircle = circleArray[i];

					// Get the position and truncate the float
					var xpos = aCircle.position.x - aCircle.radius;
					var ypos = aCircle.position.y - aCircle.radius;

					var delta = aCircle.previousPosition.distanceSquared(aCircle.position);

					// Anything else we won't bother asking the browser to re-render
					if(delta > 0.1)
					{
						var circleDiv = document.getElementById("circ_"+i);

						// Matrix translate the position of the object in webkit & firefox
						circleDiv.style.webkitTransform ="translate3d("+xpos+"px,"+ypos+"px, 0px)";
						circleDiv.style.MozTransform ="translate("+xpos+"px,"+ypos+"px)";

						// [CrossBrowser] : Use jQuery to move the object - uncomment this if all else fails. Very slow.
						//$(aCircle.div).offset({left: xpos, top: ypos});

						// [Mozilla] : Recenter background
						if(aCircle.radius > aCircle.originalRadius)
						{
							var backgroundPostionString = (aCircle.radius*2) + "px" + " " + (aCircle.radius*2) + "px";
							$(circleDiv.div).css('-moz-background-size', backgroundPostionString);
						}
					}

					// Store the old position for next time
					aCircle.previousPosition = aCircle.position.cp();
				}
			}

			/**
			 * We're all set to start.
			 * Let's randomize the circle positions, and call handleCollisions one time manually to push the circles away from one another.
			 *
			 * Finally lets call the index.html 'onCirclePackingInitComplete'
			 */
			this.circleManager.randomizeCirclePositions();
			this.circleManager.handleCollisions();

			setInterval(function(){ updateCircles();}, 1000/30);  // 30 is the framerate


			// Call the fake onDocumentComplete inside index.html
			if(onCirclePackingInitComplete)
				onCirclePackingInitComplete();
		});
});


