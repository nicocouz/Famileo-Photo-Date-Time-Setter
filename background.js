chrome.runtime.onInstalled.addListener(() => {
    chrome.scripting.registerContentScripts([
        {
            id: "contentScript",
            matches: ["<all_urls>"],
            js: ["content.js"],
            runAt: "document_start"
        }
    ]);
});
