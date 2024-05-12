    const axios = require('axios');

/**
 * A class to handle network requests with rate limit handling and error formatting.
 */
class Network {
    /**
     * Constructs the network handler.
     * @param {string} baseUrl - The base URL for the network requests.
     * @param {object} headers - Custom headers for the requests.
     * @param {number} rateLimitWaitTime - Wait time in seconds to handle rate limits.
     */
    constructor(baseUrl, headers = {}, rateLimitWaitTime = 3) {
        const commonHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: { ...commonHeaders, ...headers },
        });
        this.rateLimitWaitTime = rateLimitWaitTime * 1000; // Convert seconds to milliseconds
    }

    /**
     * Makes a network request.
     * @param {string} method - HTTP method ('get' or 'post').
     * @param {string} url - URL endpoint for the request.
     * @param {object|null} params - params for the request
     * @param {object|null} data - Data payload for POST requests.
     * @param {number} retries - Number of retries for rate-limited requests.
     * @returns {Promise<{err: null|string, data: object|null}>} - Response or error.
     */
    async makeRequest(method, url, params = {}, data = null, retries = 3) {
        try {
            const response = await this.axiosInstance({ method, url, data, params });
            return { err: null, data: response.data };
        } catch (error) {
            if (this.isRateLimitError(error) && retries > 0) {
                console.log(`Rate limit hit, retrying in ${this.rateLimitWaitTime}ms...`);
                await this.delay(this.rateLimitWaitTime);
                const response = await this.makeRequest(method, url, data, params, retries - 1);

                return {
                    err: false,
                    data: response.data,
                }
            }
            return this.formatError(error);
        }
    }

    /**
     * Checks if an error is due to rate limiting.
     * @param {object} error - The error object to check.
     * @returns {boolean} - True if the error is a rate limit error, false otherwise.
     */
    isRateLimitError(error) {
        return error.response && error.response.status === 429;
    }

    /**
     * Formats an error object into a readable string.
     * @param {object} error - The error object to format.
     * @returns {string} - Formatted error message.
     */
    formatError(error) {
        console.log('Network Error: ' + error);
        console.log('Network Error Message: ' + error?.response?.data?.error?.message || error.message || error);
        const formattedError = {};
        if (error.response) {
            formattedError.status = error.response.status;
            formattedError.message = error.response.data
        } else {
            formattedError.status = 500;
            formattedError.message = error.message || error
        }

        return { err: true, data: formattedError };
    }

    /**
     * Delays execution for a given number of milliseconds.
     * @param {number} ms - The number of milliseconds to delay.
     * @returns {Promise<void>} - A promise that resolves after the delay.
     */
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

module.exports = Network;
