import CirclePacker from '../dist/circlepacker.es6.js';
import { random } from '../src/util.js';

const containerEl = document.querySelector( '.container' );
const addButtonEl = document.querySelector( '#add-circle' );
const deleteButtonEl = document.querySelector( '#delete-circle' );
const randomButtonEl = document.querySelector( '#random-size' );

// references to all circle elements
const circleEls = { };

// dimenstions of container
const rect = containerEl.getBoundingClientRect();
let bounds = { width: rect.width, height: rect.height };
const target = { x: bounds.width / 2, y: bounds.height / 2 };

var isDragging = false;

let circles = [
	createCircle(),
	createCircle(),
	createCircle(),
	createCircle(),
	createCircle()
];

const packer = new CirclePacker( {
	bounds,
	target,
	circles,
	onMove: render,
	continuousMode: false,
	collisionPasses: 5,
	centeringPasses: 200
} );

addButtonEl.addEventListener( 'click', addRandomCircle );
deleteButtonEl.addEventListener( 'click', removeRandomCircle );
randomButtonEl.addEventListener( 'click', setRandomBounds );

packer.update();

function addRandomCircle () {
	packer.addCircle( createCircle() );
	packer.update();
}

function removeRandomCircle () {
	const ids = Object.keys( circleEls );
	const idToDelete = ids[random( 0, ids.length, true )];

	removeCircle( idToDelete );
	packer.update();
}

function setRandomBounds () {
	bounds = {
		width: random( 200, 500, true ),
		height: random( 200, 500, true )
	};

	containerEl.style.width = bounds.width + 'px';
	containerEl.style.height = bounds.height + 'px';

	packer.setBounds( bounds );
}

// create circle dom object, return circle data
function createCircle ( x, y, radius ) {
	radius = radius || random( 10, 40 );
	x = x || random( radius, bounds.width - radius );
	y = y || random( radius, bounds.height - radius );

	const diameter = radius * 2;
	const circleEl = document.createElement( 'div' );
	
	// need some sort of unique id...
	const id = 'circle-' + random( 0, 1000, true ) + '-' + Date.now();

	const circle =  {
		id: id,
		radius: radius,
		position: {
			x: random( radius, bounds.width - radius ),
			y: random( radius, bounds.height - radius )
		}
	};

	// create circle el
	
	circleEl.id = id;
	circleEl.style.width = diameter + 'px';
	circleEl.style.height = diameter + 'px';
	circleEl.style.borderRadius = diameter + 'px';
	circleEl.classList.add( 'circle' );
		
	containerEl.appendChild( circleEl );

	circleEls[id] = circleEl;

	return circle;
}

function removeCircle ( id ) {
	packer.removeCircle( id );
	
	requestAnimationFrame( function () {
		containerEl.removeChild( circleEls[id] );
		delete circleEls[id];
	} );
}

function render ( circles ) {
	requestAnimationFrame( function () {
		for ( let id in circles ) {
			const circleEl = circleEls[id];

			if ( circleEl ) {
				const circle = circles[id];
				const x = circle.position.x - circle.radius;
				const y = circle.position.y - circle.radius;

				// actually move the circles around
				circleEl.style.transform = `translateX(${ x }px) translateY(${ y }px)`;
				circleEl.classList.add( 'is-visible' );
			}
		}
	} );
}