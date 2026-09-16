window.PhishShield = window.PhishShield || {};

window.PhishShield.Observer = {

    initialized: false,
    lastUrl: location.href,

    checkUrlChange() {

        if (location.href === this.lastUrl) {
            return;
        }

        this.lastUrl = location.href;

        window.PhishShield.Utils.log(
            "URL Changed:",
            this.lastUrl
        );

        if (window.PhishShield.scanPage) {

            window.PhishShield.Utils.log(
                "Re-scanning..."
            );

            window.PhishShield.scanPage();
        }
    },

    init() {

        if (this.initialized) {
            return;
        }

        this.initialized = true;

        window.PhishShield.Utils.log("Observer initialized");

        // Observe DOM changes
        const observer = new MutationObserver(

            window.PhishShield.Utils.debounce(() => {
                this.checkUrlChange();
            }, 1000)

        );

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Detect browser Back/Forward
        window.addEventListener("popstate", () => {
            this.checkUrlChange();
        });

        // Detect history.pushState()
        const originalPushState = history.pushState;

        history.pushState = (...args) => {

            originalPushState.apply(history, args);

            this.checkUrlChange();
        };

        // Detect history.replaceState()
        const originalReplaceState = history.replaceState;

        history.replaceState = (...args) => {

            originalReplaceState.apply(history, args);

            this.checkUrlChange();
        };

    }

};