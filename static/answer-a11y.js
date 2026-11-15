// answer-a11y.js -- screen reader support for Ximera answer boxes.
//
// Not part of stock Ximera. Every page loads this file; src/intent.cfg adds
// the two lines to the MathJax configuration that do so. Authors keep
// writing \answer{...} as before. Styling is in src/custom.css.
//
// What a screen reader gets from MathJax 4 is one element per formula,
// <mjx-speech role="img" aria-label="...">, holding MathJax's own speech.
// The typeset formula and the assistive MathML are both aria-hidden.
//
// (a) The answer box lives inside the typeset formula, so it is hidden too:
//     Tab reaches it, reading with the arrow keys does not. This script
//     takes aria-hidden off the chain of elements leading to the box and
//     puts it on everything beside that chain instead, and moves the speech
//     element first, so the reading order is: the formula, then the edit
//     box, then the Check button.
//
// (b) Feedback after checking. A line is written near the math: the
//     student's answer as MathML, then the verdict. NVDA reads a live region
//     as plain text ("x 2" for x squared), so the announcement itself is a
//     separate, invisible live region holding MathJax's speech for the
//     answer ("x squared plus 7 x minus 9 is not correct"). The same
//     sentence is the input's description.
//
// (c) Answer boxes inside a matrix or a vector. Every box would be called
//     just "answer". The script adds the position to the name of the box and
//     of its Check button ("answer, row 1, column 2"), and to the feedback
//     ("Row 1, column 2: 20 is not correct").

// The parser that turns typed text into LaTeX. It is the one the answer box
// uses, in the same version, but that copy is sealed inside ximera.js, so a
// second copy is fetched the first time it is needed.
const PARSER = 'https://cdn.jsdelivr.net/npm/math-expressions@2.0.0-alpha96/build/math-expressions.js';
let parserPromise;
function parser() {
  parserPromise ??= import(PARSER).then((module) => module.default);
  parserPromise.catch(() => { parserPromise = undefined; });
  return parserPromise;
}
// Start fetching it when an answer box is first used.
document.addEventListener('focusin', (event) => {
  if (event.target.matches?.('.ximera-answer-input')) parser().catch(() => {});
}, true);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- (a) make the answer box reachable in browse mode ------------------

function setHidden(el, hidden) {
  if (hidden) { if (el.getAttribute('aria-hidden') !== 'true') el.setAttribute('aria-hidden', 'true'); }
  else if (el.hasAttribute('aria-hidden')) el.removeAttribute('aria-hidden');
}

// Where a box sits, if it is inside a matrix or a vector: MathJax marks those
// with data-semantic-type. Tables used only for layout (aligned equations,
// cases) are not marked that way and get no position.
function position(group) {
  const cell = group.closest('mjx-mtd');
  const row = cell?.closest('mjx-mtr, mjx-mlabeledtr');
  const kind = cell?.closest('[data-semantic-type="matrix"], [data-semantic-type="vector"]');
  if (!cell || !row || !kind) return null;
  const isRow = (el) => el.matches('mjx-mtr, mjx-mlabeledtr');
  const rows = [...row.parentElement.children].filter(isRow);
  const cells = [...row.children].filter((el) => el.matches('mjx-mtd'));
  const r = rows.indexOf(row) + 1;
  const c = cells.indexOf(cell) + 1;
  if (rows.length > 1 && cells.length > 1) return `row ${r}, column ${c}`;
  if (rows.length > 1) return `entry ${r} of ${rows.length}`;
  if (cells.length > 1) return `entry ${c} of ${cells.length}`;
  return null;
}

function setName(el, name) {
  if (el && el.getAttribute('aria-label') !== name) el.setAttribute('aria-label', name);
}

function expose(container) {
  const groups = [...container.querySelectorAll('.ximera-input-group')];
  if (groups.length === 0) return;
  for (const group of groups) {
    const where = position(group);
    if (!where) continue;
    group.dataset.position = where;
    setName(group.querySelector('.ximera-answer-input'), `answer, ${where}`);
    setName(group.querySelector('.ximera-check-btn'), `check work, ${where}`);
  }
  // Every element between the formula's container and an answer box.
  const chain = new Set();
  for (const group of groups) {
    for (let n = group.parentElement; n && n !== container; n = n.parentElement) chain.add(n);
  }
  for (const el of chain) {
    setHidden(el, false);
    for (const child of el.children) {
      if (chain.has(child) || groups.includes(child)) continue;
      if (child.classList.contains('ximera-math-popover')) continue;
      setHidden(child, true);
    }
  }
  const speech = container.querySelector(':scope > mjx-speech');
  if (speech && container.firstElementChild !== speech) container.prepend(speech);
}

let exposeTimer;
function exposeAll() {
  clearTimeout(exposeTimer);
  exposeTimer = setTimeout(() => {
    const containers = new Set();
    for (const group of document.querySelectorAll('mjx-container .ximera-input-group')) {
      containers.add(group.closest('mjx-container'));
    }
    containers.forEach(expose);
  }, 50);
}
// The box is mounted, and MathJax attaches its speech, some time after the
// page loads; MathJax may also put aria-hidden back. Re-apply when needed.
new MutationObserver(exposeAll).observe(document.documentElement, {
  childList: true, subtree: true, attributes: true, attributeFilter: ['aria-hidden'],
});
exposeAll();

// ---- (b) feedback --------------------------------------------------------

const live = document.createElement('div');
live.className = 'ximera-sr-only';
live.setAttribute('role', 'status');
live.setAttribute('aria-live', 'polite');
live.setAttribute('aria-atomic', 'true');
// Off-screen place where MathJax typesets the answer to obtain its speech.
const scratch = document.createElement('div');
scratch.className = 'ximera-sr-only';
scratch.setAttribute('aria-hidden', 'true');
document.body.append(live, scratch);

