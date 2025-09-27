# ShadowCheck Lite

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![Mapbox](https://img.shields.io/badge/mapbox-v3.4.0-orange.svg)

**A lightweight web-based WiFi network visualization and analysis tool**

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Contributing](#contributing)

</div>

---

## 🌟 Features

### 📡 **WiFi Network Visualization**
- **Interactive mapping** of WiFi access points with real-time data
- **Signal strength visualization** with physics-based propagation modeling
- **Frequency analysis** supporting 2.4GHz and 5GHz bands
- **Network clustering** for performance at scale

### 🗺️ **Advanced Mapping**
- **Mapbox Standard** style with dynamic time-of-day lighting
- **3D buildings and terrain** visualization
- **Auto-fitting bounds** that adapt to your data
- **Point jittering** to separate overlapping networks

### 🔧 **Data Processing**
- **Multiple format support**: WiGLE exports, GeoJSON, custom formats
- **Real-time filtering** by network visibility
- **Signal range calculation** based on RF propagation physics
- **Deduplication** of overlapping scan data

### 🎨 **User Experience**
- **Responsive design** for desktop and mobile
- **Collapsible sidebar** with network legend
- **Hover tooltips** with detailed network information
- **Batch file processing** with progress indicators

---

## 🚀 Installation

### Prerequisites

- **Modern web browser** (Chrome 90+, Firefox 88+, Safari 14+)
- **HTTP server** (required for CORS and modules)
- **Mapbox account** for map tiles ([Get free token](https://account.mapbox.com/))

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shadowcheck-lite.git
   cd shadowcheck-lite
   ```

2. **Configure Mapbox token**
   ```bash
   cp config.example.js config.js
   # Edit config.js with your Mapbox token
   ```

3. **Start local server**
   ```bash
   # Python
   python -m http.server 8080

   # Node.js
   npx http-server -p 8080

   # PHP
   php -S localhost:8080
   ```

4. **Open in browser**
   ```
   http://localhost:8080/public/index.html
   ```

---

## 📖 Usage

### Loading WiFi Data

1. **Click the file input** in the sidebar
2. **Select JSON files** containing WiFi scan data
3. **Watch the map populate** with access point locations
4. **Use the legend** to toggle network visibility

### Supported Data Formats

#### WiGLE Export Format
```json
{
  "results": [
    {
      "trilat": 43.0125,
      "trilong": -83.6875,
      "ssid": "MyNetwork",
      "netid": "AA:BB:CC:DD:EE:FF",
      "signal": -45,
      "frequency": 2437,
      "encryption": "WPA2"
    }
  ]
}
```

#### GeoJSON Format
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-83.6875, 43.0125]
      },
      "properties": {
        "bssid": "AA:BB:CC:DD:EE:FF",
        "ssid": "MyNetwork",
        "signal_dbm": -45,
        "frequency_mhz": 2437,
        "encryption": "WPA2"
      }
    }
  ]
}
```

### Controls

| Control | Function |
|---------|----------|
| **Sidebar Tab** | Toggle sidebar visibility |
| **Time Icon** | Cycle through time-of-day lighting |
| **Jitter Icon** | Toggle point jittering for overlapping networks |
| **3D Icon** | Enable 3D buildings and terrain |
| **Toggle All** | Show/hide all networks at once |
| **Legend Items** | Click to toggle individual networks |

---

## 🛠️ API Reference

### Configuration

```javascript
window.CONFIG = {
    MAPBOX_ACCESS_TOKEN: 'your_token_here'
};
```

### Core Functions

#### `calculateSignalRange(signalDbm, frequencyMhz, zoom)`
Calculates realistic WiFi signal propagation range based on:
- **Signal strength** (dBm)
- **Frequency** (2.4GHz vs 5GHz)
- **Environmental factors** (urban/indoor loss)
- **Map zoom level** for display scaling

#### `macColor(mac)`
Generates consistent colors for MAC addresses using:
- **OUI-based hue** for manufacturer consistency
- **Device-specific saturation/lightness** for uniqueness
- **HSL color space** for optimal visibility

---

## 🏗️ Project Structure

```
shadowcheck-lite/
├── public/
│   └── index.html          # Main application
├── src/
│   └── viewer.js          # Standalone JavaScript
├── styles/
│   └── style.css          # Application styling
├── config.js              # Configuration (create from example)
├── config.example.js      # Configuration template
├── test.html             # Minimal test version
├── .env.example          # Environment template
├── .gitignore            # Git exclusions
└── README.md             # This file
```

---

## 🔧 Development

### Performance Optimizations

- **Radius caching** prevents redundant signal calculations
- **Debounced zoom events** reduce rendering overhead
- **Smart clustering** improves performance with large datasets
- **Conditional re-calculation** only updates when necessary

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |

### Local Development

```bash
# Watch for changes (if using a build system)
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- **ES6+** JavaScript
- **Consistent indentation** (2 spaces)
- **Meaningful variable names**
- **JSDoc comments** for functions
- **Error handling** for all async operations

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Mapbox](https://mapbox.com)** for excellent mapping APIs
- **[WiGLE](https://wigle.net)** for WiFi database inspiration
- **RF propagation models** based on ITU recommendations
- **Community contributors** who help improve this project

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/shadowcheck-lite/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/shadowcheck-lite/discussions)
- 📧 **Contact**: your.email@domain.com

---

<div align="center">

**[⬆ Back to Top](#shadowcheck-lite)**

Made with ❤️ for the cybersecurity community

</div>