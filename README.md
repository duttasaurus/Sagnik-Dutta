# Sagnik Dutta — Static portfolio (GitHub Pages)

## How to publish

1. Create a GitHub repo named `yourusername.github.io` and push the entire project to the repository's root.
2. GitHub Pages will serve `index.html` automatically.
3. Alternatively create any repo and enable GitHub Pages from `gh-pages` branch or `main` branch `docs/` folder.

## How to add/update blog posts

- Open `assets/posts/posts.json`. Add a new object to the `posts` array with fields: `id`, `title`, `date` (ISO), `tags` (array), `excerpt`, `content`.
- Upload any images used by the post to `assets/images/` and reference them in the `content` HTML (you can include `<img src=...>`).
- Commit and push — the Read page loads posts from `assets/posts/posts.json` automatically.

## Replace images and press kits

- Replace placeholder images in `assets/images/` with the correct files.
- Upload press kit PDFs to `presskits/` (or within `films/` subfolders) and update the links in each film page.

## Notes and possible future improvements

- If you want a fully CMS-like editing experience, use Netlify CMS, Forestry, or GitHub Actions + a simple admin page that commits to the repo via a PAT (more setup required).
- You can convert this static site to Jekyll (supported by GitHub Pages) to write posts in Markdown and get an admin-friendly flow.
