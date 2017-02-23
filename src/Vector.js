// most of this code is taken from here:
// https://github.com/snorpey/CirclePackingJS/blob/master/js-module/web/js/lib/Vector.js
// by @onedayitwillmake / Mario Gonzalez with some changes by @snorpey

export default class Vector {
	constructor ( x, y ) {
		if ( typeof x === 'object' ) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	cp () {
		return new Vector( this.x, this.y );
	}

	mul ( factor ) {
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	normalize () {
		var l = this.length();
		this.x /= l;
		this.y /= l;
		return this;
	}

	length () {
		var length = Math.sqrt( this.x * this.x + this.y * this.y );
		
		if ( length < 0.005 && length > -0.005 ) {
			return 0.000001;
		}

		return length;
	}

	distance ( vec ) {
		var deltaX = this.x - vec.x;
		var deltaY = this.y - vec.y;
		return Math.sqrt( ( deltaX * deltaX ) + ( deltaY * deltaY ) );
	}

	distanceSquared ( vec ) {
		var deltaX = this.x - vec.x;
		var deltaY = this.y - vec.y;
		return ( deltaX * deltaX ) + ( deltaY * deltaY );
	}
}