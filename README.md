# 🚫 Facebook No Distraction Extension

**Transform your Facebook experience into a focused, distraction-free environment**

A powerful Chrome/Edge extension that removes distracting elements from Facebook while preserving the content you actually want to see. Block reels, stories, ads, home feed distractions, and notification badges with granular control.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen?logo=googlechrome)](https://github.com/your-username/fb-no-distraction-v2)
[![Edge Compatible](https://img.shields.io/badge/Edge-Compatible-blue?logo=microsoftedge)](https://github.com/your-username/fb-no-distraction-v2)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](manifest.json)

## ✨ Features

### 🎬 **Smart Reels Blocking**
- Blocks Facebook Reels across all pages except the dedicated `/reels` page
- Redirects single reel pages to the main reels hub for better UX
- Supports multiple languages (English, Arabic, Spanish, Chinese, etc.)
- Uses advanced DOM detection with MutationObserver for dynamic content

### 📚 **Stories Management**
- Hide Facebook Stories from your feed and navigation
- Removes story creation prompts and carousels
- Maintains clean interface without story distractions

### 🏠 **Home Feed Control**
- Option to completely hide the home feed for ultimate focus
- Automatically hides left and right sidebars on home page
- Preserves other Facebook functionality while removing feed distractions

### 🚫 **Advanced Ad Blocking**
- Intelligent sponsored content detection
- Multi-language ad keyword recognition
- Removes promoted posts and sponsored content
- Uses multiple detection strategies for reliability

### 🔔 **Notification Badge Management**
- Hide red notification badges on Messenger and Notifications
- Reduce anxiety-inducing notification pressure
- Maintain functionality while removing visual distractions

### ⚡ **Performance Optimized**
- Lightweight and fast execution
- Minimal resource usage
- Real-time settings updates without page refresh
- Efficient DOM scanning with throttled operations

## 🚀 Quick Install

### Chrome / Edge Installation
1. Download or clone this repository
2. Open `chrome://extensions/` (Chrome) or `edge://extensions/` (Edge)
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder
5. Visit Facebook and refresh the page
6. Click the extension icon to customize settings

### Firefox (Coming Soon)
Firefox support is planned for future releases.

## 🎛️ How to Use

1. **Install the extension** following the steps above
2. **Click the extension icon** in your browser toolbar
3. **Toggle features** on/off according to your preferences:
   - ✅ Block Reels
   - ✅ Block Stories  
   - ✅ Hide Home Feed
   - ✅ Block FB Ads (Premium feature)
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

- **Minimal Permissions**: Only requests storage and Facebook access
- **No Data Collection**: All settings stored locally
- **No External Requests**: Works entirely offline
- **Open Source**: Full transparency of functionality

## 🛠️ Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/fb-no-distraction-v2.git

# Navigate to project
cd fb-no-distraction-v2

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

### Version 1.0.0
- ✅ Initial release with core blocking features
- ✅ Multi-language support for content detection
- ✅ Real-time settings updates
- ✅ Modern popup interface with toggle controls
- ✅ Advanced ad blocking with multiple detection methods
- ✅ Home feed and sidebar hiding functionality
- ✅ Notification badge management

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/fb-no-distraction-v2/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/your-username/fb-no-distraction-v2/discussions)
- **Developer**: [@mkshaon](https://github.com/mkshaon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

If this extension helps you stay focused, please:
- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🔄 Share with friends who need focus

---

**Made with ❤️ by [mkshaon](https://github.com/mkshaon)**

*Take control of your social media experience. Stay focused, stay productive.*


