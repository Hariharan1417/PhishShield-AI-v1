/**
 * ==========================================
 * PhishShield AI V2
 * popup.js
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", () => {

    console.log("PhishShield popup loaded");

    // ---------------------------------------------
    // Get buttons
    // ---------------------------------------------

    const viewButton =
        document.getElementById("viewAnalysisBtn");

    const scanButton =
        document.getElementById("scanBtn");


    // ---------------------------------------------
    // View Full Analysis
    // ---------------------------------------------

    if (viewButton) {

        viewButton.addEventListener(
            "click",
            openFullAnalysis
        );

    } else {

        console.error(
            "viewAnalysisBtn not found"
        );

    }


    // ---------------------------------------------
    // Scan Current Tab
    // ---------------------------------------------

    if (scanButton) {

        scanButton.addEventListener(
            "click",
            scanCurrentTab
        );

    } else {

        console.error(
            "scanBtn not found"
        );

    }


    // ---------------------------------------------
    // Load current website
    // ---------------------------------------------

    loadCurrentWebsite();


    // ---------------------------------------------
    // Load latest scan
    // ---------------------------------------------

    loadLatestScan();

});


/* =====================================================
   CURRENT WEBSITE
===================================================== */

function loadCurrentWebsite() {

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => {

            if (chrome.runtime.lastError) {

                console.error(
                    chrome.runtime.lastError.message
                );

                return;
            }


            if (
                !tabs ||
                tabs.length === 0 ||
                !tabs[0].url
            ) {

                setWebsiteText(
                    "Unable to detect website"
                );

                return;
            }


            const url = tabs[0].url;


            console.log(
                "Current tab URL:",
                url
            );


            setWebsiteText(url);

        }
    );

}


/* =====================================================
   SET WEBSITE TEXT
===================================================== */

function setWebsiteText(url) {

    const website =
        document.getElementById(
            "currentWebsite"
        );


    if (!website) {

        console.error(
            "currentWebsite element not found"
        );

        return;
    }


    website.textContent = url;

}


/* =====================================================
   LOAD LATEST SCAN
===================================================== */

function loadLatestScan() {

    chrome.storage.local.get(
        ["latestScan"],
        (result) => {

            if (chrome.runtime.lastError) {

                console.error(
                    chrome.runtime.lastError.message
                );

                return;
            }


            if (!result.latestScan) {

                setStatus(
                    "No Scan",
                    "No scan result available."
                );

                return;
            }


            console.log(
                "Latest scan:",
                result.latestScan
            );


            updatePopup(
                result.latestScan
            );

        }
    );

}


/* =====================================================
   UPDATE POPUP
===================================================== */

function updatePopup(data) {

    const status =
        data?.status || "Unknown";


    let message =
        "Website analysis completed.";


    if (status === "Safe") {

        message =
            "This website appears to be verified and safe.";

    } else if (status === "Low Risk") {

        message =
            "Low risk characteristics detected.";

    } else if (status === "Suspicious") {

        message =
            "Suspicious anomaly patterns detected.";

    } else if (status === "Phishing") {

        message =
            "High risk phishing threat detected.";

    }


    setStatus(
        status,
        message
    );


    // Update Risk Score and Progress Bar
    const rawScore = data?.riskScore;
    let scoreVal = 0;
    if (typeof rawScore === "number") {
        scoreVal = Math.round(rawScore);
    } else if (status === "Phishing") {
        scoreVal = 95;
    } else if (status === "Suspicious") {
        scoreVal = 65;
    } else if (status === "Low Risk") {
        scoreVal = 25;
    } else if (status === "Safe") {
        scoreVal = 0;
    }

    const scoreEl = document.getElementById("riskScore");
    const progressEl = document.getElementById("riskProgress");

    if (scoreEl) {
        scoreEl.textContent = scoreVal;
    }

    if (progressEl) {
        progressEl.style.width = Math.min(100, Math.max(0, scoreVal)) + "%";
        if (scoreVal >= 70 || status === "Phishing") {
            progressEl.style.background = "#f43f5e";
            progressEl.style.boxShadow = "0 0 10px rgba(244, 63, 94, 0.4)";
        } else if (scoreVal >= 40 || status === "Suspicious") {
            progressEl.style.background = "#f59e0b";
            progressEl.style.boxShadow = "0 0 10px rgba(245, 158, 11, 0.4)";
        } else {
            progressEl.style.background = "#10b981";
            progressEl.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.4)";
        }
    }

}


/* =====================================================
   SET STATUS
===================================================== */

