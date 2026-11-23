# Doug's Kitchen (foodie)

Personal recipe site, built with Zola 0.17 and the DeepThought theme (a git submodule in `themes/`). Live at https://foodie.chapmaniacs.com, deployed from the `dougch/foodie` GitHub repo.

## Content

- `SPEC.md` is the style guide. When writing or editing anything under `content/`, act as the copy editor it describes and follow it exactly.
- `SPEC.md` holds final rules only: no history, rationale or open questions. Discuss proposed rule changes in chat, then write the decision in.
- The site is the author's personal cookbook. Don't reintroduce the retired "sensory-averse" or family-audience framing, or the removed Guidelines and Conversions pages.
- New recipes start from `content/recipes/template`.

## Workflow

- Commit directly to `main`. No branches or PRs; this is a solo site.
- Pushing `main` deploys the live site (`.github/workflows/publish.yml` builds to `gh-pages`). Confirm with the author before pushing.
- `make test` runs `typos` on the content.

## Verifying changes

- Use `zola build -o <scratch dir> --force`, not `zola check`. `check` doesn't render templates, so it misses template errors. Example: a recipe with no `date` crashes the theme's list pages.
- `zola serve` falls back to a stale `public/` folder for pages that no longer exist. If removed pages still show up, stop the server, `rm -rf public`, and restart it.
- `zola serve` sometimes doesn't rebuild taxonomies after front matter changes. Restart it if tag or cuisine pages look stale.
- There's no browser here. To test `static/js/units.js`, load served pages in jsdom: strip the page's `<script>` tags, then `eval` the script.

## How the site is put together

- **Templates:**
  - `templates/page.html` extends `DeepThought/templates/page.html`. It splits the rendered content at `<h3 id="ingredients">` to build the ingredients panel beside the steps.
  - `templates/recipes.html` is the card grid on the Recipes page. A card's photo comes from `[extra] image`, defaulting to `finished.jpg`; without one it shows a cuisine-colored placeholder.
  - `templates/index.html` renders the course and cuisine pills at the `<!-- pills -->` marker in `content/_index.md`.
- **Taxonomies:** `tags` holds the course tags. `cuisine` is a separate taxonomy, with its own `templates/cuisine/` templates.
- **Unit and portion selector** (`static/js/units.js`, no dependencies):
  - It reads amount-first lines in `### Ingredients` lists, temperatures written like `350°F`, and `{{ q(...) }}` shortcode spans.
  - Display defaults to metric, with a US toggle and ½×–3× scaling. `[extra] servings` drives the "Serves N" readout.
- **Styles:** all custom CSS, including the print stylesheet, lives in `static/css/kitchen.css`. Fonts (Fraunces, Inter) are self-hosted in `static/fonts/` because the site promises no third-party tracking. Don't add Google Fonts or other trackers.
- **Zola 0.17 quirks:**
  - Shortcodes can't call `get_taxonomy`.
  - `resize_image` writes to `static/processed_images/`, which is gitignored.
- **Footer:** every page carries a USDA food safety advisory. The author's cooking temperatures stay as written.
