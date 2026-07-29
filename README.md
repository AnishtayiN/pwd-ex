# 🔐 Password Generator

> A powerful Chrome extension for generating secure, customizable passwords — built with ❤️ by [AnishtayiN](https://t.me/AnishtayiN)

![Chrome](https://img.shields.io/badge/Chrome-49%2B-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Manifest V2](https://img.shields.io/badge/Manifest-V2-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔤 **Uppercase Letters** | `A-Z` characters |
| 🔡 **Lowercase Letters** | `a-z` characters |
| 🔢 **Numbers** | `0-9` digits |
| 🔣 **Symbols** | `!@#$%^&*()` and more |
| 📏 **Custom Length** | 4 to 128 characters |
| 🚫 **No Ambiguous Chars** | Excludes `0OolI1` |
| 🔁 **No Duplicates** | Each character used only once |
| 📐 **No Sequential** | Prevents `abc`, `123` patterns |
| 🗣️ **Pronounceable** | Human-readable passwords |
| ✏️ **Custom Excludes** | Remove specific characters |
| 📊 **Strength Indicator** | Real-time entropy-based analysis |
| 📜 **Password History** | Last 20 passwords saved |
| 📋 **One-Click Copy** | Instant clipboard copy |

---

## 🚀 Installation

### Method 1: Manual Install (Developer Mode)

1. **Download** this repository as a ZIP file
2. **Extract** the ZIP to a folder on your computer
3. Open Chrome and go to `chrome://extensions`
4. Enable **Developer mode** (toggle in top-right corner)
5. Click **Load unpacked**
6. Select the extracted folder
7. Done! 🎉

### Method 2: From Source Code

```bash
git clone https://github.com/AnishtayiN/pwd-ex.git
```

Then follow steps 3-7 from Method 1.

---

## 📖 How to Use

1. Click the **extension icon** 🔐 in your Chrome toolbar
2. Adjust the **length slider** (4-128 characters)
3. Select which **character types** to include
4. Click **⚡ Generate Password**
5. Click **📋** to copy to clipboard
6. Check the **strength indicator** for security level

---

## 🎯 Advanced Options

### Exclude Ambiguous Characters
Enable this to remove characters that look similar: `0`, `O`, `o`, `l`, `I`, `1`. Perfect for passwords you need to **read aloud**.

### No Duplicate Characters
Each character appears **only once**. Great for **PIN codes** or **short passwords** where you want maximum uniqueness.

### No Sequential Characters
Prevents patterns like `abc`, `xyz`, `123`, `987`. Keeps passwords **harder to guess**.

### Pronounceable Mode
Generates **syllable-based** passwords like `BaKuMoTa` that are easier to **remember** but still secure.

### Custom Excludes
Type specific characters you want to **remove** from the password (e.g., characters that conflict with your system).

---

## 🔒 Security

- Uses **`crypto.getRandomValues()`** for cryptographic randomness
- Falls back to **`msCrypto`** for older browsers
- All generation happens **locally** — nothing is sent to any server
- Password history is stored **only in your browser**

---

## 📁 Project Structure

```
pwd-ex/
├── manifest.json          # Chrome extension manifest (V2)
├── popup.html             # Extension popup UI
├── popup.js               # Password generation logic
├── style.css              # Dark theme styling
├── icons/
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

---

## 🖥️ Compatibility

| Browser | Supported |
|---------|-----------|
| Chrome 49+ | ✅ |
| Chrome 50+ | ✅ |
| Chrome 60+ | ✅ |
| Chrome 80+ | ✅ |
| Chrome 100+ | ✅ |
| Edge (Chromium) | ✅ |
| Brave | ✅ |
| Opera | ✅ |
| Vivaldi | ✅ |

> Uses **Manifest V2** for maximum compatibility with older Chrome versions.

---

## 🎨 Screenshots

The extension features a beautiful **dark cyberpunk theme** with:
- 🌊 Cyan gradient accents
- 📊 Animated strength bar
- 🎯 Smooth micro-interactions
- 📱 Clean, modern RTL layout

---

## 🛠️ Tech Stack

- **HTML5** — Structure
- **CSS3** — Dark gradient theme with animations
- **Vanilla JavaScript** — Zero dependencies, maximum performance
- **Manifest V2** — Wide Chrome compatibility
- **Web Crypto API** — Cryptographically secure randomness

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**AnishtayiN** — [@AnishtayiN](https://t.me/AnishtayiN)

---

## ⭐ Support

If this extension helped you, give it a ⭐ on GitHub and share it with your friends!

[![Telegram](https://img.shields.io/badge/Telegram-Contact-blue?style=for-the-badge&logo=telegram)](https://t.me/AnishtayiN)

---

<p align="center">Made with ❤️ by <a href="https://t.me/AnishtayiN">AnishtayiN</a></p>
