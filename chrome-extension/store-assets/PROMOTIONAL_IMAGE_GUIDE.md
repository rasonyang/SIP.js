# Promotional Image Design Guide

**Chrome Web Store Requirement:** 440×280 pixels (small promotional tile)

This guide provides templates, design principles, and tool-specific instructions for creating the promotional image for the Chrome Web Store listing.

---

## Overview

### What is the Promotional Image?

The promotional image is the visual representation of your extension that appears:
- In Chrome Web Store search results
- On the extension's detail page
- In promotional carousels (if featured)

**Dimensions:** 440×280 pixels (mandatory)
**Format:** PNG or JPEG
**File size:** < 1MB recommended
**Purpose:** Attract users and communicate extension functionality at a glance

---

## Design Principles

### 1. Keep It Simple

- Focus on 1-2 key concepts (SIP calling, headless automation)
- Avoid cluttering with too much text
- Use clear, readable fonts (minimum 16px for body text)

### 2. Brand Consistency

- Use SIP.js brand colors if available
- Maintain professional appearance
- Consistent with extension's technical nature

### 3. Visual Hierarchy

- **Primary:** Extension name/logo
- **Secondary:** Tagline or key feature
- **Tertiary:** Supporting icons or graphics

### 4. Readability

- High contrast between text and background
- Test at thumbnail size (image should be clear even when small)
- Avoid light text on light background or dark on dark

---

## Design Template Options

### Template 1: Minimalist Professional

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│              📞 SIP.js                     │
│         Headless Extension                  │
│                                             │
│     Automated SIP/WebRTC Calling           │
│     • Auto-answer    • Remote Control      │
│                                             │
│            [WebRTC icon]                    │
└─────────────────────────────────────────────┘
```

**Color Scheme:**
- Background: #FFFFFF (white) or #F8F9FA (light gray)
- Primary text: #202124 (dark gray/black)
- Accent: #4285F4 (Google blue) or #1976D2 (SIP.js blue)
- Icons: #5F6368 (medium gray)

**Fonts:**
- Title: Roboto Bold 32px
- Subtitle: Roboto Medium 20px
- Body: Roboto Regular 14px

---

### Template 2: Developer-Focused

**Layout:**
```
┌─────────────────────────────────────────────┐
│  SIP.js Headless Chrome Extension          │
│  ─────────────────────────────────────────  │
│                                             │
│   Chrome Browser ──▶ SIP Server            │
│   [Chrome icon]      [Server icon]         │
│                                             │
│   ✓ Auto-Answer   ✓ DevTools Monitoring   │
│   ✓ WebRTC Audio  ✓ BroadSoft Support     │
└─────────────────────────────────────────────┘
```

**Color Scheme:**
- Background: #263238 (dark blue-gray) or #1E1E1E (dark)
- Primary text: #FFFFFF (white)
- Accent: #00BCD4 (cyan) or #4CAF50 (green)
- Secondary text: #B0BEC5 (light gray)

**Fonts:**
- Title: Source Code Pro Bold 28px (monospace for developer feel)
- Body: Roboto Regular 14px
- Features: Roboto Medium 12px

---

### Template 3: Feature Highlight

**Layout:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  [Phone icon]  SIP.js Headless Extension   │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │  [DevTools Console Screenshot]        │ │
│  │  [Offscreen UA] Registered!           │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Headless SIP Calling via DevTools Console │
└─────────────────────────────────────────────┘
```

**Color Scheme:**
- Background: Gradient from #667EEA to #764BA2 (purple gradient)
- Text: #FFFFFF (white with slight shadow for depth)
- Console mockup: #2D2D2D (dark gray)
- Console text: #4EC9B0 (teal, like VS Code console)

**Fonts:**
- Title: Inter Bold 26px
- Tagline: Inter Regular 16px
- Console text: Consolas or Monaco 12px (monospace)

---

## Design Assets

### Icons to Include

**Primary Icon Options:**
1. **Phone Icon** 📞
   - Represents calling/telephony
   - Universal recognition
   - Source: Material Icons, Font Awesome, or custom

2. **WebRTC Logo**
   - Official WebRTC logo (ensure licensing allows use)
   - Download: https://webrtc.org/assets/images/webrtc-logo-vert-retro-255x305.png
   - Resize to fit

3. **SIP Icon**
   - Generic SIP protocol icon
   - Or custom designed icon representing SIP

