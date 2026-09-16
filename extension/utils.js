/**
 * ==========================================
 * PhishShield AI V2
 * utils.js
 * Common Helper Functions
 * ==========================================
 */

window.PhishShield = window.PhishShield || {};

window.PhishShield.Utils = {

    VERSION: "2.0.0",

    BACKEND_URL: "http://127.0.0.1:8000",

    /**
     * Check whether current page is localhost.
     */
    isLocalhost() {

        const host = window.location.hostname;

        return (
            host === "localhost" ||
            host === "127.0.0.1"
        );

    },

    /**
     * Simple logger
     */
    log(message, data = null) {

        if (data) {
            console.log(`[PhishShield AI] ${message}`, data);
        } else {
            console.log(`[PhishShield AI] ${message}`);
        }

    },

    /**
     * Error logger
     */
    error(message, error = null) {

        if (error) {
            console.error(`[PhishShield AI] ${message}`, error);
        } else {
            console.error(`[PhishShield AI] ${message}`);
        }

    },

    /**
     * Generate timestamp
     */
    getTimestamp() {

        return new Date().toISOString();

    },

    /**
     * Debounce helper
     * (Used in Milestone 2)
     */
    debounce(func, delay = 500) {

        let timeout;

        return (...args) => {

            clearTimeout(timeout);

            timeout = setTimeout(() => {

                func.apply(null, args);

            }, delay);

        };

    }

};