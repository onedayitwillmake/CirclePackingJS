import { readFile, writeFile } from 'fs/promises';
import { join as joinPath, resolve as resolvePath, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';
import buble from 'rollup-plugin-buble';
import { program } from 'commander';
import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

program
	.option('-e, --es5', 'make output files es5 compatible')
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
	es5: !!options.es5,
	date: new Date(),
	jsModuleName: 'CirclePacker',
});

program.version(buildData.pkg.version);

await Promise.all(
	buildData.scripts.map(async scriptFileName => {
		const scriptFilePath = joinPath(buildData.srcPath, scriptFileName);
		const jsFileContent = await bundleJsFile(scriptFilePath, buildData);

		const fileSuffixes = [];

		if (!buildData.es5) {
			fileSuffixes.push('es6');
		}

		if (buildData.minify) {
			fileSuffixes.push('min');
		}

		const fileParts = [buildData.jsModuleName, ...fileSuffixes, 'js'];

		const distFileName = fileParts.join('.');
		const distFilePath = joinPath(buildData.distPath, distFileName);

		return writeFile(distFilePath, jsFileContent);
	})
);

async function bundleJsFile(filePath, buildData, isWorker) {
	const rollupPlugins = [];

	if (buildData.es5) {
		rollupPlugins.push(buble());
	} else {
	}

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
	const generationOptions = buildData.es5
		? {
				format: 'umd',
				name: buildData.jsModuleName,
		  }
		: {
				format: 'module',
				name: buildData.jsModuleName,
		  };

	const bundleResult = await rollupBundle.generate(generationOptions);
	let jsFileContent = bundleResult.output[0].code;

	if (jsFileContent.includes('new Worker')) {
		jsFileContent = await handleWorkers(jsFileContent, buildData);
	}

	if (!isWorker && !buildData.minify) {
		const typeCommentsFile = await loadFile(joinPath(buildData.srcPath, 'types.js'));

		jsFileContent = `${typeCommentsFile.fileContent}
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
	const workerInstantiation = `new Worker(workerPath, { type: 'module' })`;
	const workerFilePath = resolvePath(buildData.srcPath, 'CirclePackWorker.js');

	// TODO: REMOVE COMMENTS?
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
