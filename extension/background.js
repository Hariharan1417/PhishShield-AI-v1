// ==========================================
// PhishShield AI
// background.js
// Navigation Protection + Backend Communication
// ==========================================

const BACKEND_URL = "http://127.0.0.1:8000/analyze";


// ==========================================
// Runtime State
// ==========================================

const allowedOnce = new Map();
const analyzingUrls = new Map();


// ==========================================
// Startup
// ==========================================

console.log(
    "🛡️ PhishShield AI Background Service Worker Started"
);

console.log(
    "🔗 Backend:",
    BACKEND_URL
);


// ==========================================
// Utility
// ==========================================

function isInternalUrl(url) {

    if (!url) {
        return true;
    }

    return (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:") ||
        url.startsWith("devtools://")
    );
}


function isBackendUrl(url) {

    if (!url) {
        return false;
    }

    return (
        url.startsWith("http://127.0.0.1:8000") ||
        url.startsWith("http://localhost:8000")
    );
}


// ==========================================
// Build Backend Payload
// ==========================================

function buildPayload(url) {

    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname;

    return {

        // Advanced HTML Features

        iframes: 0,
        externalScripts: 0,
        inlineScripts: 0,
        hiddenElements: 0,


        // Existing Features

        url: url,

        title: "",

        protocol:
            parsedUrl.protocol,

        forms: 0,

        passwordFields: 0,

        emailFields: 0,

        links: 0,

        hasFavicon: 0,

        hasHiddenFields: 0,

        hasSubmitButton: 0,

        hasExternalFormSubmit: 0,

        noOfPopup: 0,


        // URL Features

        urlLength:
            url.length,

        domainLength:
            hostname.length,

        dotCount:
            (url.match(/\./g) || []).length,

        hyphenCount:
            (url.match(/-/g) || []).length,

        underscoreCount:
            (url.match(/_/g) || []).length,

        digitCount:
            (url.match(/\d/g) || []).length,
 
        specialCharCount:
            (url.match(/[^a-zA-Z0-9]/g) || []).length,

        subdomainCount:
            Math.max(
                0,
                hostname.split(".").length - 2
            ),


        // Security Features

        isHTTPS:
            parsedUrl.protocol === "https:"
                ? 1
                : 0,

        isIPAddress:
            /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
                ? 1
                : 0,

        hasLoginKeyword:
            /login|signin|sign-in|verify|verification|password|account/i
                .test(url)
                ? 1
                : 0,

        hasBankKeyword:
            /bank|paypal|upi|payment|wallet|credit|debit/i
                .test(url)
                ? 1
                : 0,

        hasCryptoKeyword:
            /crypto|bitcoin|ethereum|wallet/i
                .test(url)
                ? 1
                : 0,

        hasSecureKeyword:
            /secure|security|auth|authenticate/i
                .test(url)
                ? 1
                : 0,


        // V3 Dataset Features

        hasDescription: 0,

        robots: 0,

        isResponsive: 0,

        noOfImage: 0,

        noOfCSS: 0,

        noOfJS: 0,

        noOfiFrame: 0,

        hasSocialNet: 0,

        hasCopyrightInfo: 0,

        noOfExternalRef: 0,

        noOfSelfRef: 0,

        noOfEmptyRef: 0,

        noOfURLRedirect: 0
    };
}


// ==========================================
// Save Analysis Result
// ==========================================

async function saveAnalysisResult(url, result) {

    try {

        const scanResult = {

            ...result,

            scannedUrl: url,

            scannedAt: Date.now()

        };


        // ==========================================
        // SESSION STORAGE
        // Used by background service
        // ==========================================

        const sessionStored =
            await chrome.storage.session.get(
                ["phishshield_results"]
            );

        const sessionResults =
            sessionStored.phishshield_results || {};

        sessionResults[url] =
            scanResult;


        await chrome.storage.session.set({

            phishshield_results:
                sessionResults

        });


        // ==========================================
        // LOCAL STORAGE
        // Used by popup
        // ==========================================

        await chrome.storage.local.set({

            latestScan:
                scanResult

        });


        console.log(
            "💾 Analysis result saved:",
            url
        );

        console.log(
            "📦 latestScan saved:",
            scanResult
        );


    } catch (error) {

        console.error(
            "❌ Failed to save analysis result:",
            error
        );

    }
}


// ==========================================
// Analyze URL
// ==========================================

