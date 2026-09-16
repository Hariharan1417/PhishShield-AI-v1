/**
 * ==========================================
 * PhishShield AI V2
 * detector.js
 * Background Communication Engine
 * ==========================================
 */

window.PhishShield = window.PhishShield || {};

window.PhishShield.Detector = {

    analyze(pageInfo) {

        return new Promise((resolve, reject) => {

            chrome.runtime.sendMessage(
                {
                    action: "analyze",
                    data: pageInfo
                },
                (response) => {

                    // Check for Chrome runtime errors
                    if (chrome.runtime.lastError) {

                        window.PhishShield.Utils.error(
                            "Runtime Error",
                            chrome.runtime.lastError
                        );

                        reject(chrome.runtime.lastError);
                        return;
                    }

                    // Check background response
                    if (!response || !response.success) {

                        window.PhishShield.Utils.error(
                            "Background request failed",
                            response?.error
                        );

                        reject(response?.error || "Unknown Error");
                        return;
                    }

                    resolve(response.data);

                }
            );

        });

    }

};