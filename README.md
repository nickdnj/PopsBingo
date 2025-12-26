# 🎄 Pop's Bingo — A Family Story

## Where Bingo Really Began

Before there was code, before there were sound cards and luggable computers, there was **Nana Mae**.

Nana Mae *loved* Bingo. Not casually — she lived for it. Bingo was joy, anticipation, community, and ritual all rolled into one. When my wife **Cathie** and I would visit Nana in Orlando, one of the highlights was taking her to a local bingo hall near her home. Sitting beside her, watching her light up as the numbers were called, you could feel how something as simple as Bingo brought people together.

That joy planted a seed.

---

## A Problem-Solver at Heart

My dad, **Nick DeMarco**, was a successful business owner who worked relentlessly to provide for his family. But he wasn't just a businessman — he was a problem-solver, a builder, and someone who loved learning new things.

In the mid‑1980s, he decided to pursue a lifelong dream: learning to fly.

Through his friend **Frank**, who worked at Grumman, my dad joined a private pilot club called **GACE**. The club operated a small fleet of aircraft, including **Cessna 152s and 172s**, and like many clubs at the time, scheduling was painfully manual. If you wanted to reserve a plane, you had to physically drive out to the airport, check a paper schedule, and hope something was available.

My dad immediately saw the problem.

And, as he always did, he decided to fix it.

---

## QTS: Technology Ahead of Its Time

This was the mid‑1980s. Personal computers were primitive. There was no internet. No mobile phones. No cloud.

But my dad discovered a piece of ISA hardware called **Big Mouth**, a voice playback board. Using it, along with MS‑DOS and his own programming skills, he built something remarkable: a **telephone‑based aircraft scheduling system**.

Members of the GACE club could call in by phone, listen to spoken prompts, and reserve aircraft without ever driving to the airport.

He called it the **QTS Scheduling System**.

The system was deployed at GACE, and members loved it. So much so that my dad went on to sell copies of QTS to other flying clubs. His work was even written up in a private pilots' magazine — a proud moment that reflected how far ahead of the curve he truly was.

This was interactive voice technology, built by hand, years before it was commonplace.

---

## From Airplanes to Bingo

Every Christmas, our family had a tradition.

We played Bingo.

Mom would go out and buy a collection of small, thoughtful, fun prizes. The whole family — kids, grandkids, everyone — would gather together. It wasn't about the prizes. It was about laughter, excitement, and being together.

And my dad had an idea.

If he could build a telephone scheduling system using his own recorded voice… why not build a Bingo caller?

So he did.

Using the same core ideas behind QTS, my dad built a **Bingo Calling Application**. He recorded his own voice calling *every single Bingo number*. Each call was stored individually, mapped perfectly, and played back by the computer.

When Bingo started, it wasn't a generic voice.

It was **Pop**.

Calling every number.

---

## The Original Machine

![The Halikan Luggable PC](pops_bingo_brief/halikan_luggable.jpeg)

*The Halikan "luggable" IBM-PC compatible that has run Pop's Bingo for over three decades. Built-in CRT, mechanical keyboard, and an ISA sound card that brought Pop's voice to life.*

![DOS Directory Listing](pops_bingo_brief/bingo_dir_listing.jpeg)

*The `C:\BINGO` directory listing from the original machine. 83 files totaling just 632KB—including BINGO.EXE, BINGOCARD.EXE, and all 75 of Pop's voice recordings.*

---

## A Voice That Never Got Old

The grandkids loved it.

They couldn't get enough of hearing Pop's voice calling the numbers. Even after he passed, that voice — warm, familiar, unmistakably his — filled the room every Christmas. It brought smiles, laughter, and a deep sense of connection.

Bingo became more than a game.

It became a way for the family to come together.
A way to remember.
A way for Pop to still be there with us.

---

## Why This Project Exists

This repository exists to **preserve that legacy**.

Not just the code.
Not just the audio files.
But the spirit of a man who:

* solved problems when tools were limited,
* built technology to bring people together,
* and understood that the most important thing technology can do is **create joy and connection**.

**Pop's Bingo** is a love letter to family, tradition, and a voice that will always call the next number.

---

## Quick Start

No installation required. Just open in a browser:

```bash
# Clone the repository
git clone https://github.com/nickdnj/PopsBingo.git
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

### Easter Egg
Click on the **Pop's Christmas Bingo** logo to read the full family story. 🎄

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

*With love, for Nana Mae, for Pop, and for the generations who gather around the table every Christmas.* 🎄
