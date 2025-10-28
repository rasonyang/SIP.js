# Spec: Headless SIP.js Chrome Extension (MV3)

## 0. Overview
在 `SIP.js/` 仓库中新增一个完全隔离的子项目 `chrome-extension/`，  
用于开发基于 SIP.js 源码的 Headless Chrome 扩展（Manifest V3）。  
特性包括：
- 直接引用 `../src/`（SIP.js 源码）
- Webpack 构建与热重载
- FreeSWITCH + BroadSoft Access-Side 扩展支持（`Call-Info; answer-after`、`NOTIFY talk/hold`）
- 无弹窗 UI（offscreen + background）
- 构建产物不纳入版本控制

---

## 1. Project Layout

```text
SIP.js/
├── src/                      # SIP.js 源码（被扩展直接引用）
└── chrome-extension/         # Chrome 扩展（完全独立）
    ├── src/
    │   ├── background.js     # Service Worker（生命周期/保活/创建 offscreen）
    │   ├── offscreen.html    # Offscreen Document（DOM + <audio>）
    │   ├── offscreen-ua.js   # SIP UA 主逻辑（注册/媒体/BroadSoft）
    │   ├── options.html      # 配置页面
    │   ├── options.js        # 配置保存与通知
    │   ├── manifest.json     # MV3 Manifest（最小权限）
    │   └── assets/           # 铃音/图标等资源
    ├── dist/                 # 构建输出（Git 忽略）
    ├── webpack.config.js     # 构建配置（alias @sip -> ../src）
    ├── package.json          # 开发脚本与依赖
    └── .gitignore            # 忽略 dist/ 与 node_modules/

---

## 2) Key Modules & Duties
- `background.js`：安装打开 options、`chrome.alarms` 保活、`offscreen` 文档创建、可选系统通知
- `offscreen.html`：提供 `<audio>` 播放容器
- `offscreen-ua.js`：引用 `@sip` 源码，初始化 UA，注册 WSS；处理 `Call-Info` 自动接听；处理 `NOTIFY talk/hold`；绑定远端音频
- `options.html / options.js`：录入并存储 `username/password/domain/wssUrl`（`chrome.storage.sync`）；通知 UA 重载配置
- `manifest.json`：`permissions`: `storage`, `alarms`, `notifications`, `offscreen`；`host_permissions` 精确到 `wss://…/*`
- `webpack.config.js`：`alias @sip -> ../src`；`copy` manifest/assets/html；`devServer` 写盘以便加载 `dist/`

---

## 3) Build & Run
- `npm run dev`：Webpack dev server（热重载，写入 `dist/`）
- Chrome → 扩展 → 开发者模式 → “加载已解压的扩展程序” → 选择 `SIP.js/chrome-extension/dist`
- 在 `options.html` 配置 SIP 账号与 WSS
- 验证：注册成功、`answer-after=0` 自动接听、未设置时振铃、`uuid_phone_event talk/hold` 生效、断线自动重连
- `.gitignore` 排除：`/chrome-extension/dist/`、`/chrome-extension/node_modules/`

---

## 4) Acceptance Criteria
- 可本地运行并注册到 FreeSWITCH（WSS）
- BroadSoft 自动接听与远程控制可验证
- 直接调试上层 `SIP.js/src` 源码（别名 `@sip`）
- 构建环境隔离、热重载生效、产物未入库