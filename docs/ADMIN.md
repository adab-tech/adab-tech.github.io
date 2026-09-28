# Admin: what you can change and where

adamu.tech/admin is the control room for the whole site. The site has no
server: every change is saved to this GitHub repository and the site rebuilds
about a minute later.

## Signing in

You sign in with a **GitHub token**, not a password. The token is the key that
lets the admin save to the repository, so it is the only thing worth
protecting; a password checked in the browser would be written into the
site’s public code where anyone could read it (the old admin password worked
that way and has been removed).

- The token is saved in the browser you sign in with, until you **Sign out**
  or it expires. A different browser, another device or a private window asks
  for it once. So do some phone browsers and in-app browsers (opening a link
  inside WhatsApp, Gmail or GitHub’s app uses a separate browser) and clearing
  site data.
- When the browser offers to save the password on the sign-in page, accept.
  The account shows as `adab-tech`; next time the token fills in by itself,
  including on your other devices signed in to the same Chrome, Safari
  (iCloud Keychain) or password manager.
- When a token expires or is revoked, the admin signs you out and asks for a
  new one. Create it from the sign-in page (**No token, or it expired?**):
  only `adab-tech.github.io`, **Contents: Read and write**, **Actions:
  Read-only**, expiry up to a year.
- To lock every device out at once, revoke the token on GitHub
  (Settings → Developer settings → Fine-grained tokens).

## What you can change

| Area | Where | What you can do |
|---|---|---|
| Blog posts | Admin → Blog posts | Write, format, add images and videos, publish, save as draft, edit, delete |
| Home page | Admin → Home page | Name, headline, introduction, buttons, “Murya in numbers”, specifications, principles, contact box; show or hide sections |
| Projects | Admin → Projects | Add, edit, reorder, duplicate or remove projects; upload a logo; choose which appear on the home page and in the icon row |
| CV | Admin → CV | Profile buttons, education, experience, languages, publications, datasets |
| Comments | Admin → Comments | A link to every post’s comments, and how to delete or reply (below) |
| Status | Admin (front page) | Post and draft counts, the latest site updates and whether they went live, visits, sign-out |

Each editor has **Save & publish** at the bottom. Nothing changes on the
site until you press it; **Discard changes** undoes everything since the last
save. After saving, the editor shows “Building…” and then “Live”. If a build
fails, the live site stays as it was and the editor links to the reason.

In longer text you can write `**bold**`, `*italic*`, `` `code` `` and
`[link text](https://…)`.

## Project logos and the icon row

Each project shows its logo on its card; clicking the logo opens the
project’s site. The **My platforms** row, under the buttons at the top of the
home page, shows the logo of each project with “Show in the icon
row” ticked.

Where a logo comes from:

1. The logo uploaded in Admin → Projects (stored in `public/project-logos/`).
   An SVG or a square PNG of at least 128 px looks best.
2. If none is uploaded, the project’s live site’s own icon
   (`https://<site>/favicon.ico`), loaded by the visitor’s browser.
3. If that doesn’t load either, the project’s initials.

Mapping Voices, Imodoye, Global Opportunities and Adab use the logos from their
own code. Murya uses app.murya.ng’s own icon; upload the Murya logo in
Admin → Projects to use a sharper one.

## Deleting a comment

Comments are hosted by HTML Comment Box, which has no way for other sites to
delete comments, so moderation happens on the post itself:

1. Admin → Comments → **Open comments** next to the post.
2. Under the comment box, click **Moderator login** and sign in with the HTML
   Comment Box account used to get the code (once per browser).
3. Click **delete** on the comment. It disappears for everyone.

## Files behind the editors

- `content/site/home.json`, `content/site/projects.json`, `content/site/cv.json`:
  the text of the home page, projects and CV. They can also be edited directly
  on GitHub.
- `src/lib/site-content.ts`: the shape of those files, and the checks that stop
  a build (leaving the live site unchanged) if one is malformed.
- `src/components/admin/ContentEditor.tsx`: the form editor used by the Home
  page, Projects and CV screens.
