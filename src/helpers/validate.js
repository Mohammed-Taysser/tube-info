import axios from 'axios';
import isAbsolute from 'is-absolute';
import config from './config.js';
import chalk from 'chalk';

async function validateApiKey(apiKey = '') {
	if (apiKey.length === 0) {
		console.log(chalk.red('\n✖ Please enter a non-empty API key'));
	} else if (apiKey.length < 39) {
		console.log(chalk.red('\n✖ Please enter a valid API key'));
	} else {
		// Try out the API key
		try {
			await axios(`${config.get('apiBaseUrl')}/playlistItems`, {
				params: {
					key: apiKey,
					playlistId: 'PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ',
					part: 'status',
					maxResults: 1,
				},
			});

			return true;
		} catch (error) {
			if (error.response === undefined) {
				console.log(
					chalk.red(
						'\n✖ Error in network connection. Please check your Internet connection.'
					)
				);
			}
			if (error.response.status === 400) {
				console.log(
					chalk.red(
						`\n✖ Your API key is invalid. Did you obtain the API key correctly?\n  - Watch this 3 min. tutorial on how to get a YouTube API key (v3) - ${chalk.underline(
							'https://youtu.be/N18czV5tj5o'
						)}`
					)
				);
			} else {
				console.log(
					chalk.red('✖ Your API key is not working. Please try again.')
				);
			}
		}
	}
}

function validateFilePath(input = '/') {
	if (isAbsolute(input)) {
		return true;
	}

	console.log(chalk.red(`\n✖ Please enter a valid absolute path!`));
}

function validateExportItems(input = '') {
	if (input.length === 0) {
		console.log(chalk.red('\n✖ Select at least 1 item to export'));
	}
	return true;
}

/**
 * Handle error from fetching YouTube API.
 * @param {Error} error
 */
function handleApiError(error) {
	let status = '',
		reason = '';

	try {
		// @ts-ignore
		const json = JSON.parse(error?.response.data.error.errors);
		status = json.status;
		reason = json.reason;
	} catch (error) {
		console.log(chalk.red(`\n✖ ${error.message}`));
		process.exit(1);
	}

	switch (reason) {
		case 'quotaExceeded':
			console.log(
				chalk.red(
					`✖ (${status}): Your API key has exceeded the daily quota of 10,000 units.`
				)
			);

			console.log(
				chalk.red(
					'✖ You cannot export more data until tomorrow when the quote usage resets.'
				)
			);
			break;
		case 'playlistNotFound':
			console.log(`(${status}): Playlist cannot be found.`);
			console.log(
				chalk.red(
					'✖ This may be because the playlist visibility is set to private.'
				)
			);
			break;
		default:
			console.log(
				chalk.red(
					`✖ (${status} ${reason}): Something went wrong. Please try again!`
				)
			);
			break;
	}
}

// ------------------------------
// get valid playlist url or id |
// ------------------------------

// constants
const playlistIdRegex = /^[a-zA-Z0-9-_]{34}$/;
const playlistUrlRegex = /^https?:\/\//;
const playlistValidQueryDomains = [
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
];

/**
 * Returns true if given id satisfies YouTube's playlist id format.
 *
 * @param {string} id
 * @return {boolean}
 */
function validatePlaylistId(id = '') {
	return playlistIdRegex.test(id.trim());
}

/**
 * Get playlist ID.
 *
 * The following url is a type of playlist URL formats.
 * - https://www.youtube.com/playlist?list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ
 *
 * @param {string} url
 * @return {string}
 */
function getURLPlaylistId(url = '') {
	const parsed = new URL(url.trim());

	let id = parsed.searchParams.get('list');

	if (parsed.hostname && !playlistValidQueryDomains.includes(parsed.hostname)) {
		console.log(chalk.red('✖ Not a YouTube domain'));
	}

	if (!id) {
		console.log(chalk.red(`✖ No video id found: "${url}"`));
	}

	id = id.substring(0, 34);

	if (!validatePlaylistId(id)) {
		console.log(
			chalk.red(
				`✖ Playlist id (${id}) does not match expected format (${playlistIdRegex.toString()})`
			)
		);
	}

	return id;
}

