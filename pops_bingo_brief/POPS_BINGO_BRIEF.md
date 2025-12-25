# 🎱 Pop’s Bingo — Preservation & Recreation Project Brief (for Codex/Cursor)

> Purpose: give AI agents everything needed to recreate Nick DeMarco’s original DOS bingo caller as a modern Mac + Windows app while preserving the *retro 90s-but-cutting-edge* vibe and using Pop’s recorded voice files.

---

## 1) Human Context / Intent

- Original creator: **Nick DeMarco** (project owner’s father), built in the **late 1980s / early 1990s**.
- Original target: **MS-DOS** on a **luggable IBM-PC compatible** with an **ISA “Big Mouth” voice/sound card**.
- Pop recorded his **real voice** for the bingo calls (this is the core legacy asset).
- Goal: **preserve + modernize**:
  - extract and preserve the original assets safely
  - rebuild as a modern desktop app for **macOS + Windows**
  - keep a **retro 90s aesthetic** but deliver modern polish and stability (“90s graphics, but cutting-edge”).

---

## 2) Evidence from On-Site Photos (uploaded)

### Photo A — The computer (Halikan luggable)
![Halikan Luggable PC](./halikan_luggable.jpeg)

**Observed:**
- Late-80s/early-90s luggable IBM-PC compatible branded **Halikan**.
- Integrated CRT + keyboard, no network, no USB.
- Class of machine typically contains:
  - 3.5" floppy drive
  - internal **IDE/PATA** hard drive (most likely) and ISA slots for expansion cards.

### Photo B — DOS directory listing (C:\BINGO)
![C:\BINGO directory listing](./bingo_dir_listing.jpeg)

**Observed:**
- **MS-DOS 5**
- Directory: `C:\BINGO`
- **83 files**, ~632 KB total.
- A large set of files with **no extension** named exactly like bingo calls:
  - `B1..B15`
  - `I16..I30`
  - `N31..N45`
  - `G46..G60`
  - `O61..O75`
- Executables and scripts:
  - `BINGO.EXE` (main program)
  - `BINGOCARD.EXE`
  - `TOOL.EXE`
  - `BINGO.BAT`, `BINGOBAT.BAT`
  - `QW1.DAT`

---

## 3) Critical Technical Finding (High Confidence)

### 3.1 Audio asset architecture
The no-extension files named `B12`, `N31`, etc. are almost certainly **one audio clip per bingo call** (Pop’s recorded voice).

**Implications:**
- Direct lookup by filename.
- No need for TTS or speech synthesis.
- No need to stitch letter+number unless some calls are missing.
- Original system likely streamed these samples via the ISA sound board.

### 3.2 Likely audio encoding
Most likely:
- **RAW PCM**
- **8-bit unsigned**
- **mono**
- sample rate likely **6 kHz – 11.025 kHz**
- **no headers** (hence no extension)

---

## 4) Preservation First: Safest Data Extraction Plan

### Preferred method (best): remove hard drive and image it
1. Power down the luggable.
2. Open the case and identify hard drive interface:
   - **IDE/PATA**: one 40-pin ribbon + 4-pin Molex power (likely).
   - If **MFM/RLL** (two ribbons), stop and use an MFM-specific recovery path.
3. Remove the drive carefully (photograph cabling/label first).
4. Connect to modern machine using **USB-to-IDE adapter with external 12V power**.
5. IMPORTANT: mount read-only / do not “repair/initialize/format.”
6. Create a full disk image; then copy out:
   - entire `C:\BINGO\` folder
   - all `B* I* N* G* O*` files unchanged
   - `BINGO.EXE`, `BINGOCARD.EXE`, `TOOL.EXE`, BAT files, `QW1.DAT`

### Alternate methods
- Serial (null modem) transfer using LapLink/INTERLNK/Kermit (slower but safe)
- Floppy transfer (last resort)

---

## 5) Modern App Requirements (Rebuild)

### 5.1 Platform
- Must run on **macOS + Windows** (desktop).

### 5.2 Look & feel: “90s graphics, but cutting-edge”
- Retro UI aesthetics reminiscent of DOS/Win95/98 era “multimedia” apps.
- Crisp layout, big buttons, tight typography, intentional gradients/bevels.
- Optional visual flourishes: subtle glow, “CRT/scanline” toggle, tiny spectrum visualizer while Pop speaks.

### 5.3 Recommended implementation stack
**Tauri + React + TypeScript + Rust**
- UI: React/TS for rapid iteration and theming.
- Backend: Rust for voice-pack management, filesystem, exports/logging, reliable local storage.
- Packaging: modern cross-platform installers, small footprint.

*(Electron is acceptable fallback if needed, but larger footprint.)*

---

## 6) Bingo Functionality (75-ball default)

### 6.1 Rules
- 75-ball bingo:
  - B: 1–15
  - I: 16–30
  - N: 31–45
  - G: 46–60
  - O: 61–75
- Random draw without repeats.
- Manual calling + optional auto-call interval (3s–30s).
- Call history visible and exportable.

### 6.2 Core controls
- START / PAUSE / RESUME
- CALL NEXT
- REPEAT LAST
- NEW GAME (reset)
- Optional: UNDO LAST CALL

### 6.3 UI elements
- Large “current call” display (e.g., **B-12**).
- Called-number board highlighting.
- Scrollable call history.

---

## 7) Audio / Voice Pack System (must support Pop’s files)

### 7.1 Voice pack input
- App must accept modern audio formats:
  - `.wav` preferred (converted from RAW)
  - `.mp3` / `.m4a` acceptable
- Voice pack folder includes `manifest.json` + `audio/`.

### 7.2 Direct lookup strategy (primary)
- For each call, compute label: `B12`, `I17`, etc.
- Play matching audio file if available (e.g., `audio/B12.wav`).
- If missing, optionally fall back to:
  - component mode (letters + numbers), or
  - TTS (default OFF).

### 7.3 Playback quality requirements
- Preload audio so calls are instant.
- Queue or gapless playback if stitching becomes necessary.
- Stop/interrupt behavior: calling “Next Number” stops current audio and plays the new call.

---

## 8) Deliverables for the Rebuild
- Source repo with:
  - Tauri scaffold + React UI
  - voice pack manager + validation
  - bingo engine + state persistence
  - export history (CSV/JSON)
- Packaged builds:
  - macOS
  - Windows
- README:
  - dev + build instructions
  - voice pack format
  - importing Pop’s audio

---

## 9) One-line instruction to an AI agent
**“Build a Tauri (Rust) + React/TypeScript cross-platform desktop Bingo caller that reproduces a late-80s/90s DOS bingo app with a polished ‘90s cutting-edge multimedia’ retro UI, and plays Pop Nick DeMarco’s recorded per-call audio clips named after calls (B1..O75) via a voice-pack system.”**
