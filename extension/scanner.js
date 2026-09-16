/**
 * ==========================================
 * PhishShield AI V2
 * scanner.js
 * Website Feature Extraction Engine
 * ==========================================
 */

window.PhishShield = window.PhishShield || {};

window.PhishShield.Scanner = {

    collectPageInfo() {

        const url = window.location.href;
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;

        // ==========================================
        // Advanced HTML Metrics
        // ==========================================

        const iframes =
            document.querySelectorAll("iframe").length;

        const externalScripts =
            [...document.scripts].filter(script => {

                if (!script.src) {
                    return false;
                }

                try {

                    return (
                        new URL(script.src).hostname !== hostname
                    );

                } catch {

                    return false;
                }

            }).length;

        const inlineScripts =
            [...document.scripts].filter(
                script => !script.src
            ).length;

        const hiddenElements =
            document.querySelectorAll(
                '[type="hidden"], [hidden], [style*="display:none"]'
            ).length;


        // ==========================================
        // Dataset-Compatible Features
        // ==========================================

        const hasDescription =
            document.querySelector(
                'meta[name="description"]'
            ) ? 1 : 0;

        const robots =
            document.querySelector(
                'meta[name="robots"]'
            ) ? 1 : 0;

        const isResponsive =
            document.querySelector(
                'meta[name="viewport"]'
            ) ? 1 : 0;

        const noOfImage =
            document.images.length;

        const noOfCSS =
            document.styleSheets.length;

        const noOfJS =
            document.scripts.length;

        const noOfiFrame =
            iframes;


        // ==========================================
        // Social Network Detection
        // ==========================================

        const hasSocialNet =
            document.querySelectorAll(
                [
                    'a[href*="facebook.com"]',
                    'a[href*="twitter.com"]',
                    'a[href*="instagram.com"]',
                    'a[href*="linkedin.com"]',
                    'a[href*="youtube.com"]'
                ].join(",")
            ).length > 0
                ? 1
                : 0;


        // ==========================================
        // Copyright Detection
        // ==========================================

        const pageText =
            document.body?.innerText || "";

        const hasCopyrightInfo =
            /copyright|©/i.test(pageText)
                ? 1
                : 0;


        // ==========================================
        // Link Analysis
        // ==========================================

        const links =
            [...document.links];


        const noOfExternalRef =
            links.filter(link => {

                try {

                    const linkUrl =
                        new URL(
                            link.href,
                            window.location.href
                        );

                    return (
                        linkUrl.hostname !== hostname
                    );

                } catch {

                    return false;
                }

            }).length;


        const noOfSelfRef =
            links.filter(link => {

                try {

                    const linkUrl =
                        new URL(
                            link.href,
                            window.location.href
                        );

                    return (
                        linkUrl.hostname === hostname
                    );

                } catch {

                    return false;
                }

            }).length;


        const noOfEmptyRef =
            links.filter(link => {

                const href =
                    link.getAttribute("href");

                return (
                    !href ||
                    href === "#" ||
                    href.trim() === ""
                );

            }).length;


        // ==========================================
        // Redirect Detection
        // ==========================================

        const navigationEntry =
            performance.getEntriesByType(
                "navigation"
            )[0];

        const noOfURLRedirect =
            navigationEntry?.redirectCount || 0;


        // ==========================================
        // URL Analysis
        // ==========================================

        const urlLength =
            url.length;

        const domainLength =
            hostname.length;

        const dotCount =
            (hostname.match(/\./g) || []).length;

        const hyphenCount =
            (url.match(/-/g) || []).length;

        const underscoreCount =
            (url.match(/_/g) || []).length;

        const digitCount =
            (url.match(/\d/g) || []).length;

        const specialCharCount =
            (url.match(/[^a-zA-Z0-9]/g) || []).length;


        // ==========================================
        // Subdomain Count
        // ==========================================

        let subdomainCount = 0;

        const domainParts =
            hostname.split(".").filter(Boolean);

        if (domainParts.length > 2) {

            subdomainCount =
                domainParts.length - 2;
        }


        // ==========================================
        // IP Address Detection
        // ==========================================

        const isIPAddress =
            /^(?:\d{1,3}\.){3}\d{1,3}$/.test(
                hostname
            )
                ? 1
                : 0;


        // ==========================================
        // Security Keywords
        // ==========================================

        const hasLoginKeyword =
            /(login|signin|sign-in|verify|password|account)/i
                .test(url)
                ? 1
                : 0;

        const hasBankKeyword =
            /(bank|paypal|upi|payment|wallet)/i
                .test(url)
                ? 1
                : 0;

        const hasCryptoKeyword =
            /(crypto|bitcoin|ethereum|wallet)/i
                .test(url)
                ? 1
                : 0;

        const hasSecureKeyword =
            /(secure|security|auth|authenticate|confirm|update)/i
                .test(url)
                ? 1
                : 0;


        // ==========================================
        // Form Analysis
        // ==========================================

        const forms =
            document.forms.length;

        const passwordFields =
            document.querySelectorAll(
                'input[type="password"]'
            ).length;

        const emailFields =
            document.querySelectorAll(
                'input[type="email"]'
            ).length;

        const hasFavicon =
            document.querySelector(
                'link[rel*="icon"]'
            )
                ? 1
                : 0;

        const hasHiddenFields =
            document.querySelectorAll(
                'input[type="hidden"]'
            ).length > 0
                ? 1
                : 0;

        const hasSubmitButton =
            document.querySelectorAll(
                'input[type="submit"], button[type="submit"]'
            ).length > 0
                ? 1
                : 0;


        // ==========================================
        // External Form Submission
        // ==========================================

        const hasExternalFormSubmit =
            [...document.forms].some(form => {

                const action =
                    form.getAttribute("action");

                if (!action) {
                    return false;
                }

                try {

                    const actionUrl =
                        new URL(
                            action,
                            window.location.href
                        );

                    return (
                        actionUrl.hostname !== hostname
                    );

                } catch {

                    return false;
                }

            })
                ? 1
                : 0;


        // ==========================================
        // Debug Information
        // ==========================================

        console.log(
            "🛡️ PhishShield Page Metrics:",
            {
                url,
                hostname,
                forms,
                passwordFields,
                emailFields,
                links: links.length,
                iframes,
                externalScripts,
                inlineScripts,
                hiddenElements,
                noOfExternalRef,
                noOfSelfRef,
                noOfEmptyRef,
                noOfURLRedirect
            }
        );


        // ==========================================
        // Return Complete Feature Vector
        // ==========================================

        return {

            // --------------------------------------
            // Existing Features
            // --------------------------------------

            url: url,

            title:
                document.title || "",

            protocol:
                protocol,

            forms:
                forms,

            passwordFields:
                passwordFields,

            emailFields:
                emailFields,

            links:
                links.length,

            hasFavicon:
                hasFavicon,

            hasHiddenFields:
                hasHiddenFields,

            hasSubmitButton:
                hasSubmitButton,

            hasExternalFormSubmit:
                hasExternalFormSubmit,

            noOfPopup:
                0,


            // --------------------------------------
            // URL Features
            // --------------------------------------

            urlLength:
                urlLength,

            domainLength:
                domainLength,

            dotCount:
                dotCount,

            hyphenCount:
                hyphenCount,

            underscoreCount:
                underscoreCount,

            digitCount:
                digitCount,

            specialCharCount:
                specialCharCount,

            subdomainCount:
                subdomainCount,

            isHTTPS:
                protocol === "https:"
                    ? 1
                    : 0,

            isIPAddress:
                isIPAddress,

            hasLoginKeyword:
                hasLoginKeyword,

            hasBankKeyword:
                hasBankKeyword,

            hasCryptoKeyword:
                hasCryptoKeyword,

            hasSecureKeyword:
                hasSecureKeyword,


            // --------------------------------------
            // Advanced HTML Features
            // --------------------------------------

            iframes:
                iframes,

            externalScripts:
                externalScripts,

            inlineScripts:
                inlineScripts,

            hiddenElements:
                hiddenElements,


            // --------------------------------------
            // V3 Dataset Features
            // --------------------------------------

            hasDescription:
                hasDescription,

            robots:
                robots,

            isResponsive:
                isResponsive,

            noOfImage:
                noOfImage,

            noOfCSS:
                noOfCSS,

            noOfJS:
                noOfJS,

            noOfiFrame:
                noOfiFrame,

            hasSocialNet:
                hasSocialNet,

            hasCopyrightInfo:
                hasCopyrightInfo,

            noOfExternalRef:
                noOfExternalRef,

            noOfSelfRef:
                noOfSelfRef,

            noOfEmptyRef:
                noOfEmptyRef,

            noOfURLRedirect:
                noOfURLRedirect,


            // --------------------------------------
            // Timestamp
            // --------------------------------------

            timestamp:
                window.PhishShield.Utils.getTimestamp()
        };
    }
};