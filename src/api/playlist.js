import axios from 'axios';
import config from '../helpers/config.js';
import { handleApiError } from '../helpers/validate.js';

/**
 * Mapping from export item key names to the properties of each object in the `response.data.items` array
 * returned by YouTube API (`/playlistId`).
 */
const exportedItemsMap = {
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

/**
 * Gets the key of an object.
 * @param {Object} object
 * @param {String} keyPath
 * @returns {any|null} `null` if the path refers to non-existing property
 * @example
 * const obj = { foo: { bar: 10 } };
 * const result = getNestedValue(obj, "foo.bar"); // 10
 */
function getNestedValue(object = {}, keyPath = null) {
	return keyPath.split('.').reduce((prev, curr) => {
		if (prev) {
			return prev[curr] ?? null;
		}
		return null;
	}, object);
}

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
			let data = getNestedValue(item, exportedItemsMap[exportItem]) ?? null;
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

export { getPlaylistInfo, getPlaylistMetadata };
