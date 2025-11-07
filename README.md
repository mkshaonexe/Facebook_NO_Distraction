# 🎯 Focus Mode - No Reels No Distractions

**Transform your social media experience into a focused, distraction-free environment**

A powerful Chrome/Edge extension that removes distracting elements from Facebook while preserving the content you actually want to see. Block reels, stories, home feed distractions, and notification badges with granular control.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen?logo=googlechrome)](https://github.com/mkshaonexe/Facebook_NO_Distraction)
[![Edge Compatible](https://img.shields.io/badge/Edge-Compatible-blue?logo=microsoftedge)](https://github.com/mkshaonexe/Facebook_NO_Distraction)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](manifest.json)

## ✨ Features

- 🎬 **Smart Reels Blocking** - Blocks Facebook Reels across all pages except `/reels` page, redirects single reel pages, supports multiple languages, uses advanced DOM detection
- 📚 **Stories Management** - Hide Facebook Stories from feed and navigation, removes story creation prompts and carousels
- 🏠 **Home Feed Control** - Option to completely hide the home feed, automatically hides left and right sidebars on home page
- 🔔 **Notification Badge Management** - Hide red notification badges on Messenger and Notifications to reduce distraction
- ⚡ **Performance Optimized** - Lightweight and fast execution, minimal resource usage, real-time settings updates without page refresh

## 🚀 Quick Install

### From Chrome Web Store (Coming Soon)
The extension will be available on Chrome Web Store after review approval.

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder
5. Visit Facebook and refresh the page
6. Click the extension icon to customize settings

### For Developers: Chrome Web Store Submission
See [CHROME_STORE_SUBMISSION_GUIDE.md](CHROME_STORE_SUBMISSION_GUIDE.md) for complete submission instructions.

### Firefox (Coming Soon)
Firefox support is planned for future releases.

## 🎛️ How to Use

1. **Install the extension** following the steps above
2. **Click the extension icon** in your browser toolbar
3. **Toggle features** on/off according to your preferences:
   - ✅ Block Reels
   - ✅ Block Stories  
   - ✅ Hide Home Feed
   - ✅ Hide Notification Badges (Beta)
4. **Settings auto-save** and apply immediately

## 🔧 Technical Details

### Architecture
- **Manifest V3** compatible for modern browsers
- **Content Scripts** for DOM manipulation
- **Chrome Storage API** for settings persistence
- **Message Passing** for real-time updates

### File Structure
```
├── manifest.json          # Extension configuration
├── src/
│   ├── content.js         # Main blocking logic
│   ├── content.css        # Fallback CSS rules
│   ├── popup.html         # Settings interface
│   ├── popup.js          # Popup functionality
│   ├── popup.css         # Modern UI styling
│   └── settings.js       # Settings management
└── README.md             # Documentation
```

### Key Technologies
- **MutationObserver** - Real-time DOM monitoring
- **Chrome Storage Sync** - Settings synchronization
- **CSS Selectors** - Fallback blocking rules
- **ES6 Modules** - Modern JavaScript structure

## 🌍 Multi-Language Support

The extension detects and blocks content in multiple languages:
- English (Reels, Stories, Sponsored)
- Spanish (Publicidad, Patrocinado)
- German (Gesponsert)
- Italian (Sponsorizzato)
- French (Sponsorisé)
- Arabic (مُموَّل, إعلان)
- Chinese (赞助, 赞助内容)
- Japanese (広告)
- Russian (Спонсируемая, реклама)
- And many more...

## 🔒 Privacy & Permissions

- **Minimal Permissions**: Only requests storage, activeTab, and Facebook access
- **No Data Collection**: All settings stored locally on your device
- **No Tracking**: Zero analytics, zero external requests
- **No External Requests**: Works entirely offline
- **Open Source**: Full transparency of functionality
- **Privacy Policy**: See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for complete details

### Why We Need These Permissions:

1. **Storage** - To save your extension settings (Block Reels, Stories, etc.)
2. **Active Tab** - To apply your settings to the current Facebook tab
3. **Host Permissions (facebook.com)** - To modify Facebook page appearance based on your preferences

**We do NOT collect, transmit, or share any of your personal data.**

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/mkshaonexe/Facebook_NO_Distraction.git

# Navigate to project
cd Facebook_NO_Distraction

# Load in browser for testing
# Chrome: chrome://extensions/ -> Load unpacked
# Edge: edge://extensions/ -> Load unpacked
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Solutions

- **Facebook DOM Changes**: Facebook frequently updates their structure. If blocking stops working, please report with screenshots.
- **Single Page App**: The extension handles Facebook's SPA navigation with URL monitoring.
- **Performance**: Optimized scanning reduces impact on page load times.

## 📝 Changelog

### Version 1.0.0 (Latest - November 2024) 🎉
**Chrome Web Store Compliance Update**
- ✅ Fixed extension name (removed trademark violation, fixed typo)
- ✅ Updated to use `activeTab` permission instead of `tabs` (less intrusive)
- ✅ Added comprehensive privacy policy (PRIVACY_POLICY.md)
- ✅ Enhanced description with all features listed
- ✅ Added author and homepage metadata
- ✅ Removed hardcoded dates from popup
- ✅ Added support for multiple icon sizes (16x16, 48x48, 128x128)
- ✅ Improved Chrome Web Store compliance
- ✅ Better permission justification documentation

### Version 0.0.9 (November 2024)
- ✅ Added extension icon (icon128.png)
- ✅ Fixed missing tabs permission for Chrome extension compliance
- ✅ Updated extension version and last update time

### Version 0.0.8 (Initial Release)
- ✅ Core blocking features: Reels, Stories, Home Feed, Notification Badges
- ✅ Multi-language support for content detection
- ✅ Real-time settings updates
- ✅ Modern popup interface with toggle controls
- ✅ Home feed and sidebar hiding functionality

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/mkshaonexe/Facebook_NO_Distraction/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/mkshaonexe/Facebook_NO_Distraction/discussions)
- **Developer**: [MK X Shaon](https://github.com/mkshaonexe) (@mkshaonexe)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

If this extension helps you stay focused, please:
- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🔄 Share with friends who need focus

---

**Made with ❤️ by [MK X Shaon](https://github.com/mkshaonexe)**

*Take control of your social media experience. Stay focused, stay productive.*


