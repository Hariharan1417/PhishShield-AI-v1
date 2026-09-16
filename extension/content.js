/* =========================================================
   PhishShield AI V2
   content.js
========================================================= */

console.log("🛡️ PhishShield AI content script loaded");


// =========================================================
// Check scanner availability
// =========================================================

function scannerAvailable() {
    return (
        window.PhishShield &&
        window.PhishShield.Scanner &&
        typeof window.PhishShield.Scanner.collectPageInfo === "function"
    );
}


// =========================================================
// Scan Current Page
// =========================================================

async function scanCurrentPage() {

    console.log("🔍 Starting PhishShield scan...");

    if (!scannerAvailable()) {

        console.error(
            "❌ PhishShield Scanner is not available"
        );

        throw new Error(
            "Scanner is not available on this page."
        );
    }


    try {

        // ---------------------------------------------
        // Collect page features
        // ---------------------------------------------

        const pageInfo =
            window.PhishShield.Scanner.collectPageInfo();


        console.log(
            "📊 Page information collected:",
            pageInfo
        );


        // ---------------------------------------------
        // Send features to detector
        // ---------------------------------------------

        if (
            window.PhishShield.Detector &&
            typeof window.PhishShield.Detector.analyze === "function"
        ) {

            console.log(
                "🤖 Sending data to Detector..."
            );

            const result =
                await window.PhishShield.Detector.analyze(
                    pageInfo
                );


            console.log(
                "✅ Detection result:",
                result
            );


            return result;
        }


        // ---------------------------------------------
        // If detector isn't exposed,
        // return collected features
        // ---------------------------------------------

        console.warn(
            "⚠️ Detector analyze() not available."
        );

        return {
            success: true,
            pageInfo: pageInfo
        };


    } catch (error) {

        console.error(
            "❌ Scan failed:",
            error
        );

        throw error;
    }
}


// =========================================================
// Message Listener
// =========================================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        console.log(
            "📩 PhishShield message:",
            message
        );


        // =================================================
        // SCAN AGAIN
        // =================================================

        if (
            message &&
            message.action === "scanAgain"
        ) {

            scanCurrentPage()

                .then((result) => {

                    console.log(
                        "✅ Scan completed"
                    );

                    sendResponse({
                        success: true,
                        result: result
                    });

                })

                .catch((error) => {

                    console.error(
                        "❌ Scan failed:",
                        error
                    );

                    sendResponse({
                        success: false,
                        error: error.message
                    });

                });


            // Keep message channel open
            return true;
        }


        // =================================================
        // GET CURRENT URL
        // =================================================

        if (
            message &&
            message.action === "getCurrentURL"
        ) {

            sendResponse({
                success: true,
                url: window.location.href
            });

            return true;
        }


        // =================================================
        // PING
        // =================================================

        if (
            message &&
            message.action === "ping"
        ) {

            sendResponse({
                success: true,
                scannerAvailable: scannerAvailable(),
                url: window.location.href
            });

            return true;
        }

    }
);


// =========================================================
// Initial Status
// =========================================================

if (scannerAvailable()) {

    console.log(
        "✅ PhishShield Scanner ready"
    );

} else {

    console.warn(
        "⚠️ PhishShield Scanner not ready yet"
    );

}