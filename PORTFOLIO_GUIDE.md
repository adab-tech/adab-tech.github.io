# Portfolio Management Guide

This guide shows you how to update and manage your portfolio at `adamu.tech`.

## 📁 File Structure

```
adab-tech.github.io/
├── index.html          # Main portfolio page (edit this!)
├── CNAME              # Domain configuration (adamu.tech)
├── assets/            # Create this folder for your files
│   ├── cv/           # Store your CV here
│   ├── images/       # Store images here
│   └── blog/         # Optional: blog assets
└── PORTFOLIO_GUIDE.md # This guide
```

## 🎯 How to Update Content

### 1. Update Your CV

**Step 1:** Create the assets folder structure
```bash
mkdir -p assets/cv
```

**Step 2:** Add your CV file
- Save your CV as PDF: `assets/cv/adamu-danjuma-cv.pdf`
- Or use your name: `assets/cv/Adamu_Danjuma_Resume.pdf`

**Step 3:** The CV download link is already configured in `index.html` (line 529):
```html
<a href="assets/cv/adamu-danjuma-cv.pdf" class="cv-download" download>Download CV</a>
```

**To update:** Just replace the PDF file in `assets/cv/` folder.

---

### 2. Add a New Blog Post

**Find the Blog Section** in `index.html` (around line 630-690)

**Copy this template:**
```html
<article class="blog-post">
  <h3><a href="#">YOUR BLOG TITLE HERE</a></h3>
  <p class="meta">Published: Month DD, YYYY</p>
  <p>
    Your blog post summary goes here. Write 150-200 words that give readers
    a preview of what the full article covers. Make it engaging!
  </p>
  <a href="#" class="read-more">Read full article →</a>
</article>
```

**Paste it** inside the `<div class="blog-posts">` section to add a new post.

**Tips:**
- Update the title, date, and summary
- For the full article link, you can:
  - Link to an external blog (Medium, Dev.to, etc.)
  - Create a new HTML file: `blog/my-article.html` and link to it
  - Link to a PDF: `assets/blog/my-article.pdf`

---

### 3. Add a New Poem

**Find the Poetry Section** in `index.html` (around line 693-710)

**Copy this template:**
```html
<article class="poetry-item">
  <h3>Your Poem Title</h3>
  <div class="poem-text">Line one of your poem
Line two of your poem
Line three of your poem

Second stanza starts here
With more beautiful lines
That express your thoughts</div>
  <p class="poem-summary">
    A brief description of what inspired this poem or its themes.
  </p>
</article>
```

**Paste it** inside the `<div class="poetry-grid">` section.

---

### 4. Update Social Media Links

**Find the Social Icons** in `index.html` (around line 728-742)

**Current placeholders to update:**

```html
<!-- Line 729: Twitter -->
<a href="https://twitter.com/yourusername" ...>

<!-- Line 732: LinkedIn -->
<a href="https://linkedin.com/in/yourusername" ...>

<!-- Line 735: GitHub -->
<a href="https://github.com/yourusername" ...>

<!-- Line 738: Email -->
<a href="mailto:adamu.danjuma@example.com" ...>
```

**Replace:**
- `yourusername` with your actual social media handles
- `adamu.danjuma@example.com` with your real email address

---

### 5. Update About Me Section

**Find** the About Me section in `index.html` (around line 548-575)

**Edit the paragraphs** to reflect your actual background:
```html
<p>
  Your personal introduction here...
</p>
<p>
  More about your work and expertise...
</p>
```

**Update the expertise list:**
```html
<ul>
  <li>Your expertise area 1</li>
  <li>Your expertise area 2</li>
  <li>Your expertise area 3</li>
  ...
</ul>
```

---

### 6. Update Portfolio Items

**Find** the Portfolio section in `index.html` (around line 580-610)

**Each portfolio item follows this structure:**
```html
<article class="portfolio-item">
  <h3>Project Title</h3>
  <p>Project description goes here...</p>
</article>
```

**To add a new project:** Copy an existing article and update the content.

---

