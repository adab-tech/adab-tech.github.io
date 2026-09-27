# Blog: how it works and how to publish

adamu.tech/blog is where posts, reflections, and notes are published. Every
post is one Markdown file in `content/blog/`. Adding a file to `main` publishes
it: the deploy workflow rebuilds the site and the post appears at
`adamu.tech/blog/<slug>/` about a minute later.

## Writing (the admin editor)

adamu.tech/admin → **Write a blog post** is a full rich-text editor (free,
built into the site; no subscription):

- Toolbar: undo/redo; paragraph, heading, subheading; bold, italic,
  underline, strikethrough; add/remove link; bulleted and numbered lists;
  quotation; code block; divider; align left/center/right; insert image;
  embed YouTube video; insert table. Keyboard shortcuts work too (Ctrl/Cmd+B,
  I, U, Z, …), and pasting from Word or Google Docs keeps basic formatting.
- **Images**: pick a JPG, PNG, WebP or GIF. Photos are shrunk in the browser to
  at most 2000px wide, then uploaded to `public/blog-images/` together with
  the post when you publish; images removed before publishing are never
  uploaded.
- **Videos**: paste a YouTube link (embedded with youtube-nocookie.com).
  Upload long videos to YouTube rather than to the site.
- **Publish** sends the post, its images, and any rename as one commit, so
  the site rebuilds once; the editor shows Building… then the live link
  (about a minute). **Save as draft** keeps it off the site.
- Posts written here are stored as HTML (`format: html` in the header);
  older Markdown posts open in the editor and are saved back as HTML.

(Ghost support, `src/config/blog.ts`, is still wired in but unused; it needs a
paid Ghost plan.)

## Sharing

