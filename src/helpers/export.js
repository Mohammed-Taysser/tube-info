import fs from 'fs';
import parser from 'json2csv';
import chalk from 'chalk';
import sanitizeTitle from './sanitize.js';

/**
 * create a new directory and nested directory if not exit, ignore existing directory
 * @param {String} dir the directory to be create
 * @returns {Boolean}
 */
function mkdir(dir = 'tube') {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		try {
			console.log(chalk.green(`✔ Created new folder: ${chalk.cyan(dir)}`));
			return true;
		} catch (error) {
			console.log(
				chalk.red(`✖ Error in creating new folder in ${dir}\n${error.message}`)
			);
			return false;
		}
	}
}

/**
 * Gets the exported playlist's file/folder name.
 * @param {string} fileName
 * @param {string} fileExt
 * @example
 * const fileName = getFileName("Hello: World", "json");
 * console.log(fileName); // "2021-09-16-Hello_World.json"
 */
function getExportedFileName(fileName, fileExt) {
	const currentDate = new Date().toISOString().substring(0, 10); // YYYY-MM-DD

	let output = `${currentDate} ${sanitizeTitle(fileName)}`;

	if (fileExt) {
		output += `.${fileExt}`;
	}
	return output;
}

/**
 * Save playlist data into a file.
 * @param {object[]} info
 * @param {{ fileExt: "csv"|"json", folderPath: string, title: string }} options
 * @return {Void} Whether the operation is successful.
 */
function exportInfoAsReport(info, options) {
	const { fileExt, folderPath, title } = options;

	mkdir(folderPath);

	let output = '';

	switch (fileExt) {
		case 'csv':
			output = parser.parse(info);
			break;
		case 'json':
		default:
			output = JSON.stringify(info, null, '\t');
	}

	try {
		const fileName = getExportedFileName(title, fileExt);
		fs.writeFileSync(`${folderPath}/${fileName}`, output);
		console.log(
			`${chalk.green('✔')} Successfully exported to: ${chalk.cyan(folderPath)}`
		);
		console.log(`  - file name: ${chalk.cyan(fileName)}`);
	} catch (error) {
		console.log(chalk.red(`✖ ${error.message}`));
	}
}

export { exportInfoAsReport };