async function analyzeUrl(url) {

    console.log(
        "🔎 Analyzing URL:",
        url
    );


    // Prevent duplicate requests

    if (analyzingUrls.has(url)) {

        console.log(
            "⏳ Analysis already running:",
            url
        );

        return analyzingUrls.get(url);
    }


    const analysisPromise =
        (async () => {

            try {

                const payload =
                    buildPayload(url);


                console.log(
                    "📤 Backend payload:",
                    payload
                );


                const response =
                    await fetch(
                        BACKEND_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                // ==================================
                // HTTP Error
                // ==================================

                if (!response.ok) {

                    throw new Error(
                        `Backend returned HTTP ${response.status}`
                    );
                }


                const result =
                    await response.json();


                console.log(
                    "🧠 PhishShield Result:",
                    result
                );


                // ==================================
                // Save Complete Result
                // ==================================

                await saveAnalysisResult(
                    url,
                    result
                );


                return result;


            } catch (error) {

                console.error(
                    "❌ Backend analysis failed:",
                    error
                );

                throw error;

            } finally {

                analyzingUrls.delete(url);

            }

        })();


    analyzingUrls.set(
        url,
        analysisPromise
    );


    return analysisPromise;
}


// ==========================================
// Get Blocked Page
// ==========================================

function getBlockedPage(
    url,
    result
) {

    const score =
        result?.riskScore !== undefined
            ? result.riskScore
            : "UNKNOWN";


    return (
        chrome.runtime.getURL(
            "blocked.html"
        ) +
        "?url=" +
        encodeURIComponent(url) +
        "&score=" +
        encodeURIComponent(score)
    );
}


// ==========================================
// Get Checking Page
// ==========================================

function getCheckingPage(url) {

    return (
        chrome.runtime.getURL(
            "checking.html"
        ) +
        "?url=" +
        encodeURIComponent(url)
    );
}


// ==========================================
// Is Dangerous
// ==========================================

function isDangerous(result) {

    if (!result) {
        return true;
    }


    if (
        result.status === "Phishing"
    ) {

        return true;
    }


    if (
        result.status === "Suspicious"
    ) {

        return true;
    }


    if (
        typeof result.riskScore === "number" &&
        result.riskScore >= 60
    ) {

        return true;
    }


    return false;
}


// ==========================================
// Navigation Interceptor
// ==========================================

chrome.webNavigation.onBeforeNavigate.addListener(
    async (details) => {

        // Only main frame

        if (details.frameId !== 0) {
            return;
        }


        const tabId =
            details.tabId;

        const url =
            details.url;


        // Ignore internal pages

        if (
            isInternalUrl(url)
        ) {

            return;
        }


        // Ignore backend

        if (
            isBackendUrl(url)
        ) {

            return;
        }


        console.log(
            "🌐 Navigation detected:",
            url
        );


        // ==========================================
        // Already Allowed
        // ==========================================

        if (
            allowedOnce.has(tabId)
        ) {

            const allowedUrl =
                allowedOnce.get(tabId);


            if (
                allowedUrl === url
            ) {

                console.log(
                    "✅ Already verified:",
                    url
                );


                allowedOnce.delete(
                    tabId
                );


                return;
            }
        }


        // ==========================================
        // Show Checking Page
        // ==========================================

        const checkingPage =
            getCheckingPage(url);


        try {

            await chrome.tabs.update(
                tabId,
                {
                    url: checkingPage
                }
            );

        } catch (error) {

            console.error(
                "❌ Failed to open checking page:",
                error
            );

            return;
        }


        // ==========================================
        // Analyze
        // ==========================================

        try {

            const result =
                await analyzeUrl(url);


            // ==========================================
            // PHISHING / SUSPICIOUS
            // ==========================================

            if (
                isDangerous(result)
            ) {

                console.warn(
                    "🚨 Dangerous website blocked:",
                    url,
                    result
                );


                await chrome.tabs.update(
                    tabId,
                    {
                        url:
                            getBlockedPage(
                                url,
                                result
                            )
                    }
                );

                return;
            }


            // ==========================================
            // SAFE / LOW RISK
            // ==========================================

            console.log(
                "✅ Website considered safe:",
                url,
                result
            );


            allowedOnce.set(
                tabId,
                url
            );


            await chrome.tabs.update(
                tabId,
                {
                    url: url
                }
            );


        } catch (error) {

            console.error(
                "❌ Analysis failed:",
                error
            );


            // ==========================================
            // Fail Closed
            // ==========================================

            const fallbackResult = {

                status:
                    "Unavailable",

                riskScore:
                    "UNKNOWN",

                confidence:
                    "Unknown",

                highestEngine:
                    "Backend",

                source:
                    "Backend Unavailable",

                reasons: [
                    "PhishShield AI backend could not analyze this website."
                ],

                recommendation:
                    "Do not enter credentials until the website can be verified."
            };


            await saveAnalysisResult(
                url,
                fallbackResult
            );


            await chrome.tabs.update(
                tabId,
                {
                    url:
                        getBlockedPage(
                            url,
                            fallbackResult
                        )
                }
            );
        }

    }
);


// ==========================================
// Content Script Communication
// ==========================================
//
// detector.js sends:
//
// {
//     action: "analyze",
//     data: pageInfo
// }
//
// This listener handles that request.
// ==========================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (
            !message ||
            message.action !== "analyze"
        ) {

            return false;
        }


        console.log(
            "📨 Content script analysis request:",
            message.data
        );


        (async () => {

            try {

                const pageInfo =
                    message.data || {};


                const url =
                    pageInfo.url ||
                    sender?.tab?.url;


                if (!url) {

                    throw new Error(
                        "URL not available"
                    );
                }


                // ==================================
                // URL analysis
                // ==================================

                const result =
                    await analyzeUrl(url);


                sendResponse({

                    success: true,

                    data: result

                });


            } catch (error) {

                console.error(
                    "❌ Content script analysis error:",
                    error
                );


                sendResponse({

                    success: false,

                    error:
                        error?.message ||
                        String(error)

                });

            }

        })();


        // Required for async response

        return true;
    }
);


// ==========================================
// Tab Cleanup
// ==========================================

chrome.tabs.onRemoved.addListener(
    (tabId) => {

        allowedOnce.delete(
            tabId
        );


        console.log(
            "🧹 Cleaned tab state:",
            tabId
        );

    }
);


// ==========================================
// Extension Startup
// ==========================================

chrome.runtime.onStartup.addListener(
    () => {

        console.log(
            "🚀 PhishShield AI started"
        );

    }
);