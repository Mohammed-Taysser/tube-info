import axios from 'axios';
import config from '../helpers/config.js';
import { handleApiError } from '../helpers/validate.js';
import { getNestedValue } from '../helpers/api.js';

/**
 * Mapping from export item key names to the properties of each object in the `response.data.items` array
 * returned by YouTube API (`/videoId`).
 */
const exportedItemsMap = {
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
	thumbnail: 'snippet.thumbnail.standard.url',
	title: 'snippet.title',
	url: 'id',
	viewCount: 'statistics.viewCount',
};

function refactorVideoItems(video, exportItems) {
	const videoInfo = {};

	exportItems.forEach((exportItem) => {
		let data = getNestedValue(video, exportedItemsMap[exportItem]) ?? null;
		switch (exportItem) {
			case 'channelId':
				data = `https://www.youtube.com/channel/${data}`;
				break;
			case 'url':
				data = `https://youtu.be/${data}`;
				break;
		}

		videoInfo[exportItem] = data;
	});

	return videoInfo;
}

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

		return refactorVideoItems(data.items[0], exportItems);
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

export { getVideoInfo, getVideoMetadata };
