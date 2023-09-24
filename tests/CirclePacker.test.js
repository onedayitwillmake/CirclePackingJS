import { assert, expect, test } from 'vitest';
import { CirclePacker, pack } from '../src/CirclePacker.js';

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
} from './testData.js';

export const runBrowserTests = (CirclePacker, pack, workerPath = undefined, testType = 'src') => {
	test(`${testType} empty initialisation`, () => {
		const circlePacker = new CirclePacker({ workerPath });

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.areItemsMoving).toEqual(false);
		expect(circlePacker.animationFrameId).toBeDefined();
		expect(circlePacker.isLooping).toEqual(false);
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMoveStart).toEqual(null);
		expect(circlePacker.onMoveEnd).toEqual(null);
		expect(circlePacker.onMove).toEqual(null);
		expect(circlePacker.isContinuousModeActive).toEqual(true);
	});

	test(`${testType} initualisation with webworker`, () => {
		const circlePacker = new CirclePacker({
			workerPath,
			continuousMode: false,
		});

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.areItemsMoving).toEqual(false);
		expect(circlePacker.animationFrameId).toBeDefined();
		expect(circlePacker.isLooping).toEqual(false);
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMoveStart).toEqual(null);
		expect(circlePacker.onMoveEnd).toEqual(null);
		expect(circlePacker.onMove).toEqual(null);
		expect(circlePacker.isContinuousModeActive).toBeFalsy();
	});

	test(`${testType} initialisation without webworker`, () => {
		const circlePacker = new CirclePacker({
			useWorker: false,
		});

		expect(circlePacker).toBeInstanceOf(CirclePacker);
		expect(circlePacker.addCircle).toBeDefined();
		expect(circlePacker.addCircles).toBeDefined();
		expect(circlePacker.areItemsMoving).toEqual(false);
		expect(circlePacker.animationFrameId).toBeDefined();
		expect(circlePacker.isLooping).toEqual(false);
		expect(circlePacker.lastCirclePositions).toEqual({});
		expect(circlePacker.onMoveStart).toEqual(null);
		expect(circlePacker.onMoveEnd).toEqual(null);
		expect(circlePacker.onMove).toEqual(null);
		expect(circlePacker.isContinuousModeActive).toBeTruthy();
	});

	test(`${testType} calculate positions: no worker, no target, no bounds`, async () => {
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

	test(`${testType} calculate positions: has worker, no target, no bounds`, async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				workerPath,
				onMove: updatedCircles => {
					resolve(updatedCircles);
				},
			});
		});

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test(`${testType} calculate positions: has worker, no target, has bounds`, async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				workerPath,
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

	test(`${testType} calculate positions: has worker, has target, has bounds`, async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				workerPath,
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

	test(`${testType} calculate positions: with correction passes`, async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				circles,
				continuousMode: false,
				workerPath,
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

	test(`${testType} calculate overlapping circles`, async () => {
		const overlaps = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				workerPath,
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

	test(`${testType} pass attraction target in callback`, async () => {
		const attractionTarget = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				workerPath,
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

	test(`${testType} pin circle`, async () => {
		const updatedCircles = await new Promise(resolve => {
			const circlePacker = new CirclePacker({
				workerPath,
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

	test(`${testType} pack function: no worker, no target, no bounds`, async () => {
		const { updatedCircles } = await pack({ circles, useWorker: false });

		expect(updatedCircles).toBeTypeOf('object');
		expect(Object.keys(updatedCircles)).toEqual(circleIds);
		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test(`${testType} pack function: has worker, no target, no bounds`, async () => {
		const { updatedCircles } = await pack({
			circles,
			workerPath,
		});

		expect(updatedCircles).toEqual(circlesNoBoundsNoTarget);
	});

	test(`${testType} pack function: has worker, has target, has bounds`, async () => {
		const { updatedCircles } = await pack({
			circles,
			bounds,
			target,
			workerPath,
		});

		expect(updatedCircles).toEqual(circlesBoundsAndTarget);
	});

	test(`${testType} pack function: with correction passes`, async () => {
		const { updatedCircles } = await pack({
			circles,
			bounds,
			target,
			workerPath,
			correctionPasses: 20,
		});

		expect(updatedCircles).toEqual(circlesWithCorrectionPasses);
	});

	test(`${testType} pack function: overlapping circles`, async () => {
		const { overlappingCircles: overlaps } = await pack({
			circles,
			bounds,
			target,
			workerPath,
			calculateOverlap: true,
		});

		expect(overlaps).toEqual(overlappingCircles);
	});
};

runBrowserTests(CirclePacker, pack, '../src/CirclePackWorker.js', 'src');
