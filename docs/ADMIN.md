# Site administration

Open [adamu.tech/admin](https://adamu.tech/admin/) to edit the home page, projects, CV, and blog. Publishing commits the changes to GitHub and starts the site's GitHub Pages build.

## Set up this browser

When the Cloudflare admin Worker is absent, the sign-in page offers browser setup. Create a [fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new) for only `adab-tech/adab-tech.github.io` with **Contents read and write**. Give it **Actions read** if you want to see deployment status.

Enter the token and choose a password in the setup form on `adamu.tech`. This password and the GitHub connection are specific to this browser. The editor uses the token to authenticate each publish with GitHub. Signing out clears the token. When you sign in again, the editors offer to reconnect GitHub.

Use **Reset this browser’s password** on the sign-in page if you forget the local password. GitHub verifies access to the site repository before the browser accepts a replacement. Older devices may still read `public/admin-auth.json` if that file was published previously. The current setup stores new hashes in the browser.

## Set up password sign-in on every device

The Cloudflare Worker at `https://adamu.tech/api/admin` stores the publishing token and password as Worker secrets. After it is deployed, sign in with the admin password. The Worker uses a secure, HttpOnly cookie for the session.

### Deploy from GitHub Actions

1. Find the account ID for the Cloudflare account that owns `adamu.tech`.
2. Create a Cloudflare API token for deploying the Worker and managing its route in that zone.
3. Create a [fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new) for only `adab-tech/adab-tech.github.io` with **Contents read and write** and **Actions read**.
4. Put the values directly in this repository's **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - `ADMIN_GITHUB_TOKEN`
   - `ADMIN_PASSWORD`, a unique password of at least 10 characters
5. Run [Deploy admin server](https://github.com/adab-tech/adab-tech.github.io/actions/workflows/admin-worker.yml). The workflow skips deployment if it cannot find all four secrets.
6. Open [the admin session endpoint](https://adamu.tech/api/admin/session). It should return `{"signedIn":false}` in a signed-out browser. If it returns a static 404, check that the `adamu.tech` record is proxied through Cloudflare and the Worker route is present.

In Cloudflare the corresponding Worker secrets are `GITHUB_TOKEN` and `ADMIN_PASSWORD`. For an Actions-managed deployment, update the corresponding GitHub secret and rerun the workflow when a credential needs to change. When managing the Worker directly, rotate its secret in **Cloudflare → Workers & Pages → adamu-admin → Settings → Variables and Secrets**. Rotating either credential ends existing admin sessions.

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

## Blog comments

Readers can reply by email. If you enable the first-party comments Worker,
use **Admin → Comments** to moderate. See [Blog publishing](BLOG.md#comments).

## Files behind the editors

- `content/site/home.json`, `content/site/projects.json`, `content/site/cv.json`:
  the text of the home page, projects and CV. They can also be edited directly
  on GitHub.
- `src/lib/site-content.ts`: the shape of those files, and the checks that stop
  a build (leaving the live site unchanged) if one is malformed.
- `src/components/admin/ContentEditor.tsx`: the form editor used by the Home
  page, Projects and CV screens.
