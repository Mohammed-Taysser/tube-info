import chalk from 'chalk';
import inquirer from 'inquirer';
import { oraPromise } from 'ora';
import config from './config.js';
import { getPlaylistInfo, getPlaylistMetadata } from '../api/playlist.js';
import { exportInfoAsReport } from './export.js';
import {
	getPlaylistId,
	getVideoID,
	handleApiError,
	validateApiKey,
	validateExportItems,
	validateFilePath,
} from './validate.js';
import { getVideoInfo, getVideoMetadata } from '../api/video.js';

const playlistExportOptions = [
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
];

const videoExportOptions = [
	{
		type: 'checkbox',
		name: 'exportItems',
		message: 'Which data do you want to export for each video?',
		choices: [
			{ name: '1. Channel id', value: 'channelId' },
			{ name: '2. Channel title', value: 'channelTitle' },
			{ name: '3. Comment count', value: 'commentCount' },
			{ name: '4. Description', value: 'description' },
			{ name: '5. Favorite count', value: 'favoriteCount' },
			{ name: '6. Length', value: 'length' },
			{ name: '7. Likes', value: 'likeCount' },
			{ name: '8. Privacy status', value: 'privacyStatus' },
			{ name: '9. Publish date', value: 'publishDate' },
			{ name: '10. Tags', value: 'tags' },
			{ name: '11. Thumbnail', value: 'thumbnail' },
			{ name: '12. Title', value: 'title' },
			{ name: '13. Url', value: 'url' },
			{ name: '14. View count', value: 'viewCount' },
		],
		default: config.getExportOptionDefaults('videoExportItems'),
		validate: validateExportItems,
	},
];

const exportPathAndExtensionOptions = [
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
];

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
	const { exportItems } = await inquirer.prompt(playlistExportOptions);

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
	const { fileExt, folderPath } = await inquirer.prompt(
		exportPathAndExtensionOptions
	);

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

// -----------------
// playlist action |
// -----------------

/**
 * Action handler for `tube-info id [options] <playlistId>`
 * @param {string} inputValue   Command argument - ID of playlist to be exported
 */
async function playlistAction(inputValue, options) {
	const playlistId = getPlaylistId(inputValue);

	// Check for "Watch Later"
	if (playlistId === 'WL') {
		console.log(
			chalk.yellow(
				'⚠️ Videos in Watch Later playlist cannot be retrieved through the YouTube API.'
			)
		);
		console.log(chalk.yellow('⚠️ Please try another playlist.'));
	}

	// Check if API key exists
	if (!config.get('apiKey')) {
		console.log(chalk.yellow(`⚠️ You haven't set your YouTube API key!`));
		console.log(`- Run ${chalk.cyan('tube-info key')} to set the API `);
		process.exit();
	}

	// Fetch playlist metadata
	const metadata = await oraPromise(
		getPlaylistMetadata(playlistId),
		'Fetching playlist metadata...'
	);

	console.log(`- Playlist Title: ${chalk.cyan(metadata.title)}`);
	console.log(
		`- Number of videos (including private videos): ${chalk.cyan(
			metadata.numOfVideos
		)}\n`
	);

	// Check if playlist is empty
	if (metadata.numOfVideos === 0) {
		console.log(
			chalk.yellow(
				'⚠️ This playlist is empty and there are no video data to export.'
			)
		);
	}

	let playlistData = null;

	const saveFileOptions = {
		fileExt: config.get('fileExt'),
		folderPath: config.get('folderPath'),
		title: metadata.title,
	};

	try {
		if (options.default) {
			// Skip all prompts for `--default` option
			const exportItems = config.getExportOptionDefaults('playlistExportItems');

			playlistData = await oraPromise(
				getPlaylistInfo(playlistId, exportItems),
				'Getting playlist info ...'
			);
		} else {
			const { exportItems } = await inquirer.prompt(playlistExportOptions);
			const { fileExt, folderPath } = await inquirer.prompt(
				exportPathAndExtensionOptions
			);

			saveFileOptions.fileExt = fileExt;
			saveFileOptions.folderPath = folderPath;

			// Fetch playlist data
			playlistData = await oraPromise(
				getPlaylistInfo(playlistId, exportItems),
				'Getting playlist info ...'
			);
		}
	} catch (error) {
		handleApiError(error);
	}

	exportInfoAsReport(playlistData, saveFileOptions);
}

// --------------
// video action |
// --------------

async function videoAction(inputValue, options) {
	const videoId = getVideoID(inputValue);

	// Check if API key exists
	if (!config.get('apiKey')) {
		console.log(chalk.yellow(`⚠️ You haven't set your YouTube API key!`));
		console.log(`- Run ${chalk.cyan('tube-info key')} to set the API `);
		process.exit();
	}

	const metaData = await oraPromise(
		getVideoMetadata(videoId),
		'Fetching video metadata...'
	);

	console.log(`- Video Title: ${chalk.cyan(metaData.title)}`);
	console.log(`- Channel title: ${chalk.cyan(metaData.channelTitle)}\n`);

	const saveFileOptions = {
		fileExt: config.get('fileExt'),
		folderPath: config.get('folderPath'),
		title: metaData.title,
	};

	let videoInfo = null;

	try {
		if (options.default) {
			// Skip all prompts for `--default` option
			const exportItems = config.getExportOptionDefaults('videoExportItems');

			videoInfo = await oraPromise(
				getVideoInfo(videoId, exportItems),
				'Getting video info ...'
			);
		} else {
			const { exportItems } = await inquirer.prompt(videoExportOptions);
			const { fileExt, folderPath } = await inquirer.prompt(
				exportPathAndExtensionOptions
			);

			saveFileOptions.fileExt = fileExt;
			saveFileOptions.folderPath = folderPath;

			// Fetch video data
			videoInfo = await oraPromise(
				getVideoInfo(videoId, exportItems),
				'Getting video info ...'
			);
		}
	} catch (error) {
		handleApiError(error);
	}

	exportInfoAsReport(videoInfo, saveFileOptions);
}

export { apiKeyAction, configAction, playlistAction, videoAction };
