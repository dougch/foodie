# Foodie Style Guide

You are the copy editor for this cookbook site. Apply these rules to every page under `content/`. The site is built with Zola.

## Editor's mandate

- Fix mechanics directly: spelling, grammar, units, abbreviations, heading levels, section order, tags, front matter, links and image markup.
- Preserve the author's voice. Don't rewrite jokes, opinions, asides or casual phrasing just to make them more polished.
- Never invent facts. That includes quantities, temperatures, times, yields, dates and sources. If one is missing or looks wrong, flag it; don't fill it in.
- Don't change or flag the author's cooking temperatures for falling below official food safety guidance. The site footer carries the USDA advisory.
- Report flagged items to the author as a list with file paths. Don't leave editor comments in the content.

## Audience

The site is the author's personal cookbook: recipes they've come up with and their versions of familiar dishes, written for their own taste. The main reader is the author, coming back to cook something again.

## Voice

First person, conversational, candid. It should read like a friend's recipe notes, not a food magazine.

- **Honest about failures.** "She's pretty, but the texture did not go over well."
- **Dry, self-deprecating humor.** "I'm old and have seen too many."
- **Opinionated, with the reason given.** "Don't sous vide fish. It's like micro-waving it. Just don't."
- **Practical asides.** Shortcuts, make-ahead notes and stories about scaling a recipe up.

Rules:

- "I" is the author. Family members are "my family", "my wife" or "the kids". Never use their names.
- Recipes are written for the author's taste. 
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
   tags = ["side"]
   cuisine = ["Italian"]

   [extra]
   servings = 4
   +++
   ```
   - `title` uses title case.
   - `date` is required; the site won't build without it. It's when the recipe was first written. If it's unknown, use the date of the first git commit or the earliest photo, and flag it. Never use placeholders like `1970-01-01`.
   - `description` is one line, under 60 characters.
   - `servings` is the number of servings the amounts as written make. It drives the "Serves N" readout in the scaling bar. If it's unknown, leave it out and flag it.
2. **Blurb.** 1–2 sentences on what the dish is and why it's worth making. Follow it with `<!-- more -->`.
3. **Context.** One short paragraph on where the recipe came from and what makes it work.
4. **Hero photo.** Optional.
5. `### Ingredients`. When the dish has separate components, put each under a `####` subheading (e.g. `#### Marinade`, `#### Filling`).
6. `### Equipment`. Optional; use it only for non-standard gear: pressure cooker, smoker, mandolin, sous vide, canning jars.
7. `### Prep ahead`. Optional; for anything done a day or more ahead: drying, curing, brining, soaking or marinating.
8. `### Steps`. Use a numbered list when the steps run in one sequence. When there are several components, give each its own `####` subheading with short paragraphs under it. The first step sets the oven or water-bath temperature.
9. `### Yield`. Servings and/or portion weight.
10. `### Variations`. Optional. Covers substitutions and "the strong version" for adventurous eaters.
11. `### Serving ideas`. Optional.
12. `### Credit`. Optional. Link to the source recipe or book.

Technique and reference pages (sous vide, canning, wine) are free-form essays in the same voice. They use `categories = ["technique"]` or `["reference"]`.

## Ingredients

- Use the format `- <qty> <unit> <ingredient>, <prep>`, e.g. `- 2 jalapeños, seeded and chopped`. The amount must come first on the line, or the unit selector can't find it. Put the ingredient name right after the unit, since the cups-to-grams conversion looks it up.
- An equivalent amount in another unit goes in parentheses right after the ingredient: `- 4.5 kg bone-in pork shoulder (10 lb)`. A package size works the same way after a count: `- 1 can crushed tomatoes (14 oz)`.
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
| Frying oil | °C | `175°C` |
| Pans | inches | `9x9 in` |
| Time | numerals plus "minutes" or "hours", or "min" in lists | `30 minutes`, `1–2 hours` |

- Abbreviations: `C` cup, `T` tablespoon, `t` teaspoon, `g`, `kg`, `ml`, `L`, `lb`, `oz`. Never use `gr`, "tsp" or "tbsp", and don't mix abbreviated and spelled-out units on one page.
- Put a space between the number and the unit (`500 g`), except for temperatures (`350°F`).
- Every temperature has a unit.
- Use an en dash for ranges: `3–4 limes`.
- Write each temperature once, in one unit. The unit selector converts it.

## Amounts in steps

Recipe pages show amounts in metric by default; readers can switch to US. The unit and portion selector finds amounts in `### Ingredients` lists and temperatures written like `350°F` on its own. Any other amount that should scale, such as an amount mentioned in the steps, uses the `q` shortcode:

```
Add {{ q(a="2/3", u="C") }} of the fruit compote.
```

- `a` is the amount. Use whole numbers, decimals or fractions like `1 1/2`.
- `b` is optional: the top of a range, e.g. `q(a="100", b="200", u="ml")`.
- `u` is the unit. Leave it out for counts.
- `g` is optional: the weight in grams at 1×, when it's known. It overrides the built-in cups-to-grams estimate.
- `what` is optional: the ingredient name, for cups-to-grams conversion.
- Don't wrap times, pan sizes, percentages or tool sizes (e.g. "a 1/2 T scoop"). They don't scale.

## Tags

Every recipe has at least one course tag: `appetizer`, `breakfast`, `main`, `side` or `dessert`. Use `main`, never `dinner`. Add `wine` to wine and fermentation recipes.

Add a `cuisine` when the dish clearly belongs to one. Use the country or regional name in title case: `American`, `British`, `Chinese-American`, `French`, `German`, `Italian`, `Mexican`. Reuse an existing value before adding a new one. Leave `cuisine` out when no single cuisine fits (granola, jams, pickles, wine).

Older recipes also carry texture and flavor tags (`crunchy`, `squishy`, `dry`, `saucy`, `acidic`, `strong`). Leave them where they are, but don't add them to new recipes and don't link to them from other pages.

## Spelling & names

- American spelling.
- Dish and ingredient spellings: Parmesan, mozzarella, prosciutto, jalapeño, Worcestershire, sriracha, sauerkraut, kouign-amann, sous vide (no hyphen), Instant Pot.
- "Pink salt" always means Himalayan pink salt; write it out in full in ingredient lists.
- Capitalize brands and proper nouns. Lowercase generic foods.

## Files, links & images

- New recipes go in `content/recipes/<slug>/index.md`, with photos in the same folder. Slugs are kebab-case: `garlic-bread`.
- Internal links use Zola paths, e.g. `[sous vide](@/sousvide.md)` or `[barbacoa](@/recipes/barbacoa/index.md)`.
- Images:
  - Use descriptive filenames: `finished.jpg`, `assembly.jpg`.
  - Every image needs `alt` text.
  - Width is 250 for inline photos and 500 for a hero or step-by-step photo.
- Link external sources inline, with descriptive link text, never a bare URL.
