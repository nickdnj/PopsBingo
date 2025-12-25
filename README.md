# 🎄 Pop's Christmas Bingo

**A 30+ year family tradition, preserved in code.**

Every Christmas since the late 1980s, our family has gathered around a glowing screen to play Bingo. Not with store-bought cards and a plastic tumbler—but with custom software built by Pop, calling out numbers in his own recorded voice.

This is that program, reborn for the modern web.

---

## The Original Machine

![The Halikan Luggable PC](pops_bingo_brief/halikan_luggable.jpeg)

*The Halikan "luggable" IBM-PC compatible that has run Pop's Bingo for over three decades. Built-in CRT, mechanical keyboard, and an ISA sound card that brought Pop's voice to life.*

---

## The Man Behind the Code

**Nick DeMarco** wasn't a professional software engineer. He never took a programming class. He was a self-taught tinkerer—the kind of person who looked at a problem and thought, *"I can build that."*

In the late 1980s, when most families didn't even have a computer in their home, Pop sat down at this Halikan luggable running **MS-DOS 5** and wrote `BINGO.EXE`. He didn't just write the game logic—he recorded his own voice for every single bingo call.

**75 audio files.** B-1 through O-75. Each one captured in raw PCM format and saved to the hard drive with names like `B12`, `N31`, `O68`—no file extensions, just pure data.

---

## The Files

![DOS Directory Listing](pops_bingo_brief/bingo_dir_listing.jpeg)

*The `C:\BINGO` directory listing from the original machine. 83 files totaling just 632KB—including BINGO.EXE, BINGOCARD.EXE, and all 75 of Pop's voice recordings.*

Look at that directory listing. Each of those cryptic filenames—`B1`, `I16`, `N31`, `G46`, `O61`—is Pop's voice, frozen in time. When you called a number, the ISA "Big Mouth" sound card would stream that raw audio data and Pop would announce: *"B... twelve!"*

---

## The Christmas Tradition

For over **30 years**, this program has been the heartbeat of our family's Christmas gatherings.

The ritual never changed:
1. Boot up the Halikan
2. Run `BINGO.BAT`
3. Print out cards on the dot-matrix printer
4. Crowd around the screen—kids, cousins, aunts, uncles, grandkids
5. Listen for Pop's voice calling the numbers
6. **"BINGO!"**—followed by cheers, groans, and accusations of cheating

The laughter. The rivalries. The kids fighting over who gets to click the button. That's what this code really is—not algorithms and audio files, but three decades of family memories.

---

## The Preservation Project

The Halikan still works. Thirty-five years later, it still boots, still runs BINGO.EXE, still plays Pop's voice.

But hardware doesn't last forever. So we're preserving it:

1. **Extract** Pop's original voice files from the IDE hard drive
2. **Convert** the raw PCM audio to modern `.wav` format
3. **Rebuild** the game as a web app that runs anywhere
4. **Keep his voice alive** in every call

This repository is that effort. The Christmas 2024 version features a festive new look with falling snow, glowing ornament-style numbers, and—most importantly—the same voice that's been calling Bingo for three decades.

---

## Quick Start

No installation required. Just open in a browser:

```bash
# Clone the repository
git clone https://github.com/yourusername/PopsBingo.git
cd PopsBingo

# Start a local server (for audio to work properly)
python3 -m http.server 8000

# Open in your browser
open http://localhost:8000
```

Or simply open `index.html` directly in any modern browser.

### Controls
- **Call Number** (or press `Space`) — Call the next random number
- **New Game** — Reset and start fresh
- Voice files auto-load from the `audio/` folder

---

## Using Pop's Voice Files

The app automatically loads voice files from the `audio/` folder on startup.

### Current Setup
The repository includes placeholder audio files generated with macOS text-to-speech. These work for testing, but the real magic is Pop's voice.

### Adding Pop's Original Voice
Once we extract the files from the Halikan:

1. Convert the raw PCM files to `.wav` format
2. Name them: `B1.wav`, `B2.wav`, ... `O75.wav`
3. Replace the files in the `audio/` folder
4. Refresh the page

The voice status indicator will show **"Pop's Voice Ready!"** when all 75 files are loaded.

---

## Technical Details

### Bingo Rules (75-Ball)
| Letter | Numbers |
|--------|---------|
| B | 1–15 |
| I | 16–30 |
| N | 31–45 |
| G | 46–60 |
| O | 61–75 |

### Original Audio Format
Pop's files are likely:
- Raw PCM, 8-bit unsigned
- Mono, 11.025 kHz sample rate
- No headers (hence no file extensions)

To convert with SoX:
```bash
sox -r 11025 -c 1 -b 8 -e unsigned-integer B12 B12.wav
```

---

## The Legacy

This isn't just code. It's a family artifact.

Pop showed us that you don't need a computer science degree to build something meaningful. You don't need permission. You just need curiosity, stubbornness, and the desire to make something your family will love.

Every time this app calls a number, it carries forward that spirit. A self-taught engineer's gift to his family, echoing through the decades.

---

## For Other Families

If you grew up with a parent who tinkered—who built things, fixed things, figured things out—this project is for you too.

Fork it. Customize it. Record your own voice. Start your own tradition.

The best software isn't always the most sophisticated. Sometimes it's the program that makes your family laugh together every Christmas for thirty years.

---

## Gratitude

To Pop, who taught us that making something yourself is always better than buying it.

To the family members who kept the Halikan running all these years.

And to everyone who understands that the best code is written with love.

**Merry Christmas.** 🎄

---

*Built with curiosity, preserved with love.*
