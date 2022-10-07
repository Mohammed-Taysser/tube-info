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
		const json = JSON.parse(error.message);
		status = json.status;
		reason = json.reason;
	} catch (error) {
		console.log(chalk.red('✖ Something went wrong. Please try again!'));
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

export {
	validateApiKey,
	validateFilePath,
	validateExportItems,
	handleApiError,
};
