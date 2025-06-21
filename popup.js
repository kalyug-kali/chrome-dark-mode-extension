document.addEventListener('DOMContentLoaded', function () {
    const pageToggle = document.getElementById('togglePage');
    const globalToggle = document.getElementById('toggleGlobal');
    const filterInput = document.getElementById('filter-input');
    const addFilterBtn = document.getElementById('add-filter-btn');
    const filterListUl = document.getElementById('filter-list');

    let activeHostname = '';

   
    function executeCommand(tabId, command) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            chrome.tabs.sendMessage(tabId, command);
        }).catch(err => console.error("Script injection failed:", err));
    }

 
    function renderFilterList(list) {
        filterListUl.innerHTML = '';
        (list || []).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            const removeBtn = document.createElement('span');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-btn';
            removeBtn.onclick = () => removeFilteredSite(item);
            li.appendChild(removeBtn);
            filterListUl.appendChild(li);
        });
    }

    function addFilteredSite() {
        let hostname = filterInput.value.trim();
        if (!hostname) return;
        try {
            hostname = new URL('http://' + hostname).hostname;
        } catch (e) {
            console.warn("Invalid hostname entered");
            return;
        }

        chrome.storage.sync.get(['filterList'], (result) => {
            const list = result.filterList || [];
            if (!list.includes(hostname)) {
                list.push(hostname);
                chrome.storage.sync.set({ filterList: list }, () => {
                    renderFilterList(list);
                    filterInput.value = '';
                    if(hostname === activeHostname) {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            executeCommand(tabs[0].id, { command: "remove-dark-mode" });
                            updateUiStates();
                        });
                    }
                });
            }
        });
    }

    function removeFilteredSite(hostname) {
        chrome.storage.sync.get(['filterList'], (result) => {
            let list = result.filterList || [];
            list = list.filter(item => item !== hostname);
            chrome.storage.sync.set({ filterList: list }, () => {
                renderFilterList(list);
                if(hostname === activeHostname) {
                    updateUiStates();
                }
            });
        });
    }

    addFilterBtn.addEventListener('click', addFilteredSite);
    filterInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') addFilteredSite();
    });

    function updateUiStates() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (!tabs[0] || !tabs[0].url) return;
            const tab = tabs[0];
            const url = new URL(tab.url);
            activeHostname = url.hostname;

            chrome.storage.sync.get(['globalDarkMode', 'filterList'], (syncResult) => {
                const globalOn = !!syncResult.globalDarkMode;
                const filterList = syncResult.filterList || [];
                const isPermanentlyFiltered = filterList.includes(activeHostname);

                globalToggle.checked = globalOn;

                if (isPermanentlyFiltered) {
                    pageToggle.checked = false;
                    pageToggle.disabled = true;
                    return;
                }
                pageToggle.disabled = false;
                
                chrome.storage.session.get(['sessionExclusions'], (sessionResult) => {
                     const sessionExclusions = sessionResult.sessionExclusions || [];
                     const isSessionExcluded = sessionExclusions.includes(activeHostname);

                    chrome.tabs.sendMessage(tab.id, { command: "is-active" }, (response) => {
                        if (chrome.runtime.lastError) {
                            pageToggle.checked = false;
                        } else {
                            pageToggle.checked = response.status;
                        }
                    });
                });
            });
        });
    }

    pageToggle.addEventListener('change', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const command = { command: pageToggle.checked ? "apply-dark-mode" : "remove-dark-mode" };
            executeCommand(tabs[0].id, command);
            chrome.storage.sync.get(['globalDarkMode'], (syncResult) => {
                if (syncResult.globalDarkMode) {
                    chrome.storage.session.get(['sessionExclusions'], (sessionResult) => {
                        let exclusions = sessionResult.sessionExclusions || [];
                        if (pageToggle.checked) { 
                            exclusions = exclusions.filter(h => h !== activeHostname);
                        } else {
                            if (!exclusions.includes(activeHostname)) {
                                exclusions.push(activeHostname);
                            }
                        }
                        chrome.storage.session.set({ sessionExclusions: exclusions });
                    });
                }
            });
        });
    });

    globalToggle.addEventListener('change', function () {
        const isEnabled = this.checked;
        chrome.storage.sync.set({ globalDarkMode: isEnabled }, () => {
            updateUiStates();
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                executeCommand(tabs[0].id, { command: isEnabled ? "apply-dark-mode" : "remove-dark-mode" });
            });
        });
    });

    chrome.storage.sync.get(['filterList'], (result) => renderFilterList(result.filterList));
    updateUiStates();
});
