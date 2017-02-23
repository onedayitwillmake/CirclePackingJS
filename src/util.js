export function random ( min, max, intResult ) {
	if ( typeof min !== 'number' && typeof max !== 'number' ) {
		min = 0;
		max = 1;
	}

	if ( typeof max !== 'number' ) {
		max = min;
		min = 0;
	}

	let result = min + Math.random() * ( max - min );

	if ( intResult ) {
		result = parseInt( result, 10 );
	}

	return result;
}

export function sendWorkerMessage ( worker, msg ) {
	worker.postMessage( JSON.stringify( msg ) );
}

export function processWorkerMessage ( event ) {
	return event.data ? JSON.parse( event.data ) : { };
}

export function isCircleValid ( circle ) {
	return circle &&
		circle.id &&
		circle.radius &&
		circle.position &&
		typeof circle.position.x === 'number' &&
		typeof circle.position.y === 'number'
}

export function isBoundsValid ( bounds ) {
	return bounds &&
		typeof bounds.width === 'number' &&
		typeof bounds.height === 'number'
}