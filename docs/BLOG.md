# Blog: how it works and how to publish

adamu.tech/blog is where posts, reflections, and notes are published. Every
post is one Markdown file in `content/blog/`. Adding a file to `main` publishes
it: the deploy workflow rebuilds the site and the post appears at
`adamu.tech/blog/<slug>/` about a minute later.

## Publish a post (from any browser, including a phone)

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

## What was built (technical notes)

- `content/blog/*.md`: the posts.
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
