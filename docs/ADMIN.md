# Admin: what you can change and where

adamu.tech/admin is the control room for the whole site. The site has no
server: every change is saved to this GitHub repository and the site rebuilds
about a minute later. The first time on a device, an editor asks for a GitHub
token (setup steps are on that screen and in docs/BLOG.md). The token is kept
in that browser only.

## Signing in

adamu.tech/admin asks only for a password; no GitHub token is needed to sign
in. A sign-in lasts 30 days in that browser, or until you sign out.

- **Default password:** `adamu2026` works until you set your own. Change it
  straight away: Admin → **Admin password**.
- **Changing it:** if that browser is connected to GitHub (you have written a
  post or edited a page there), the new password is saved for every device
  and the default stops working everywhere, about a minute later. If not, you
  can paste the GitHub token in the same box to do that, or leave it empty to
  change the password on that device only (the default then still works on
  other devices).
- **Nothing readable is stored:** only a salted PBKDF2 hash of the password
  (in `public/admin-auth.json`, or in that browser for a device-only
  password), which can’t be turned back into the password.
- **Forgot it:** delete `public/admin-auth.json` on GitHub; about a minute
  later the default works again, then set a new one. (A device-only password
  is cleared by clearing that browser’s data for adamu.tech.)
- The check runs in the browser, because the site has no server. It keeps out
  anyone who doesn’t know the password; publishing is still protected by the
  GitHub token, which the editors ask for once per browser.

## What you can change

| Area | Where | What you can do |
|---|---|---|
| Blog posts | Admin → Blog posts | Write, format, add images and videos, publish, save as draft, edit, delete |
| Home page | Admin → Home page | Name, headline, introduction, buttons, “Murya in numbers”, specifications, principles, contact box; show or hide sections |
| Projects | Admin → Projects | Add, edit, reorder, duplicate or remove projects; upload a logo; choose which appear on the home page and in the icon row |
| CV | Admin → CV | Profile buttons, education, experience, languages, publications, datasets |
| Comments | Admin → Comments | A link to every post’s comments, and how to delete or reply (below) |
| Status | Admin (front page) | Post and draft counts, the latest site updates and whether they went live, visits |

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
