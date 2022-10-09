import Conf from 'conf';
import path from 'path';
import os from 'os';
import fs from 'fs';

const schema = {
	version: {
		type: 'string',
		default: JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
	},
	apiKey: {
		type: 'string',
		default: '',
	},
	apiBaseUrl: {
		type: 'string',
		default: 'https://www.googleapis.com/youtube/v3',
		format: 'url',
	},
	playlistExportItems: {
		type: 'object',
		properties: {
			description: { type: 'boolean' },
			position: { type: 'boolean' },
			publishTime: { type: 'boolean' },
			thumbnail: { type: 'boolean' },
			title: { type: 'boolean' },
			uploader: { type: 'boolean' },
			uploaderUrl: { type: 'boolean' },
			url: { type: 'boolean' },
			videoPrivacy: { type: 'boolean' },
		},
		default: {
			description: false,
			position: true,
			publishTime: false,
			thumbnail: true,
			title: true,
			uploader: true,
			uploaderUrl: false,
			url: true,
			videoPrivacy: false,
		},
	},
	videoExportItems: {
		type: 'object',
		properties: {
			channelId: { type: 'boolean' },
			channelTitle: { type: 'boolean' },
			commentCount: { type: 'boolean' },
			description: { type: 'boolean' },
			favoriteCount: { type: 'boolean' },
			length: { type: 'boolean' },
			likeCount: { type: 'boolean' },
			privacyStatus: { type: 'boolean' },
			publishDate: { type: 'boolean' },
			tags: { type: 'boolean' },
			thumbnail: { type: 'boolean' },
			title: { type: 'boolean' },
			url: { type: 'boolean' },
			viewCount: { type: 'boolean' },
		},
		default: {
			channelId: false,
			channelTitle: true,
			commentCount: false,
			description: false,
			favoriteCount: false,
			length: true,
			likeCount: true,
			privacyStatus: false,
			publishDate: true,
			tags: false,
			thumbnail: true,
			title: true,
			url: false,
			viewCount: true,
		},
	},
	fileExt: {
		type: 'string',
		enum: ['csv', 'json'],
		default: 'json',
	},
	folderPath: {
		type: 'string',
		default: path.join(os.homedir(), 'tube/reports/'),
	},
	skipPrivateOrDeleted: {
		type: 'boolean',
		default: true,
	},
};

class Config {
	constructor() {
		this.conf = new Conf({ schema });
	}

	/**
	 * Throw an error if the config key is not found.
	 * @param {string} key  Config key
	 */
	checkKey(key) {
		if (!this.conf.has(key)) {
			throw new Error('Unknown config key');
		}
	}

	/**
	 * get the config value by key if exist else throw an error
	 * @param {String} key
	 * @returns {any}
	 */
	get(key) {
		this.checkKey(key);
		return this.conf.get(key);
	}

	/**
	 * set config option if exist else throw an error
	 * @param {String} key
	 * @param {*} value
	 */
	set(key, value) {
		this.checkKey(key);
		this.conf.set(key, value);
	}

	/**
	 * Used in the `default` field of `inquirer` prompt.
	 * @param {String} key
	 * @returns {string[]}  Key names get by key if that key's value is `true`
	 */
	getExportOptionDefaults(key) {
		const exportItems = this.conf.get(key);

		const result = [];

		Object.keys(exportItems).forEach((item) => {
			if (exportItems[item]) {
				result.push(item);
			}
		});

		return result;
	}

	/**
	 * Set which items to export by default.
	 * @param {String} key
	 * @param {string[]} items Key names in `exportItems` to be set to `true`
	 */
	setExportOptionDefaults(key, items) {
		const exportItems = this.conf.get(key);

		Object.keys(exportItems).forEach((item) => {
			exportItems[item] = items.includes(item);
		});

		this.conf.set(key, exportItems);
	}

	/**
	 * Get the path of the config file.
	 */
	get path() {
		return this.conf.path;
	}

	/**
	 * Reset all items to their default value defined in `schema`.
	 */
	resetAll() {
		this.conf.clear();
	}
}

const config = new Config();

export { config as default, schema };
