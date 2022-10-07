import { Command } from 'commander';
import config from './helpers/config.js';

const app = new Command();

app
	.name('tube-info')
	.version(config.get('version'), '-v, --version')
	.description('Exports video/playlist data from YouTube to JSON/CSV file.\n');

app.parse(process.argv);
