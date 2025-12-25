# Pop's Bingo Preservation Plan

This repository captures the plan for preserving and modernizing Pop Nick DeMarco's 1980s/1990s DOS-based Bingo caller that uses his recorded voice clips.

## Goals
- Safely extract the original Bingo program and per-call voice clips from the vintage DOS machine without altering the disk.
- Convert the raw audio assets into a modern, lossless format for long-term storage.
- Rebuild the Bingo caller as a cross-platform desktop app with a "cutting-edge 90s" aesthetic while keeping Pop's voice front and center.

## Safe Data Extraction from the Luggable DOS PC
Prioritize a clean, read-only copy of the entire drive before experimenting with the files.

### 1) Best: Remove the Drive and Image It
1. Power down the DOS machine and unplug AC power.
2. Open the case and photograph cable orientation and the drive label.
3. Identify the interface:
   - **IDE/PATA (most likely):** one 40-pin ribbon + a 4-pin Molex power plug.
   - **MFM/RLL (unlikely):** two ribbon cables (data + control) plus power — stop and reassess if you see this.
4. Disconnect ribbon and power carefully, remove the drive, and place it on a non-conductive surface.
5. Use a USB-to-IDE/SATA adapter that includes 12V power (e.g., **Inateck SA03001** or similar multi-interface adapters).
6. Connect the drive to a modern computer via the adapter. If the OS asks to format/repair, **cancel**.
7. Create a full disk image (read-only) before copying individual files. Preserve the untouched image as the archival master.

### 2) Good: Null-Modem Serial Transfer (if you cannot open the case)
1. Acquire a null-modem serial cable and a USB-to-Serial adapter for the modern PC.
2. On the DOS side, use INTERLNK/LapLink/Kermit to copy the entire `C:\BINGO` directory.
3. Expect slower transfer speeds, but the ~632 KB asset set is manageable.

### 3) Acceptable: 3.5" Floppies
1. Use known-good, preferably new floppies and a USB floppy drive on the modern machine.
2. Copy in small batches and verify each disk. This is tedious and riskier for old media.

## Verifying the Audio Assets
The `C:\BINGO` directory contains files named `B1`, `I16`, `N31`, `G46`, `O61`, etc. with no extensions — likely one clip per Bingo call.

Expected encoding for these files:
- Headerless RAW PCM
- 8-bit, mono, unsigned samples
- Sample rate in the ~6–11 kHz range

After extraction:
1. Keep an untouched copy of the originals.
2. Test-decode one file (e.g., `B12`) at 8-bit unsigned PCM with 8 kHz, 10 kHz, and 11.025 kHz sample rates to find the correct pitch.
3. Batch-convert all clips to WAV while preserving original names (e.g., `B12.wav`, `I30.wav`).

## Modern App Implementation ("90s Cutting-Edge" Aesthetic)
**Recommended stack:** Tauri + React + TypeScript (UI) with a small Rust backend for file/voice-pack handling.

### Core Features
- 75-ball Bingo (default), optional 90-ball mode.
- Manual and auto-call with adjustable interval; no repeat calls.
- Gapless voice playback for each call; "Repeat Last" and "Undo" controls.
- Call history, on-board grid highlighting called numbers.
- Voice-pack system reading a `manifest.json` that maps calls to audio files (direct `B-12` clips or letter+number components). Optional TTS fallback if a clip is missing.
- Import/export settings and call history (CSV/JSON); local session log.

### Retro-Themed UI Notes
- Default theme: late-90s multimedia/Win95-Plus! vibe with beveled chrome, pixel fonts, optional CRT/scanline overlay, and a chunky "CALL NEXT" button.
- Alternative skins: ANSI/DOS black-and-cyan, glossy 1997 media-player skin.

## Next Steps
1. Extract the `C:\BINGO` folder via drive imaging (preferred) or serial/floppy transfer.
2. Confirm the audio parameters by test-decoding a single clip.
3. Build/import a voice pack using the converted WAVs and the manifest schema.
4. Implement the Tauri app shell, voice playback, and retro UI theme.
