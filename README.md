# 🌙 Dark Mode Transformer

A powerful yet minimal Chrome extension that instantly applies a customizable dark mode to any website. Supports both **global** dark mode and **per-website** filters, giving you full control of your browsing comfort.

## ✨ Features

- ✅ Toggle dark mode on the current page
- 🌐 Enable dark mode globally across all websites
- 📵 Exclude specific websites permanently or for a single session
- ⚙️ Clean, user-friendly popup interface
- 🧠 Automatically injects dark mode on tab updates
- 💾 Syncs settings across your browser using Chrome Sync and Session Storage

## 🔧 How It Works

The extension uses simple CSS filters (`invert()` and `hue-rotate()`) to transform light-themed websites into dark ones. You can exclude websites temporarily (per session) or permanently using the filter manager in the popup UI.

---

## 📁 Project Structure
dark-mode-transformer/
│
├── background.js # Injects dark mode when tabs load
├── content.js # Applies/removes the dark theme styles
├── popup.html # UI for controlling dark mode and filters
├── popup.js # Logic behind the popup UI
├── manifest.json # Chrome extension manifest
└── images/ # Icons for the extension

## 🛠️ Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/kalyug-kali/chrome-dark-mode-extension.git
   
2. Open Chrome and go to chrome://extensions

3. Enable Developer Mode (top right)

4. Click Load unpacked and select the project folder

5. The Dark Mode Transformer extension is now active!

   
 Use Case
Perfect for:

Nighttime browsing

Reducing eye strain

Developers who want a consistent dark interface

Users who want control over website themes

📌 Technologies Used
JavaScript (ES6+)

Chrome Extension APIs

HTML & CSS (No frameworks)

Storage APIs (chrome.storage.sync, chrome.storage.session)

DOM manipulation & scripting injection

🤝 Contributing
Contributions, issues and feature requests are welcome!
Feel free to open an issue or submit a pull request.

📜 License
This project is licensed under the MIT License.

📣 Let's Connect
If you liked this project, feel free to give it a ⭐ on GitHub and connect with me on LinkedIn.

