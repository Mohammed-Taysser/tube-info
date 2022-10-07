import chalk from 'chalk';
import inquirer from 'inquirer';
import config from './config.js';
import { validateApiKey } from './validate.js';

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

export { apiKeyAction };
