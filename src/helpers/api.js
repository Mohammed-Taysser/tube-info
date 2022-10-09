import axios from 'axios';
import config from './config.js';
import { handleApiError } from './validate.js';

/**
 * Gets the key of an object.
 * @param {Object} object
 * @param {String} keyPath
 * @returns {any|null} `null` if the path refers to non-existing property
 * @example
 * const obj = { foo: { bar: 10 } };
 * const result = getNestedObjectValue(obj, "foo.bar"); // 10
 */
function getNestedObjectValue(object = {}, keyPath = null) {
	return keyPath.split('.').reduce((prev, curr) => {
		if (prev) {
			return prev[curr] ?? null;
		}
		return null;
	}, object);
}

/**
 * refactor & extract video duration from YouTube api 3 duration
 * @example
 * getVideoDuration('PT59M10S') // "59 minutes, 10 seconds"
 * getVideoDuration('P4DT4H1S') // "4 days, 4 hours, 1 seconds"
 * @param {String} duration
 * @returns {String}
 */
function getVideoDuration(duration = '') {
	const durationItems = [
		{ key: 'D', replacement: ' days, ' },
		{ key: 'H', replacement: ' hours, ' },
		{ key: 'M', replacement: ' minutes, ' },
		{ key: 'S', replacement: ' seconds' },
	];

	let result = '';

	durationItems.forEach((item) => {
		const refactoredDuration = duration.match(
			new RegExp(`([0-9])+${item.key}`, 'g')
		);
		if (refactoredDuration) {
			result += refactoredDuration[0].replace(item.key, item.replacement);
		}
	});

	return result;
}

// -----------
// video api |
// -----------

/**
 * Mapping from export item key names to the properties of each object in the `response.data.items` array
 * returned by YouTube API (`/videoId`).
 */
const exportedVideoOptionsMap = {
	channelId: 'snippet.channelId',
	channelTitle: 'snippet.channelTitle',
	commentCount: 'statistics.commentCount',
	description: 'snippet.description',
	favoriteCount: 'statistics.favoriteCount',
	length: 'contentDetails.duration',
	likeCount: 'statistics.likeCount',
	privacyStatus: 'status.privacyStatus',
	publishDate: 'snippet.publishedAt',
	tags: 'snippet.tags',
	thumbnail: 'snippet.thumbnails.standard.url',
	title: 'snippet.title',
	url: 'id',
	viewCount: 'statistics.viewCount',
};

/**
 * Fetches video data.
 * @param {String} videoId
 * @param {String[]} exportItems  Key names of items to be exported
 * @returns Data in JSON form.
 */
async function getVideoInfo(videoId, exportItems) {
	try {
		const { data } = await axios(`${config.get('apiBaseUrl')}/videos`, {
			params: {
				key: config.get('apiKey'),
				part: 'statistics, status, snippet, contentDetails, topicDetails',
				id: videoId,
			},
		});

		const videoInfo = {};

		exportItems.forEach((exportItem) => {
			let itemValue =
				getNestedObjectValue(
					data.items[0],
					exportedVideoOptionsMap[exportItem]
				) ?? null;
			switch (exportItem) {
				case 'channelId':
					itemValue = `https://www.youtube.com/channel/${itemValue}`;
					break;
				case 'url':
					itemValue = `https://youtu.be/${itemValue}`;
					break;
			}

			videoInfo[exportItem] = itemValue;
		});

		return videoInfo;
	} catch (error) {
		handleApiError(error);
	}
}

/**
 * Fetches video data.
 * @param {String} videoId
 * @returns Data in JSON form.
 */
async function getVideoMetadata(videoId) {
	try {
		const { data } = await axios(`${config.get('apiBaseUrl')}/videos`, {
			params: {
				key: config.get('apiKey'),
				part: 'snippet',
				id: videoId,
			},
		});

		return {
			channelTitle: data.items[0].snippet.channelTitle,
			title: data.items[0].snippet.title,
		};
	} catch (error) {
		handleApiError(error);
	}
}

// --------------
// playlist api |
// --------------

/**
 * Mapping from export item key names to the properties of each object in the `response.data.items` array
 * returned by YouTube API (`/playlistId`).
 */
const exportedPlaylistOptionsMap = {
	position: 'snippet.position',
	title: 'snippet.title',
	uploader: 'snippet.videoOwnerChannelTitle',
	uploaderUrl: 'snippet.videoOwnerChannelId',
	url: 'snippet.resourceId.videoId',
	description: 'snippet.description',
	videoPrivacy: 'status.privacyStatus',
	publishTime: 'snippet.publishedAt',
	thumbnail: 'snippet.thumbnails.standard.url',
};

function refactorPlaylistItems(items, exportItems) {
	const playlistData = [];

	items.forEach((item) => {
		const isPrivateOrDeleted =
			item.status.privacyStatus === 'private' ||
			item.snippet.title === 'Deleted video';

		// Ignore private/deleted videos
		if (config.get('skipPrivateOrDeleted') && isPrivateOrDeleted) {
			return;
		}

		const entry = {};

		exportItems.forEach((exportItem) => {
			let data =
				getNestedObjectValue(item, exportedPlaylistOptionsMap[exportItem]) ??
				null;
			switch (exportItem) {
				case 'description':
					if (isPrivateOrDeleted) {
						data = null;
					}
					break;
				case 'uploaderUrl':
					data = isPrivateOrDeleted
						? null
						: `https://www.youtube.com/channel/${data}`;
					break;
				case 'url':
					data = `https://youtu.be/${data}`;
					break;
				case 'videoPrivacy':
					// deleted video
					if (item.snippet.title === 'Deleted video') {
						data = 'deleted';
					}
					break;
			}

			entry[exportItem] = data;
		});

		playlistData.push(entry);
	});
	return playlistData;
}

/**
 * Fetches playlist data.
 * @param {String} playlistId
 * @param {String[]} exportItems  Key names of items to be exported
 * @returns Data in JSON form.
 */
async function getPlaylistInfo(playlistId, exportItems) {
	try {
		const { data } = await axios(`${config.get('apiBaseUrl')}/playlistItems`, {
			params: {
				key: config.get('apiKey'),
				part: 'snippet, status',
				playlistId,
				maxResults: 10000,
			},
		});

		return refactorPlaylistItems(data.items, exportItems);
	} catch (error) {
		handleApiError(error);
	}
}

/**
 * Fetches playlist metadata (eg. No. of videos, no. of pages)
 * @param {string} playlistId
 */
async function getPlaylistMetadata(playlistId) {
	try {
		const playlistResponse = await axios(
			`${config.get('apiBaseUrl')}/playlists`,
			{
				params: {
					key: config.get('apiKey'),
					part: 'snippet,contentDetails',
					id: playlistId,
				},
			}
		);

		const title = playlistResponse.data.items[0].snippet.title;
		const numOfVideos = playlistResponse.data.items[0].contentDetails.itemCount;

		return {
			title,
			numOfVideos,
		};
	} catch (error) {
		handleApiError(error);
	}
}

export { getNestedObjectValue, getVideoDuration };
export { getVideoInfo, getVideoMetadata };
export { getPlaylistInfo, getPlaylistMetadata };