4. **Chrome Extension Icon**
   - Your existing extension icon (icon128.png)
   - Located at: `src/assets/icon128.png`

5. **DevTools Console Icon**
   - Represents monitoring via console
   - Can use `</>` or terminal icon

### Where to Find Icons

**Free Icon Resources:**
- **Material Icons:** https://fonts.google.com/icons (recommended)
- **Font Awesome:** https://fontawesome.com/search?o=r&m=free
- **Heroicons:** https://heroicons.com/
- **Feather Icons:** https://feathericons.com/
- **Flaticon:** https://www.flaticon.com/ (check license)

**WebRTC/SIP Specific:**
- WebRTC logo: https://webrtc.org/ (check usage terms)
- SIP.js GitHub: Check for official logos

---

## Tool-Specific Instructions

### Option A: Figma (Recommended)

**Why Figma:**
- Professional design tool
- Free for individual use
- Browser-based (no installation)
- Easy export to PNG
- Collaborative (can share with team)

**Step-by-Step:**

1. **Create Figma Account**
   - Visit: https://figma.com
   - Sign up (free tier is sufficient)

2. **Create New Design**
   - Click **New design file**
   - File → **Create new frame**
   - Set dimensions: **440×280** (type in right panel)

3. **Add Background**
   - Select frame
   - Fill: Choose solid color, gradient, or image
   - Examples:
     - Solid: #FFFFFF, #F8F9FA, #263238
     - Gradient: Linear, 90°, #667EEA → #764BA2

4. **Add Extension Icon**
   - Drag `src/assets/icon128.png` into Figma
   - Resize: 64×64 or 80×80 pixels
   - Position: Top-left or center-top

5. **Add Text**
   - Press **T** (text tool)
   - Click to add text box
   - Type: "SIP.js Headless Chrome Extension"
   - Font: Roboto Bold, 28-32px
   - Color: High contrast with background
   - Alignment: Center or left

6. **Add Tagline**
   - Add another text box below title
   - Type: "Automated SIP/WebRTC Calling for Chrome"
   - Font: Roboto Regular or Medium, 16-20px
   - Color: Slightly lighter than title

7. **Add Icons/Graphics**
   - **Option 1:** Use Figma plugins
     - Plugins → Browse → Search "Material Icons" or "Iconify"
     - Insert icons: phone, settings, code
   - **Option 2:** Import PNG icons
     - Drag downloaded icon files into Figma
     - Resize and position

8. **Add Feature List (Optional)**
   - Text boxes with bullet points or checkmarks
   - "✓ Auto-answer" (use ✓ or • symbol)
   - "✓ DevTools monitoring"
   - Keep concise (2-4 features max)

9. **Export**
   - Select frame
   - Export settings (right panel):
     - Format: **PNG**
     - Scale: **1x** (440×280)
     - Check: "Include in export"
   - Click **Export** button
   - Save as: `promo-small-440x280.png`

**Figma Tips:**
- Use **Auto Layout** (Shift+A) for easier alignment
- **Align tools** (top toolbar) for precise positioning
- Duplicate elements: Cmd/Ctrl+D
- Group elements: Cmd/Ctrl+G
- Zoom: Cmd/Ctrl + scroll or pinch

**Figma Templates:**
- Search Figma Community for "Chrome extension promo"
- Many free templates available for 440×280 size
- Customize with your content

---

### Option B: Canva (Easiest)

**Why Canva:**
- Very beginner-friendly
- Drag-and-drop interface
- Many templates available
- Free tier sufficient

**Step-by-Step:**

1. **Create Canva Account**
   - Visit: https://canva.com
   - Sign up (free)

2. **Create Custom Size**
   - Click **Create a design**
   - Select **Custom size**
   - Enter: **440 × 280** pixels
   - Click **Create new design**

3. **Choose Template (Optional)**
   - Browse templates on left panel
   - Search: "app promo", "tech banner", "software ad"
   - Click template to apply
   - Customize colors and text

4. **Or Design from Scratch**
   - **Background:** Click "Background" → Choose color or gradient
   - **Text:** Click "Text" → Add heading → Type extension name
   - **Elements:** Click "Elements" → Search "phone icon", "code", "webrtc"
   - **Uploads:** Upload your extension icon (icon128.png)

