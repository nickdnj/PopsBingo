# CLAUDE.md - Pop's Bingo Project Guide

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Pop's Bingo** is a web-based Bingo calling application that preserves Pop's (Nick DeMarco Sr.'s) voice from a 1980s DOS application. The app plays his original voice recordings when calling Bingo numbers, keeping his memory alive for future family Christmas Eve gatherings.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Hosting**: Firebase Hosting (https://pops-bingo.web.app)
- **Analytics**: Google Analytics via gtag.js (Measurement ID: G-EXQX0C3RRM)
- **Audio**: 75 WAV files of Pop's voice (B1-B15, I16-I30, N31-N45, G46-G60, O61-O75)

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main Bingo caller application |
| `card.html` | Mobile Bingo card for players (scan QR code) |
| `styles/main.css` | Styles for caller app |
| `styles/card.css` | Styles for mobile card |
| `scripts/main.js` | Caller app logic |
| `scripts/card.js` | Mobile card logic |
| `audio/*.wav` | Pop's voice recordings |

## Directory Structure

```
PopsBingo/
├── index.html          # Main caller app
├── card.html           # Mobile player card
├── styles/
│   ├── main.css        # Caller styles
│   └── card.css        # Card styles
├── scripts/
│   ├── main.js         # Caller logic
│   └── card.js         # Card logic
├── audio/              # 75 voice files (B1.wav - O75.wav)
├── photos/             # Family photos for story modal
├── screenshots/        # App screenshots for README
├── pops_bingo_brief/   # Original design docs and images
└── README.md           # Full family story
```

## Features

1. **Voice Calling**: Pop's original 1980s voice recordings play for each number
2. **Visual Board**: 75-ball Bingo board highlights called numbers
3. **Mobile Cards**: QR code links to mobile card page for players
4. **Story Easter Egg**: Click the logo to read the full family story
5. **Photo Gallery**: Lightbox for family photos in the story

## Deployment

```bash
# Deploy to Firebase
firebase deploy --only hosting

# Local development
python3 -m http.server 8000
```

## Family Context (Important for Story Accuracy)

### Key People
- **Pop (Nick DeMarco Sr.)**: Father, created the original Bingo app, passed away before Christmas 2025
- **Mom Marge**: Mother, age 87, organized Bingo prizes and gatherings for decades
- **Nana Mae**: Grandmother (maternal), started the Bingo tradition, passed around 1995
- **Cathie**: Nick's wife
- **Bud & Eileen**: Nick's brother and sister-in-law, their family carries the tradition
  - Kids: Nicky, Ashley, Joey
  - Nicky has 2 kids, girlfriend with kids (blended family)
  - Ashley is married
  - Joey just got engaged
- **Peggy**: Nick's sister
- **Kevin**: Peggy's son, lives in Glens Falls, NY, has 2 kids

### Key Events
- **Christmas 2025**: First Christmas without Pop, played Bingo on the old "Luggable" computer
- **Thanksgiving 2024**: Drove to Kevin's in Glens Falls since his family couldn't make Christmas Eve
- The "Luggable" is a 400-pound IBM-PC compatible with built-in LCD (not CRT)

### Order of Names (per Mom's preference)
When listing the women who help with tradition: "Eileen, Peggy, Cathie" (sister-in-law first)

## Audio Technical Details

Original files from 1980s "Big Mouth" ISA sound card:
- Format: Raw PCM with delta encoding
- Sample rate: 11.025 kHz
- Bit depth: 8-bit unsigned
- Channels: Mono
- Recovery: Required delta-decoding with accumulator to reconstruct waveform

## Commands

- **Space**: Call next number
- **Click logo**: Open family story modal
- **New Game**: Reset board

## Firebase Project

- Project ID: `pops-bingo`
- Web App ID: `1:1009973000850:web:dfd64d0f187a6e5bc7044b`
- Analytics: G-EXQX0C3RRM
