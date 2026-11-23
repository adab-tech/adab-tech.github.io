# Site administration

Open [adamu.tech/admin](https://adamu.tech/admin/) to edit the home page, projects, CV, and blog. Publishing commits the changes to GitHub and starts the site's GitHub Pages build.

## Set up this browser

When the Cloudflare admin Worker is absent, the sign-in page offers browser setup. Create a [fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new) for only `adab-tech/adab-tech.github.io` with **Contents read and write**. Give it **Actions read** if you want to see deployment status.

Enter the token and choose a password in the setup form on `adamu.tech`. This password and the GitHub connection are specific to this browser. The editor uses the token to authenticate each publish with GitHub. Signing out clears the token. When you sign in again, the editors offer to reconnect GitHub.

Use **Reset this browser’s password** on the sign-in page if you forget the local password. GitHub verifies access to the site repository before the browser accepts a replacement. Older devices may still read `public/admin-auth.json` if that file was published previously. The current setup stores new hashes in the browser.

## Set up password sign-in on every device

Sign in with the same site password on every device. The Cloudflare Worker uses a secure, HttpOnly cookie for the session. The dashboard and local blog drafts are available with password sign-in. The GitHub publishing connection is a separate setup.

In the [adamu-admin Worker settings](https://dash.cloudflare.com/5e2c8f3d32eb5621a3b94964b6a89ba1/workers/services/view/adamu-admin/production/settings), open **Variables and Secrets** and add these values as **Secret** types:

- `ADMIN_PASSWORD` is a unique site password of at least 10 characters. A password manager can generate and remember it.
- `ADMIN_SESSION_SECRET` is a separate random signing key. Generate one with `openssl rand -hex 32` on your computer if one is missing. Rotating either sign-in secret ends existing sessions.

The Worker uses `CLOUDFLARE_ANALYTICS_TOKEN` with **Analytics Read** on the site's zone to show visits after sign-in.

### Connect GitHub publishing

A private GitHub App lets the Worker request short-lived publishing credentials automatically. Set it up once for the website repository.

1. Sign in as `adab-tech` and open [New GitHub App](https://github.com/settings/apps/new). Name the app, set the homepage to `https://adamu.tech`, disable the webhook, and choose **Only on this account**.
2. Under repository permissions, set **Contents** to **Read and write** and **Actions** to **Read-only**. Create the app, then copy its **App ID** from the General settings.
3. In the app's **Install App** tab, install it on `adab-tech` and select only `adab-tech.github.io`. The installation settings URL ends with the numeric installation ID. If you increase the app's permissions later, review and accept the change on the installation settings page.
4. Open **Credentials → Key pairs → New key** in your app's settings to download the private key. In **Variables and Secrets** on the [adamu-admin Worker settings](https://dash.cloudflare.com/5e2c8f3d32eb5621a3b94964b6a89ba1/workers/services/view/adamu-admin/production/settings), save `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_PRIVATE_KEY` as **Secret** types. Paste the full downloaded PEM, including its header and footer, into the private key field. [GitHub's private key instructions](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/managing-private-keys-for-github-apps#generating-private-keys)
5. After deploying the secrets, sign in and open [Blog posts](https://adamu.tech/admin/blog/). If your posts load, the Worker has connected to the repository. Publish from the editor when a post or page is ready.

An existing Worker `GITHUB_TOKEN` with repository **Contents read and write** and **Actions read** also works if no GitHub App is configured. Updating publishing credentials preserves password sessions.

### Deploy from GitHub Actions

1. Find the account ID for the Cloudflare account that owns `adamu.tech`.
2. Create a Cloudflare API token for deploying the Worker and managing its route in that zone.
3. In this repository's **Settings → Secrets and variables → Actions**, save:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
   - `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` from the sign-in setup
   - Optional publishing secrets `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_PRIVATE_KEY`. For an existing token-based setup, use `ADMIN_GITHUB_TOKEN`.
4. Run [Deploy admin server](https://github.com/adab-tech/adab-tech.github.io/actions/workflows/admin-worker.yml). The workflow checks its four required secrets before deploying.
5. Open [the admin session endpoint](https://adamu.tech/api/admin/session). In a signed-out browser it should return `{"signedIn":false,"publishingConfigured":false}`. A static 404 means the Worker route is not active. Check that the DNS record is proxied through Cloudflare and that `adamu.tech/api/admin/*` points to `adamu-admin`.

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
