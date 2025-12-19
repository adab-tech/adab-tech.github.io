# Adamu Abubakar Portfolio - Hugo Migration

This repository has been successfully migrated from Jekyll to Hugo static site generator with integrated Clerk authentication.

## 🚀 Features

- **Hugo Static Site Generator**: Fast, modern static site generation
- **Custom AdabTech Theme**: Clean, minimal design preserving the original aesthetics
- **Clerk Authentication**: Complete user authentication and management system
- **Multilingual Support**: Content in multiple languages (English, Hausa)
- **Dark Mode**: Theme toggle for better user experience
- **Responsive Design**: Mobile-first, accessible interface
- **Progressive Web App**: Service worker support for offline functionality

## 📋 Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.121.0 or later
- [Git](https://git-scm.com/)
- (Optional) [Clerk Account](https://clerk.com) for authentication features

## 🛠️ Local Development

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adab-tech/adab-tech.github.io.git
   cd adab-tech.github.io
   ```

2. **Install Hugo** (if not already installed)
   
   **macOS:**
   ```bash
   brew install hugo
   ```
   
   **Linux:**
   ```bash
   sudo snap install hugo
   ```
   
   **Windows:**
   ```bash
   choco install hugo-extended
   ```
   
   Or download from [Hugo Releases](https://github.com/gohugoio/hugo/releases)

3. **Verify Hugo installation**
   ```bash
   hugo version
   ```

### Running Locally

1. **Start the development server**
   ```bash
   hugo server -D
   ```

2. **Open your browser**
   ```
   http://localhost:1313
   ```

3. **With live reload**: Hugo automatically rebuilds and refreshes when you make changes

### Building for Production

```bash
hugo --minify
```

The built site will be in the `public/` directory.

## 🔐 Clerk Authentication Setup

This site includes Clerk authentication integration. To enable it:

1. **Create a Clerk account** at [clerk.com](https://clerk.com)

2. **Get your publishable key** from the Clerk Dashboard

3. **Set environment variable**
   ```bash
   export CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

4. **Run Hugo with the environment variable**
   ```bash
   hugo server
   ```

For detailed setup instructions, see [CLERK_SETUP.md](./CLERK_SETUP.md)

## 📁 Project Structure

```
.
├── content/              # Markdown content files
│   ├── posts/           # Blog posts
│   ├── projects/        # Project pages
│   ├── contact.md       # Contact page
│   ├── cv.md           # CV page
│   └── ...
├── themes/
│   └── adabtech/        # Custom theme
│       ├── layouts/     # HTML templates
│       ├── static/      # Theme static files
│       └── theme.toml   # Theme configuration
├── static/              # Static assets
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── images/         # Images
│   └── ...
├── hugo.toml           # Hugo configuration
└── public/             # Generated site (git-ignored)
```

## 📝 Content Management

### Creating a New Blog Post

```bash
hugo new posts/my-new-post.md
```

Then edit `content/posts/my-new-post.md`:

```yaml
---
title: "My New Post"
date: 2024-12-19
draft: false
author: "Adamu Abubakar"
---

Your content here...
```

### Creating a New Project

```bash
hugo new projects/my-project.md
```

Edit `content/projects/my-project.md`:

```yaml
---
title: "My Project"
problem: "Description of the problem solved"
tools:
  - Python
  - JavaScript
  - Hugo
role: "Your role in the project"
outcome: "Results and impact"
---

Detailed project description...
```

### Updating Pages

Edit files in the `content/` directory:
- `content/contact.md` - Contact information
- `content/cv.md` - Curriculum Vitae
- `content/services.md` - Services offered
- `content/opportunities.md` - Opportunities

## 🎨 Customization

### Site Configuration

Edit `hugo.toml` to update:
- Site title and description
- Social media links
- Menu items
- Permalinks
- Other site-wide settings

### Theme Customization

The custom theme is located in `themes/adabtech/`. Modify:
- `layouts/` - HTML templates
- `static/css/` - Stylesheets
- `static/js/` - JavaScript

### Adding a Menu Item

Edit `hugo.toml`:

```toml
[[menu.main]]
  name = 'New Page'
  url = '/new-page/'
  weight = 8
```

## 🌐 Deployment

### GitHub Pages

1. **Configure GitHub Pages** in repository settings
2. **Set source** to deploy from `main` branch `/public` folder
3. **Build and commit**:
   ```bash
   hugo --minify
   git add public/
   git commit -m "Deploy site"
   git push
   ```

**Note**: For GitHub Pages with custom domain, ensure `CNAME` file exists in `static/`

### Netlify

1. **Connect repository** to Netlify
2. **Build settings**:
   - Build command: `hugo --minify`
   - Publish directory: `public`
3. **Environment variables**: Add `CLERK_PUBLISHABLE_KEY` if using Clerk
4. **Deploy**: Automatic on push to main branch

### Vercel

1. **Import repository** to Vercel
2. **Framework preset**: Hugo
3. **Build command**: `hugo --minify`
4. **Output directory**: `public`
5. **Environment variables**: Add `CLERK_PUBLISHABLE_KEY` if using Clerk

## 🔄 Migration from Jekyll

This site was migrated from Jekyll. Key changes:

### Directory Structure
- `_posts/` → `content/posts/`
- `_projects/` → `content/projects/`
- `_layouts/` → `themes/adabtech/layouts/`
- `assets/` → `static/`

### Template Syntax
- Jekyll Liquid: `{{ site.title }}` → Hugo: `{{ .Site.Title }}`
- Jekyll: `{{ content }}` → Hugo: `{{ .Content }}`
- Jekyll: `{% for post in site.posts %}` → Hugo: `{{ range .Site.RegularPages }}`

### Configuration
- `_config.yml` → `hugo.toml`

All original content has been preserved and is fully functional in the new Hugo structure.

## 📚 Documentation

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Setup Guide](./CLERK_SETUP.md) - Detailed authentication setup
- [Markdown Guide](https://www.markdownguide.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Hugo Not Found
```bash
# Verify installation
hugo version

# Reinstall if necessary
brew install hugo  # macOS
```

### Build Errors
```bash
# Clear Hugo cache
hugo --gc

# Rebuild
hugo --minify
```

### Port Already in Use
```bash
# Use different port
hugo server --port 1314
```

### Authentication Not Working
See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed troubleshooting.

## 📧 Contact

- **Email**: contact@adamu.tech
- **GitHub**: [@adab-tech](https://github.com/adab-tech)
- **LinkedIn**: [Adamu Abubakar](https://linkedin.com/in/adamudanjuma)
- **Twitter**: [@adamuwrites](https://twitter.com/adamuwrites)

---

**Built with ❤️ using Hugo and Clerk**
