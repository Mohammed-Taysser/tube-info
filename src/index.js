#!/usr/bin/env node

import { Command } from 'commander';
import config from './helpers/config.js';
import {
	apiKeyAction,
	configAction,
	playlistAction,
	videoAction,
} from './helpers/actions.js';

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

app
	.command('playlist')
	.description('Export playlist metadata its id or url.')
	.argument(
		'ID Or URL',
		`The value of the "list" parameter in the the playlist homepage URL https://www.youtube.com/playlist?list='playlistId'`
	)
	.action(playlistAction)
	.option('-d, --default', 'Skip all questions and use the default config')
	.addHelpText(
		'after',
		`
Example:
 $ tube-info playlist https://www.youtube.com/playlist?list=PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ
 $ tube-info playlist PLDoPjvoNmBAy532K9M_fjiAmrJ0gkCyLJ -d
    `
	);

app
	.command('video')
	.description('Export video metadata by id or url.')
	.argument(
		'ID Or URL',
		`The value of the "v" parameter in the the video URL https://www.youtube.com/watch?v='videoId'`
	)
	.action(videoAction)
	.option('-d, --default', 'Skip all questions and use the default config')
	.addHelpText(
		'after',
		`
Example:
 $ tube-info video https://www.youtube.com/watch?v=yUndnE-2osg
 $ tube-info video yUndnE-2osg -d
    `
	);

app.parse(process.argv);
