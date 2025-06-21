(function() {
    const styleId = 'dark-mode-extension-style';
    const css = `
        html {
            filter: invert(1) hue-rotate(180deg) !important;
            background-color: #111 !important;
        }
        /* Re-invert images, videos, and other elements to make them look normal */
        img, video, iframe, .ytp-videowall-still, [style*="background-image"] {
            filter: invert(1) hue-rotate(180deg) !important;
        }
    `;

    function applyDarkMode() {
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function removeDarkMode() {
        const style = document.getElementById(styleId);
        if (style) {
            style.remove();
        }
    }

    function toggleDarkMode() {
        if (document.getElementById(styleId)) {
            removeDarkMode();
        } else {
            applyDarkMode();
        }
    }
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.command === "toggle-dark-mode") {
            toggleDarkMode();
            sendResponse({ status: !!document.getElementById(styleId) });
        } else if (request.command === "apply-dark-mode") {
            applyDarkMode();
        } else if (request.command === "remove-dark-mode") {
            removeDarkMode();
        } else if (request.command === "is-active") {
            sendResponse({ status: !!document.getElementById(styleId) });
        }
        return true;
    });

})();
