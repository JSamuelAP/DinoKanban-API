/**
 * Formats the response depending on whether it is an error or not
 * @param {Number} statusCode HTTP response code
 * @param {String} message Short message about result
 * @param {Object} data Data to return
 * @returns Object with formated response
 */
const formatResponse = (statusCode, message = '', data = {}) => {
  const isError = statusCode >= 400;
  const response = {
    success: !isError,
    status_code: statusCode,
    message: isError
      ? message || 'Something went wrong, please retry later'
      : message,
  };
  if (!isError) response.data = data;
  return response;
};

export default formatResponse;
