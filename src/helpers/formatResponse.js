/**
 * Formats the response depending on whether it is an error or not
 * @param {Number} status_code HTTP response code
 * @param {String} message Short message about result
 * @param {Object} data Data to return
 * @returns Object with formated response
 */
export const formatResponse = function (status_code, message = "", data = {}) {
	const isError = status_code >= 400;
	const response = {
		success: !isError,
		status_code,
		message: isError
			? message || "Something went wrong, please retry later"
			: message,
	};
	if (!isError) response.data = data;
	return response;
};
