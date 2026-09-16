// ==========================================
// PhishShield AI
// blocked.js
// Blocked Website Result Renderer
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const url =
        params.get("url");

    const scoreFromUrl =
        params.get("score");


    // ==========================================
    // Elements
    // ==========================================

    const urlElement =
        document.getElementById("url");

    const scoreElement =
        document.getElementById("score");

    const statusElement =
        document.getElementById("status");

    const warningTitle =
        document.getElementById("warningTitle");

    const reasonsContainer =
        document.getElementById("reasons");

    const recommendationElement =
        document.getElementById(
            "recommendationText"
        );

    const confidenceElement =
        document.getElementById(
            "confidence"
        );

    const backButton =
        document.getElementById(
            "backButton"
        );


    // ==========================================
    // Show URL
    // ==========================================

    if (url) {

        urlElement.textContent =
            url;

    } else {

        urlElement.textContent =
            "Unknown URL";
    }


    // ==========================================
    // Show Score
    // ==========================================

    if (
        scoreFromUrl &&
        scoreFromUrl !== "UNKNOWN"
    ) {

        scoreElement.textContent =
            scoreFromUrl;
    }


    // ==========================================
    // Back Button
    // ==========================================

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                history.back();

            }
        );
    }


    // ==========================================
    // No URL
    // ==========================================

    if (!url) {

        showFallbackReason(
            reasonsContainer,
            recommendationElement
        );

        return;
    }


    // ==========================================
    // Get Stored Result
    // ==========================================

    try {

        const stored =
            await chrome.storage.session.get(
                "phishshield_results"
            );


        const results =
            stored.phishshield_results || {};


        const result =
            results[url];


        console.log(
            "🧠 BLOCKED PAGE RESULT:",
            result
        );


        // ==========================================
        // Result Not Found
        // ==========================================

        if (!result) {

            console.log(
                "⚠️ No stored result found:",
                url
            );


            showFallbackReason(
                reasonsContainer,
                recommendationElement
            );


            return;
        }


        // ==========================================
        // Risk Score
        // ==========================================

        if (
            result.riskScore !== undefined &&
            result.riskScore !== null
        ) {

            scoreElement.textContent =
                result.riskScore;
        }


        // ==========================================
        // Status
        // ==========================================

        if (result.status) {

            if (statusElement) {

                statusElement.textContent =
                    result.status;
            }


            if (warningTitle) {

                if (
                    result.status === "Phishing"
                ) {

                    warningTitle.textContent =
                        "🚨 Phishing Threat Detected";

                }
                else if (
                    result.status === "Suspicious"
                ) {

                    warningTitle.textContent =
                        "⚠️ Security Threat Detected";

                }
                else {

                    warningTitle.textContent =
                        "⚠️ Security Analysis Result";

                }
            }
        }


        // ==========================================
        // Detection Reasons
        // ==========================================

        if (reasonsContainer) {

            reasonsContainer.innerHTML = "";


            if (
                Array.isArray(result.reasons) &&
                result.reasons.length > 0
            ) {

                result.reasons.forEach(
                    (reason) => {

                        const li =
                            document.createElement(
                                "li"
                            );


                        // --------------------------
                        // String reason
                        // --------------------------

                        if (
                            typeof reason === "string"
                        ) {

                            li.textContent =
                                reason;
                        }


                        // --------------------------
                        // Object reason
                        // --------------------------

                        else if (
                            typeof reason === "object" &&
                            reason !== null
                        ) {

                            if (
                                reason.message
                            ) {

                                li.textContent =
                                    reason.message;

                            }
                            else if (
                                reason.reason
                            ) {

                                li.textContent =
                                    reason.reason;

                            }
                            else if (
                                reason.description
                            ) {

                                li.textContent =
                                    reason.description;

                            }
                            else {

                                li.textContent =
                                    Object.entries(
                                        reason
                                    )
                                    .map(
                                        ([key, value]) =>
                                            `${key}: ${value}`
                                    )
                                    .join(
                                        " | "
                                    );
                            }

                        }


                        // --------------------------
                        // Unknown value
                        // --------------------------

                        else {

                            li.textContent =
                                String(reason);
                        }


                        reasonsContainer.appendChild(
                            li
                        );

                    }
                );

            }
            else {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    "Website was blocked by the PhishShield AI detection engine.";


                reasonsContainer.appendChild(
                    li
                );
            }
        }


        // ==========================================
        // Recommendation
        // ==========================================

        let recommendation =
            result.recommendation;


        // Groq result
        if (
            result.groqEngine &&
            result.groqEngine.recommendation
        ) {

            recommendation =
                result.groqEngine.recommendation;
        }


        if (
            recommendationElement
        ) {

            if (recommendation) {

                recommendationElement.textContent =
                    recommendation;

            }
            else {

                recommendationElement.textContent =
                    "Do not enter credentials or sensitive information.";

            }
        }


        // ==========================================
        // Confidence
        // ==========================================

        if (confidenceElement) {

            if (
                result.confidence !== undefined &&
                result.confidence !== null
            ) {

                // Backend gives:
                // High / Medium / Low

                if (
                    typeof result.confidence === "string"
                ) {

                    confidenceElement.textContent =
                        result.confidence;

                }
                else {

                    confidenceElement.textContent =
                        result.confidence + "%";
                }

            }
            else if (
                result.groqEngine &&
                result.groqEngine.confidence !== undefined
            ) {

                confidenceElement.textContent =
                    result.groqEngine.confidence + "%";

            }
            else {

                confidenceElement.textContent =
                    "Unknown";
            }
        }


    }
    catch (error) {

        console.error(
            "❌ Blocked page result error:",
            error
        );


        showFallbackReason(
            reasonsContainer,
            recommendationElement
        );

    }

});


// ==========================================
// Fallback
// ==========================================

function showFallbackReason(
    reasonsContainer,
    recommendationElement
) {

    if (reasonsContainer) {

        reasonsContainer.innerHTML = "";


        const li =
            document.createElement(
                "li"
            );


        li.textContent =
            "Website was blocked by the PhishShield AI detection engine.";


        reasonsContainer.appendChild(
            li
        );
    }


    if (recommendationElement) {

        recommendationElement.textContent =
            "Do not enter credentials or sensitive information.";

    }

}