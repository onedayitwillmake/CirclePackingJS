export const circles = [
	{
		id: 'circle-1',
		position: {
			x: 46,
			y: 28,
		},
		radius: 49,
	},
	{
		id: 'circle-2',
		position: {
			x: 1,
			y: 37,
		},
		radius: 30,
	},
	{
		id: 'circle-3',
		position: {
			x: 101,
			y: 185,
		},
		radius: 24,
	},
	{
		id: 'circle-4',
		position: {
			x: 74,
			y: 191,
		},
		radius: 38,
	},
	{
		id: 'circle-5',
		position: {
			x: 90,
			y: 51,
		},
		radius: 49,
	},
	{
		id: 'circle-6',
		position: {
			x: 156,
			y: 36,
		},
		radius: 49,
	},
	{
		id: 'circle-7',
		position: {
			x: 191,
			y: 190,
		},
		radius: 13,
	},
	{
		id: 'circle-8',
		position: {
			x: 218,
			y: 46,
		},
		radius: 50,
	},
	{
		id: 'circle-9',
		position: {
			x: 267,
			y: 252,
		},
		radius: 29,
	},
	{
		id: 'circle-10',
		position: {
			x: 39,
			y: 87,
		},
		radius: 42,
	},
];

export const circleIds = circles.map(circle => circle.id);
export const bounds = { width: 300, height: 300 };
export const target = { x: bounds.width / 2, y: bounds.height / 2 };

