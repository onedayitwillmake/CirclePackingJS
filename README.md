# circlepacker

## downloads

-   [circlepacker.min.js](https://raw.githubusercontent.com/snorpey/circlepacker/master/dist/circlepacker.min.js) 23kb (6kb gzipped)
-   [circlepacker.js](https://raw.githubusercontent.com/snorpey/circlepacker/master/dist/circlepacker.js) 72kb (13kb gzipped)
-   [circlepacker.esm.js](https://raw.githubusercontent.com/snorpey/circlepacker/master/dist/circlepacker.esm.js) 69kb (13kb gzipped)
-   [circlepacker.es6.min.js](https://raw.githubusercontent.com/snorpey/circlepacker/master/dist/circlepacker.es6.min.js) 23kb (6kb gzipped)

`npm install circlepacker`

## what is it?

![circlepacker demo](demo.gif)

a circlepacking algorithm that executes in a webworker, so it doesn't clog the ui thread of your browser.

## how to use it

the easiest way to use this library is to create a `CirclePacker` instance and call it`s methods. it is inteded to be used in the browser

_please note_: circlepacker does not handle the rendering of circles. in merely calculates the circle positions. in the the [examples](examples) folder, you'll find some demos that show you how to handle rendering.

# reference

[`CirclePacker(options)`](#circlepackeroptions)

[`addCircles(circles)`](#addcirclescircles), [`addCircle(circle)`](#addcirclescircle), [`setBounds(bounds)`](#setboundsbounds), [`setTarget(position)`](#settargetposition), [`setCenteringPasses(number)`](#setcenteringpassesnumber), [`setCollisionPasses(number)`](#setcollisionpassesnumber), [`setCorrectionPasses(number)`](#setcorrectionpassesnumber), [`setDamping(number)`](#setdampingnumber), [`setCenterPull(boolean)`](#setcenterpullboolean), [`update()`](#update), [`dragStart(circleId)`](#dragstartcircleid), [`drag(circleId, position)`](#dragcircleid-position), [`dragEnd(circleId)`](#dragendcircleid), [`pinCircle(circleId)`](#pincirclecircleid), [`unpinCircle(circleId)`](#unpincirclecircleid), [`setCircleRadius(circleId, number)`](#setcircleradiuscircleid-number), [`setCircleCenterPull(circleId, boolean)`](#setcirclecenterpullcircleid-boolean) [`destroy()`](#destroy)

[`pack(options)`](#packoptions)

## CirclePacker(options)

returns a new circlepacker instance. it accepts the following options:

```javascript
const packerOptions = {
	// the point that the circles should be attracted to
	// OPTIONAL (but recommended)
	target: { x: 50, y: 50 },

	// the bounds of the area we want to draw the circles in
	// OPTIONAL (but recommended)
	bounds: { width: 100, height: 100 },

	// the initial position and sizes of our circles
	// it is possible to add more circles later
	// each circle should have a unique id, a position and a radius
	// REQUIRED
	circles: [
		{
			id: 'circle1',
			radius: 34,
			position: { x: 32, y: 54 },
			isPulledToCenter: true,
			isPinned: false,
		},
		{
			id: 'circle2',
			radius: 64,
			position: { x: 24, y: 42 },
			isPulledToCenter: true,
			isPinned: false,
		},
		{
			id: 'circle3',
			radius: 53,
			position: { x: 23, y: 21 },
			isPulledToCenter: true,
			isPinned: false,
		},
	],

	// true: continuous animation loop
	// false: one-time animation
	// not available in node or in the pack() shorthand.
	// OPTIONAL. default: true
	continuousMode: true,

	// correctness of collision calculations.
	// higher number means means longer time to calculate
	// OPTIONAL
	// default = 3
	collisionPasses: 3,

	// number of centering animations per frame.
	// higher number means faster movement and longer time to calculate
	// OPTIONAL
	// default = 1
	centeringPasses: 2,

	// number of times per frame we try to remove overlapping circles.
	// this is mostly relevant in cases where continuousMode === false.
	// higher number means longer time to calculate
	// OPTIONAL
	// default = 3
	correctionPasses: 3,

	// return information about overlapping circles
	// in the onMove() callback?
	// can impact performance for high number of circles.
	// OPTIONAL
	// default = false
	calculateOverlap: false,

	// use webworker to calculate results, or calculate them on the main thread?
	// not available in node.
	// OPTIONAL
	// default = true
	useWorker: true,

	// callback function for when movement started
	// can get called multiple times
	// not available in node or in the pack() shorthand.
	// OPTIONAL
	onMoveStart: function () {},

	// callback function for updated circle positions
	// can optionally also include information about
	// overlapping circles and the attraction target
	onMove: function (
		updatedCirclePositions,
		attractionTarget = undefined,
		overlappingCircles = undefined
	) {
		// draw logic here...
	},

	// callback function for when movement ended
	// can get called multiple times
	// not available in node or in the pack() shorthand.
	// OPTIONAL
	onMoveEnd: function () {},
};

const packer = new CirclePacker(packerOptions);
```

back to [reference](#reference)

## addCircles(circles)

add an array of new circles. each _circle_ should have a unique `id`, a `position` and a `radius`.

```javascript
packer.addCircles([
	{
		id: 'circle4',
		radius: 21,
		position: { x: 12, y: 27 },
		isPulledToCenter: false,
		isPinned: false,
	},
	{
		id: 'circle5',
		radius: 64,
		position: { x: 14, y: 42 },
		isPulledToCenter: false,
		isPinned: false,
	},
]);
```

back to [reference](#reference)

## addCircle(circle)

add a single new circle. a _circle_ should have a unique `id`, a `position` and a `radius`.

```javascript
packer.addCircles({ id: 'circle6', radius: 21, position: { x: 12, y: 27 } });
```

back to [reference](#reference)

## setBounds(bounds)

update bounds. a _bounds_ object should have a `width` and a `height`.

```javascript
packer.setBounds({ width: 200, height: 300 });
```

back to [reference](#reference)

## setTarget(position)

updates the target position. a _position_ object should have `x` and `y` values.

```javascript
packer.setTarget({ x: 21, y: 29 });
```

back to [reference](#reference)

## setCenteringPasses(number)

updates number of centering passes. should be an integer >= 1. high values can impact performance.

```javascript
packer.setCenteringPasses(3);
```

back to [reference](#reference)

## setCollisionPasses(number)

updates number of collision passes. should be an integer >= 1. high values can impact performance.

```javascript
packer.setCollisionPasses(3);
```

back to [reference](#reference)

## setCorrectionPasses(number)

updates number of correction passes. should be an integer >= 0. high values can impact performance.

```javascript
packer.setCorrectionPasses(3);
```

back to [reference](#reference)

## setDamping(number)

set damping. this affects the movement speed of the circles. value should be a float between 0 and 1. the _default_ value is _0.025_

```javascript
packer.setDamping(0.01);
```

back to [reference](#reference)

## setCenterPull(boolean)

set center pull. if set to `false`, circles collide, but are not pulled to the center. the _default_ value is `true`.

```javascript
packer.setCenterPull(false);
```

back to [reference](#reference)

## setCalculateOverlap(boolean)

set calculate overlap. if set to `false`, overlap information will not be returned on the `onMove` callback.

```javascript
packer.setCalculateOverlap(true);
```

back to [reference](#reference)

## update()

starts calculation. useful if `continuousMode` was set to `false`.

```javascript
packer.update();
```

back to [reference](#reference)

## dragStart(circleId)

indicate that we're about to start dragging this circle. this is usually called in a `mousedown` or a `touchstart` event handler.

```javascript
packer.dragStart('circle2');
```

back to [reference](#reference)

## drag(circleId, position)

update position of dragges circle. a _position_ object should have `x` and `y` values. this is usually called in a `mousemove` or a `touchmove` event handler.

```javascript
packer.drag('circle2', { x: 30, y: 45 });
```

back to [reference](#reference)

## dragEnd(circleId)

indicate that we're done dragging this circle. this is usually called in an `mouseup` or a `touchend` event handler.

```javascript
packer.dragEnd('circle2');
```

back to [reference](#reference)

## pinCircle(circleId)

pin circle. this means that the circle is static and will not move. other circles will still be bounce off of it.

```javascript
packer.pinCircle('circle2');
```

back to [reference](#reference)

## unpinCircle(circleId)

unpin circle. this means that the circle is no longer static and will start colliding with other circles as normal.

```javascript
packer.unpinCircle('circle2');
```

back to [reference](#reference)

## setCircleRadius(circleId, number)

change the radius of a circle.

```javascript
packer.setCircleRadius('circle2', 20);
```

back to [reference](#reference)

## setCircleCenterPull(circleId, boolean)

change the `isPulledToCenter` value of a circle. if it is set to `false`, the circle is not pulled to the center. (it still collides with other circles).

```javascript
packer.setCircleCenterPull('circle2', true);
```

back to [reference](#reference)

## destroy()

tell circlepacker instance we're done and won't be needing it again. it terminates the webworker. useful for lifecycle hooks in single page web apps.

```javascript
packer.destroy();
```

back to [reference](#reference)

## pack(options)

shorthand for `new CirclePacker({continuousMode: false})`

returns a promise

```javascript
import { pack } from 'circlepacker';
const { updatedCircles, target, overlappingCircles } = await pack(packerOptions);
```

back to [reference](#reference)

# development

the source code is located in the `src` folder, the built source files are located in the `dist` folder.

`npm run build` will run the build script (`build.mjs`) that compiles all files in the `dist` folder.

`npm run test` will run the tests on the `src/` folder.

`npm run test:all` will run the tests on the `src/` and `/dist` folders.

# license

[mit](LICENSE)

# credits

Mario Gonzalez &lt;mariogonzalez@gmail.com&gt;
Georg Fischer &lt;hi@snorpey.com&gt;

large parts of the circle packing algirithm are based on the [CirclePackingJS](https://github.com/onedayitwillmake/CirclePackingJS) repo by [@onedayitwillmake](https://github.com/onedayitwillmake) (mit licensed)

# missing something?

found a bug? missing a feature? instructions unclear? are you using this library in an interesting project? maybe open an issue or a pull request to let me know. thanks!

# most importantly

**thank you** for taking a look at this repo. and reading the readme file until the end. have a great day :)
