import { readFile, writeFile, access, unlink } from 'fs/promises';
import { F_OK } from 'fs';
import { join as joinPath, resolve as resolvePath, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';
import buble from 'rollup-plugin-buble';
import { program } from 'commander';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import replace from '@rollup/plugin-replace';

program
	.option('-u, --umd', 'create umd export')
	.option('-n, --nodemjs', 'generate node module (mjs)')
	.option('-c, --commonjs', 'generate commonjs module')
	.option('-m, --minify', 'minify output')
	.parse(process.argv);

const __dirname = dirname(fileURLToPath(import.meta.url));
const basePath = __dirname;

const options = program.opts();

const buildData = await prepareBuildData({
	scripts: ['CirclePacker.js'],
	srcPath: joinPath(basePath, 'src'),
	distPath: joinPath(basePath, 'dist'),
	minify: !!options.minify,
	umd: !!options.umd,
	nodemjs: !!options.nodemjs,
	commonjs: !!options.commonjs,
	date: new Date(),
	jsModuleName: 'CirclePacker',
});

program.version(buildData.pkg.version);

await Promise.all(
	buildData.scripts.map(async scriptFileName => {
		const scriptFilePath = joinPath(buildData.srcPath, scriptFileName);
		const jsFileContent = await bundleJsFile(scriptFilePath, buildData);

		const fileSuffixes = [];
		let extension = 'js';

		if (!buildData.umd && !buildData.nodemjs && !buildData.commonjs) {
			fileSuffixes.push('esm');
		}

		if (buildData.minify) {
			fileSuffixes.push('min');
		}

		if (buildData.nodemjs) {
			fileSuffixes.push('node');
			extension = 'mjs';
		}

		if (buildData.commonjs) {
			fileSuffixes.push('cjs');
		}

		const fileParts = [buildData.jsModuleName, ...fileSuffixes, extension];

		const distFileName = fileParts.join('.').toLowerCase();
		const distFilePath = joinPath(buildData.distPath, distFileName);

		try {
			await access(distFilePath, F_OK);
			await unlink(distFilePath);
		} catch (e) {}

		return writeFile(distFilePath, jsFileContent);
	})
);

async function bundleJsFile(filePath, buildData, isWorker) {
	const rollupPlugins = [];

	const replacements = {};
	replacements[
		`const workerPath = params.workerPath ? params.workerPath : './CirclePackWorker.js';`
	] = '';

	if (buildData.nodemjs || buildData.commonjs) {
		replacements['this.useWorker = params.useWorker === false ? false : true'] = '';
		replacements[`if (this.useWorker) {`] = 'if (false) {';
		replacements[` extends CirclePackerBrowser`] = '';
		replacements[`super(params);`] = '';
		replacements[`if (!this.isContinuousModeActive) {`] = 'if (true) {';
		replacements[`super.handleWorkerResponse(response);`] = '';
		replacements[`super.updateListeners(response);`] = '';
		replacements[`super.forceMovement();`] = '';
		replacements[`super.startLoop();`] = '';
		replacements[`super.destroy();`] = '';
	}

	if (buildData.umd) {
		replacements[`export class CirclePacker `] = 'export default class CirclePacker ';
		replacements[`export function pack`] = 'function pack ';
	}

	rollupPlugins.push(
		replace({ preventAssignment: false, values: replacements, delimiters: ['', ''] })
	);

	if (buildData.minify) {
		rollupPlugins.push(terser());
	}

	if (isWorker) {
		rollupPlugins.push(cleanup());
	}

	const rollupOptions = {
		input: filePath,
		plugins: rollupPlugins,
	};

	const rollupBundle = await rollup(rollupOptions);

	let generationOptions = {
		format: 'module',
		name: buildData.jsModuleName,
	};

	if (buildData.umd || buildData.commonjs) {
		generationOptions = {
			format: 'umd',
			name: buildData.jsModuleName,
		};
	}

	const bundleResult = await rollupBundle.generate(generationOptions);

	let jsFileContent = bundleResult.output[0].code;

	if (!isWorker && jsFileContent.includes('new Worker')) {
		jsFileContent = await handleWorkers(jsFileContent, buildData);
	}

	if (!isWorker && !buildData.minify) {
		let typeCommentsFile = await loadFile(joinPath(buildData.srcPath, 'types.js'));

		let typeComments = typeCommentsFile.fileContent.replace(/^.*\[workerPath\].*$\n/gm, '');

		if (buildData.nodemjs || buildData.commonjs) {
			typeComments = typeComments.replace(/^.*\[continuousMode=true\].*$\n/gm, '');
			typeComments = typeComments.replace(/^.*\[useWorker=true\].*$\n/gm, '');
			typeComments = typeComments.replace(/^.*\[onMoveStart\].*$\n/gm, '');
			typeComments = typeComments.replace(/^.*\[onMoveEnd\].*$\n/gm, '');
		}

		jsFileContent = `${typeComments}
${jsFileContent}`;
	}

	if (!isWorker) {
		const year = buildData.date.getFullYear();
		const banner = `/*! ${buildData.pkg.name} v${buildData.pkg.version} | ${buildData.pkg.license} (c) ${year} ${buildData.pkg.author} | ${buildData.pkg.homepage} */`;
		jsFileContent = `${banner}
${jsFileContent}`;
	}

	return jsFileContent;
}

async function handleWorkers(fileContent, buildData) {
	const workerInstantiation =
		/new Worker\([a-zA-Z]+\s*,\s*{\s*type\s*:\s*['"]\s*module\s*['"]\s*}\s*\)/gm;
	const workerFilePath = resolvePath(buildData.srcPath, 'CirclePackWorker.js');

	const workerCode = await bundleJsFile(workerFilePath, buildData, true);
	const workerFileContent = fileToBlobURL(workerCode);

	fileContent = fileContent.replace(workerInstantiation, `new Worker(${workerFileContent})`);

	return fileContent;
}

async function prepareBuildData(data = {}) {
	const pkg = await loadJSONFile(joinPath(basePath, 'package.json'));

	const buildData = {
		pkg,
		...data,
	};

	return buildData;
}

async function loadFile(filePath) {
	const fileContent = await readFile(filePath, { encoding: 'utf8' });
	return { filePath, fileContent };
}

async function loadJSONFile(filePath) {
	const { fileContent } = await loadFile(filePath);
	return JSON.parse(fileContent);
}

function fileToBlobURL(fileContent, type = 'text/javascript') {
	const fileContentStr = JSON.stringify(fileContent);

	return 'URL.createObjectURL(new Blob([' + fileContentStr + "],{type:'" + type + "'}))";
}
