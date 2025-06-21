chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        chrome.storage.sync.get(['globalDarkMode', 'filterList'], function (syncResult) {
            if (!syncResult.globalDarkMode) return;

            const filterList = syncResult.filterList || [];
            if (filterList.includes(hostname)) return;
            chrome.storage.session.get(['sessionExclusions'], function (sessionResult) {
                const sessionExclusions = sessionResult.sessionExclusions || [];
                if (sessionExclusions.includes(hostname)) return;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).then(() => {
                    chrome.tabs.sendMessage(tabId, { command: "apply-dark-mode" });
                }).catch(err => console.error("Background script error:", err));
            });
        });
    }
});
