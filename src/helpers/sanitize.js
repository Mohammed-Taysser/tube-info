// variables
const REG_EXP = {
	illegal        : /[\/\?<>\\:\*\|"]/g,
	control        : /[\x00-\x1f\x80-\x9f]/g,
	reserved       : /^\.+$/,
	windowsReserved: /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i,
	windowsTrailing: /[\. ]+$/,
};

/**
 * Truncate a string to the given length in bytes. Correctly handles multi-byte characters and surrogate pairs.
 * @example
 * const str = "a☃" // a = 1 byte, ☃ = 3 bytes
 * truncate(str, 2) // -> "a"
 * @see https://github.com/parshap/truncate-utf8-bytes
 * @param {String} string
 * @param {Number} length
 * @returns {String}
 */
function truncate(string = '', length = 1) {
	if (typeof string !== 'string') {
		return '';
	}

	let curByteLength = 0,
		codePoint = 0,
		segment = '';

	const isHighSurrogate = (code) => code >= 0xd800 && code <= 0xdbff;
	const isLowSurrogate = (code) => code >= 0xdc00 && code <= 0xdfff;
	const getLength = Buffer.byteLength.bind(Buffer);

	for (let i = 0; i < string.length; i++) {
		codePoint = string.charCodeAt(i);
		segment = string[i];

		if (
			isHighSurrogate(codePoint) &&
			isLowSurrogate(string.charCodeAt(i + 1))
		) {
			i++;
			segment += string[i];
		}
		curByteLength += getLength(segment);

		if (curByteLength === length) {
			return string.slice(0, i + 1);
		} else if (curByteLength > length) {
			return string.slice(0, i - segment.length + 1);
		}
	}

	return string;
}

/**
 * replaces characters in strings by replacement
 * @param {String} input
 * @param {String} replacement
 * @returns {String}
 */
function sanitize(input = '', replacement = '') {
	if (typeof input !== 'string') {
		return '';
	}
	const sanitized = input
		.replace(REG_EXP.illegal, replacement)
		.replace(REG_EXP.control, replacement)
		.replace(REG_EXP.reserved, replacement)
		.replace(REG_EXP.windowsReserved, replacement)
		.replace(REG_EXP.windowsTrailing, replacement);

	return truncate(sanitized, 255);
}

/**
 * Replaces characters in strings that are illegal/unsafe for filenames.
 * Unsafe characters are either removed or replaced by a substitute set
 * in the optional `options` object.
 *
 * Illegal Characters on constious Operating Systems
 * / ? < > \ : * | "
 * https://kb.acronis.com/content/39790
 *
 * Unicode Control codes
 * C0 0x00-0x1f & C1 (0x80-0x9f)
 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
 *
 * Reserved filenames on Unix-based systems (".", "..")
 * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
 * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
 * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
 * "LPT9") case-insensitively and with or without filename extensions.
 *
 * Capped at 255 characters in length.
 * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
 * @see https://github.com/parshap/node-sanitize-filename
 * @example
 * sanitizeTitle("..")       // -> ""
 * sanitizeTitle("file?")    // -> "file"
 * sanitizeTitle("file?",'-')// -> "file-"
 * @param  {String} input   Original filename
 * @param  {Object|String} options {replacement: String | Function }
 * @return {String}         Sanitized filename
 */
function sanitizeTitle(input, options) {
	const replacement = (options && options.replacement) || '';
	const output = sanitize(input, replacement);
	if (replacement === '') {
		return output;
	}
	return sanitize(output, '');
}

export default sanitizeTitle;
export { truncate };