## 🚀 Publishing Your Changes

### Method 1: Edit on GitHub (Easiest)

1. Go to: `https://github.com/adab-tech/adab-tech.github.io`
2. Click on `index.html`
3. Click the **pencil icon** (Edit this file)
4. Make your changes
5. Scroll down and click **Commit changes**
6. Your site updates automatically in 1-2 minutes!
7. Visit `https://adamu.tech` to see changes

### Method 2: Edit Locally (Advanced)

1. Clone the repository:
```bash
git clone https://github.com/adab-tech/adab-tech.github.io.git
cd adab-tech.github.io
```

2. Make your changes in a text editor (VS Code, Sublime, etc.)

3. Test locally:
```bash
python3 -m http.server 8000
# Visit http://localhost:8000 in your browser
```

4. Commit and push:
```bash
git add .
git commit -m "Update portfolio content"
git push origin main
```

5. Wait 1-2 minutes, then visit `https://adamu.tech`

---

## 📝 Quick Reference

### Line Numbers for Key Sections

| Section | Approximate Line Numbers |
|---------|-------------------------|
| CV Download Link | Line 529 |
| About Me Content | Lines 548-575 |
| Portfolio Items | Lines 580-610 |
| Blog Posts | Lines 630-690 |
| Poetry Items | Lines 693-710 |
| Contact Form Email | Line 713 |
| Social Media Links | Lines 728-742 |

### TODO Comments

Search for `TODO:` in `index.html` to find sections that need customization:
- Line 528: CV file path
- Line 712: Contact form email
- Line 727: Social media URLs

---

## 🎨 Customization Tips

### Change Colors

Edit the CSS variables (lines 12-21):
```css
:root {
  --primary-color: #0B3D91;    /* Main blue color */
  --accent-color: #007ACC;      /* Link color */
  --background-color: #F5F7FA;  /* Page background */
}
```

### Add Images

1. Create folder: `mkdir -p assets/images`
2. Add your image: `assets/images/profile.jpg`
3. Insert in HTML:
```html
<img src="assets/images/profile.jpg" alt="Description">
```

### Add a New Page

1. Create new file: `about.html`
2. Link to it from `index.html`:
```html
<a href="about.html">About</a>
```

---

## 🔗 External Blog Links

If you publish on external platforms:

**Medium:** Link directly to your articles
```html
<a href="https://medium.com/@yourusername/article-title">Read full article →</a>
```

**Dev.to:** Same approach
```html
<a href="https://dev.to/yourusername/article-title">Read full article →</a>
```

**LinkedIn:** Link to LinkedIn articles
```html
<a href="https://linkedin.com/pulse/your-article">Read full article →</a>
```

---

## 💡 Common Tasks

### Task: Update Email for Contact Form

**Find:** Line 713
```html
<form class="contact-form" action="mailto:adamu.danjuma@example.com" ...>
```

**Replace:** `adamu.danjuma@example.com` with your real email

**Note:** Mailto forms have limitations. Consider using:
- Google Forms
- Formspree.io (free form backend)
- Netlify Forms (if you move to Netlify)

### Task: Add Google Analytics

**Add before** `</head>` tag:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

---

## 🆘 Getting Help

### Common Issues

**Q: Changes don't appear?**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Wait 2-3 minutes for GitHub Pages to rebuild
- Check GitHub Actions tab for build errors

**Q: Images don't load?**
- Verify file paths are correct
- Use lowercase filenames with no spaces
- Check files are committed to repository

**Q: Custom domain not working?**
- Verify DNS settings at your domain provider
- Check CNAME file contains only `adamu.tech`
- Wait up to 48 hours for DNS propagation

---

## 📚 Learning Resources

- **HTML/CSS:** [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web)
- **GitHub Pages:** [Official Guide](https://docs.github.com/en/pages)
- **Markdown:** [Markdown Guide](https://www.markdownguide.org/)
- **Git Basics:** [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

**Last Updated:** December 2024
**Version:** 1.0
**Your Portfolio:** https://adamu.tech