5. **Customize**
   - Change fonts: Click text → Font dropdown (try Roboto, Inter, Montserrat)
   - Colors: Use color picker or enter hex codes
   - Alignment: Use alignment tools in top toolbar
   - Spacing: Drag elements to position

6. **Download**
   - Click **Share** (top-right)
   - Click **Download**
   - Format: **PNG**
   - Quality: **Standard** (sufficient for 440×280)
   - Click **Download**
   - Save as: `promo-small-440x280.png`

**Canva Tips:**
- Use **Grid** (View → Show Grid) for alignment
- Use **Rulers** (View → Show Rulers) for precision
- **Position** tool (top toolbar) for exact coordinates
- **Transparency** slider for overlays

---

### Option C: GIMP (Free, Advanced)

**Why GIMP:**
- Completely free and open-source
- Powerful like Photoshop
- Available on Windows, macOS, Linux
- Best for users familiar with image editing

**Step-by-Step:**

1. **Install GIMP**
   - Download: https://www.gimp.org/downloads/
   - Install and launch

2. **Create New Image**
   - File → New
   - Width: **440** pixels
   - Height: **280** pixels
   - Fill with: White or Foreground color
   - Click **OK**

3. **Add Background Color/Gradient**
   - **Solid Color:**
     - Click foreground color → Choose color → OK
     - Edit → Fill with FG Color
   - **Gradient:**
     - Select Gradient tool (G)
     - Choose gradient from Gradients panel
     - Drag across canvas

4. **Add Text**
   - Select Text tool (T)
   - Click on canvas
   - Type: "SIP.js Headless Chrome Extension"
   - Adjust:
     - Font: Roboto or Sans (in Tool Options)
     - Size: 28-32px
     - Color: Click color box in Tool Options
   - Move tool (M) to reposition

5. **Add Icons**
   - File → Open as Layers → Select icon PNG files
   - Scale: Layer → Scale Layer → Enter new size
   - Position: Move tool (M)
   - Opacity: Adjust in Layers panel if needed

6. **Add Extension Icon**
   - File → Open as Layers → `src/assets/icon128.png`
   - Scale if needed: Layer → Scale Layer → 64×64 or 80×80
   - Position with Move tool

7. **Export**
   - File → Export As
   - Filename: `promo-small-440x280.png`
   - Select **PNG image** from file type dropdown
   - Click **Export**
   - PNG Options: Default settings OK → Export

**GIMP Tips:**
- Use **Guides** (Image → Guides → New Guide) for alignment
- **Layers panel** (Ctrl+L) to manage elements
- **Filters → Light and Shadow** for effects
- **Text along path** for creative text layouts

---

### Option D: Adobe Photoshop / Illustrator

If you have access to Adobe Creative Cloud:

**Photoshop:**
1. New document: 440×280 px, 72 DPI, RGB
2. Design using layers, text tools, shape tools
3. Export: File → Export → Export As → PNG

**Illustrator:**
1. New document: 440×280 px
2. Design using artboard tools
3. Export: File → Export → Export As → PNG

---

## Design Recommendations

### Typography

**Recommended Fonts:**
- **Roboto** (Google font, professional, clean)
- **Inter** (modern, web-friendly)
- **Open Sans** (readable, versatile)
- **Source Code Pro** (monospace, developer-focused)
- **Montserrat** (geometric, modern)

**Font Sizes:**
- Title/Extension name: 24-32px
- Tagline: 16-20px
- Feature list: 12-16px
- Fine print (if any): 10-12px

**Font Weights:**
- Use **Bold** or **Semi-Bold** for extension name
- Use **Regular** or **Medium** for body text
- Avoid **Light** weights (hard to read at small sizes)

### Color Schemes

**Option 1: Professional Blue**
- Background: #FFFFFF or #F5F5F5
- Primary: #1976D2 (blue)
- Secondary: #424242 (dark gray)
- Accent: #4CAF50 (green for checkmarks)

**Option 2: Developer Dark**
- Background: #1E1E1E or #263238
- Primary: #FFFFFF
- Secondary: #B0BEC5
- Accent: #00BCD4 (cyan)

**Option 3: Gradient Modern**
- Background: Gradient from #667EEA (purple) to #764BA2 (darker purple)
- Text: #FFFFFF with shadow
- Accent: #FFD700 (gold for highlights)

