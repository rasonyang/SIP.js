# Development Guide

This document provides guidelines for developing the SIP.js Headless Chrome Extension.

---

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Git Workflow](#git-workflow)
3. [Build and Test](#build-and-test)
4. [Debugging](#debugging)
5. [Code Style](#code-style)
6. [Project Structure](#project-structure)

---

## Development Environment Setup

### Prerequisites

- **Node.js**: 16.x or higher
- **npm**: 8.x or higher
- **Google Chrome**: Latest stable version
- **Git**: For version control

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/onsip/SIP.js.git
   cd SIP.js/chrome-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   # Development mode with hot reload
   npm run dev

   # Production build
   npm run build
   ```

4. **Load in Chrome:**
   - Navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `chrome-extension/dist/` directory

### VS Code Setup (Recommended)

This project includes VS Code configuration for optimal development experience:

**Recommended Extensions** (`.vscode/extensions.json`):
- ESLint - Code linting
- Prettier - Code formatting
- TypeScript - Enhanced TypeScript support
- Error Lens - Inline error display
- GitLens - Git integration
- Code Spell Checker - Spell checking

**Install recommended extensions:**
```bash
# VS Code will prompt you to install recommended extensions
# Or manually: Cmd/Ctrl + Shift + P → "Extensions: Show Recommended Extensions"
```

**VS Code Tasks** (`.vscode/tasks.json`):
- `Cmd/Ctrl + Shift + B` - Build Extension (Production)
- `Cmd/Ctrl + Shift + P` → "Tasks: Run Task" → Select task:
  - Build Extension (Development)
  - Package CRX
  - Clean Build Artifacts
  - Install Dependencies

---

## Git Workflow

### What's Ignored (.gitignore)

The `.gitignore` file is configured to exclude:

**Build Artifacts:**
- `dist/` - Webpack build output
- `build/` - Alternative build directory
- `*.tsbuildinfo` - TypeScript incremental build info

**Dependencies:**
- `node_modules/` - npm packages

**Extension Packaging (CRITICAL):**
- `*.pem` - Private keys (NEVER commit!)
- `*.crx` - Extension packages
- `*.zip` - Archived packages
- `release/` - Release directory
- `packages/` - Package directory

**Environment Variables:**
- `.env*` - Environment configuration files

**Editor/IDE Files:**
- `.idea/` - IntelliJ IDEA
- `.vscode/*` - VS Code (except specific config files)
- `*.swp`, `*.swo` - Vim swap files
- `*.sublime-*` - Sublime Text

**OS Files:**
- `.DS_Store` - macOS Finder
- `Thumbs.db` - Windows thumbnails
- `Desktop.ini` - Windows folder settings

**Testing:**
- `coverage/` - Code coverage reports
- `.nyc_output/` - NYC coverage data

**Logs:**
- `*.log` - All log files
- `npm-debug.log*` - npm debug logs

**Temporary Files:**
- `*.tmp`, `*.temp` - Temporary files
- `.cache/` - Cache directories
- `*.bak` - Backup files

### Committing Changes

**Before committing, verify:**

```bash
# Check what will be committed
git status

# Ensure no sensitive files (*.pem, *.crx) appear
# They should already be ignored by .gitignore
```

**Commit best practices:**

```bash
# Add files
git add .

# Commit with descriptive message
git commit -m "feat: add new feature description"

# Use conventional commit format:
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# style: Code style changes (formatting)
# refactor: Code refactoring
# test: Adding tests
# chore: Build process or auxiliary tool changes
```

### Private Key Security

**⚠️ CRITICAL: Never commit `extension-key.pem`**

- The `.gitignore` file already excludes `*.pem` files
- If accidentally committed, **immediately** remove from Git history:
  ```bash
  git filter-branch --index-filter \
    'git rm --cached --ignore-unmatch extension-key.pem' HEAD
  ```
- Generate a new private key and redistribute the extension

---

## Build and Test

### Build Commands

```bash
# Development build with watch mode (auto-rebuild on changes)
npm run dev

# Production build (minified, optimized)
npm run build

# Package for Chrome Web Store
./scripts/build-webstore.sh     # macOS/Linux
scripts\build-webstore.bat      # Windows
```

### Build Output

```
dist/
├── manifest.json          # Extension manifest
├── background.js          # Service Worker
├── background.js.map      # Source map
├── offscreen-ua.js        # SIP UserAgent
├── offscreen-ua.js.map    # Source map
├── offscreen.html         # Offscreen document
├── options.js             # Options page script
├── options.js.map         # Source map
├── options.html           # Options page
└── assets/                # Icons and assets
```

### Development Workflow

1. **Make changes** to source files in `src/`
2. **Webpack auto-rebuilds** (if using `npm run dev`)
3. **Reload extension** in Chrome:
   - Go to `chrome://extensions`
   - Click reload button on extension card
4. **Test changes** in browser
5. **Monitor console**:
   - Offscreen document: Inspect views → offscreen.html
   - Background: Inspect views → service worker

### Testing Checklist

Before committing changes, test:

- [ ] Extension loads without errors
- [ ] Configuration saves correctly
- [ ] SIP registration succeeds
- [ ] Incoming calls work (with/without auto-answer)
- [ ] Remote control functionality works
- [ ] Audio plays correctly
- [ ] Reconnection works after network interruption
- [ ] Service Worker stays alive
- [ ] No console errors in background or offscreen contexts

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing procedures.

---

## Debugging

### Chrome DevTools

**Offscreen Document Console:**
1. Navigate to `chrome://extensions`
2. Find "SIP.js Headless Chrome Extension"
3. Click "Inspect views: offscreen.html"
4. Console shows SIP events, calls, registration

**Background Service Worker Console:**
1. Navigate to `chrome://extensions`
2. Click "Inspect views: service worker"
3. Console shows lifecycle events, keep-alive pings

### Source Maps

Source maps are enabled in both development and production builds:

- **Development**: `cheap-source-map` (faster rebuilds)
- **Production**: `source-map` (external .map files)

**Debug SIP.js source code:**
1. Open DevTools
2. Sources tab → `webpack://` → `../src/`
3. Set breakpoints in SIP.js TypeScript source
4. Debugger will break at TypeScript source, not transpiled JS

### VS Code Debugging

Use the included launch configurations (`.vscode/launch.json`):

1. **Debug Chrome Extension** - Launch Chrome with extension
2. **Attach to Chrome Extension** - Attach to running Chrome instance

**To use:**
1. Press `F5` or Run → Start Debugging
2. Select "Debug Chrome Extension"
3. Chrome opens with extension loaded
4. Set breakpoints in VS Code
5. Debugger breaks when code executes

**Attach to running Chrome:**
1. Start Chrome with debugging: `chrome --remote-debugging-port=9222`
2. Select "Attach to Chrome Extension"
3. Debugger connects to Chrome

---

## Code Style

### Formatting

- **Auto-format on save** (if using VS Code with Prettier)
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: 100 characters (soft limit)

### Naming Conventions

- **Variables**: camelCase (`userName`, `sipPassword`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RECONNECT_DELAY`)
- **Functions**: camelCase (`connectToServer`, `handleIncomingCall`)
- **Classes**: PascalCase (`UserAgent`, `SessionManager`)
- **Files**: kebab-case (`offscreen-ua.js`, `build-webstore.sh`)

### Comments

- **Use comments** to explain "why", not "what"
- **JSDoc** for functions and classes
- **TODO comments** for future improvements:
  ```javascript
  // TODO: Add support for call transfer
  ```

### File Organization

```javascript
// 1. Imports
import { UserAgent } from '@sip/api/user-agent';

// 2. Constants
const MAX_RECONNECT_DELAY = 60000;

// 3. Variables
let reconnectAttempts = 0;

// 4. Functions
function connectToServer() {
  // ...
}

// 5. Event listeners
chrome.runtime.onMessage.addListener((message) => {
  // ...
});

// 6. Initialization
connectToServer();
```

---

## Project Structure

```
chrome-extension/
├── src/                           # Source files
│   ├── manifest.json              # Extension manifest (MV3)
│   ├── background.js              # Service Worker (lifecycle)
│   ├── offscreen-ua.js            # SIP UserAgent (core logic)
│   ├── offscreen.html             # Offscreen document UI
│   ├── options.js                 # Options page script
│   ├── options.html               # Options page UI
│   └── assets/                    # Icons and assets
│       ├── icon48.png
│       ├── icon128.png
│       ├── create-icons.js
│       └── ICONS_README.md
├── scripts/                       # Build scripts
│   ├── build-webstore.sh          # Chrome Web Store packager (macOS/Linux)
│   └── build-webstore.bat         # Chrome Web Store packager (Windows)
├── dist/                          # Build output (gitignored)
├── store-assets/                  # Chrome Web Store assets
│   ├── screenshots/               # Screenshots (5 required)
│   ├── promotional/               # Promotional images
│   └── store-listing.txt          # Store listing text
├── .vscode/                       # VS Code configuration
│   ├── extensions.json            # Recommended extensions
│   ├── settings.json              # Editor settings
│   ├── launch.json                # Debug configurations
│   └── tasks.json                 # Build tasks
├── webpack.config.js              # Webpack configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # npm package definition
├── .gitignore                     # Git ignore rules
├── README.md                      # Technical documentation
├── DEVELOPMENT.md                 # This file
├── TESTING_GUIDE.md               # Testing procedures
├── USER_MANUAL.md                 # End-user guide
├── INSTALLATION.md                # Installation instructions
├── PRIVACY_POLICY.md              # Privacy policy
├── CHROME_WEBSTORE_PUBLISHING.md  # Chrome Web Store publishing guide
├── IMPLEMENTATION_STATUS.md       # Development status
└── CHANGELOG.md                   # Version history
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/manifest.json` | Chrome extension manifest (MV3) | ~27 |
| `src/background.js` | Service Worker, keep-alive, offscreen management | ~207 |
| `src/offscreen-ua.js` | SIP UserAgent, WebRTC, BroadSoft extensions | ~279 |
| `src/options.js` | Configuration UI logic | ~113 |
| `webpack.config.js` | Build configuration | ~57 |
| `tsconfig.json` | TypeScript configuration | ~26 |

---

## Common Development Tasks

### Add a New Feature

1. Create feature branch: `git checkout -b feature/my-feature`
2. Edit source files in `src/`
3. Test with `npm run dev`
4. Update documentation if needed
5. Commit changes: `git commit -m "feat: add my feature"`
6. Push and create pull request

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update package
npm update <package-name>

# Update all packages
npm update

# Rebuild
npm run build
```

### Bump Version

1. Update `version` in `package.json`
2. Update `version` in `src/manifest.json`
3. Update `CHANGELOG.md` with changes
4. Commit: `git commit -m "chore: bump version to X.Y.Z"`
5. Tag: `git tag -a vX.Y.Z -m "Release X.Y.Z"`
6. Build package: `./scripts/build-webstore.sh`

### Clean Build

```bash
# Remove build artifacts
rm -rf dist *.zip

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Fresh build
npm run build
```

---

## Troubleshooting Development Issues

### Issue: Webpack Build Fails

**Solutions:**
- Check Node.js version: `node --version` (requires 16+)
- Clean install: `rm -rf node_modules && npm install`
- Check for syntax errors in source files

### Issue: Extension Not Loading in Chrome

**Solutions:**
- Ensure `dist/manifest.json` exists
- Check manifest.json syntax
- Review Chrome console for errors: `chrome://extensions` → Errors

### Issue: Changes Not Reflecting

**Solutions:**
- Reload extension: `chrome://extensions` → Reload button
- Clear cache: Delete `dist/` and rebuild
- Check if `npm run dev` is still running

### Issue: Source Maps Not Working

**Solutions:**
- Verify source maps are enabled in webpack.config.js
- Check DevTools settings: Sources → Enable JavaScript source maps
- Rebuild: `npm run build`

### Issue: Git Shows Sensitive Files

**Solutions:**
- Verify `.gitignore` is present and correct
- Remove from Git if accidentally added:
  ```bash
  git rm --cached extension-key.pem
  git commit -m "chore: remove sensitive file"
  ```

---

## Additional Resources

- **SIP.js Documentation**: https://sipjs.com/
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/mv3/
- **Webpack Documentation**: https://webpack.js.org/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Getting Help

1. Check existing documentation (README.md, TESTING_GUIDE.md)
2. Search GitHub issues: https://github.com/onsip/SIP.js/issues
3. Create new issue with:
   - Chrome version
   - Extension version
   - Console logs
   - Steps to reproduce

---

**Happy Coding!** 🚀
