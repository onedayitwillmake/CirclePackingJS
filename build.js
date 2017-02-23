var fs = require( 'fs' );
var rollup = require( 'rollup' );
var buble = require( 'rollup-plugin-buble' );
var UglifyJS = require( 'uglify-js' );
var program = require( 'commander' );

program
	.version( '0.0.1' )
	.option('-e, --es5', 'make output files es5 compatible' )
	.option('-m, --minify', 'minify output' )
	.parse( process.argv );

var globalPath = 'src/';
var buildPath = 'dist/';
var minifyExtension = 'min';
var es6Extension = 'es6';

var moduleName = 'CirclePacker';
var mainFilePath = 'CirclePacker.js';

var es5Build = !! program.es5;
var minifyBuild = !! program.minify;

console.log( 'starting build with options: es5:', es5Build, 'minify:', minifyBuild );

createES6Bundle( globalPath + mainFilePath )
	.then( ( fileContent ) => {
		console.log( 'build complete. file saved to ' + buildPath + getOutputFileName( mainFilePath ) );
	} );

function createES6Bundle ( filePath ) {
	const format = es5Build ? 'umd' : 'es';

	return processES6File( filePath, format, moduleName )
		.then( ( fileContent ) => {
			return processFileContent( fileContent );
		} )
		.then( ( fileContent ) => {
			return saveFile( buildPath + getOutputFileName( mainFilePath ), fileContent );
		} );
}

function processES6File ( filePath, format = 'es', moduleName ) {
	const rollupOptions = { entry: filePath };

	if ( es5Build ) {
		rollupOptions.plugins = [ buble() ];
	}

	return rollup.rollup( rollupOptions )
		.then( ( bundle ) => {
			const bundleOpts = { format };

			if ( moduleName ) {
				bundleOpts.moduleName = moduleName;
			}

			return bundle.generate( bundleOpts ).code;
		} );
}

function processFileContent ( fileContent ) {
	return replaceImportedScripts ( fileContent )
		.then( fileContent => {
			return workersToBlobURL( fileContent );
		} )
		.then( fileContent => {
			if ( minifyBuild ) {
				return compressFileContent( fileContent );
			} else {
				return fileContent;
			}
		} );
}

function loadFile ( path ) {
	return new Promise( function ( resolve, reject ) {
		fs.readFile( path, 'utf8', ( err, data ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( data );
			}
		} );
	} );
}

function saveFile ( filePath, fileContent ) {
	return new Promise( function ( resolve, reject ) {
		fs.writeFile( filePath, fileContent, 'utf8', ( err, res ) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( fileContent );
			}
		} );
	} );
}

function compressFileContent ( fileContent ) {
	// console.log( fileContent );
	
	// return saveFile( buildPath + 'TMP.js', fileContent )
	// 	.then( () => {
			let res = UglifyJS.minify( fileContent, { fromString: true } );
	
			return res.code;
		// } );
}

function replaceImportedScripts ( fileContent ) {
	let scriptPaths = getImportedScriptPaths( fileContent );

	let loadScripts = scriptPaths.map( ( scriptPath ) => {
		return loadFile( globalPath + scriptPath );
	} );

	return Promise.all( loadScripts )
		.then( ( scriptContents, scriptIndex ) => {
			return scriptContents.reduce( ( fileContent, scriptContent, scriptContentIndex ) => {
				return replaceImportedScript ( fileContent, scriptPaths[scriptContentIndex], scriptContent );
			}, fileContent );
	} );
}

function workersToBlobURL ( fileContent ) {
	const workerPaths = getWorkerPaths( fileContent );

	return Promise.all( workerPaths.map( ( workerPath ) => {
		const p = workerPath.indexOf( globalPath ) === 0 ? workerPath : globalPath + workerPath;
		return processES6File( p );
	} ) )
	.then( ( workerContents ) => {
		return workerContents.map( ( workerContent, index ) => {
			return fileToBlobURL( workerContent );
		} );
	} )
	.then( ( blobURLs ) => {
		return blobURLs.reduce( ( fileContent, blobUrl, workerIndex ) => {
			let sanitizedScriptPath = sanitizePathForRegEx( workerPaths[workerIndex] );
			let pattern = "[\'\"]" + sanitizedScriptPath + '[\'\"]';
			let regex = new RegExp( pattern, 'mig' );

			return fileContent.replace( regex, blobUrl );
		}, fileContent );
	} );
}

function fileToBlobURL ( fileContent, type = 'text/javascript' ) {
	if ( minifyBuild ) {
		fileContent = compressFileContent( fileContent );
	}
	
	const fileContentStr = JSON.stringify( fileContent );

	return "URL.createObjectURL(new Blob([" + fileContentStr + "],{type:'" + type + "'}))";
}

function getWorkerPaths ( fileContent ) {
	let regex = /[\'\”](.*Worker.js)[\'\”]/mig;
	let matches;
	let result = [ ];

	while  ( ( matches = regex.exec( fileContent ) ) !== null ) {
		// This is necessary to avoid infinite loops with zero-width matches
		if ( matches.index === regex.lastIndex ) {
			regex.lastIndex++;
		}
		
		// The result can be accessed through the `m`-variable.
		matches.forEach( ( match, groupIndex ) => {
			if ( groupIndex === 1 ) {
				result.push( match );
			}
		} );
	}

	return result;
}

function getImportedScriptPaths ( fileContent ) {
	// let regex = /(importScripts|\(|"|')([a-zA-Z0-9\/\_\-]*\.js)/mig;
	let regex = /importScripts\([\"\'\s]+([a-zA-Z0-9\/\_\-]*\.js)[\"\'\s]+\)/mig;

	let matches;
	let result = [ ];

	while  ( ( matches = regex.exec( fileContent ) ) !== null ) {
		// This is necessary to avoid infinite loops with zero-width matches
		if ( matches.index === regex.lastIndex ) {
			regex.lastIndex++;
		}
		
		// The result can be accessed through the `m`-variable.
		matches.forEach( ( match, groupIndex ) => {
			if ( groupIndex === 1 ) {
				result.push( match );
			}
		} );
	}

	return result;
}

function replaceImportedScript ( fileContent, scriptPath, scriptContent ) {
	let sanitizedScriptPath = sanitizePathForRegEx( scriptPath );
	let pattern = 'importScripts.*' + sanitizedScriptPath +  '*.*\;';
	let regex = new RegExp( pattern, 'mig' );

	let res = fileContent.replace( regex, scriptContent );

	return res;
}

function sanitizePathForRegEx ( path ) {
	return path
		.replace( /\//g, '\\/' )
		.replace( /\-/g, '\\-' )
		.replace( /\(/g, '\\(' )
		.replace( /\"/g, '\\"' )
		.replace( /\./g, '\\.' );
}

function getOutputFileName ( filePath ) {
	const baseName = filePath.replace( '.js', '' );
	let result = baseName.toLowerCase();

	if ( ! es5Build && es6Extension && es6Extension.length ) {
		result += '.' + es6Extension;
	}

	if ( minifyBuild ) {
		result += '.' + minifyExtension;
	}

	return result + '.js';
}