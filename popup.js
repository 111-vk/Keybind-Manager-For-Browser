document.addEventListener("DOMContentLoaded", () => {
    const slotSelect = document.getElementById("slot");
    const urlInput = document.getElementById("url");
    const addButton = document.getElementById("add");
    const listDiv = document.getElementById("list");

    // Load existing keybinds
    function loadKeybinds(callback) {
        chrome.storage.sync.get("keybinds", (data) => {
            callback(data.keybinds || {});
        });
    }

    // Update the UI list
    function updateList() {
        loadKeybinds((keybinds) => {
            listDiv.innerHTML = "";
            Object.entries(keybinds).forEach(([slot, url]) => {
                const entry = document.createElement("div");
                entry.className = "entry";
                entry.innerHTML = `<span>${slot} → ${url}</span> <button data-slot="${slot}">X</button>`;
                listDiv.appendChild(entry);
            });

            // Add delete functionality
            document.querySelectorAll("button[data-slot]").forEach(button => {
                button.addEventListener("click", () => {
                    loadKeybinds((keybinds) => {
                        delete keybinds[button.dataset.slot];
                        chrome.storage.sync.set({ keybinds }, updateList);
                    });
                });
            });
        });
    }

    // Add keybind
    addButton.addEventListener("click", () => {
        const slot = slotSelect.value;
        const url = urlInput.value.trim();
        if (!url) return;

        loadKeybinds((keybinds) => {
            keybinds[slot] = url;
            chrome.storage.sync.set({ keybinds }, () => {
                urlInput.value = "";
                updateList();
            });
        });
    });

    // Initial load
    updateList();
});