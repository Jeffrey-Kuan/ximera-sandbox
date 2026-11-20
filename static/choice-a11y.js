// choice-a11y.js
//
// Turns the choices of a multipleChoice question into ordinary radio buttons.
//
// Ximera draws each \choice as <span role="radio" tabindex="0">. That is a
// hand-made radio button: every choice is a separate Tab stop, the arrow keys
// do nothing, and the group has no name, so a screen reader does not say
// which question the choices belong to.
//
// This file puts a real <input type="radio"> and a <label> inside each
// choice and takes the hand-made role off. The browser then supplies the
// usual behaviour: one Tab stop for the group, arrow keys to move, "radio
// button, 2 of 3". The group is named after the question in front of it, and
// pressing Check announces "Correct" or "Incorrect".
//
// Ximera still does the checking. A click on a radio button reaches Ximera's
// own handler on the surrounding <span class="choice">, and this file copies
// Ximera's state (chosen, ruled out, solved) back onto the radio buttons.
//
// Loaded by answer-a11y.js. Nothing changes in how \choice is written.

const done = new WeakSet();
let counter = 0;

const live = document.createElement('div');
live.className = 'ximera-sr-only';
live.setAttribute('role', 'status');
live.setAttribute('aria-live', 'polite');
live.setAttribute('aria-atomic', 'true');
document.body.append(live);

let clearTimer;
function announce(sentence) {
  clearTimeout(clearTimer);
  live.textContent = '';
  setTimeout(() => { live.textContent = sentence; }, 50);
  clearTimer = setTimeout(() => { live.textContent = ''; }, 4000);
}

function isBlock(node) {
  return node.nodeType === 1 &&
    /^(DIV|P|UL|OL|DL|TABLE|FIGURE|H[1-6]|PRE|BLOCKQUOTE|HR)$/.test(node.tagName);
}

// The question: the paragraph, or the run of text, just before the choices.
function questionIds(group) {
  let node = group.previousSibling;
  while (node && node.nodeType !== 1 && !node.textContent.trim()) node = node.previousSibling;
  if (!node) return '';
  if (node.nodeType === 1 && node.tagName === 'P') {
    if (!node.id) node.id = 'xm-question-' + (++counter);
    return node.id;
  }
  if (isBlock(node)) return '';
  const run = [];
  while (node && !isBlock(node)) { run.unshift(node); node = node.previousSibling; }
  const wrap = document.createElement('span');
  wrap.id = 'xm-question-' + (++counter);
  run[0].before(wrap);
  wrap.append(...run);
  return wrap.id;
}

function sync(group) {
  const solved = /\bcorrect\b/.test(group.dataset.state || '');
  group.querySelectorAll('.choice').forEach((choice) => {
    const input = choice.querySelector('input.xm-choice-input');
    if (!input) return;
    const state = choice.dataset.state || '';
    input.checked = /\bselected\b/.test(state);
    input.disabled = solved || /\beliminated\b/.test(state);
    // Ximera keeps writing aria-checked on the span, which has no role any
    // more. The radio button carries that information now.
    if (choice.hasAttribute('aria-checked')) choice.removeAttribute('aria-checked');
  });
}

function upgrade(group) {
  if (done.has(group)) return;
  const check = group.querySelector('.ximera-check-btn');
  if (!check) return;                       // Ximera has not set it up yet
  done.add(group);

  const ids = questionIds(group);
  if (ids) group.setAttribute('aria-labelledby', ids);
  else group.setAttribute('aria-label', 'Multiple choice');

  const name = (group.id || 'xm-choices-' + (++counter)) + '-choice';
  group.querySelectorAll('.choice').forEach((choice) => {
    if (!choice.id) return;
    choice.removeAttribute('role');
    choice.removeAttribute('tabindex');

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.id = choice.id + '-input';
    input.className = 'xm-choice-input';

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.className = 'xm-choice-label';
    label.append(...choice.childNodes);
    // A click on the label is passed on to the radio button by the browser.
    // Stop the label's own click here so that Ximera hears one click, not two.
    label.addEventListener('click', (e) => e.stopPropagation());

    choice.append(input, label);
  });

  // A click that Ximera ignores (question already solved) must not leave the
  // radio buttons showing something else.
  group.addEventListener('click', () => setTimeout(() => sync(group), 0));

  check.addEventListener('click', () => setTimeout(() => {
    const state = group.dataset.state || '';
    if (/\bcorrect\b/.test(state)) announce('Correct.');
    else if (group.querySelector('.choice[data-state~="selected"]')) announce('Incorrect. Try another choice.');
    else announce('Choose an answer first.');
  }, 60));

  new MutationObserver(() => sync(group)).observe(group, {
    attributes: true, subtree: true, attributeFilter: ['data-state', 'aria-checked'],
  });
  sync(group);
}

function upgradeAll() {
  document.querySelectorAll('.multiple-choice').forEach(upgrade);
}

upgradeAll();
new MutationObserver(upgradeAll).observe(document.documentElement, { childList: true, subtree: true });
