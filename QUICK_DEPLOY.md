# Quick Deployment Guide

## 🚀 Fast Track: Deploy to adamu.tech

Your site is pre-configured with custom domain `adamu.tech` (CNAME file included).

### Step 1: Configure DNS
At your domain registrar for `adamu.tech`, add these **A records**:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### Step 2: Merge to Main Branch
```bash
git checkout main
git merge copilot/create-static-personal-website
git push origin main
```

### Step 3: Enable GitHub Pages
1. Go to: `https://github.com/adab-tech/adab-tech.github.io/settings/pages`
2. Under **Source**, select: `Deploy from a branch`
3. Under **Branch**, select: `main` and `/ (root)`
4. Custom domain: `adamu.tech` (should auto-populate from CNAME)
5. Click **Save**
6. Enable **Enforce HTTPS** after DNS propagates

### Step 4: Access Your Site
Wait 5-30 minutes for DNS propagation, then visit: **`https://adamu.tech/`**

---

## 📋 Deployment Checklist

- [ ] Configure DNS A records at domain registrar
- [ ] Merge PR to main branch
- [ ] Enable GitHub Pages in repository settings
- [ ] Select `main` branch and `/ (root)` folder
- [ ] Verify custom domain is set to `adamu.tech`
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Enable HTTPS enforcement
- [ ] Test all pages:
  - [ ] Homepage: `https://adamu.tech/`
  - [ ] Writing: `https://adamu.tech/writing/`
  - [ ] Projects: `https://adamu.tech/projects/`
  - [ ] CV: `https://adamu.tech/cv/`
  - [ ] Contact: `https://adamu.tech/contact/`

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
   https://adamu.tech/
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

If you want to deploy without merging to main (for preview/testing):

1. Go to: `https://github.com/adab-tech/adab-tech.github.io/settings/pages`
2. Under **Branch**, select: `copilot/create-static-personal-website` and `/ (root)`
3. Click **Save**
4. Site will be live at: `https://adamu.tech/` (after DNS is configured)

**Note:** This is useful for preview/testing before merging to main.

---

## 🎯 Expected URLs After Deployment

| Section | URL |
|---------|-----|
| Homepage | `https://adamu.tech/` |
| Writing | `https://adamu.tech/writing/` |
| Sample Post | `https://adamu.tech/writing/sample-post.html` |
| Projects | `https://adamu.tech/projects/` |
| Hausa Explorer | `https://adamu.tech/projects/sample-project.html` |
| CV | `https://adamu.tech/cv/` |
| Contact | `https://adamu.tech/contact/` |

---

## 💡 Pro Tips

1. **DNS propagation** takes 5-30 minutes (sometimes up to 24 hours globally)
2. **First deployment takes longer** (3-5 minutes) as GitHub Pages sets up the environment
3. **Subsequent updates** deploy in 1-2 minutes
4. **Check deployment status** in the repository's "Actions" tab
5. **Clear browser cache** if you don't see changes immediately
6. **Mobile testing**: Use Chrome DevTools to test responsive design
7. **HTTPS**: Enable "Enforce HTTPS" only after DNS fully propagates

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
