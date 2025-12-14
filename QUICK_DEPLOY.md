# Quick Deployment Guide

## 🚀 Fast Track: Deploy in 3 Steps

### Step 1: Merge to Main Branch
```bash
git checkout main
git merge copilot/create-static-personal-website
git push origin main
```

### Step 2: Enable GitHub Pages
1. Go to: `https://github.com/adab-tech/adab-tech.github.io/settings/pages`
2. Under **Source**, select: `Deploy from a branch`
3. Under **Branch**, select: `main` and `/ (root)`
4. Click **Save**

### Step 3: Access Your Site
Wait 1-2 minutes, then visit: **`https://adab-tech.github.io/`**

---

## 📋 Deployment Checklist

- [ ] Merge PR to main branch
- [ ] Enable GitHub Pages in repository settings
- [ ] Select `main` branch and `/ (root)` folder
- [ ] Wait for deployment (check Actions tab)
- [ ] Test all pages:
  - [ ] Homepage: `/`
  - [ ] Writing: `/writing/`
  - [ ] Projects: `/projects/`
  - [ ] CV: `/cv/`
  - [ ] Contact: `/contact/`

---

## 🔍 Visual Deployment Flow

```
Your Local Repository
         │
         ├─ git merge copilot/create-static-personal-website
         │
         ├─ git push origin main
         │
         ▼
   GitHub Repository (main branch)
         │
         ├─ Settings → Pages
         │
         ├─ Source: main / (root)
         │
         ▼
   GitHub Pages Build
         │
         ├─ Automatic build (1-2 min)
         │
         ▼
   🌐 Live Website
   https://adab-tech.github.io/
```

---

## 📁 What Gets Deployed

```
adab-tech.github.io/
├── index.html           → Homepage
├── writing/
│   ├── index.html       → Writing list
│   └── sample-post.html → Multilingual article
├── projects/
│   ├── index.html       → Project portfolio
│   └── sample-project.html → Hausa Explorer
├── cv/
│   └── index.html       → CV/Resume
├── contact/
│   └── index.html       → Contact page
└── assets/
    ├── css/style.css    → Styles (12KB)
    └── js/main.js       → Scripts (4.2KB)
```

---

## ⚡ Alternative: Deploy Current Branch Directly

If you want to deploy without merging to main:

1. Go to: `https://github.com/adab-tech/adab-tech.github.io/settings/pages`
2. Under **Branch**, select: `copilot/create-static-personal-website` and `/ (root)`
3. Click **Save**
4. Site will be live at: `https://adab-tech.github.io/`

**Note:** This is useful for preview/testing before merging to main.

---

## 🎯 Expected URLs After Deployment

| Section | URL |
|---------|-----|
| Homepage | `https://adab-tech.github.io/` |
| Writing | `https://adab-tech.github.io/writing/` |
| Sample Post | `https://adab-tech.github.io/writing/sample-post.html` |
| Projects | `https://adab-tech.github.io/projects/` |
| Hausa Explorer | `https://adab-tech.github.io/projects/sample-project.html` |
| CV | `https://adab-tech.github.io/cv/` |
| Contact | `https://adab-tech.github.io/contact/` |

---

## 💡 Pro Tips

1. **First deployment takes longer** (3-5 minutes) as GitHub Pages sets up the environment
2. **Subsequent updates** deploy in 1-2 minutes
3. **Check deployment status** in the repository's "Actions" tab
4. **Clear browser cache** if you don't see changes immediately
5. **Mobile testing**: Use Chrome DevTools to test responsive design

---

## 🐛 Common Issues & Solutions

### Issue: 404 Not Found
**Solution:** Ensure `index.html` exists in the root and all subdirectories

### Issue: CSS not loading
**Solution:** Check that paths use `/assets/css/style.css` (with leading slash)

### Issue: Changes not appearing
**Solution:** 
- Wait 2-3 minutes for build to complete
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check Actions tab for build errors

### Issue: Navigation links broken
**Solution:** All links use absolute paths (`/writing/`) which work on GitHub Pages

---

## 📞 Need Help?

See full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

GitHub Pages documentation: https://docs.github.com/en/pages