**Option 4: SIP.js Brand** (if brand colors are available)
- Use official SIP.js colors
- Check: https://github.com/onsip/SIP.js for branding assets

### Composition

**Layout Grid:**
```
┌───────────────────────────────────────────┐
│  Margin: 20px                             │
│  ┌─────────────────────────────────────┐ │
│  │                                     │ │
│  │  [Icon] Extension Name              │ │ ← Top section: 80-100px
│  │                                     │ │
│  │  ─────────────────────────────────  │ │
│  │                                     │ │
│  │  Tagline or Key Feature             │ │ ← Middle section: 100-120px
│  │  • Feature 1  • Feature 2           │ │
│  │                                     │ │
│  │  ─────────────────────────────────  │ │
│  │                                     │ │
│  │  [Supporting graphic/icon]          │ │ ← Bottom section: 60-80px
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│  Margin: 20px                             │
└───────────────────────────────────────────┘
```

**Alignment:**
- Use consistent margins (15-20px on all sides)
- Center-align for symmetry
- Left-align for text-heavy designs
- Use grid or guides for precise alignment

**White Space:**
- Don't fill every pixel
- Let elements breathe
- White space improves readability

---

## Content Suggestions

### Primary Text (Extension Name)

**Options:**
1. "SIP.js Headless Chrome Extension"
2. "SIP.js Headless Extension"
3. "SIP.js for Chrome"

**Recommendation:** Use full name for clarity.

### Tagline (Secondary Text)

**Options:**
1. "Automated SIP/WebRTC Calling for Chrome"
2. "Headless SIP Client with Auto-Answer"
3. "SIP Calling Monitored via DevTools Console"
4. "Automated VoIP Calling in Chrome"
5. "Headless SIP • WebRTC • Auto-Answer"

**Recommendation:** Choose based on target audience:
- Developers: "Monitor SIP calls via DevTools Console"
- General users: "Automated SIP Calling for Chrome"

### Feature List (Optional)

Pick 2-4 most compelling features:
- ✓ Auto-answer incoming calls
- ✓ Remote call control (BroadSoft)
- ✓ WebRTC audio support
- ✓ DevTools console monitoring
- ✓ Headless operation (no UI)
- ✓ Automatic reconnection

**Keep it short:** Use symbols (✓, •, ▸) instead of full words where possible.

---

## Quality Checklist

Before finalizing your promotional image:

### Technical
- [ ] Dimensions: Exactly 440×280 pixels
- [ ] Format: PNG or JPEG
- [ ] File size: < 1MB (preferably < 500KB)
- [ ] Resolution: 72 DPI (standard web)
- [ ] Color mode: RGB (not CMYK)

### Design
- [ ] Extension name clearly visible
- [ ] High contrast (text readable on background)
- [ ] Professional appearance (no pixelated images)
- [ ] Brand consistent (colors, fonts match extension theme)
- [ ] No spelling errors in text
- [ ] Icons are clear and relevant

### Readability
- [ ] Text readable at 440×280 size
- [ ] Text readable when scaled down to thumbnail (~150px wide)
- [ ] Fonts are large enough (minimum 16px for body)
- [ ] Good contrast ratio (WCAG AA: 4.5:1 for text)

### Content
- [ ] Accurately represents extension functionality
- [ ] No misleading claims
- [ ] No copyrighted material without permission
- [ ] No text overlapping images (unless intentional)

---

## Testing Your Design

### View at Different Sizes

Test how your image looks at various sizes:

1. **Full size (440×280):**
   - Open in image viewer at 100%
   - Text should be crisp and clear

2. **Thumbnail (~150×95):**
   - Resize in browser or image editor to 150px wide
   - Check if extension name still readable
   - Icons should still be recognizable

3. **On Different Backgrounds:**
   - Chrome Web Store uses light background
   - View your image on white/light gray background
   - Ensure no white text gets lost on white background

### Get Feedback

Before final submission:
- Show to colleagues or friends
- Ask: "What does this extension do?" (based on image alone)
- If they can't answer, refine the design
- Check for typos or unclear messaging

---

## Example Designs

### Example 1: Minimal Blue

**Description:**
- White background
- Extension icon (icon128.png) at 64×64 in top-left
- Extension name in Roboto Bold 28px, #1976D2 (blue)
- Tagline in Roboto Regular 16px, #424242 (dark gray)
- Three checkmark features in 14px
- Phone icon in bottom-right corner (light gray, decorative)