export const circlesNoBoundsNoTarget = {
	'circle-1': {
		id: 'circle-1',
		position: {
			x: 45.00672653523102,
			y: -9.006428738706896,
		},
		previousPosition: {
			x: 46,
			y: 28,
		},
		radius: 49,
		delta: {
			x: -0.9932734647689827,
			y: -37.006428738706894,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-2': {
		id: 'circle-2',
		position: {
			x: -27.294486362656688,
			y: 36.899003827363934,
		},
		previousPosition: {
			x: 1,
			y: 37,
		},
		radius: 30,
		delta: {
			x: -28.294486362656688,
			y: -0.10099617263606575,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-3': {
		id: 'circle-3',
		position: {
			x: 120.18274277495874,
			y: 180.7371682722314,
		},
		previousPosition: {
			x: 101,
			y: 185,
		},
		radius: 24,
		delta: {
			x: 19.18274277495874,
			y: -4.262831727768599,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-4': {
		id: 'circle-4',
		position: {
			x: 54.81725722504126,
			y: 195.2628317277686,
		},
		previousPosition: {
			x: 74,
			y: 191,
		},
		radius: 38,
		delta: {
			x: -19.18274277495874,
			y: 4.262831727768599,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-5': {
		id: 'circle-5',
		position: {
			x: 118.31889858882806,
			y: 99.57545797092591,
		},
		previousPosition: {
			x: 90,
			y: 51,
		},
		radius: 49,
		delta: {
			x: 28.318898588828063,
			y: 48.57545797092591,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-6': {
		id: 'circle-6',
		position: {
			x: 152.22911294192187,
			y: -0.5470639065586167,
		},
		previousPosition: {
			x: 156,
			y: 36,
		},
		radius: 49,
		delta: {
			x: -3.770887058078131,
			y: -36.54706390655862,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-7': {
		id: 'circle-7',
		position: {
			x: 191,
			y: 190,
		},
		previousPosition: {
			x: 191,
			y: 190,
		},
		radius: 13,
		delta: {
			x: 0,
			y: 0,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-8': {
		id: 'circle-8',
		position: {
			x: 241.69196844549788,
			y: 59.824792786076074,
		},
		previousPosition: {
			x: 218,
			y: 46,
		},
		radius: 50,
		delta: {
			x: 23.691968445497878,
			y: 13.824792786076074,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-9': {
		id: 'circle-9',
		position: {
			x: 267,
			y: 252,
		},
		previousPosition: {
			x: 267,
			y: 252,
		},
		radius: 29,
		delta: {
			x: 0,
			y: 0,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-10': {
		id: 'circle-10',
		position: {
			x: 20.047779851177843,
			y: 98.2542380608996,
		},
		previousPosition: {
			x: 39,
			y: 87,
		},
		radius: 42,
		delta: {
			x: -18.952220148822157,
			y: 11.254238060899596,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
};

// export const circlesNoBoundsNoTarget = {
// 	'circle-1': {
// 		id: 'circle-1',
// 		position: {
// 			x: 45.00672653523102,
// 			y: -9.006428738706896,
// 		},
// 		previousPosition: {
// 			x: 46,
// 			y: 28,
// 		},
// 		radius: 49,
// 		delta: {
// 			x: -0.9932734647689827,
// 			y: -37.006428738706894,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-2': {
// 		id: 'circle-2',
// 		position: {
// 			x: -27.294486362656688,
// 			y: 36.899003827363934,
// 		},
// 		previousPosition: {
// 			x: 1,
// 			y: 37,
// 		},
// 		radius: 30,
// 		delta: {
// 			x: -28.294486362656688,
// 			y: -0.10099617263606575,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-3': {
// 		id: 'circle-3',
// 		position: {
// 			x: 120.18274277495874,
// 			y: 180.7371682722314,
// 		},
// 		previousPosition: {
// 			x: 101,
// 			y: 185,
// 		},
// 		radius: 24,
// 		delta: {
// 			x: 19.18274277495874,
// 			y: -4.262831727768599,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-4': {
// 		id: 'circle-4',
// 		position: {
// 			x: 54.81725722504126,
// 			y: 195.2628317277686,
// 		},
// 		previousPosition: {
// 			x: 74,
// 			y: 191,
// 		},
// 		radius: 38,
// 		delta: {
// 			x: -19.18274277495874,
// 			y: 4.262831727768599,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-5': {
// 		id: 'circle-5',
// 		position: {
// 			x: 118.31889858882806,
// 			y: 99.57545797092591,
// 		},
// 		previousPosition: {
// 			x: 90,
// 			y: 51,
// 		},
// 		radius: 49,
// 		delta: {
// 			x: 28.318898588828063,
// 			y: 48.57545797092591,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-6': {
// 		id: 'circle-6',
// 		position: {
// 			x: 152.22911294192187,
// 			y: -0.5470639065586167,
// 		},
// 		previousPosition: {
// 			x: 156,
// 			y: 36,
// 		},
// 		radius: 49,
// 		delta: {
// 			x: -3.770887058078131,
// 			y: -36.54706390655862,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-7': {
// 		id: 'circle-7',
// 		position: {
// 			x: 191,
// 			y: 190,
// 		},
// 		previousPosition: {
// 			x: 191,
// 			y: 190,
// 		},
// 		radius: 13,
// 		delta: {
// 			x: 0,
// 			y: 0,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-8': {
// 		id: 'circle-8',
// 		position: {
// 			x: 241.69196844549788,
// 			y: 59.824792786076074,
// 		},
// 		previousPosition: {
// 			x: 218,
// 			y: 46,
// 		},
// 		radius: 50,
// 		delta: {
// 			x: 23.691968445497878,
// 			y: 13.824792786076074,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-9': {
// 		id: 'circle-9',
// 		position: {
// 			x: 267,
// 			y: 252,
// 		},
// 		previousPosition: {
// 			x: 267,
// 			y: 252,
// 		},
// 		radius: 29,
// 		delta: {
// 			x: 0,
// 			y: 0,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// 	'circle-10': {
// 		id: 'circle-10',
// 		position: {
// 			x: 20.047779851177843,
// 			y: 98.2542380608996,
// 		},
// 		previousPosition: {
// 			x: 39,
// 			y: 87,
// 		},
// 		radius: 42,
// 		delta: {
// 			x: -18.952220148822157,
// 			y: 11.254238060899596,
// 		},
// 		isPulledToTarget: true,
// 		isPinned: false,
// 	},
// };

export const circlesNoTarget = {
	'circle-1': {
		id: 'circle-1',
		position: {
			x: 49,
			y: 49,
		},
		previousPosition: {
			x: 46,
			y: 28,
		},
		radius: 49,
		delta: {
			x: 3,
			y: 21,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-2': {
		id: 'circle-2',
		position: {
			x: 30,
			y: 36.899003827363934,
		},
		previousPosition: {
			x: 1,
			y: 37,
		},
		radius: 30,
		delta: {
			x: 29,
			y: -0.10099617263606575,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-3': {
		id: 'circle-3',
		position: {
			x: 120.18274277495874,
			y: 180.7371682722314,
		},
		previousPosition: {
			x: 101,
			y: 185,
		},
		radius: 24,
		delta: {
			x: 19.18274277495874,
			y: -4.262831727768599,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-4': {
		id: 'circle-4',
		position: {
			x: 54.81725722504126,
			y: 195.2628317277686,
		},
		previousPosition: {
			x: 74,
			y: 191,
		},
		radius: 38,
		delta: {
			x: -19.18274277495874,
			y: 4.262831727768599,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-5': {
		id: 'circle-5',
		position: {
			x: 118.31889858882806,
			y: 99.57545797092591,
		},
		previousPosition: {
			x: 90,
			y: 51,
		},
		radius: 49,
		delta: {
			x: 28.318898588828063,
			y: 48.57545797092591,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-6': {
		id: 'circle-6',
		position: {
			x: 152.22911294192187,
			y: 49,
		},
		previousPosition: {
			x: 156,
			y: 36,
		},
		radius: 49,
		delta: {
			x: -3.770887058078131,
			y: 13,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-7': {
		id: 'circle-7',
		position: {
			x: 191,
			y: 190,
		},
		previousPosition: {
			x: 191,
			y: 190,
		},
		radius: 13,
		delta: {
			x: 0,
			y: 0,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-8': {
		id: 'circle-8',
		position: {
			x: 241.69196844549788,
			y: 59.824792786076074,
		},
		previousPosition: {
			x: 218,
			y: 46,
		},
		radius: 50,
		delta: {
			x: 23.691968445497878,
			y: 13.824792786076074,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-9': {
		id: 'circle-9',
		position: {
			x: 267,
			y: 252,
		},
		previousPosition: {
			x: 267,
			y: 252,
		},
		radius: 29,
		delta: {
			x: 0,
			y: 0,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-10': {
		id: 'circle-10',
		position: {
			x: 42,
			y: 98.2542380608996,
		},
		previousPosition: {
			x: 39,
			y: 87,
		},
		radius: 42,
		delta: {
			x: 3,
			y: 11.254238060899596,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
};

export const overlappingCircles = {
	'circle-1': [
		{
			overlappingCircleId: 'circle-2',
			overlapDistance: 57.51263044076963,
		},
		{
			overlappingCircleId: 'circle-5',
			overlapDistance: 7.992127061648603,
		},
		{
			overlappingCircleId: 'circle-10',
			overlapDistance: 39.69643267644896,
		},
	],
	'circle-2': [
		{
			overlappingCircleId: 'circle-1',
			overlapDistance: 57.51263044076963,
		},
		{
			overlappingCircleId: 'circle-10',
			overlapDistance: 9.969155074134605,
		},
	],
	'circle-5': [
		{
			overlappingCircleId: 'circle-1',
			overlapDistance: 7.992127061648603,
		},
		{
			overlappingCircleId: 'circle-6',
			overlapDistance: 35.638071562976386,
		},
		{
			overlappingCircleId: 'circle-10',
			overlapDistance: 11.811018139643906,
		},
	],
	'circle-6': [
		{
			overlappingCircleId: 'circle-5',
			overlapDistance: 35.638071562976386,
		},
		{
			overlappingCircleId: 'circle-8',
			overlapDistance: 9.995633419050364,
		},
	],
	'circle-8': [
		{
			overlappingCircleId: 'circle-6',
			overlapDistance: 9.995633419050364,
		},
	],
	'circle-10': [
		{
			overlappingCircleId: 'circle-1',
			overlapDistance: 39.69643267644896,
		},
		{
			overlappingCircleId: 'circle-2',
			overlapDistance: 9.969155074134605,
		},
		{
			overlappingCircleId: 'circle-5',
			overlapDistance: 11.811018139643906,
		},
	],
};

export const circlesBoundsAndTarget = {
	'circle-1': {
		id: 'circle-1',
		position: {
			x: 49,
			y: 49,
		},
		previousPosition: {
			x: 46,
			y: 28,
		},
		radius: 49,
		delta: {
			x: 3,
			y: 21,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-2': {
		id: 'circle-2',
		position: {
			x: 30,
			y: 38.964709741370704,
		},
		previousPosition: {
			x: 1,
			y: 37,
		},
		radius: 30,
		delta: {
			x: 29,
			y: 1.9647097413707044,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-3': {
		id: 'circle-3',
		position: {
			x: 121.75625187758772,
			y: 180.81139615762123,
		},
		previousPosition: {
			x: 101,
			y: 185,
		},
		radius: 24,
		delta: {
			x: 20.756251877587715,
			y: -4.188603842378768,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-4': {
		id: 'circle-4',
		position: {
			x: 56.37975722504126,
			y: 194.3128317277686,
		},
		previousPosition: {
			x: 74,
			y: 191,
		},
		radius: 38,
		delta: {
			x: -17.62024277495874,
			y: 3.312831727768611,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-5': {
		id: 'circle-5',
		position: {
			x: 121.13162459412214,
			y: 102.8372169070713,
		},
		previousPosition: {
			x: 90,
			y: 51,
		},
		radius: 49,
		delta: {
			x: 31.131624594122144,
			y: 51.837216907071294,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-6': {
		id: 'circle-6',
		position: {
			x: 152.60485439478626,
			y: 49,
		},
		previousPosition: {
			x: 156,
			y: 36,
		},
		radius: 49,
		delta: {
			x: -3.3951456052137416,
			y: 13,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-7': {
		id: 'circle-7',
		position: {
			x: 189.975,
			y: 189,
		},
		previousPosition: {
			x: 191,
			y: 190,
		},
		radius: 13,
		delta: {
			x: -1.0250000000000057,
			y: -1,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-8': {
		id: 'circle-8',
		position: {
			x: 240.4466070917765,
			y: 63.33888955243288,
		},
		previousPosition: {
			x: 218,
			y: 46,
		},
		radius: 50,
		delta: {
			x: 22.446607091776514,
			y: 17.33888955243288,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-9': {
		id: 'circle-9',
		position: {
			x: 264.075,
			y: 249.45,
		},
		previousPosition: {
			x: 267,
			y: 252,
		},
		radius: 29,
		delta: {
			x: -2.9250000000000114,
			y: -2.5500000000000114,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-10': {
		id: 'circle-10',
		position: {
			x: 42,
			y: 99.8237741625131,
		},
		previousPosition: {
			x: 39,
			y: 87,
		},
		radius: 42,
		delta: {
			x: 3,
			y: 12.823774162513104,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
};

export const circlesWithCorrectionPasses = {
	'circle-1': {
		id: 'circle-1',
		position: {
			x: 105.42893457589469,
			y: 55.94080530772404,
		},
		previousPosition: {
			x: 46,
			y: 28,
		},
		radius: 49,
		delta: {
			x: 59.42893457589469,
			y: 27.94080530772404,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-2': {
		id: 'circle-2',
		position: {
			x: 30,
			y: 30,
		},
		previousPosition: {
			x: 1,
			y: 37,
		},
		radius: 30,
		delta: {
			x: 29,
			y: -7,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-3': {
		id: 'circle-3',
		position: {
			x: 117.96427483238749,
			y: 227.4021823361953,
		},
		previousPosition: {
			x: 101,
			y: 185,
		},
		radius: 24,
		delta: {
			x: 16.96427483238749,
			y: 42.402182336195295,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-4': {
		id: 'circle-4',
		position: {
			x: 51.10055867166166,
			y: 224.65357283922694,
		},
		previousPosition: {
			x: 74,
			y: 191,
		},
		radius: 38,
		delta: {
			x: -22.89944132833834,
			y: 33.65357283922694,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-5': {
		id: 'circle-5',
		position: {
			x: 145.94174141318445,
			y: 153.69324825273162,
		},
		previousPosition: {
			x: 90,
			y: 51,
		},
		radius: 49,
		delta: {
			x: 55.941741413184445,
			y: 102.69324825273162,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-6': {
		id: 'circle-6',
		position: {
			x: 210.88321287209757,
			y: 49,
		},
		previousPosition: {
			x: 156,
			y: 36,
		},
		radius: 49,
		delta: {
			x: 54.88321287209757,
			y: 13,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-7': {
		id: 'circle-7',
		position: {
			x: 197.69990889530067,
			y: 197.3122952997837,
		},
		previousPosition: {
			x: 191,
			y: 190,
		},
		radius: 13,
		delta: {
			x: 6.699908895300666,
			y: 7.312295299783699,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-8': {
		id: 'circle-8',
		position: {
			x: 250,
			y: 145.4884516641736,
		},
		previousPosition: {
			x: 218,
			y: 46,
		},
		radius: 50,
		delta: {
			x: 32,
			y: 99.4884516641736,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-9': {
		id: 'circle-9',
		position: {
			x: 264.075,
			y: 249.45,
		},
		previousPosition: {
			x: 267,
			y: 252,
		},
		radius: 29,
		delta: {
			x: -2.9250000000000114,
			y: -2.5500000000000114,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
	'circle-10': {
		id: 'circle-10',
		position: {
			x: 42,
			y: 138.73435289806181,
		},
		previousPosition: {
			x: 39,
			y: 87,
		},
		radius: 42,
		delta: {
			x: 3,
			y: 51.734352898061815,
		},
		isPulledToTarget: true,
		isPinned: false,
	},
};
