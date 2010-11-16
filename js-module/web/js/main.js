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
			// Catch console = undefined errors in firefox
			if(this['console'] == undefined)
				this.console = {log: function(){}};
			
			// Document is ready - do stuff
			console.log('Document.ready!');

			var container =  $("#touchArea");
			var amountOfCircles = 25;

			// Use the whole window size
			this.bounds= {left: 0, top: 0, right: $(window).width(), bottom: $(window).height()};
			// Use the container size
//			this.bounds= {left: 0, top: 0, right: container.width(), bottom: container.height()};
			this.circleManager = new PackedCircleManager();
			this.circleManager.setBounds(this.bounds);

			for(var i = 0; i < amountOfCircles; i++)
			{
				var radius = Math.floor(Math.random() * 50) + 20;
				var diameter = radius*2;

				var aCircleDiv = $("<div />");
				aCircleDiv.addClass('packedCircle');
				aCircleDiv.css('background-image', ''+"url(./images/circle-"+Math.floor(Math.random() * 8)+".png)");
				aCircleDiv.css('width', diameter).css('height', diameter);
//				aCircleDiv.css('opacity', '0.5');

				var backgroundPostionString = diameter + "px" + " " + diameter + "px";
				aCircleDiv.css('background-position', 'center');
				aCircleDiv.css('-moz-background-size', backgroundPostionString);
				var aPackedCircle = new PackedCircle(aCircleDiv, radius);

				this.circleManager.addCircle(aPackedCircle);
				container.append(aCircleDiv);
			}


			this.circleManager.randomizeCirclePositions();

			this.circleManager.packCircles();
			setInterval(function(){
				this.circleManager.packCircles();

				// Position circles based on new position

				var circleArray = this.circleManager.allCircles;
				var len = circleArray.length;
				for(var i = 0; i < len; i++)
				{
					var aCircle = circleArray[i];
					var previousOffsetPosition = aCircle.previousPositionWithOffset;
					var offsetPosition	= aCircle.getPositionWithRadiusOffset();


					// Get the position and truncate the float
					var xpos = offsetPosition.x >> 0;
					var ypos = offsetPosition.y >> 0;
					var delta = previousOffsetPosition.distanceSquared(offsetPosition);

					if(delta > 0.1) {
						$(aCircle.div).offset({left: xpos, top: ypos});
					}
				}

			}, 1000/35);

			// Call the fake onDocumentComplete inside index.html
			if(onCirclePackingInitComplete)
				onCirclePackingInitComplete();
		});
});


