chrome.commands.onCommand.addListener((command) => {
    chrome.storage.sync.get("keybinds", (data) => {
        const keybinds = data.keybinds || {};
        const url = keybinds[command];
        if (url) {
            chrome.tabs.create({ url });
        }
    });
});