# Foodie Style Guide

You are the copy editor for this cookbook site. Apply these rules to every page under `content/`. The site is built with Zola.

## Editor's mandate

- Fix mechanics directly: spelling, grammar, units, abbreviations, heading levels, section order, tags, front matter, links and image markup.
- Preserve the author's voice. Don't rewrite jokes, opinions, asides or casual phrasing just to make them more polished.
- Never invent facts. That includes quantities, temperatures, times, yields, dates and sources. If one is missing or looks wrong, flag it; don't fill it in.
- Report flagged items to the author as a list with file paths. Don't leave editor comments in the content.

## Audience

The site is the author's personal cookbook. Its recipes work for a family with sensory food aversions. Readers are the author, coming back to cook something again, and other people cooking for picky or sensory-averse eaters.

## Voice

First person, conversational, candid. It should read like a friend's recipe notes, not a food magazine.

- **Honest about failures.** "She's pretty, but the texture did not go over well."
- **Dry, self-deprecating humor.** "I'm old and have seen too many."
- **Opinionated, with the reason given.** "Don't sous vide fish. It's like micro-waving it. Just don't."
- **Judged by the family.** "My family does not approve of the sprinkling Parmesan on top, so I only do one for myself."
- **Explains texture choices.** "While there is sauce, it's hidden inside, so it might get a pass as seasoning."

Rules:

- "I" is the author. Family members are "my family", "my wife" or "the kids". Never use their names.
- Humor targets the situation, never the picky eaters.
- Unfinished work is labeled "(work in progress)".
- Keep the language plain. Explain cooking terms the first time a page uses them (e.g. "jacking, or freeze distillation").

## Recipe structure

Use these sections, in this order. Optional sections are marked; leave them out when they're empty.

1. **Front matter**
   ```toml
   +++
   title = "Garlic Bread"
   date = 2022-06-23
   description = "Crunchy, cheesy, garlicky side."

   [taxonomies]
   categories = ["recipe"]
   tags = ["side", "crunchy", "dry"]
   +++
   ```
   - `title` uses title case.
   - `date` is when the recipe was first written. If it's unknown, flag it; don't use placeholders like `1970-01-01`.
   - `description` is one line, under 60 characters.
2. **Blurb.** 1–2 sentences on what the dish is and its texture or sensory hook. Follow it with `<!-- more -->`.
3. **Context.** One short paragraph: where the recipe came from and how it fits or bends the [guidelines](content/guidelines.md). Recipes tagged `strong`, `acidic` or `gross` must say why here.
4. **Hero photo.** Optional.
5. `### Ingredients`. When the dish has separate components, put each under a `####` subheading (e.g. `#### Marinade`, `#### Filling`).
6. `### Equipment`. Optional; use it only for non-standard gear: pressure cooker, smoker, mandolin, sous vide, canning jars.
7. `### Prep — day before`. Optional; for drying, brining, soaking or marinating.
8. `### Steps`. Use a numbered list when the steps run in one sequence. When there are several components, give each its own `####` subheading with short paragraphs under it. The first step sets the oven or water-bath temperature.
9. `### Yield`. Servings and/or portion weight.
10. `### Variations`. Optional. Covers substitutions and "the strong version" for adventurous eaters.
11. `### Serving ideas`. Optional.
12. `### Credit`. Optional. Link to the source recipe or book.

Technique and reference pages (sous vide, canning, conversions, wine, guidelines) are free-form essays in the same voice. They use `categories = ["technique"]` or `["reference"]`.

## Ingredients

- Use the format `- <qty> <unit> <ingredient>, <prep>`, e.g. `- 2 jalapeños, seeded and chopped`.
- Informal amounts ("splash", "handful", "pinch", "to taste") are fine.
- Give alternatives in parentheses: `- 1 C dried cranberries (or raisins, cherries)`.
- Mark optional items with `(optional)` at the end of the line.

## Units

| Measure | Style | Example |
| --- | --- | --- |
| Weight | metric first, imperial in parentheses for large amounts | `4.5 kg (10 lb)`, `200 g` |
| Liquid | metric | `500 ml`, `2 L` |
| Volume (baking) | US measures are allowed | `1 C`, `2 T`, `1 t` |
| Oven, smoker | °F | `350°F` |
| Sous vide, canning, candy | °C | `55°C` |
| Frying oil | °C with °F | `175°C (350°F)` |
| Pans | inches | `9x9 in` |
| Time | numerals plus "minutes" or "hours", or "min" in lists | `30 minutes`, `1–2 hours` |

- Abbreviations: `C` cup, `T` tablespoon, `t` teaspoon, `g`, `kg`, `ml`, `L`, `lb`, `oz`. Never use `gr`, "tsp" or "tbsp", and don't mix abbreviated and spelled-out units on one page.
- Put a space between the number and the unit (`500 g`), except for temperatures (`350°F`).
- Every temperature has a unit.
- Use an en dash for ranges: `3–4 limes`.

## Tags

Every recipe has at least one course tag and at least one sensory tag. Use only the tags below.

| Group | Tags |
| --- | --- |
| Course | `appetizer`, `breakfast`, `main`, `side`, `dessert` |
| Texture | `crunchy` or `squishy`; `dry` or `saucy` |
| Flavor | `acidic`, `strong` |
| Warning | `gross`: the recipe breaks the guidelines |
| Special | `wine` |

- Use `main`, never `dinner`.
- Mild and low-acid are the default, so they have no tags.
- Tag the dominant texture honestly, even when the family likes the dish anyway.

## Spelling & names

- American spelling.
- Dish and ingredient spellings: Parmesan, mozzarella, prosciutto, jalapeño, Worcestershire, sriracha, sauerkraut, kouign-amann, sous vide (no hyphen), Instant Pot.
- Capitalize brands and proper nouns. Lowercase generic foods.

## Files, links & images

- New recipes go in `content/recipes/<slug>/index.md`, with photos in the same folder. Slugs are kebab-case: `garlic-bread`.
- Internal links use Zola paths, e.g. `[guidelines](@/guidelines.md)` or `[barbacoa](@/recipes/barbacoa/index.md)`.
- Images:
  - Use descriptive filenames: `finished.jpg`, `assembly.jpg`.
  - Every image needs `alt` text.
  - Width is 250 for inline photos and 500 for a hero or step-by-step photo.
- Link external sources inline, with descriptive link text, never a bare URL.
