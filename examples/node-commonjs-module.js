const { CirclePacker, pack } = require('../dist/circlepacker.cjs.js');

// CirclePacker Node CommonJS Module Example
// run node node-commonjs-module.js to run this example

const circles = generateRandomCircles();
const bounds = { width: 300, height: 300 };
const target = { x: bounds.width / 2, y: bounds.height / 2 };

// use CirclePacker instance
new CirclePacker({
	circles,
	bounds,
	target,
	continuousMode: false,
	correctionPasses: 20,
	onMove(circles) {
		console.log({ circles });
	},
});

// use pack function
pack({
	circles,
	bounds,
	target,
	continuousMode: false,
	correctionPasses: 20,
}).then(({ updatedCircles }) => {
	console.log(updatedCircles);
});

// generate random circle data
function generateRandomCircles(
	params = {
		circleCount: 10,
		containerHeight: 300,
		containerWidth: 300,
		minRadius: 10,
		maxRadius: 50,
	}
) {
	const {
		circleCount = 10,
		containerHeight = 300,
		containerWidth = 300,
		minRadius = 10,
		maxRadius = 50,
	} = params;

	return [...new Array(circleCount).keys()].map(index => {
		const radius = Math.round(minRadius + Math.random() * (maxRadius - minRadius));
		const x = Math.round(Math.random() * (containerWidth - radius));
		const y = Math.round(Math.random() * (containerHeight - radius));

		return {
			id: `circle-${index + 1}`,
			position: {
				x,
				y,
			},
			radius,
		};
	});
}
