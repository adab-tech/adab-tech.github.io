# Deployment Guide - Hugo Site with Clerk Authentication

This guide provides step-by-step instructions for deploying your Hugo-powered site to various platforms.

## Table of Contents

1. [GitHub Pages Deployment](#github-pages-deployment)
2. [Netlify Deployment](#netlify-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Custom Server Deployment](#custom-server-deployment)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## GitHub Pages Deployment

### Option 1: Using GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/hugo-deploy.yml`) that automatically builds and deploys your site.

1. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages
   - Under "Source", select "GitHub Actions"

2. **Add Clerk Environment Variable (Optional)**
   - Go to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `CLERK_PUBLISHABLE_KEY`
   - Value: Your Clerk publishable key (e.g., `pk_live_xxxxx`)

3. **Push to Main Branch**
   ```bash
   git push origin main
   ```

4. **Verify Deployment**
   - Go to the Actions tab in your repository
   - Watch the deployment workflow run
   - Once complete, visit your site at `https://yourusername.github.io`

### Option 2: Manual Build and Deploy

1. **Build the site locally**
   ```bash
   hugo --gc --minify
   ```

2. **Commit and push the public folder**
   ```bash
   git add public/
   git commit -m "Deploy site"
   git push origin main
   ```

3. **Configure GitHub Pages**
   - Go to Settings > Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/public` folder

---

## Netlify Deployment

### Automated Deployment

1. **Connect Repository**
   - Log in to [Netlify](https://www.netlify.com/)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings**
   - **Build command**: `hugo --gc --minify`
   - **Publish directory**: `public`
   - **Production branch**: `main`

3. **Add Environment Variables**
   - Go to Site settings > Build & deploy > Environment
   - Add variable:
     - Key: `CLERK_PUBLISHABLE_KEY`
     - Value: Your Clerk publishable key

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy on every push to main

### Custom Domain Setup

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS

### netlify.toml Configuration (Optional)

Create a `netlify.toml` file in the root directory:

```toml
[build]
  command = "hugo --gc --minify"
  publish = "public"

[build.environment]
  HUGO_VERSION = "0.121.1"

[context.production.environment]
  HUGO_ENV = "production"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

---

## Vercel Deployment

### Automated Deployment

1. **Import Project**
   - Log in to [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Hugo
   - **Build Command**: `hugo --gc --minify`
   - **Output Directory**: `public`

3. **Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add:
     - Name: `CLERK_PUBLISHABLE_KEY`
     - Value: Your Clerk publishable key
     - Environments: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically redeploy on every push

### vercel.json Configuration (Optional)

Create a `vercel.json` file:

```json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.121.1"
    }
  }
}
```

---

## Custom Server Deployment

### Using Docker

1. **Create Dockerfile**

```dockerfile
FROM klakegg/hugo:0.121.1-ext-alpine AS builder

WORKDIR /src
COPY . .

RUN hugo --gc --minify

FROM nginx:alpine
COPY --from=builder /src/public /usr/share/nginx/html
EXPOSE 80
```

2. **Build and Run**

```bash
docker build -t my-hugo-site .
docker run -p 80:80 my-hugo-site
```

### Using Nginx

1. **Build the site**
   ```bash
   hugo --gc --minify
   ```

2. **Copy to web root**
   ```bash
   sudo cp -r public/* /var/www/html/
   ```

3. **Configure Nginx**

Create `/etc/nginx/sites-available/hugo-site`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

4. **Enable and restart**
   ```bash
   sudo ln -s /etc/nginx/sites-available/hugo-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Environment Variables

### Required Variables

- `CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key (for authentication features)

### Optional Variables

- `HUGO_ENV` - Set to `production` for production builds
- `HUGO_VERSION` - Specify Hugo version (e.g., `0.121.1`)

### Setting Environment Variables

**Local Development (.env file)**
```bash
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

**GitHub Actions**
- Repository Settings > Secrets and variables > Actions
- Add as repository secret

**Netlify**
- Site settings > Build & deploy > Environment

**Vercel**
- Project Settings > Environment Variables

---

## Troubleshooting

### Build Fails with "Hugo not found"

**Solution**: Ensure Hugo Extended version 0.121.0 or later is installed
```bash
hugo version
```

### Clerk Authentication Not Working

**Symptoms**: No login form appears, or authentication fails

**Solutions**:
1. Verify `CLERK_PUBLISHABLE_KEY` is set correctly
2. Check browser console for errors
3. Ensure redirect URLs are configured in Clerk Dashboard
4. Verify Clerk SDK is loading (check Network tab)

### 404 Errors on Deployment

**Solution**: Check that:
1. `baseURL` in `hugo.toml` matches your domain
2. Public folder is being deployed correctly
3. All links use `relURL` or `absURL` functions

### Assets Not Loading

**Solution**: 
1. Verify files are in `static/` directory
2. Check that build command includes `--gc --minify`
3. Clear browser cache and CDN cache

### CORS Errors with Clerk

**Solution**: Add your deployment domain to Clerk Dashboard:
- Settings > Domains
- Add production and preview URLs

---

## Post-Deployment Checklist

- [ ] Site loads correctly at production URL
- [ ] All pages render properly (home, projects, posts, etc.)
- [ ] Navigation works
- [ ] Authentication pages are accessible (if Clerk is configured)
- [ ] Static assets (CSS, JS, images) load correctly
- [ ] Standalone HTML files work (hausa_explorer.html, etc.)
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is valid
- [ ] Site analytics are tracking (if configured)
- [ ] SEO meta tags are present

---

## Continuous Deployment

All platforms support automatic deployment on git push:

**GitHub Pages**: Automatic via GitHub Actions
**Netlify**: Automatic on push to main
**Vercel**: Automatic on push to any branch

To disable auto-deploy, configure branch restrictions in your platform settings.

---

## Support

For deployment issues:
- **Hugo**: [Hugo Documentation](https://gohugo.io/documentation/)
- **GitHub Pages**: [GitHub Pages Docs](https://docs.github.com/en/pages)
- **Netlify**: [Netlify Support](https://www.netlify.com/support/)
- **Vercel**: [Vercel Documentation](https://vercel.com/docs)
- **Clerk**: [Clerk Support](https://clerk.com/support)

For site-specific issues, open an issue on the GitHub repository.
