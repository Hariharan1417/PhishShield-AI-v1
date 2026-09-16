/**
 * ==========================================
 * PhishShield AI V2
 * ui.js
 * Compact Security Toast UI
 * ==========================================
 */

window.PhishShield = window.PhishShield || {};

window.PhishShield.UI = {

    banner: null,
    hideTimer: null,

    // ==========================================
    // Create Compact Banner
    // ==========================================

    createBanner() {

        if (this.banner) {
            return this.banner;
        }

        const banner = document.createElement("div");

        banner.id = "phishshield-banner";

        // Position
        banner.style.position = "fixed";
        banner.style.bottom = "18px";
        banner.style.right = "18px";

        // Size
        banner.style.width = "300px";
        banner.style.maxWidth = "calc(100vw - 36px)";

        // Appearance
        banner.style.background = "#0f172a";
        banner.style.color = "#ffffff";

        banner.style.padding = "14px 16px";

        banner.style.borderRadius = "12px";

        banner.style.border =
            "1px solid rgba(255,255,255,0.12)";

        banner.style.boxShadow =
            "0 12px 35px rgba(0,0,0,0.35)";

        banner.style.backdropFilter =
            "blur(10px)";

        banner.style.webkitBackdropFilter =
            "blur(10px)";

        // Typography
        banner.style.fontFamily =
            "Segoe UI, Arial, sans-serif";

        banner.style.fontSize = "13px";
        banner.style.fontWeight = "500";
        banner.style.lineHeight = "1.45";

        // Layout
        banner.style.zIndex = "2147483647";

        banner.style.whiteSpace = "pre-line";

        banner.style.overflow = "hidden";

        banner.style.transition =
            "opacity .25s ease, transform .25s ease";

        banner.style.opacity = "0";

        banner.style.transform =
            "translateY(10px)";

        // Prevent website CSS interference
        banner.style.all = "initial";

        banner.style.position = "fixed";
        banner.style.bottom = "18px";
        banner.style.right = "18px";

        banner.style.width = "300px";
        banner.style.maxWidth =
            "calc(100vw - 36px)";

        banner.style.boxSizing =
            "border-box";

        banner.style.padding =
            "14px 16px";

        banner.style.borderRadius =
            "12px";

        banner.style.zIndex =
            "2147483647";

        banner.style.fontFamily =
            "Segoe UI, Arial, sans-serif";

        banner.style.fontSize =
            "13px";

        banner.style.lineHeight =
            "1.45";

        banner.style.color =
            "#ffffff";

        banner.style.background =
            "#0f172a";

        banner.style.border =
            "1px solid rgba(255,255,255,0.12)";

        banner.style.boxShadow =
            "0 12px 35px rgba(0,0,0,0.35)";

        banner.style.whiteSpace =
            "pre-line";

        banner.style.cursor =
            "default";

        document.body.appendChild(banner);

        this.banner = banner;

        return banner;
    },


    // ==========================================
    // Show Animation
    // ==========================================

    showBanner() {

        requestAnimationFrame(() => {

            this.banner.style.opacity = "1";

            this.banner.style.transform =
                "translateY(0)";
        });
    },


    // ==========================================
    // Loading State
    // ==========================================

    showLoading() {

        this.createBanner();

        clearTimeout(this.hideTimer);

        this.banner.style.display = "block";

        this.banner.style.background =
            "#0f172a";

        this.banner.style.border =
            "1px solid rgba(255,255,255,0.12)";

        this.banner.style.opacity = "0";

        this.banner.style.transform =
            "translateY(10px)";

        this.banner.innerText =
`🛡️  PhishShield AI
🔎  Scanning website...`;

        this.showBanner();
    },


    // ==========================================
    // Update Result
    // ==========================================

    updateBanner(data) {

        this.createBanner();

        clearTimeout(this.hideTimer);

        if (!data) {

            this.showError(
                "No analysis result received."
            );

            return;
        }


        // ==========================================
        // Status
        // ==========================================

        const status =
            data.status || "Unknown";


        // ==========================================
        // Risk Score
        // ==========================================

        const riskScore =
            data.riskScore !== undefined &&
            data.riskScore !== null
                ? data.riskScore
                : "--";


        // ==========================================
        // Source
        // ==========================================

        const source =
            data.source ||
            data.highestEngine ||
            "Unknown";


        // ==========================================
        // Status Configuration
        // ==========================================

        let icon = "🔴";

        let background = "#991b1b";

        let border =
            "1px solid rgba(248,113,113,0.35)";


        if (status === "Safe") {

            icon = "🟢";

            background = "#166534";

            border =
                "1px solid rgba(134,239,172,0.3)";
        }

        else if (status === "Low Risk") {

            icon = "🟡";

            background = "#854d0e";

            border =
                "1px solid rgba(253,224,71,0.3)";
        }

        else if (status === "Suspicious") {

            icon = "🟠";

            background = "#9a3412";

            border =
                "1px solid rgba(253,186,116,0.3)";
        }


        // ==========================================
        // Confidence
        // ==========================================

        let confidenceText = "";

        if (data.confidence) {

            confidenceText =
                ` • ${data.confidence}`;
        }


        // ==========================================
        // Reason Summary
        // ==========================================

        let reasonText = "";

        if (
            Array.isArray(data.reasons) &&
            data.reasons.length > 0
        ) {

            const firstReason =
                data.reasons[0];

            if (
                typeof firstReason === "string"
            ) {

                reasonText =
                    firstReason;
            }

            else if (
                typeof firstReason === "object" &&
                firstReason !== null
            ) {

                reasonText =
                    firstReason.message ||
                    firstReason.reason ||
                    firstReason.text ||
                    "";
            }


            if (data.reasons.length > 1) {

                reasonText +=
                    ` +${data.reasons.length - 1} more`;
            }
        }


        // ==========================================
        // Apply Style
        // ==========================================

        this.banner.style.background =
            background;

        this.banner.style.border =
            border;

        this.banner.style.display =
            "block";


        // ==========================================
        // Compact Result
        // ==========================================

        let text =
`${icon}  ${status} Website
Risk ${riskScore}/100${confidenceText}
${source}`;

        if (reasonText) {

            text +=
                `\n⚠ ${reasonText}`;
        }


        this.banner.innerText = text;


        // ==========================================
        // Animation
        // ==========================================

        this.banner.style.opacity = "0";

        this.banner.style.transform =
            "translateY(10px)";

        this.showBanner();


        // ==========================================
        // Auto Hide
        // ==========================================

        this.hideTimer =
            setTimeout(() => {

                this.hideBanner();

            }, 7000);
    },


    // ==========================================
    // Backend Error
    // ==========================================

    showBackendError() {

        this.createBanner();

        clearTimeout(this.hideTimer);

        this.banner.style.display =
            "block";

        this.banner.style.background =
            "#991b1b";

        this.banner.style.border =
            "1px solid rgba(248,113,113,0.35)";

        this.banner.innerText =
`❌  Backend Connection Failed
FastAPI server is unavailable.`;

        this.banner.style.opacity = "0";

        this.banner.style.transform =
            "translateY(10px)";

        this.showBanner();

        this.hideTimer =
            setTimeout(() => {

                this.hideBanner();

            }, 8000);
    },


    // ==========================================
    // Generic Error
    // ==========================================

    showError(message) {

        this.createBanner();

        clearTimeout(this.hideTimer);

        this.banner.style.display =
            "block";

        this.banner.style.background =
            "#991b1b";

        this.banner.innerText =
`❌  Scan Failed
${message}`;

        this.banner.style.opacity = "0";

        this.banner.style.transform =
            "translateY(10px)";

        this.showBanner();

        this.hideTimer =
            setTimeout(() => {

                this.hideBanner();

            }, 7000);
    },


    // ==========================================
    // Hide Banner
    // ==========================================

    hideBanner() {

        if (!this.banner) {
            return;
        }

        this.banner.style.opacity = "0";

        this.banner.style.transform =
            "translateY(10px)";

        setTimeout(() => {

            if (this.banner) {

                this.banner.style.display =
                    "none";
            }

        }, 250);
    }

};