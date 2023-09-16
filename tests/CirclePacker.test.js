import { assert, expect, test } from 'vitest';
import CirclePacker from '../src/CirclePacker.js';

test('empty init', () => {
	const circlePacker = new CirclePacker({ workerPath: '../src/CirclePackWorker.js' });

	expect(circlePacker).toBeInstanceOf(CirclePacker);
	expect(circlePacker.addCircle).toBeDefined();
	expect(circlePacker.addCircles).toBeDefined();
	expect(circlePacker.areItemsMoving).toEqual(false);
	expect(circlePacker.animationFrameId).toBeDefined();
	expect(circlePacker.initialized).toEqual(true);
	expect(circlePacker.isLooping).toEqual(true);
	expect(circlePacker.lastCirclePositions).toEqual([]);
	expect(circlePacker.onMoveStart).toEqual(null);
	expect(circlePacker.onMoveEnd).toEqual(null);
	expect(circlePacker.onMove).toEqual(null);
	expect(circlePacker.isContinuousModeActive).toEqual(true);
});

test('static init', () => {
	const circlePacker = new CirclePacker({
		workerPath: '../src/CirclePackWorker.js',
		continuousMode: false,
	});

	expect(circlePacker).toBeInstanceOf(CirclePacker);
	expect(circlePacker.addCircle).toBeDefined();
	expect(circlePacker.addCircles).toBeDefined();
	expect(circlePacker.areItemsMoving).toEqual(false);
	expect(circlePacker.animationFrameId).toBeDefined();
	expect(circlePacker.initialized).toEqual(true);
	expect(circlePacker.isLooping).toEqual(false);
	expect(circlePacker.lastCirclePositions).toEqual([]);
	expect(circlePacker.onMoveStart).toEqual(null);
	expect(circlePacker.onMoveEnd).toEqual(null);
	expect(circlePacker.onMove).toEqual(null);
	expect(circlePacker.isContinuousModeActive).toBeFalsy();
});
