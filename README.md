# Adamu Abubakar Portfolio

**Hugo-Powered Portfolio** | Computational Linguistics & AI

This portfolio has been migrated to Hugo static site generator with integrated Clerk authentication.

---

## 🚀 Quick Start

This site is now powered by [Hugo](https://gohugo.io/), a fast and flexible static site generator.

### Prerequisites
- Hugo Extended v0.121.0 or later
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/adab-tech/adab-tech.github.io.git
   cd adab-tech.github.io
   ```

2. **Run Hugo server**
   ```bash
   hugo server
   ```

3. **View site**
   Open http://localhost:1313 in your browser

### Build for Production

```bash
hugo --gc --minify
```

---

## 📖 Documentation

- **[Hugo Migration Guide](./HUGO_README.md)** - Complete documentation for the Hugo setup
- **[Clerk Authentication Setup](./CLERK_SETUP.md)** - How to configure user authentication
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Deploy to GitHub Pages, Netlify, or Vercel

---

## ✨ Features

- **Hugo Static Site Generator**: Fast builds, modern architecture
- **Clerk Authentication**: Optional user authentication system
- **Custom AdabTech Theme**: Clean, minimal design
- **Multilingual Content**: Support for English, Hausa, and more
- **Dark Mode**: Theme toggle for better UX
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Meta tags, sitemaps, and more

---

## 🌍 Hausa Explorer Application

This repository also includes the Hausa Explorer, a comprehensive language learning web app.

**Live Demo**: [adab-tech.github.io/hausa_explorer.html](https://adab-tech.github.io/hausa_explorer.html)

### Features
- 500+ vocabulary entries with audio pronunciation
- Interactive quizzes and exercises
- Cultural facts and proverbs
- Zero dependencies, works offline

For more details, see the original README content below.

---

## 📂 Repository Structure

```
.
├── content/              # Markdown content
│   ├── posts/           # Blog posts
│   ├── projects/        # Project pages
│   └── *.md            # Other pages
├── themes/adabtech/     # Custom Hugo theme
├── static/              # Static assets (CSS, JS, images, HTML apps)
├── hugo.toml            # Hugo configuration
└── public/              # Generated site (auto-built)
```

---

## 🤝 Contributing

Contributions are welcome! Please see [HUGO_README.md](./HUGO_README.md) for development guidelines.

---

## 📧 Contact

- **Website**: [adamu.tech](https://adamu.tech)
- **Email**: contact@adamu.tech
- **GitHub**: [@adab-tech](https://github.com/adab-tech)
- **LinkedIn**: [Adamu Abubakar](https://linkedin.com/in/adamudanjuma)

---

<details>
<summary><b>📜 Original Hausa Explorer Documentation</b></summary>

## 🌍 Hausa Explorer: Language & Culture Web App

The Hausa Explorer is a comprehensive, single-page educational application designed to introduce users of all levels—from children to language professionals—to the Hausa language and rich cultural heritage.

Built as a lightweight, zero-dependency static site, it offers structured lessons, an extensive dictionary, and interactive quizzes, all instantly accessible in the browser.

### 🌐 Live Demo

This project is hosted live on GitHub Pages. Click the link below to start exploring:

adab-tech.github.io/hausa_explorer.html

### ✨ Features

The application is structured into four main views, prioritizing easy navigation and efficient learning:

1. **Lessons & Culture (Al'adun Hausa)**
   - Greetings & Sentences: Essential phrases for daily communication.
   - Numbers 1-100: Full set of Hausa number words (dynamically generated).
   - Proverbs: Traditional wise sayings with literal translations and cultural meanings.
   - Themed Vocabulary: Specialized lists covering Food, Science & Tech, Literature, Education, and Nature & Environment.
   - Cultural Facts: Key information about Hausa traditions, history, and major cities.

2. **Dictionary (Kamus)**
   - Extensive Vocabulary: Contains over 500 core Hausa vocabulary entries.
   - Interactive Search: Find words by Hausa term, English translation, or example sentence.
   - Audio Pronunciation: Click the speaker icon to hear words pronounced.

3. **Quiz (Jarrabawa)**
   - Multiple-Choice Tests: Randomized vocabulary quizzes.
   - Visual Progress: Score tracking with immediate feedback.

4. **Interactive Exercises**
   - Fill in the Blank: Complete sentences with correct Hausa words.
   - Matching Game: Match Hausa words with English translations.

### 🛠️ Technology Stack

- HTML5, JavaScript (Vanilla), Tailwind CSS
- Web Speech API for pronunciation
- Progressive Web App (PWA) with service worker
- Zero Dependencies

### 🤝 Contribution

We welcome suggestions for dictionary enhancements, new cultural facts, or improvements to the quiz logic! 

Feel free to open an Issue or submit a Pull Request

</details>

---

**Built with ❤️ using Hugo and Clerk**
