# 👑 KinderChess — Kids Learning Chess Adventure 🌟

A fun, vibrant, educational chess game designed specifically for kids (ages 4–12)! KinderChess combines the timeless game of chess with playful learning challenges: solve quick math problems, discover sight words and rhymes, or test chess knowledge to unlock smart moves on the board!

![KinderChess Preview](https://img.shields.io/badge/KinderChess-Kids%20Learning%20Chess-amber?style=for-the-badge&logo=chess)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan?style=for-the-badge&logo=tailwindcss)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-emerald?style=for-the-badge&logo=github)

---

## ✨ Features

### 🧠 1. Learning Challenges Before You Move
Kids solve interactive, rewarding questions to empower their pieces before moving:
- **🔢 Math Adventure**:
  - *Kindergarten / Pre-K*: Visual emoji counting (🍎 + 🍎🍎 = 3), addition & subtraction up to 10.
  - *Elementary*: Addition & subtraction up to 20, skip counting patterns (2, 4, 6, [8]), multiplication sparks (2x, 5x, 10x).
  - *Junior Master*: Multiplication tables, division basics, mental math.
- **📖 Word Wonder & Reading**:
  - *Sight Words & First Sounds*: High-frequency kid words with audio readout.
  - *Rhyme Time*: "What rhymes with Cat? Bat!"
  - *Spelling & Missing Letters*: "K _ N G -> I".
  - *Opposites & Vocabulary*: Fun opposites and descriptive words.
- **♟️ Chess Academy**:
  - Piece powers, movement rules, piece point values, castling, and defense strategies.
- **⚙️ Custom Frequency**:
  - Play with challenges on *Every Move*, *Captures Only*, *Every 2 Moves*, or *Freeplay Mode*.

### 🤖 2. Five Delightful Bot Personas
Play against computer characters with unique playing styles, difficulty levels, and expressive voices:
1. **🐶 Pip the Puppy**: Playful beginner bot who barks cheerful encouragement and loves pushing pawns!
2. **🤖 Gizmo the Robot**: Tactical calculator bot with beep-boop sounds and robotic quips!
3. **🦄 Sparkle the Unicorn**: Magic dreamer who loves knights, bishops, and rainbow leaps!
4. **🦉 Prof. Barnaby Owl**: Wise grandmaster mentor who shares gentle chess tips and strategy!
5. **🏴‍☠️ Capt. Barnacle**: Salty pirate captain who loves sneak attacks, flying rooks, and golden treasure!

### 👥 3. Two-Player Pass & Play
Play kid-vs-kid or kid-vs-parent on the same screen! Choose custom player names and avatars (Lion 🦁, Astronaut 🚀, Wizard 🧙, Unicorn 🦄, Dino 🦖, Kitty 🐱, and more).

### 🎨 4. Custom Themes & Artwork
- **5 Board Themes**:
  - 🍭 Candy Kingdom (Strawberry pinks & lilacs)
  - 🚀 Space Galaxy (Deep cosmic blues & neon cyan)
  - 🌲 Enchanted Forest (Emerald greens & parchment)
  - 👑 Royal Palace (Walnut & gold ivory)
  - 🌊 Ocean Splash (Caribbean turquoise & sandy shores)
- **3 Piece Artwork Styles**:
  - 🎨 *Cute Cartoon*: Custom hand-crafted SVG pieces with smiley faces, animated eyes, and royal crowns.
  - 🦁 *Animal Kingdom*: Baby chicks, ponies, foxes, elephants, and lions!
  - 🏛️ *Classic Clean*: Bold, crisp high-contrast chess symbols.

### 🔊 5. Pure Web Audio & Speech Synthesis
- Satisfying wooden move clacks, bouncy capture pops, check alarm fanfares, and triumphant victory jingles synthesized natively using the **Web Audio API** (zero missing asset errors!).
- Bot voices and question reading powered by the browser's native **SpeechSynthesis API** with custom pitch and speed tuning for every character.

### 🌟 6. Kid-Friendly Superpowers
- **Legal Move Dots & Capture Target Rings**: Clear visual cues show where each piece can move.
- **Undo Move Button**: Friendly 1-click takeback so kids can learn from mistakes without frustration.
- **Hint Button**: Gently highlights a smart piece to move with bot advice.
- **Star Reward Cabinet**: Kids earn shiny golden stars for solving challenges and winning games!
- **Victory Confetti**: Celebratory confetti explosion on checkmate!

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/michaelrussell4/kinderchess.git
cd kinderchess

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Building for Production

```bash
npm run build
```

This compiles optimized static assets into the `dist/` directory, ready to be hosted on any static hosting platform (GitHub Pages, Netlify, Vercel, etc.).

---

## 🌐 GitHub Pages Deployment

The repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`. When pushed to `main`, GitHub Actions automatically builds the site and deploys it to GitHub Pages.

To enable GitHub Pages in your repo:
1. Go to **Settings > Pages** in your GitHub repository.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main` (or run the workflow manually), and your site will be live!

---

## 📜 License
MIT License. Made with ❤️ for kids and chess learners everywhere!
