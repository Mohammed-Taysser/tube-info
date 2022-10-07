import { Command } from 'commander';
import config from './helpers/config.js';
import { apiKeyAction, configAction } from './helpers/actions.js';

const app = new Command();

app
	.name('tube-info')
	.version(config.get('version'), '-v, --version')
	.description('Exports video/playlist data from YouTube to JSON/CSV file.\n');

app
	.command('key')
	.description('Manage your YouTube API key.')
	.action(apiKeyAction);

app
	.command('config')
	.description(`Edit configurations of tube-info app.`)
	.option('-p, --path', 'show the path of the config file')
	.option('-r, --reset', 'reset all configurations to default')
	.action(configAction);

app.parse(process.argv);
