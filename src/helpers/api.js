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

export { getNestedValue, getVideoDuration };