/**
 * Gets video ID either from a url or by checking if the given string
 * matches the video ID format.
 *
 * If unable to find a id or If videoId doesn't match specs will log an error to console
 * @param {string} str
 * @returns {string}
 */

function getPlaylistId(str = '') {
	if (validatePlaylistId(str)) {
		return str;
	} else if (playlistUrlRegex.test(str.trim())) {
		return getURLPlaylistId(str);
	} else {
		console.log(chalk.red(`✖ No playlist id found: ${str}`));
		process.exit(1);
	}
}

/**
 * Checks wether the input string includes a valid id.
 *
 * @param {string} string
 * @returns {boolean}
 */
function isValidatePlaylistURL(string = '') {
	try {
		getURLPlaylistId(string);
		return true;
	} catch (e) {
		console.log(chalk.red(`✖ ${e.message}`));
		return false;
	}
}

// ---------------------------
// get valid video url or id |
// ---------------------------

// constants
const videoIdRegex = /^[a-zA-Z0-9-_]{11}$/;
const videoUrlRegex = /^https?:\/\//;
const videoValidPathDomains =
	/^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
const videoValidQueryDomains = [
	'youtube.com',
	'www.youtube.com',
	'm.youtube.com',
	'music.youtube.com',
	'gaming.youtube.com',
];

/**
 * Returns true if given id satisfies YouTube's id format.
 *
 * @param {string} id
 * @return {boolean}
 */
function validateVideoID(id = '') {
	return videoIdRegex.test(id.trim());
}

/**
 * Get video ID.
 *
 * There are a few type of video URL formats.
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/v/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://music.youtube.com/watch?v=VIDEO_ID
 *  - https://gaming.youtube.com/watch?v=VIDEO_ID
 *
 * @param {string} link
 * @return {string}
 * @throws {Error} If unable to find a id
 * @throws {TypeError} If videoId doesn't match specs
 */
function getURLVideoID(link = '') {
	const parsed = new URL(link.trim());

	let id = parsed.searchParams.get('v');

	if (videoValidPathDomains.test(link.trim()) && !id) {
		const paths = parsed.pathname.split('/');
		id = parsed.host === 'youtu.be' ? paths[1] : paths[2];
	} else if (
		parsed.hostname &&
		!videoValidQueryDomains.includes(parsed.hostname)
	) {
		throw Error('Not a YouTube domain');
	}

	if (!id) {
		throw Error(`No video id found: "${link}"`);
	}

	id = id.substring(0, 11);

	if (!validateVideoID(id)) {
		throw TypeError(
			`Video id (${id}) does not match expected format (${videoIdRegex.toString()})`
		);
	}

	return id;
}

/**
 * Gets video ID either from a url or by checking if the given string
 * matches the video ID format.
 *
 * @param {string} str
 * @returns {string}
 * @throws {Error} If unable to find a id
 * @throws {TypeError} If videoId doesn't match specs
 */

function getVideoID(str = '') {
	if (validateVideoID(str)) {
		return str;
	} else if (videoUrlRegex.test(str.trim())) {
		return getURLVideoID(str);
	} else {
		console.log(chalk.red(`No video id found: ${str}`));
		process.exit(1);
	}
}

/**
 * Checks wether the input string includes a valid id.
 *
 * @param {string} string
 * @returns {boolean}
 */
function isValidateVideoURL(string = '') {
	try {
		getURLVideoID(string);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
}

export {
	validateApiKey,
	validateFilePath,
	validateExportItems,
	handleApiError,
	getPlaylistId,
	isValidatePlaylistURL,
	getVideoID,
	isValidateVideoURL,
};
