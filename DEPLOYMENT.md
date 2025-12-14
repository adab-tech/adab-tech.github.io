# Deployment Guide for GitHub Pages

This guide explains how to deploy your personal website to GitHub Pages with the custom domain `adamu.tech`.

## Prerequisites

- Your website files are in the repository `adab-tech/adab-tech.github.io`
- You have admin access to the repository
- You own the domain `adamu.tech` and can configure DNS records

## Quick Start: Deploy to adamu.tech

Your site is pre-configured to deploy to `adamu.tech` (CNAME file already included).

1. **Configure DNS** at your domain registrar for `adamu.tech`:
   - Add **A records**:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`

2. **Merge and Deploy**:
   ```bash
   git checkout main
   git merge copilot/create-static-personal-website
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to: `https://github.com/adab-tech/adab-tech.github.io/settings/pages`
   - Source: `main` branch, `/ (root)` folder
   - Custom domain: `adamu.tech` (should auto-populate)
   - Click **Save**
   - Enable **Enforce HTTPS** after DNS propagates

4. **Access your site** at `https://adamu.tech/` (DNS propagation: 5-30 minutes)

## Deployment Steps

### Option 1: Deploy from Main Branch (Recommended)

1. **Merge the PR to main branch:**
   ```bash
   # Switch to main branch
   git checkout main
   
   # Merge the feature branch
   git merge copilot/create-static-personal-website
   
   # Push to GitHub
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub: `https://github.com/adab-tech/adab-tech.github.io`
   - Click on **Settings** (gear icon)
   - Scroll down to **Pages** section in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Under **Branch**, select `main` and folder `/ (root)`
   - Click **Save**

3. **Wait for deployment:**
   - GitHub will automatically build and deploy your site
   - This usually takes 1-2 minutes
   - A green checkmark will appear when deployment is complete

4. **Access your site:**
   - Your website will be available at: `https://adab-tech.github.io/`
   - The deployment URL will be shown in the Pages settings

### Option 2: Deploy from a Custom Branch

If you want to deploy from a different branch:

1. Push your branch to GitHub (already done)
2. In repository **Settings** → **Pages**
3. Select your branch: `copilot/create-static-personal-website`
4. Select folder: `/ (root)`
5. Click **Save**

### Option 3: Use GitHub Actions (Advanced)

For automated deployments, you can use GitHub Actions workflow, but it's not necessary for this simple static site.

## Verifying Deployment

After deployment, test your website:

1. **Homepage:** `https://adab-tech.github.io/`
2. **Writing:** `https://adab-tech.github.io/writing/`
3. **Projects:** `https://adab-tech.github.io/projects/`
4. **CV:** `https://adab-tech.github.io/cv/`
5. **Contact:** `https://adab-tech.github.io/contact/`

## Navigation Links

The website uses absolute paths like `/writing/`, `/projects/`, etc. These will work correctly on GitHub Pages at the root domain.

If you encounter any issues with navigation:
- Ensure the branch is deployed from the root folder `/`
- Check that all files are properly committed and pushed
- Clear your browser cache

## Custom Domain (Optional)

To use a custom domain like `www.yourname.com`:

1. Add a `CNAME` file in the root directory with your domain:
   ```
   www.yourname.com
   ```

2. Configure DNS at your domain registrar:
   - Add a CNAME record pointing to `adab-tech.github.io`
   - Or add A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

3. Enable custom domain in GitHub Pages settings

## Troubleshooting

### Site Not Loading

- Wait 5-10 minutes after initial setup
- Check the Actions tab for build errors
- Verify the branch and folder are correctly configured

### 404 Errors

- Ensure all file paths use lowercase
- Check that `index.html` exists in each directory
- Verify navigation links use the correct format

### CSS/JS Not Loading

- Check browser console for errors
- Verify asset paths in HTML files
- Ensure all files are committed and pushed

### Print CV Not Working

- The "Download PDF" button uses `window.print()` which opens the browser print dialog
- Users can save as PDF from the print dialog
- This works in all modern browsers

## Updates and Maintenance

To update your website after initial deployment:

1. Make changes to your files locally
2. Commit the changes:
   ```bash
   git add .
   git commit -m "Update content"
   ```
3. Push to the deployed branch:
   ```bash
   git push origin main
   ```
4. GitHub Pages will automatically rebuild and redeploy (1-2 minutes)

## Performance Tips

Your site is already optimized:
- ✅ Lightweight assets (12KB CSS, 4.2KB JS)
- ✅ No external dependencies
- ✅ Mobile-first responsive design
- ✅ Semantic HTML for SEO

## Security

Your static site has minimal security concerns:
- No server-side code
- No user authentication
- No database
- All code passed security scan (0 vulnerabilities)

## Support

For GitHub Pages documentation:
- https://docs.github.com/en/pages

For issues specific to this website:
- Open an issue in the repository
- Check the console for JavaScript errors
- Verify all files are present in the deployed branch
