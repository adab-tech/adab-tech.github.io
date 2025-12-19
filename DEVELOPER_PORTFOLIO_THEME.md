# Developer Portfolio Theme - Implementation Guide

This document describes how the **Developer Portfolio** Hugo theme has been integrated into the Adamu Abubakar portfolio website.

## Theme Information

- **Name**: Developer Portfolio
- **Author**: Sam Robbins
- **Repository**: https://github.com/samrobbins85/hugo-developer-portfolio
- **License**: MIT
- **Framework**: UIKit 3.2.6
- **Hugo Version**: 0.54.0+

## What is the Developer Portfolio Theme?

The Developer Portfolio is a professional Hugo theme specifically designed for developers, featuring:

- **Modern Design**: Clean, minimal aesthetics with UIKit framework
- **Portfolio Showcase**: Grid layout for projects with filtering
- **Skills Display**: Modal popups for skill descriptions
- **Experience Timeline**: Work experience with company logos
- **Education Section**: Academic background display
- **Blog Integration**: Clean blog layout with syntax highlighting
- **Responsive**: Mobile-first, works on all devices
- **Fast**: Optimized for performance

## Site Structure

### Content Organization

```
content/
├── _index.md           # Homepage content
├── about/
│   └── _index.md       # About page
├── blog/               # Blog posts
│   ├── _index.md
│   └── *.md
├── portfolio/          # Project showcase
│   ├── _index.md
│   └── *.md
└── contact/
    └── _index.md       # Contact page
```

### Data Configuration

The homepage is primarily configured through `data/homepage.yml`:

```yaml
banner:
  title: Hi! I'm Adamu Abubakar

social:
  twitter: "adamuwrites"
  linkedin: "adamudanjuma"
  github: "adab-tech"
  gmail: "contact@adamu.tech"

about:
  enable: true
  content: Computational Linguistics & AI Specialist
  button:
    btnText: Learn More About Me
    URL: "/about"

skill:
  enable: true
  item:
    - title: Natural Language Processing
      logo: [URL to logo]
      description: Expertise description

experience:
  enable: true
  item:
    - logo: [URL to logo]
      title: Position Title
      company: Company Name
      duration: Date Range

education:
  enable: true
  item:
    - title: Degree
      year: Year Range
      academy: Institution
      image: [URL to logo]

portfolio:
  filter:
    - label: Category Name
      value: category-slug
```

## Hugo Configuration

Key configuration in `hugo.toml`:

```toml
baseURL = 'https://adamu.tech/'
languageCode = 'en-us'
title = 'Adamu Abubakar | Computational Linguistics & AI'
theme = 'hugo-developer-portfolio'

[params]
  author = 'Adamu Abubakar'
  email = 'contact@adamu.tech'
  description = 'Portfolio description'
  home = 'Home'
  
  # UIKit plugins (required by theme)
  [[params.plugins.css]]
  URL = "https://cdn.jsdelivr.net/npm/uikit@3.2.6/dist/css/uikit.min.css"
  
  [[params.plugins.js]]
  URL = "https://cdn.jsdelivr.net/npm/uikit@3.2.6/dist/js/uikit.min.js"
  
  [[params.plugins.js]]
  URL = "https://cdn.jsdelivr.net/npm/uikit@3.2.6/dist/js/uikit-icons.min.js"

[menu]
  [[menu.main]]
    name = 'About'
    url = 'about'
    weight = 1
  [[menu.main]]
    name = 'Blog'
    url = 'posts'
    weight = 2
  [[menu.main]]
    name = 'Portfolio'
    url = 'portfolio'
    weight = 3
  [[menu.main]]
    name = 'Contact'
    url = 'contact'
    weight = 4
```

## Portfolio Items Format

Portfolio items use TOML front matter:

```toml
+++
title = "Project Name"
description = "Brief project description"
categories = ["nlp", "web-dev"]  # Must match filter values in homepage.yml
date = 2024-12-01T00:00:00Z
github = ["https://github.com/user/repo"]
image = "https://path-to-image.svg"
type = "post"

[[tech]]
name = "Technology Name"
logo = "https://path-to-logo.svg"
url = "https://technology-url.com/"

[[tech]]
name = "Another Technology"
logo = "https://path-to-logo.svg"
url = "https://technology-url.com/"
+++

## Project content in Markdown

Description, features, implementation details, etc.
```

## Blog Posts Format

Blog posts use standard Markdown front matter:

```yaml
---
title: "Post Title"
date: 2024-12-15
author: "Adamu Abubakar"
description: "Post description"
---

Blog content here...
```

## Customization Options

### Colors and Styling

The theme uses UIKit's default styling. To customize colors, you can:

1. Create custom CSS in `static/css/custom.css`
2. Reference it in `hugo.toml` params.plugins.css
3. Override UIKit variables

### Homepage Sections

Control which sections appear on the homepage by setting `enable: true/false` in `data/homepage.yml`:

- About section
- Skills section
- Experience section
- Education section
- Hackathons section (optional)
- Certifications section (optional)
- Leadership section (optional)

### Portfolio Filtering

Categories in portfolio items are used for filtering:

1. Define filters in `data/homepage.yml` under `portfolio.filter`
2. Use the `value` in portfolio item `categories`
3. Multiple categories per item are supported

## Content Migration from Jekyll

Key differences from Jekyll:

| Jekyll | Hugo (Developer Portfolio) |
|--------|---------------------------|
| `_posts/` | `content/blog/` |
| `_projects/` | `content/portfolio/` |
| `_layouts/` | `themes/hugo-developer-portfolio/layouts/` |
| `_config.yml` | `hugo.toml` + `data/homepage.yml` |
| Liquid templating | Go templating |

## Building and Deploying

### Local Development

```bash
hugo server -D
```

### Production Build

```bash
hugo --gc --minify
```

### GitHub Pages Deployment

The site is configured for automatic deployment via GitHub Actions:

- Workflow: `.github/workflows/hugo-deploy.yml`
- Trigger: Push to `main` branch
- Output: Deployed to GitHub Pages

## Troubleshooting

### JSON Layout Warning

The warning about missing JSON layout can be ignored or fixed by creating a custom home JSON layout if needed for API purposes.

### Images Not Loading

Ensure image URLs in `data/homepage.yml` are:
- Absolute URLs (https://)
- Publicly accessible
- Using services like GitHub raw content, Cloudinary, or similar

### Portfolio Items Not Showing

Check that:
- `categories` in portfolio items match `value` in homepage.yml filters
- Front matter is valid TOML with `+++` delimiters
- `type = "post"` is set in front matter

### Menu Items Not Working

Verify:
- URLs in `[menu]` section don't have leading/trailing slashes
- Content directories match menu URLs
- Each section has an `_index.md` file

## Resources

- **Theme Documentation**: https://github.com/samrobbins85/hugo-developer-portfolio
- **Hugo Documentation**: https://gohugo.io/documentation/
- **UIKit Documentation**: https://getuikit.com/docs/introduction

## Support

For issues specific to:
- **Theme**: https://github.com/samrobbins85/hugo-developer-portfolio/issues
- **Hugo**: https://discourse.gohugo.io/
- **This Site**: contact@adamu.tech

---

**Last Updated**: December 19, 2024