Every post page on adamu.tech ends with share buttons (X, LinkedIn, Facebook,
WhatsApp, email, copy link, and the phone's share sheet where available) and a
generated preview image (`/blog/<slug>/og.png`) so links show a card with the
title when shared. Ghost posts use Ghost's own sharing and previews.

## Comments

Each post ends with a **Reply by email** link (subject filled in with the post
title) and, once enabled, a public comment thread by
[giscus](https://giscus.app): free, no ads or tracking, stored as GitHub
Discussions in this repo, with reactions and replies. Commenters sign in with
GitHub; readers without GitHub use the email link.

To enable the comment thread (one time):

1. Install the giscus app on this repo: <https://github.com/apps/giscus> →
   Install → Only select repositories → `adab-tech/adab-tech.github.io`.
2. Open <https://giscus.app>, type `adab-tech/adab-tech.github.io` under
   Repository, choose **Announcements** as the category, and copy the value
   of `data-category-id` from the generated snippet.
3. Put it in `src/config/blog.ts` (`GISCUS.categoryId`) and commit.

Moderate in the repo's **Discussions** tab: each post gets one discussion
(titled with its path), where you can hide, delete, or lock comments.

## Admin setup (first time on a device)

1. Go to adamu.tech/admin, log in, and choose **Write a blog post**
   (or **Write a post** in the admin header).
2. **First time on a device:** the page asks for a GitHub token, because the
   site has no server and publishing means saving the post to this repo.
   - Open GitHub → Settings → Developer settings → **Fine-grained tokens** →
     Generate new token (the page links there).
   - Repository access: **Only select repositories** →
     `adab-tech/adab-tech.github.io`.
   - Permissions: **Contents: Read and write**. Optional: **Actions:
     Read-only**, so the editor can tell you when the post is live.
   - Paste it into the page. It is stored in that browser only and sent only
     to GitHub. **Forget GitHub token on this device** removes it. If a token
     leaks, revoke it on GitHub; it can only change this repository's files.
3. Write the title and text, check **Preview**, then **Publish**. The web
   address is made from the title (editable). **Save as draft** stores the post
   in the repo without putting it on the site.
4. The editor shows "Building…" and then "Live on adamu.tech" with a link
   (or a link to Actions if the token has no Actions permission).
5. Click a post in the list on the left to edit or delete it. Changing the
   date or address renames the file.

## Publish on GitHub directly (from any browser, including a phone)

1. Open <https://github.com/adab-tech/adab-tech.github.io/tree/main/content/blog>.
2. **Add file → Create new file.**
3. Name it with the date and a short slug, for example
   `2026-09-27-why-i-build-for-hausa.md`. The part after the date becomes the
   web address: `adamu.tech/blog/why-i-build-for-hausa/`.
4. Paste this at the top, then write below the second `---`:

   ```markdown
   ---
   title: Why I build for Hausa
   date: 2026-09-27
   summary: One or two sentences shown on the blog index and in link previews.
   tags: [reflection, hausa]
   ---

   Your post starts here. Use a blank line between paragraphs.
   ```

5. **Commit changes** directly to `main`. The site redeploys on its own.
   Check progress under the repo's **Actions** tab.

To keep a post unpublished while you work on it, add `draft: true` to the
block at the top. Drafts are skipped by the build. Remove the line (or set it
to `false`) to publish.

To edit or remove a post, edit or delete its file the same way.

## If a post doesn't appear

Open the repo's **Actions** tab. A red run means the build stopped, and the
live site stays exactly as it was (nothing breaks). The error names the file
and the problem, for example `My-Post.md: name the file
YYYY-MM-DD-your-slug.md`, `add a title`, or `date must be YYYY-MM-DD`. Fix the
file and commit again.

## The block at the top (front matter)

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown as the heading and in the browser tab. |
| `date` | yes | `YYYY-MM-DD`. Posts are listed newest first. |
| `summary` | recommended | Shown on `/blog`, in search results and link previews. If missing, the first paragraph is used. |
| `tags` | no | `[reflection, research]`. Shown under the title. |
| `draft` | no | `true` keeps the post off the site. |

## Writing in Markdown

| You type | You get |
|---|---|
| `## A section` | A section heading |
| `*italic*`, `**bold**` | *italic*, **bold** |
| `[link text](https://…)` | A link |
| `> a quotation` | An indented quotation |
| `- item` | A bulleted list |
| `1. item` | A numbered list |
| `![description](/blog-images/photo.jpg)` | An image (upload images to `public/blog-images/`) |

Hausa, French, and Arabic text work as typed (ƙ, ɗ, ɓ, ʼy, é, عربي).

Pressing Enter once between paragraphs is fine: single line breaks between
lines of text are treated as paragraph breaks.

## What was built (technical notes)

- `content/blog/*.md`: the posts.
- `src/lib/blog-format.ts`: the file format (front matter, file names, slugs),
  shared by the build and the admin editor so both agree.
- `src/app/admin/blog/page.tsx` + `src/lib/github-publish.ts`: the admin
  editor; commits posts through the GitHub contents API with the token
  saved in the browser.
- `src/lib/blog.ts`: reads the files at build time, parses the front matter,
  renders Markdown to HTML with [`marked`](https://marked.js.org), and
  computes reading time. Posts are written only by the site owner, so the
  HTML is not sanitized; do not accept posts from others without adding a
  sanitizer.
- `src/app/blog/page.tsx`: the index at `/blog/`.
- `src/app/blog/[slug]/page.tsx`: one static page per post, with its own
  title, description, canonical URL, and previous/next links.
- `src/app/feed.xml/route.ts`: an RSS feed at `/feed.xml` so readers can
  follow the blog in a feed reader.
- "Blog" link in the site menu (`src/components/GlobalShell.tsx`).
- Post typography in `src/app/globals.css` (`.post-body`): a readable
  serif body at a comfortable line length, not monospace.

Run locally with `npm run dev` and open <http://localhost:3000/blog/>. In
development, drafts are shown with a "Draft" label so you can preview them.
