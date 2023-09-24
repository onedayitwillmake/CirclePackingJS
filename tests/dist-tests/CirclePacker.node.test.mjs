import { assert, expect, test } from 'vitest';
import { CirclePacker, pack } from '../../dist/circlepacker.node.mjs';

import {
	circles,
	circleIds,
	bounds,
	target,
	circlesNoBoundsNoTarget,
	circlesNoTarget,
	circlesBoundsAndTarget,
	circlesWithCorrectionPasses,
	overlappingCircles,
} from '../testData.js';

const runTests = (CirclePacker, pack, workerPath = undefined) => {
	test('empty initialisation', () => {
		const circlePacker = new CirclePacker({ workerPath });

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMove).toEqual(null);
	});

	test('initualisation with webworker', () => {
		const circlePacker = new CirclePacker({
			continuousMode: false,
		});

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMove).toEqual(null);
	});

	test('initialisation without webworker', () => {
		const circlePacker = new CirclePacker({
			useWorker: false,
		});

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMove).toEqual(null);
	});

	test('calculate positions: no worker, no target, no bounds', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				useWorker: false,
				continuousMode: false,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test('calculate positions: has worker, no target, no bounds', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test('calculate positions: has worker, no target, has bounds', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				bounds,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoTarget);
	});

	test('calculate positions: has worker, has target, has bounds', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				bounds,
				target,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesBoundsAndTarget);
	});

	test('calculate positions: with correction passes', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				bounds,
				target,
				correctionPasses: 20,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesWithCorrectionPasses);
	});

	test('calculate overlapping circles', async () => {
		const overlaps = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				bounds,
				target,
				calculateOverlap: true,
				onMove: (c, t, overlaps) => {
					resolve(overlaps);
				},
			});
		});

		expect(overlaps).toEqual(overlappingCircles);
	});

	test('pass attraction target in callback', async () => {
		const attractionTarget = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				bounds,
				target,
				calculateOverlap: true,
				onMove: (c, target, o) => {
					resolve(target);
				},
			});
		});

		expect(attractionTarget).toEqual(target);
	});

	test('pin circle', async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles: [{ ...circles[0], isPinned: true }],
				continuousMode: false,
				bounds,
				target,
				calculateOverlap: true,
				onMove: (updatedCircles, t, o) => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles['circle-1'].isPinned).toEqual(true);
	});

	test('pack function: no worker, no target, no bounds', async () => {
		const { updatedCircles } = await pack({ circles, useWorker: false });

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test('pack function: has worker, no target, no bounds', async () => {
		const { updatedCircles } = await pack({
			circles,
		});

		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test('pack function: has worker, has target, has bounds', async () => {
		const { updatedCircles } = await pack({
			circles,
			bounds,
			target,
		});

		expect(updatedCircles).toEqual(circlesBoundsAndTarget);
	});

	test('pack function: with correction passes', async () => {
		const { updatedCircles } = await pack({
			circles,
			bounds,
			target,
			correctionPasses: 20,
		});

		expect(updatedCircles).toEqual(circlesWithCorrectionPasses);
	});

	test('pack function: overlapping circles', async () => {
		const { overlappingCircles: overlaps } = await pack({
			circles,
			bounds,
			target,
			calculateOverlap: true,
		});

		expect(overlaps).toEqual(overlappingCircles);
	});
};

runTests(CirclePacker, pack);
