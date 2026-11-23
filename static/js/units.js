// Unit and portion selector for recipe pages.
// Finds quantities in the "Ingredients" lists, in {{ q(...) }} shortcode spans,
// and temperatures like 350°F anywhere in the recipe, then re-renders them for
// the chosen unit system (metric by default, or US) and scale factor.
(function () {
  'use strict';

  var content = document.querySelector('article .content');
  var bar = document.getElementById('scale-bar');
  if (!content || !bar) return;

  // ---- units -------------------------------------------------------------
  var UNITS = {
    g: ['m', 1], kg: ['m', 1000], oz: ['m', 28.3495], lb: ['m', 453.592], lbs: ['m', 453.592],
    ml: ['v', 1], mL: ['v', 1], L: ['v', 1000],
    t: ['v', 4.92892], T: ['v', 14.7868], C: ['v', 236.588],
    'fl oz': ['v', 29.5735], pint: ['v', 473.176]
  };
  var US = { oz: 1, lb: 1, lbs: 1, t: 1, T: 1, C: 1, 'fl oz': 1, pint: 1 };

  // Grams per US cup, matched against the ingredient name (first match wins).
  var DENSITY = [
    ['powdered sugar', 120], ['brown sugar', 220], ['sugar', 200],
    ['flour', 125], ['cornstarch', 128], ['corn starch', 128],
    ['cream cheese', 232], ['parmesan', 100], ['cheese', 113],
    ['butter', 227], ['oats', 90], ['honey', 340], ['oil', 218],
    ['cocoa', 85], ['rice', 185], ['cranberries', 120], ['raisins', 145],
    ['pistachios', 123], ['chocolate chips', 170], ['pumpkin', 245],
    ['yogurt', 245], ['rhubarb', 122], ['strawberries', 152]
  ];

  var FRAC_CHARS = { '½': 0.5, '¼': 0.25, '¾': 0.75, '⅓': 1 / 3, '⅔': 2 / 3, '⅛': 0.125 };
  var NUM = '(?:\\d+\\s+\\d+/\\d+|\\d+\\s*[½¼¾⅓⅔⅛]|\\d+/\\d+|\\d*\\.\\d+|\\d+|[½¼¾⅓⅔⅛])';
  var UNIT = '(fl oz|kg|g|mL|ml|L|lbs|lb|oz|pint|C|T|t)(?![A-Za-z])';
  var LEAD = new RegExp('^(\\s*~?\\s*)(' + NUM + ')(?:\\s*[-–]\\s*(' + NUM + '))?(?:\\s*' + UNIT + ')?');
  var ALT = new RegExp('\\((' + NUM + ')(?:\\s*[-–]\\s*(' + NUM + '))?\\s*' + UNIT + '\\)');
  var TEMP = /(\d{2,3}(?:\.\d+)?)\s?°\s?([FC])(?![A-Za-z])/g;

  function parseNum(s) {
    s = String(s).trim();
    if (FRAC_CHARS[s] !== undefined) return FRAC_CHARS[s];
    var m;
    if ((m = s.match(/^(\d+)\s*([½¼¾⅓⅔⅛])$/))) return +m[1] + FRAC_CHARS[m[2]];
    if ((m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/))) return +m[1] + m[2] / m[3];
    if ((m = s.match(/^(\d+)\/(\d+)$/))) return m[1] / m[2];
    return parseFloat(s);
  }

  // ---- formatting --------------------------------------------------------
  var FRACS = [[0, ''], [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½'], [2 / 3, '⅔'], [0.75, '¾'], [1, '']];

  function fmtFrac(x) {
    var w = Math.floor(x + 1e-9), f = x - w, best = FRACS[0];
    FRACS.forEach(function (c) { if (Math.abs(c[0] - f) < Math.abs(best[0] - f)) best = c; });
    if (best[0] === 1) w += 1;
    var s = (w ? String(w) : '') + best[1];
    return s || '⅛';
  }

  function fmtCount(x) {
    return x >= 10 ? String(Math.round(x)) : fmtFrac(Math.round(x * 2) / 2);
  }

  function roundMetric(v) {
    if (v < 10) return String(Math.round(v * 2) / 2);
    if (v < 30) return String(Math.round(v));
    if (v < 100) return String(Math.round(v / 5) * 5);
    return String(Math.round(v / 10) * 10);
  }

  function oneDecimal(v) { return v.toFixed(1).replace(/\.0$/, ''); }

  function density(what) {
    what = (what || '').toLowerCase();
    for (var i = 0; i < DENSITY.length; i++) if (what.indexOf(DENSITY[i][0]) !== -1) return DENSITY[i][1];
    return null;
  }

  // Returns [number string, unit string] for one value in the chosen mode.
  function convert(value, unit, mode, what, grams) {
    if (!unit) return [fmtCount(value), ''];
    var u = UNITS[unit], base = value * u[1];

    if (mode === 'metric') {
      if (u[0] === 'v' && (unit === 't' || unit === 'T')) return [fmtFrac(value), unit];
      if (u[0] === 'v' && US[unit]) {
        var d = density(what);
        if (grams) base = grams; else if (d) base = base / 236.588 * d;
        if (grams || d) return base >= 1000 ? [oneDecimal(base / 1000), 'kg'] : [roundMetric(base), 'g'];
      }
      if (u[0] === 'm') return base >= 1000 ? [oneDecimal(base / 1000), 'kg'] : [roundMetric(base), 'g'];
      return base >= 1000 ? [oneDecimal(base / 1000), 'L'] : [roundMetric(base), 'ml'];
    }

    // US
    if (u[0] === 'm') {
      var oz = base / 28.3495;
      if (Math.round(oz) >= 16) return [fmtFrac(Math.round(oz / 16 * 4) / 4), 'lb'];
      return [oz < 4 ? fmtFrac(Math.round(oz * 2) / 2) : String(Math.round(oz)), 'oz'];
    }
    if (base < 14) return [fmtFrac(base / 4.92892), 't'];
    if (base < 59) return [fmtFrac(base / 14.7868), 'T'];
    return [fmtFrac(base / 236.588), 'C'];
  }

  // ---- marking up quantities -----------------------------------------------
  function qtySpan(d, text) {
    var s = document.createElement('span');
    s.className = 'qty';
    Object.keys(d).forEach(function (k) { if (d[k] !== undefined && d[k] !== null) s.dataset[k] = d[k]; });
    s.textContent = text;
    return s;
  }

  function markListItem(li) {
    var node = li.firstChild;
    if (!node || node.nodeType !== 3) return;
    var text = node.nodeValue, m = LEAD.exec(text);
    if (!m) return;
    var unit = m[4] || '', rest = text.slice(m[0].length);
    var what = rest.replace(/^\s*(of\s+)?/, '').split(/[,(]/)[0].trim();
    var frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(m[1]));
    frag.appendChild(qtySpan({ a: m[2], b: m[3], u: unit, what: what, role: 'primary' }, m[0].slice(m[1].length)));

    var am = ALT.exec(rest);
    if (am) {
      // Keep the space before "(" inside the span, so hiding it leaves no stray gap.
      var before = rest.slice(0, am.index), lead = before.match(/\s*$/)[0];
      frag.appendChild(document.createTextNode(before.slice(0, before.length - lead.length)));
      // "(10 lb)" after "4.5 kg" is an equivalent; "(14 oz)" after "1 can" is a package size.
      frag.appendChild(qtySpan({ a: am[1], b: am[2], u: am[3], role: unit ? 'alt' : 'pkg', paren: lead || '' }, lead + am[0]));
      rest = rest.slice(am.index + am[0].length);
    }
    frag.appendChild(document.createTextNode(rest));
    li.replaceChild(frag, node);
  }

  content.querySelectorAll('h3').forEach(function (h) {
    if (!/^\s*ingredients\s*$/i.test(h.textContent)) return;
    for (var el = h.nextElementSibling; el && !/^H[1-3]$/.test(el.tagName); el = el.nextElementSibling) {
      if (el.tagName === 'UL' || el.tagName === 'OL') el.querySelectorAll('li').forEach(markListItem);
    }
  });

  // Temperatures anywhere in the recipe text.
  var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null), textNodes = [];
  while (walker.nextNode()) {
    var n = walker.currentNode;
    if (!n.parentElement.closest('.qty, .temp, code, pre') && /°\s?[FC]/.test(n.nodeValue)) textNodes.push(n);
  }
  textNodes.forEach(function (n) {
    var frag = document.createDocumentFragment(), text = n.nodeValue, last = 0, m;
    TEMP.lastIndex = 0;
    while ((m = TEMP.exec(text))) {
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var s = document.createElement('span');
      s.className = 'temp';
      s.dataset.v = m[1];
      s.dataset.u = m[2];
      s.dataset.orig = m[0];
      s.textContent = m[0];
      frag.appendChild(s);
      last = TEMP.lastIndex;
    }
    frag.appendChild(document.createTextNode(text.slice(last)));
    n.parentNode.replaceChild(frag, n);
  });

  var qtys = content.querySelectorAll('.qty'), temps = content.querySelectorAll('.temp');
  if (!qtys.length && !temps.length) return;

  // ---- rendering -----------------------------------------------------------
  function renderQty(s, mode, factor) {
    var d = s.dataset;
    // An equivalent like "(10 lb)" is redundant once amounts are converted.
    if (d.role === 'alt') { s.hidden = true; return; }
    var scale = d.role === 'pkg' ? 1 : factor;
    var lo = parseNum(d.a) * scale, hi = d.b ? parseNum(d.b) * scale : null;
    var grams = d.g && !hi ? parseFloat(d.g) * scale : null;
    var a = convert(lo, d.u, mode, d.what, grams), out;
    if (hi !== null) {
      var b = convert(hi, d.u, mode, d.what, null);
      out = a[1] === b[1] ? a[0] + '–' + b[0] + (b[1] ? ' ' + b[1] : '') : a.join(' ') + ' – ' + b.join(' ');
    } else {
      out = a[0] + (a[1] ? ' ' + a[1] : '');
    }
    s.textContent = d.paren !== undefined ? d.paren + '(' + out + ')' : out;
  }

  function renderTemp(s, mode) {
    var v = parseFloat(s.dataset.v), u = s.dataset.u;
    if ((mode === 'metric' && u === 'C') || (mode === 'us' && u === 'F')) {
      s.textContent = s.dataset.orig;
    } else if (mode === 'metric') {
      var c = (v - 32) * 5 / 9;
      s.textContent = (c >= 100 ? Math.round(c / 10) * 10 : Math.round(c)) + '°C';
    } else {
      var f = v * 9 / 5 + 32;
      s.textContent = (v >= 100 ? Math.round(f / 25) * 25 : Math.round(f)) + '°F';
    }
  }

  // ---- controls ------------------------------------------------------------
  var KEY = 'foodie.units', mode = 'metric', factor = 1;
  try { if (localStorage.getItem(KEY) === 'us') mode = 'us'; } catch (e) { /* storage unavailable */ }
  var servings = parseFloat(bar.dataset.servings) || null;

  function group(label, options, current, onPick) {
    var wrap = document.createElement('div');
    wrap.className = 'scale-group';
    var l = document.createElement('span');
    l.className = 'scale-label';
    l.textContent = label;
    wrap.appendChild(l);
    var btns = document.createElement('div');
    btns.className = 'buttons has-addons are-small';
    options.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'button' + (o[0] === current ? ' is-info is-selected' : '');
      b.textContent = o[1];
      b.addEventListener('click', function () {
        btns.querySelectorAll('.button').forEach(function (x) { x.classList.remove('is-info', 'is-selected'); });
        b.classList.add('is-info', 'is-selected');
        onPick(o[0]);
      });
      btns.appendChild(b);
    });
    wrap.appendChild(btns);
    return wrap;
  }

  var note = document.createElement('span');
  note.className = 'scale-note';

  function render() {
    qtys.forEach(function (s) { renderQty(s, mode, factor); });
    temps.forEach(function (s) { renderTemp(s, mode); });
    var parts = [];
    if (servings) parts.push('Serves ' + fmtCount(servings * factor));
    if (factor !== 1) parts.push('Times and pan sizes don’t scale.');
    note.textContent = parts.join(' · ');
  }

  bar.appendChild(group('Units', [['metric', 'Metric'], ['us', 'US']], mode, function (v) {
    mode = v;
    try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ }
    render();
  }));
  if (qtys.length) {
    bar.appendChild(group('Amount', [[0.5, '½×'], [1, '1×'], [2, '2×'], [3, '3×']], factor, function (v) {
      factor = v;
      render();
    }));
  }
  bar.appendChild(note);
  bar.hidden = false;
  render();
})();