function setStatus(
    statusText,
    messageText
) {

    const status =
        document.getElementById(
            "status"
        );


    const message =
        document.getElementById(
            "statusMessage"
        );


    const icon =
        document.getElementById(
            "statusIcon"
        );


    if (status) {

        status.textContent =
            statusText;


        switch (statusText) {

            case "Safe":

                status.style.color =
                    "#22c55e";

                if (icon) {

                    icon.textContent =
                        "🟢";

                }

                break;


            case "Low Risk":

                status.style.color =
                    "#facc15";

                if (icon) {

                    icon.textContent =
                        "🟡";

                }

                break;


            case "Suspicious":

                status.style.color =
                    "#f97316";

                if (icon) {

                    icon.textContent =
                        "🟠";

                }

                break;


            case "Phishing":

                status.style.color =
                    "#ef4444";

                if (icon) {

                    icon.textContent =
                        "🔴";

                }

                break;


            default:

                status.style.color =
                    "#ffffff";

                if (icon) {

                    icon.textContent =
                        "🔍";

                }

                break;

        }

    }


    if (message) {

        message.textContent =
            messageText;

    }

}


/* =====================================================
   VIEW FULL ANALYSIS
===================================================== */

function openFullAnalysis() {

    console.log(
        "View Full Analysis clicked"
    );


    chrome.storage.local.get(
        ["latestScan"],
        (result) => {

            if (chrome.runtime.lastError) {

                console.error(
                    "Storage error:",
                    chrome.runtime.lastError.message
                );

                return;
            }


            const latestScan =
                result?.latestScan;


            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                (tabs) => {

                    if (chrome.runtime.lastError) {

                        console.error(
                            "Tab error:",
                            chrome.runtime.lastError.message
                        );

                        return;
                    }


                    if (
                        !tabs ||
                        tabs.length === 0 ||
                        !tabs[0].url
                    ) {

                        alert(
                            "Unable to get current website URL."
                        );

                        return;
                    }


                    const currentUrl =
                        tabs[0].url;


                    console.log(
                        "Current URL:",
                        currentUrl
                    );


                    console.log(
                        "Latest Scan:",
                        latestScan
                    );


                    // ---------------------------------------------
                    // Block browser internal pages
                    // ---------------------------------------------

                    if (
                        currentUrl.startsWith("chrome://") ||
                        currentUrl.startsWith("chrome-extension://") ||
                        currentUrl.startsWith("edge://") ||
                        currentUrl.startsWith("about:")
                    ) {

                        alert(
                            "This browser page cannot be analyzed."
                        );

                        return;
                    }


                    // ---------------------------------------------
                    // Use actual scanned URL
                    // ---------------------------------------------

                    let analysisUrl =
                        currentUrl;


                    if (
                        latestScan &&
                        typeof latestScan.url === "string" &&
                        latestScan.url.trim() !== ""
                    ) {

                        analysisUrl =
                            latestScan.url.trim();

                    }


                    console.log(
                        "Analysis URL:",
                        analysisUrl
                    );


                    // ---------------------------------------------
                    // Encode URL
                    // ---------------------------------------------

                    const encodedUrl =
                        encodeURIComponent(
                            analysisUrl
                        );


                    // ---------------------------------------------
                    // Dashboard URL
                    // ---------------------------------------------

                    const dashboardUrl =
                        "http://localhost:5173/dashboard?url=" +
                        encodedUrl;


                    console.log(
                        "Opening Dashboard:",
                        dashboardUrl
                    );


                    // ---------------------------------------------
                    // Open dashboard
                    // ---------------------------------------------

                    chrome.tabs.create({
                        url: dashboardUrl
                    });


                    // ---------------------------------------------
                    // Close popup
                    // ---------------------------------------------

                    window.close();

                }
            );

        }
    );

}


/* =====================================================
   SCAN CURRENT TAB
===================================================== */

function scanCurrentTab() {

    console.log(
        "Scan Current Tab clicked"
    );


    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => {

            if (chrome.runtime.lastError) {

                console.error(
                    chrome.runtime.lastError.message
                );

                return;
            }


            if (
                !tabs ||
                tabs.length === 0
            ) {

                alert(
                    "No active tab found."
                );

                return;
            }


            const tab =
                tabs[0];


            const currentUrl =
                tab.url || "";


            console.log(
                "Scanning:",
                currentUrl
            );


            // ---------------------------------------------
            // Browser internal pages cannot be scanned
            // ---------------------------------------------

            if (
                currentUrl.startsWith("chrome://") ||
                currentUrl.startsWith("chrome-extension://") ||
                currentUrl.startsWith("edge://") ||
                currentUrl.startsWith("about:")
            ) {

                alert(
                    "This browser page cannot be scanned."
                );

                return;
            }


            // ---------------------------------------------
            // Send message to content script
            // ---------------------------------------------

            chrome.tabs.sendMessage(
                tab.id,
                {
                    action: "scanAgain"
                },
                (response) => {

                    if (chrome.runtime.lastError) {

                        console.error(
                            "Content script error:",
                            chrome.runtime.lastError.message
                        );


                        alert(
                            "Scanner is not available on this page. Please reload the webpage and try again."
                        );

                        return;
                    }


                    console.log(
                        "Scan response:",
                        response
                    );


                    window.close();

                }
            );

        }
    );

}