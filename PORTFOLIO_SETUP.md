# Developer Portfolio - Setup Guide

This document provides instructions for setting up and customizing the redesigned `longblog.html` portfolio page.

## Features Implemented

### 1. About Me Section
- Detailed personal and professional background
- Highlights expertise in literature, AI, and technology
- Located at `#about` anchor

### 2. Contact Form with Email Integration
- Secure email service using **Formspree**
- Form action endpoint: `https://formspree.io/f/xovqqwdz`
- AJAX-based submission for better UX
- Real-time success/error feedback
- Email address is NOT exposed in the frontend

### 3. CV Download Section
- Dedicated section for CV download
- Link configured to: `assets/Adamu_Danjuma_CV.pdf`
- See `assets/README.md` for instructions on adding your CV

### 4. Social Media Footer
- GitHub: https://github.com/adab-tech
- LinkedIn: https://www.linkedin.com/in/adamu-danjuma
- Twitter: https://twitter.com/adabudanjuma
- SVG icons included for visual appeal

### 5. Responsive Design
- Mobile-first approach
- Breakpoint at 700px for small screens
- Sticky header navigation
- Flexbox and CSS Grid layouts

## Setup Instructions

### Customizing the Contact Form

The contact form uses Formspree (https://formspree.io/), a free service for handling form submissions.

**Current Setup:**
- The form endpoint `https://formspree.io/f/xovqqwdz` is a placeholder
- You need to create your own Formspree account and endpoint

**To set up your own Formspree endpoint:**

1. Go to https://formspree.io/
2. Sign up for a free account
3. Create a new form
4. Copy your unique form endpoint (e.g., `https://formspree.io/f/YOUR_ID`)
5. Update line 426 in `longblog.html`:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST">
   ```

### Adding Your CV

1. Export your CV as a PDF file
2. Rename it to `Adamu_Danjuma_CV.pdf` (or update the link in the HTML)
3. Place it in the `assets/` directory
4. The download button will work automatically

Alternatively, you can host your CV elsewhere and update the link on line 418:
```html
<a href="YOUR_CV_URL" class="btn-download" download>
```

### Updating Social Media Links

Edit lines 446-463 in `longblog.html` to update your social media profiles:

```html
<a href="https://github.com/YOUR_USERNAME" ...>
<a href="https://www.linkedin.com/in/YOUR_PROFILE" ...>
<a href="https://twitter.com/YOUR_HANDLE" ...>
```

### Customizing Colors

The color scheme is defined using CSS custom properties (variables) at the top of the `<style>` section:

```css
:root {
  --primary-color: #0B3D91;    /* Dark blue - headers, footer */
  --secondary-color: #004080;   /* Medium blue */
  --accent-color: #007ACC;      /* Light blue - buttons, links */
  --background-color: #F5F7FA;  /* Light gray background */
  --text-color: #222;           /* Almost black text */
  --muted-text: #555;           /* Gray text for secondary content */
}
```

Simply change these hex values to customize the entire color scheme.

## Browser Compatibility

The portfolio is tested and compatible with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, media queries
- **Vanilla JavaScript** - Form handling with Fetch API
- **Formspree** - Email service integration
- **SVG** - Social media icons

## Security Features

1. **No email exposure**: The email address is never exposed in the frontend code
2. **CSRF protection**: Formspree handles CSRF tokens automatically
3. **Form validation**: HTML5 validation + server-side validation by Formspree
4. **Secure links**: All external links use `rel="noopener noreferrer"`

## Testing

To test the portfolio locally:

1. Open `longblog.html` in a web browser
2. Test navigation by clicking menu items
3. Try the contact form (it will submit to Formspree)
4. Test responsive design by resizing the browser window
5. Check social media links open in new tabs

## Notes

- The Formspree endpoint included is a placeholder. Please replace it with your own.
- Add your actual CV file to enable the download functionality.
- Update social media links to point to your actual profiles.
- The portfolio uses a clean, modern design optimized for developer portfolios.

## Support

For questions or issues, please open an issue in the GitHub repository.