// Typed text -> LaTeX, with the same parser and fallback order as the
// answer box. Returns null when the text cannot be read as math.
async function toLatex(text) {
  let Expression;
  try { Expression = await parser(); } catch { return null; }
  let latex;
  try { latex = Expression.fromText(text).tex(); }
  catch {
    try { latex = Expression.fromLatex(text).tex(); }
    catch { return null; }
  }
  // Where something is missing ("x^2+7x-") the parser puts a "＿" mark.
  return latex.replaceAll('＿', '\\text{blank}');
}

async function toMathML(latex) {
  try {
    const mml = await window.MathJax.tex2mmlPromise(latex, { display: false });
    const box = document.createElement('template');
    box.innerHTML = mml;
    const math = box.content.querySelector('math');
    if (!math) return null;
    // Keep plain MathML only: drop MathJax's bookkeeping attributes and
    // anything that could carry a link or a script.
    for (const node of [math, ...math.querySelectorAll('*')]) {
      for (const attr of [...node.attributes]) {
        const name = attr.name.toLowerCase();
        if (name.startsWith('data-') || name.startsWith('on') || name === 'href' || name === 'style') {
          node.removeAttribute(attr.name);
        }
      }
    }
    math.removeAttribute('display');
    return math;
  } catch { return null; }
}

// MathJax's speech for the expression, the same wording a screen reader
// hears for the other formulas on the page.
async function toSpeech(latex) {
  const holder = document.createElement('span');
  holder.textContent = `\\(${latex}\\)`;
  scratch.appendChild(holder);
  try {
    await window.MathJax.typesetPromise([holder]);
    // Speech is produced in a web worker after typesetting.
    for (let i = 0; i < 60; i++) {
      const label = holder.querySelector('mjx-container')?.getAttribute('data-semantic-speech-none');
      if (label) return label;
      await sleep(50);
    }
  } catch { /* no speech */ }
  finally {
    try { window.MathJax.typesetClear?.([holder]); } catch { /* ignore */ }
    holder.remove();
  }
  return null;
}

// Where the visible line goes: after displayed math; for an answer inside
// a sentence, after that paragraph, or at the end of the problem.
function place(input, line, description) {
  const answer = document.getElementById(input.dataset.answerId);
  const wrapper = answer?.closest('.ximera-math-with-answers');
  if (!wrapper) { (answer ?? input.closest('mjx-container')).after(line, description); return; }
  if (wrapper.querySelector('.mathjax-block, .mathjax-env')) { wrapper.after(line, description); return; }
  const paragraph = wrapper.closest('p');
  if (paragraph) paragraph.after(line, description);
  else wrapper.parentElement.append(line, description);
}

// Per answer box: a visible line after the math, and a hidden sentence
// that serves as the input's description.
function feedbackFor(input) {
  const id = input.dataset.answerId + '-feedback';
  let line = document.getElementById(id);
  if (!line) {
    line = document.createElement('div');
    line.id = id;
    line.className = 'ximera-answer-feedback';
    const description = document.createElement('span');
    description.id = id + '-description';
    description.hidden = true;
    place(input, line, description);
    input.setAttribute('aria-describedby', description.id);
  }
  return { line, description: document.getElementById(id + '-description') };
}

let clearTimer;
async function announce(sentence) {
  clearTimeout(clearTimer);
  live.textContent = '';
  await sleep(50);                  // empty -> text, so a repeat is announced
  live.textContent = sentence;
  // Once spoken, take it away so it is not met again when reading the page.
  clearTimer = setTimeout(() => { live.textContent = ''; }, 4000);
}

function show(input, shown, said, verdict, kind) {
  const { line, description } = feedbackFor(input);
  line.dataset.kind = kind;
  // Inside a matrix, say which entry this is about.
  const where = input.closest('.ximera-input-group')?.dataset.position;
  const lead = where ? where[0].toUpperCase() + where.slice(1) + ': ' : '';
  line.replaceChildren(...(shown === '' ? [lead + verdict] : [lead, shown, ' ' + verdict]));
  const sentence = lead + (said === '' ? verdict : `${said} ${verdict}`);
  description.textContent = sentence;
  announce(sentence);
}

// Speak only when the student actually checks (Enter or the Check button),
// not when the badge reappears while typing.
function onCheck(group) {
  const input = group?.querySelector('.ximera-answer-input');
  const btn = group?.querySelector('.ximera-check-btn');
  if (!input || !btn) return;
  const text = input.value.trim();
  if (text === '') {
    input.removeAttribute('aria-invalid');
    show(input, '', '', 'Please enter an answer.', 'incorrect');
    return;
  }
  setTimeout(async () => {
    const state = btn.dataset.state;
    if (state !== 'correct' && state !== 'attempted') return;
    // A text answer (format=string), or input that is not math, is given
    // as typed.
    const answer = document.getElementById(input.dataset.answerId);
    const latex = answer?.dataset.format === 'string' ? null : await toLatex(text);
    const math = latex ? await toMathML(latex) : null;
    const speech = latex ? await toSpeech(latex) : null;
    const correct = state === 'correct';
    input.setAttribute('aria-invalid', correct ? 'false' : 'true');
    show(input, math ?? text, speech ?? text,
      correct ? 'is correct!' : 'is not correct — try again.',
      correct ? 'correct' : 'incorrect');
  }, 100);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.target.matches?.('.ximera-answer-input')) {
    onCheck(event.target.closest('.ximera-input-group'));
  }
}, true);
document.addEventListener('click', (event) => {
  const btn = event.target.closest?.('.ximera-check-btn');
  if (btn) onCheck(btn.closest('.ximera-input-group'));
}, true);
