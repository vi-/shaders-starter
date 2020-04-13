/**
 * Checks media query size
 * @return {String} Returns media query name string
 */

const getMediaQuery = () => {
	const size = window.getComputedStyle(document.body, ':after').content.split('"').join('');
	return size;
}

/**
 * Debounce Function
 * https://davidwalsh.name/javascript-debounce-function
 */
const debounce = ( func, wait, immediate ) => {
	let timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	}
}

/**
 * Fetches current year
 */
const getYear = () => {
	const d = new Date();
	return d.getFullYear();
}

module.exports = {
	getMediaQuery,
	debounce,
	getYear
}