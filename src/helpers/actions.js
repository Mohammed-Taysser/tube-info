import chalk from 'chalk';
import inquirer from 'inquirer';
import config from './config.js';
import {
	validateApiKey,
	validateExportItems,
	validateFilePath,
} from './validate.js';

// ----------------
// api key action |
// ----------------

/**
 * ask user for apiKey and set it in config
 */
async function setApiKey() {
	const input = await inquirer.prompt([
		{
			type: 'input',
			name: 'apiKey',
			message: 'Enter your YouTube API key: ',
			validate: validateApiKey,
		},
	]);

	config.set('apiKey', input.apiKey.trim());
	console.log(chalk.green(`✔ Successfully set the API key`));
}

/**
 * Action handler for `tube-info key`
 */
async function apiKeyAction() {
	const apiKey = config.get('apiKey');

	if (apiKey) {
		console.log(`Your current YouTube API key is: ${chalk.yellow(apiKey)}`);

		const input = await inquirer.prompt([
			{
				type: 'list',
				name: 'keyAction',
				message: 'How would you like to manage your YouTube API key?',
				choices: [
					{ name: 'Edit key', value: 'editKey' },
					{ name: 'Remove key', value: 'removeKey' },
					{ name: 'Exit', value: 'exit' },
				],
			},
		]);

		switch (input.keyAction) {
			case 'editKey':
				setApiKey();
				break;
			case 'removeKey':
				config.set('apiKey', '');
				console.log(chalk.green(`✔ Successfully remove the API key`));
				break;
			default:
				break;
		}
	} else {
		console.log(chalk.red("✖ You haven't entered your YouTube API key!"));
		console.log(
			`  - Watch this 3 min. tutorial on how to get a YouTube API key (v3) for free - ${chalk.cyan(
				'https://youtu.be/N18czV5tj5o'
			)}`
		);
		setApiKey();
	}
}

// ---------------
// config action |
// ---------------

async function resetConfig() {
	const input = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'resetConfig',
			message: 'Are you sure to reset all configurations to default?',
			default: false,
		},
	]);

	if (input.resetConfig) {
		config.resetAll();
		console.log(
			chalk.green('✔ Successfully reset all configurations to default.')
		);
	}
}

async function editPlaylistExportOptions() {
	const { exportItems } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'exportItems',
			message: 'Which data do you want to export for each video?',
			choices: [
				{ name: '1. Position in the playlist', value: 'position' },
				{ name: '2. Title', value: 'title' },
				{ name: '3. Uploader', value: 'uploader' },
				{ name: '4. Uploader URL', value: 'uploaderUrl' },
				{ name: '5. URL', value: 'url' },
				{ name: '6. Description', value: 'description' },
				{ name: '7. Video privacy', value: 'videoPrivacy' },
				{ name: '8. Publish time (UTC)', value: 'publishTime' },
				{ name: '9. thumbnail', value: 'thumbnail' },
			],
			default: config.getExportOptionDefaults('playlistExportItems'),
			validate: validateExportItems,
		},
	]);

	config.setExportOptionDefaults('playlistExportItems', exportItems);
}

async function editVideoExportOptions() {
	const { exportItems } = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'exportItems',
			message: 'Which data do you want to export for each video?',
			choices: [
				{ name: '1. Channel id', value: 'channelId' },
				{ name: '2. Channel Title', value: 'channelTitle' },
				{ name: '3. Comment Count', value: 'commentCount' },
				{ name: '4. Description', value: 'description' },
				{ name: '5. Favorite Count', value: 'favoriteCount' },
				{ name: '6. Length', value: 'length' },
				{ name: '7. Like Count', value: 'likeCount' },
				{ name: '8. Privacy Status', value: 'privacyStatus' },
				{ name: '9. Publish Date', value: 'publishDate' },
				{ name: '10. Tags', value: 'tags' },
				{ name: '11. Thumbnail', value: 'thumbnail' },
				{ name: '12. Title', value: 'title' },
				{ name: '13. Url', value: 'url' },
				{ name: '14. View Count', value: 'viewCount' },
			],
			default: config.getExportOptionDefaults('videoExportItems'),
			validate: validateExportItems,
		},
	]);

	config.setExportOptionDefaults('videoExportItems', exportItems);
}

async function editExportPathAndExtension() {
	const { fileExt, folderPath } = await inquirer.prompt([
		{
			type: 'list',
			name: 'fileExt',
			message: 'Which file extension do you prefer?',
			choices: [
				{ name: 'JSON', value: 'json' },
				{ name: 'CSV', value: 'csv' },
			],
			default: config.get('fileExt'),
		},
		{
			type: 'input',
			name: 'folderPath',
			message: `An ${chalk.underline('absolute')} path of a ${chalk.underline(
				'folder'
			)} where the report will be saved:`,
			default: config.get('folderPath'),
			validate: validateFilePath,
		},
	]);

	config.set('fileExt', fileExt);
	config.set('folderPath', folderPath);
}

async function editSkipPrivateOrDeleted() {
	const { skipPrivateOrDeleted } = await inquirer.prompt([
		{
			type: 'list',
			name: 'skipPrivateOrDeleted',
			message:
				'Do you want to skip/ignore any private or deleted videos in the playlist?' +
				"\nChoosing 'Skip' will NOT create an entry in the exported JSON/CSV file if the video is private/deleted.",
			choices: [
				{ name: 'Skip', value: true },
				{ name: 'Do not skip', value: false },
			],
			default: config.get('skipPrivateOrDeleted'),
		},
	]);

	config.set('skipPrivateOrDeleted', skipPrivateOrDeleted);
}

/**
 * Action handler for `tube-info config`
 * @param {{ path: boolean, reset: boolean }} options   Command options
 */
async function configAction(options) {
	if (options.path) {
		console.log(`Path of config file: ${chalk.cyan(config.path)}`);
		return;
	}

	if (options.reset) {
		resetConfig();
		return;
	}

	let exit = false;
	while (!exit) {
		const input = await inquirer.prompt([
			{
				type: 'list',
				name: 'configItem',
				message:
					'Which config do you want to edit? Choose "Exit" if you\'re done.',
				choices: [
					{
						name: 'Default playlist export options (eg. Items to export.)',
						value: 'playlistExportOptions',
					},
					{
						name: 'Default video export options (eg. title, thumbnail)',
						value: 'videoExportOptions',
					},
					{
						name: 'Export path & file extension',
						value: 'exportPathAndExtension',
					},
					{
						name: 'Skipping private or deleted videos',
						value: 'skipPrivateOrDeleted',
					},
					{ name: 'Exit', value: 'exit' },
				],
			},
		]);

		switch (input.configItem) {
			case 'playlistExportOptions':
				await editPlaylistExportOptions();
				console.log(chalk.green('✔ Saved playlist default export options.'));
				break;
			case 'videoExportOptions':
				await editVideoExportOptions();
				console.log(chalk.green('✔ Saved video default export options.'));
				break;
			case 'exportPathAndExtension':
				await editExportPathAndExtension();
				console.log(chalk.green('✔ Saved default export options.'));
				break;
			case 'skipPrivateOrDeleted':
				await editSkipPrivateOrDeleted();
				console.log(
					chalk.green('✔ Saved skipping private or deleted videos.\n')
				);
				break;
			case 'exit':
				exit = true;
				break;
		}
	}
}

export { apiKeyAction, configAction };
