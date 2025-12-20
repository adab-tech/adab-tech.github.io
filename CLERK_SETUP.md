# Clerk Authentication Setup Guide

This guide explains how to set up and use Clerk authentication in this Hugo-powered site.

## Overview

Clerk provides a complete user management and authentication solution. This site has been pre-configured to work with Clerk, but you'll need to set up your own Clerk account and configure the environment variables.

## Getting Started

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application in your Clerk dashboard
3. Choose your preferred authentication methods (Email, Google, GitHub, etc.)

### 2. Get Your API Keys

In your Clerk Dashboard:

1. Navigate to **API Keys** in the sidebar
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Optionally, copy your **Secret Key** (starts with `sk_test_` or `sk_live_`) for backend operations

### 3. Configure Environment Variables

#### For Local Development

Create a `.env` file in the root of the project:

```bash
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Then run Hugo with environment variables:

```bash
export CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
hugo server
```

#### For Production/Deployment

Add the environment variable to your hosting platform:

**GitHub Pages:**
- Currently, GitHub Pages doesn't support environment variables at build time
- For GitHub Pages, you'll need to hardcode the publishable key in the template or use client-side only features

**Netlify:**
```bash
# In Netlify Dashboard: Site Settings > Build & Deploy > Environment Variables
CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
```

**Vercel:**
```bash
# In Vercel Dashboard: Project Settings > Environment Variables
CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
```

**Other platforms:**
Consult your platform's documentation for setting environment variables.

### 4. Configure Clerk Dashboard

In your Clerk Dashboard, configure the following:

1. **Allowed Redirect URLs**: Add your domain URLs
   - `http://localhost:1313` (for development)
   - `https://yourdomain.com` (for production)

2. **Session & User Settings**: Configure as needed
   - Session duration
   - User profile fields
   - Social login providers

## Using Authentication Features

### Authentication Pages

The site includes three pre-built authentication pages:

1. **Sign In** - `/signin/`
2. **Sign Up** - `/signup/`
3. **User Profile** - `/profile/`

### Protecting Content

To protect a page and require authentication:

1. Add `protected: true` to the page's front matter:

```yaml
---
title: "Members Only Content"
protected: true
---

This content is only visible to authenticated users.
```

2. Add client-side protection in your layout or use Clerk's built-in session management.

### Customizing Authentication UI

Clerk provides extensive customization options:

1. **Appearance**: Customize colors, fonts, and styling in Clerk Dashboard
2. **Localization**: Add multiple language support
3. **Custom Fields**: Add additional user profile fields

## Demo Users

For testing purposes, you can create demo accounts:

### Creating Test Users

1. Go to your Clerk Dashboard
2. Navigate to **Users** section
3. Click "Create User"
4. Add test user credentials

Example test users:
- Email: `demo@example.com` / Password: `DemoPassword123!`
- Email: `testuser@example.com` / Password: `TestPass456!`

> **Note**: For production, always use real user registration, not pre-created accounts.

## Integration Examples

### Displaying User Information

```html
<div id="user-info"></div>

<script>
  if (typeof Clerk !== 'undefined') {
    const clerk = new Clerk('{{ getenv "CLERK_PUBLISHABLE_KEY" }}');
    clerk.load().then(() => {
      if (clerk.user) {
        document.getElementById('user-info').innerHTML = `
          <p>Welcome, ${clerk.user.firstName || clerk.user.emailAddresses[0].emailAddress}!</p>
        `;
      }
    });
  }
</script>
```

### Checking Authentication Status

```javascript
// Check if user is signed in
if (clerk.session) {
  // User is authenticated
  console.log('User ID:', clerk.user.id);
} else {
  // User is not authenticated
  window.location.href = '/signin/';
}
```

### Sign Out Functionality

```html
<button id="signout-btn">Sign Out</button>

<script>
  document.getElementById('signout-btn').addEventListener('click', () => {
    clerk.signOut().then(() => {
      window.location.href = '/';
    });
  });
</script>
```

## Troubleshooting

### "Clerk publishable key not found" Error

**Solution**: Make sure the `CLERK_PUBLISHABLE_KEY` environment variable is set and Hugo is restarted.

### Authentication Components Not Rendering

**Solution**: 
1. Check browser console for errors
2. Verify Clerk SDK is loaded (check Network tab)
3. Ensure publishable key is correct and valid

### Redirect Issues

**Solution**: 
1. Verify redirect URLs are configured in Clerk Dashboard
2. Check that URLs match exactly (including `http` vs `https`)

## Security Best Practices

1. **Never commit secret keys** to version control
2. **Use environment variables** for all API keys
3. **Enable MFA** for production applications
4. **Regularly rotate** API keys
5. **Monitor authentication logs** in Clerk Dashboard
6. **Use HTTPS** in production

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk JavaScript SDK](https://clerk.com/docs/references/javascript/overview)
- [Hugo Environment Variables](https://gohugo.io/getting-started/configuration/#configure-with-environment-variables)

## Support

For issues related to:
- **Clerk Authentication**: Visit [Clerk Support](https://clerk.com/support)
- **Hugo Static Site**: Check [Hugo Documentation](https://gohugo.io/documentation/)
- **This Repository**: Open an issue on GitHub

---

## Quick Start Checklist

- [ ] Create Clerk account
- [ ] Create new application in Clerk
- [ ] Copy publishable key
- [ ] Set `CLERK_PUBLISHABLE_KEY` environment variable
- [ ] Configure redirect URLs in Clerk Dashboard
- [ ] Test sign in/sign up locally
- [ ] Deploy with environment variables configured
- [ ] Test authentication in production

Once completed, your site will have a fully functional authentication system!
