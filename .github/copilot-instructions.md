# Copilot Instructions for zhangkangcool.github.io

This repository is a personal technical blog powered by MkDocs and Material theme, focused on programming languages, compilers, and related knowledge. The content is organized in Markdown files under `docs/`, and published to GitHub Pages using CI/CD workflows.

## Architecture & Structure
- **Content Source:** All articles and notes are in `docs/`, organized by topic (e.g., `Compiler/`, `Program/`, `useful/`).
- **Static Site Generation:** Uses [MkDocs](https://www.mkdocs.org/) with the Material theme. Site config is in `mkdocs.yml`.
- **Deployment:** Automated via GitHub Actions (`.github/workflows/ci.yml`) on every push to `main`.
- **Output:** Built site files are in `site/` (do not edit directly).

## Developer Workflows
- **Local Preview:**
  ```sh
  pip install -r requirements.txt
  mkdocs serve
  ```
  Visit `http://127.0.0.1:8000` to preview changes.
- **Build & Deploy:**
  - Push to `main` triggers CI/CD and deploys to GitHub Pages.
  - Manual build: `mkdocs build` (outputs to `site/`).
- **Add Dependencies:**
  - Update `requirements.txt` for Python packages/plugins.
  - Common plugins: `mkdocs-material`, `mkdocs-awesome-pages-plugin`, `mkdocs-minify-plugin`, etc.

## Project-Specific Conventions
- **Navigation:**
  - Uses `awesome-pages` plugin for flexible navigation. Avoid setting `nav` or `pages` in `mkdocs.yml` to let the plugin manage structure.
- **Markdown Extensions:**
  - Extensive use of `pymdown-extensions` and custom Markdown features (see `mkdocs.yml`).
  - Code blocks, checklists, footnotes, admonitions, and collapsible details are common.
- **Language:**
  - Content is primarily in Chinese, with some English technical terms.
- **Assets:**
  - Images and other assets are stored in `docs/assets/` and subfolders by topic.

## Integration Points
- **Plugins:**
  - See `requirements.txt` and `mkdocs.yml` for all enabled plugins.
  - Some plugins (e.g., `mkdocs-git-revision-date-localized-plugin`, `mkdocs-git-authors-plugin`) add metadata to pages.
- **Search:**
  - Uses built-in MkDocs search with Chinese support via `jieba`.

## Examples & Patterns
- **Add a New Article:**
  1. Create a Markdown file in the appropriate topic folder under `docs/`.
  2. Add images to `docs/assets/images/` or a topic-specific assets folder.
  3. Use Markdown features and extensions as configured in `mkdocs.yml`.
- **Update Navigation:**
  - Structure folders and filenames for logical navigation; `awesome-pages` auto-generates menus.

## Key Files
- `docs/` — All content
- `mkdocs.yml` — Site configuration, theme, plugins, Markdown extensions
- `requirements.txt` — Python dependencies for build and plugins
- `.github/workflows/ci.yml` — GitHub Actions for deployment

---
For questions or unclear conventions, check `README.md`, `mkdocs.yml`, or ask for clarification. Please suggest improvements if you find missing or outdated instructions.