**Colors:**
- Background: #FFFFFF
- Title: #1976D2
- Body: #424242
- Icons: #B0BEC5

**Download mockup:** (You'll create this in Figma/Canva)

---

### Example 2: Dark Developer

**Description:**
- Dark gradient background (#263238 → #1E1E1E)
- Extension name in white, Source Code Pro Bold 26px
- Horizontal line separator (cyan, #00BCD4)
- Feature list with cyan checkmarks
- Console code snippet mockup showing "[Offscreen UA] Registered!"
- WebRTC and SIP icons in bottom corners

**Colors:**
- Background: Gradient dark
- Title: #FFFFFF
- Accent: #00BCD4
- Console text: #4EC9B0

---

### Example 3: Feature Screenshot

**Description:**
- Light gray background (#F8F9FA)
- Phone icon + extension name in header
- Actual screenshot of DevTools console (scaled down, in a rounded card)
- Caption below: "Headless SIP Calling via DevTools"
- Clean, minimal design emphasizing real functionality

**Colors:**
- Background: #F8F9FA
- Text: #202124
- Card: #FFFFFF with shadow
- Accent: #4285F4

---

## Troubleshooting

### "My text is too small to read"

**Solution:**
- Increase font size to minimum 16px for body text
- Use bold or semi-bold weights for better visibility
- Increase contrast between text and background

### "Image looks pixelated"

**Solution:**
- Ensure you're designing at exactly 440×280 pixels (not scaling up)
- Use vector icons (SVG) instead of raster (PNG) where possible
- When importing icons, use high-resolution sources (at least 128px)

### "Too much text, looks cluttered"

**Solution:**
- Remove feature list, keep only title + tagline
- Use icons to represent features instead of text
- Simplify tagline to 3-5 words max

### "Colors look dull"

**Solution:**
- Increase color saturation
- Use gradient instead of solid background
- Add accent color for highlights
- Use Google Material Design color palette: https://material.io/design/color/

### "Design doesn't stand out"

**Solution:**
- Add subtle shadow or glow effects
- Use gradient backgrounds instead of solid colors
- Add decorative elements (icons, shapes) strategically
- Increase contrast between elements

---

## Additional Resources

### Design Inspiration

Browse existing Chrome extensions for ideas:
- Visit: https://chrome.google.com/webstore/category/extensions
- Filter by: Productivity or Developer Tools
- Look at promotional images of popular extensions

**Extensions to study:**
- Grammarly (clean, professional)
- LastPass (security-focused)
- Postman (developer-focused)
- Cisco Webex (enterprise communication)

### Learning Resources

**Figma:**
- Official Figma tutorials: https://help.figma.com/hc/en-us/sections/4405269443991-Figma-for-Beginners
- YouTube: "Figma tutorial for beginners"

**Canva:**
- Canva Design School: https://www.canva.com/designschool/
- YouTube: "Canva tutorial"

**GIMP:**
- Official docs: https://docs.gimp.org/
- YouTube: "GIMP tutorial"

**Design Principles:**
- Google Material Design: https://material.io/design
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

### Stock Images/Graphics (if needed)

- **Unsplash:** https://unsplash.com/ (free, high-quality photos)
- **Pexels:** https://www.pexels.com/ (free stock photos/videos)
- **unDraw:** https://undraw.co/ (free customizable illustrations)

> **Note:** For this extension, simple icons and text are recommended over stock photos.

---

## Final Save Location

When your design is complete:

```bash
# Save the final image as:
/Users/rasonyang/workspaces/SIP.js/chrome-extension/store-assets/promotional/promo-small-440x280.png

# Verify dimensions:
sips -g pixelWidth -g pixelHeight promo-small-440x280.png

# Expected output:
#   pixelWidth: 440
#   pixelHeight: 280
```

---

## Need Help?

If you're stuck or want feedback on your design:

1. **Create multiple variations** - Try 2-3 different designs
2. **Compare** - Place them side-by-side
3. **Ask for feedback** - Show to colleagues or friends
4. **Iterate** - Refine based on feedback
5. **Test at thumbnail size** - Ensure it's still clear when small

**Remember:** Simple is better than cluttered. Focus on clarity and readability over fancy effects.

---

Good luck with your promotional image design! 🎨
