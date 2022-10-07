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

export { validateApiKey, validateFilePath, validateExportItems };
