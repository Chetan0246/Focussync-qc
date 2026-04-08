// Standardized API Response Helper Functions

/**
 * Sends a success response.
 * @param {Object} res - The response object.
 * @param {Object} data - The data to send in the response.
 * @param {string} message - Optional success message.
 */
function sendSuccess(res, data, message = 'Request was successful.') {
    return res.status(200).json({
        status: 'success',
        message,
        data,
    });
}

/**
 * Sends an error response.
 * @param {Object} res - The response object.
 * @param {string} message - Error message.
 * @param {Number} statusCode - Optional HTTP status code.
 */
function sendError(res, message, statusCode = 500) {
    return res.status(statusCode).json({
        status: 'error',
        message,
    });
}

/**
 * Sends a paginated response.
 * @param {Object} res - The response object.
 * @param {Object} data - The data for the current page.
 * @param {Number} total - The total number of items.
 * @param {Number} page - Current page number.
 * @param {Number} limit - Number of items per page.
 */
function sendPaginatedResponse(res, data, total, page, limit) {
    return res.status(200).json({
        status: 'success',
        data,
        pagination: {
            total,
            page,
            limit,
        },
    });
}

module.exports = { sendSuccess, sendError, sendPaginatedResponse };