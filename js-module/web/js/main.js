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

var dependencyArray = ['js/lib/Vector.js', 'js/lib/SortedLookupTable.js', 'js/PackedCircle.js', 'js/PackedCircleManager.js', 'js/lib/Stats.js'];

// Prevent caching by adding random number query string to url
for(var i=0; i<dependencyArray.length; i++)
	dependencyArray[i] += "?t=" + String(Math.floor(Math.random() * 1000));

require(dependencyArray, function() {
		require.ready(function()
		{
			var useCanvas = true;

			if(useCanvas)
			{
				var canvasArea = document.getElementById('canvasArea');
				var context = canvasArea.getContext('2d');
			}

			// Catch 'console = undefined' errors in firefox
			//if(this['console'] == undefined) this.console = {log: function(args){}};
			var console = window['console'];
			var $ = this['$'];

			/**
			 * Create N Circles, and add them to a div you already created (in thise case, #touchArea)
			 */
			var container = document.getElementById("touchArea");
			var amountOfCircles = 130;

			// Define the bounding box where the circles will live
			//(Note: im not updating bounds for you on resize, just update the .bounds property inside PackedCircleManager)
			this.bounds= { left: 0, top: 0, right: $(window).width(), bottom: $(window).height() }; // Use the whole window size for my case

			// Initialize the PackedCircleManager
			this.circleManager = new PackedCircleManager();
			this.circleManager.setBounds(this.bounds);
		  
			// Create N circles
			for(var i = 0; i < amountOfCircles; i++)
			{
				var radius = Math.floor(Math.random() * 22) + 20;
				var diameter = radius*2;
				var circleView = null; // Set to img or div depending on if canvas is used

				if(useCanvas)
				{
					var img = new Image();
					img.src = "images/circle-" + Math.floor( Math.random() * 7 ) + ".png";
					circleView = img;
				}
				else // Oldskool :)
				{
					var aCircleDiv = document.createElement('div');
					aCircleDiv.className = 'packedCircle';
					aCircleDiv.id = 'circ_'+i;
					aCircleDiv.style.width = diameter+"px";
					aCircleDiv.style.height = diameter+"px";

					// Set the background image
					$(aCircleDiv).css('background-image', "url(./images/circle-"+Math.floor(Math.random() * 7)+".png)");
					$(aCircleDiv).css('background-position', 'center');

					// [Mozilla] : Scale the background width
					$(aCircleDiv).css('-moz-background-size', (radius*2) + "px" + " " + (radius*2) + "px");
					container.appendChild(aCircleDiv);
				}

				// Create the packed circle, and add it to our lists
				var aPackedCircle = new PackedCircle(circleView, radius);
				aPackedCircle.position.x = Math.random() * this.bounds.right;
				aPackedCircle.position.y = -50;
				this.circleManager.addCircle(aPackedCircle);
			}
			
			/**                                                                                                              	
			 * Updates the positions of the circles divs and runs the collision & target chasing
			 */
			function updateCircles()
			{
				this.circleManager.pushAllCirclesTowardTarget(this.circleManager.desiredTarget); // Push all the circles to the target - in my case the center of the bounds
				this.circleManager.handleCollisions();    // Make the circles collide and adjust positions to move away from each other

				// Position circles based on new position
				var circleArray = this.circleManager.allCircles;
					len = circleArray.length,
					positionFunction = null; // Point to the function object used to move update the circles view

				if(useCanvas) {
//					context.clearRect(0, 0, context.canvas.width, context.canvas.height );
					positionFunction = positionCircleUsingCanvas;
				} else {
					positionFunction = positionCircleUsingCSS;	
				}

				for(var i = 0; i < len; i++)
				{
					var aCircle = circleArray[i];
					this.circleManager.handleBoundaryForCircle(aCircle); // Wrap the circles packman style in my case. Look in the function to see different options

					// Get the position
					var xpos = aCircle.position.x - aCircle.radius,
						ypos = aCircle.position.y - aCircle.radius,
						diameter = aCircle.radius*2,
						delta = aCircle.previousPosition.distanceSquared(aCircle.position);

					// Anything else we won't bother asking the browser to re-render
					if(delta > -0.01) // bug - for now we always re-render
					{
						// Context will be ignored by positionUsingCSS
						positionFunction(aCircle, xpos, ypos, diameter, context);
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
//			this.circleManager.randomizeCirclePositions();
			this.circleManager.handleCollisions();

			setInterval(function(){ updateCircles();}, 1000/30);  // 30 is the framerate


			 // Call the fake onDocumentComplete inside index.html
			if(onCirclePackingInitComplete)
				onCirclePackingInitComplete();
		});
});


function positionCircleUsingCSS(aCircle, xpos, ypos, diameter)
{
	var circleDiv = aCircle.div;

	// Matrix translate the position of the object in webkit & firefox
	circleDiv.style.webkitTransform ="translate3d("+xpos+"px,"+ypos+"px, 0px)";
	circleDiv.style.MozTransform ="translate("+xpos+"px,"+ypos+"px)";

	// [CrossBrowser] : Use jQuery to move the object - uncomment this if all else fails. Very slow.
//	 $(aCircle.div).offset({left: xpos, top: ypos});

	// [Mozilla] : Recenter background
	if(aCircle.radius > aCircle.originalRadius)
	{
		var backgroundPostionString = (aCircle.radius*2) + "px" + " " + (aCircle.radius*2) + "px";
		$(circleDiv).css('-moz-background-size', backgroundPostionString);
	}
}

function positionCircleUsingCanvas(aCircle, xpos, ypos, diameter, context)
{
//	console.log(aCircle.div)
	context.drawImage(aCircle.div, xpos, ypos, diameter, diameter);
}


