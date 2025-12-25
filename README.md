# PopsBingo

A tribute to a self-taught dad who wrote a family Bingo game in the late 1980s—before most homes even had PCs. For thirty Christmases, this program has called out numbers in living rooms packed with kids, cousins, and grandkids. Now it lives here so the tradition can keep growing.

## Quick start
The current build is a lightweight web app. No tooling is required—open `index.html` in any modern browser and start calling numbers.

1. Open `index.html` in your browser.
2. Click **Generate New Card** to get a fresh 5x5 board (free center space is pre-marked).
3. Click **Call Next Number** to pull a random ball from the 1–75 pool. Called numbers show in the history list and mark themselves on the card automatically.
4. When a full row, column, or diagonal is marked, the app declares **BINGO!** and plays the bingo sound.
5. Use **Reset Session** to reshuffle the call order and clear the history without changing the card.

## Local testing
If you want to serve the page instead of double-clicking the file (helpful for consistent audio behavior across browsers), run a tiny static server from the repo root and open the local address:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000/](http://localhost:8000/) in your browser. Use the **Call sound** and **Bingo sound** file pickers to load your dad’s audio files; otherwise the fallback tones will play.

## Using your dad's audio files
You can swap in personal audio without editing code:
- Under **Game Controls**, use the **Call sound** file picker to choose the clip that should play every time a new ball is called.
- Use the **Bingo sound** file picker to select the celebratory clip for a winning card.
- The app falls back to a built-in tone if no file is loaded so you can test without assets.

## How it works
- Numbers follow the standard Bingo ranges (B 1–15, I 16–30, N 31–45, G 46–60, O 61–75).
- Cards are regenerated on demand with a free center space already marked.
- Called numbers are stored, rendered in reverse order, and highlighted on the card when applicable.
- Winning lines (rows, columns, diagonals) are outlined to make it obvious where the Bingo happened.

## The Story
- **Built by Dad:** He wasn’t a professional engineer. He was simply curious and stubborn enough to learn how to code on his own and figured out how to ship a Bingo game when doing that in the 80s was rare.
- **Christmas staple:** Every December, the ritual was the same—boot up the program, print cards, and crowd around the screen. The laughter, the rivalries, the “BINGO!” shouts all trace back to his keyboard.
- **Legacy preserved:** This repository is a way to honor his creativity and keep the game alive for future holidays. Sharing it publicly is an invitation for others to feel the same spark of curiosity he passed down.

## How to contribute
1. Fork the repo and clone it locally.
2. Open an issue if you have stories, bug reports, or feature ideas that keep with the game’s spirit.
3. Submit a pull request with your changes. Be sure to describe how your update keeps the family-fun vibe intact.

## Ideas for future updates
- Add a lobby so multiple players can join remotely.
- Support printable cards so grandparents can play offline.
- Offer themes (holidays, birthdays) that align with your family traditions.
- Document the original implementation details as we uncover them.

## Gratitude
If you grew up with a parent who taught you to be curious, this project is for you. Every line of code here is a thank-you to the dad who showed that you don’t need permission to make something your family loves.
