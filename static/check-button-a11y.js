// check-button-a11y.js
//
// Makes the result of a question something a screen reader can read on the
// Check button, not only see.
//
// After an answer is checked, Ximera turns the Check button green with a
// check mark, or red with a cross. That is done with colour and an icon
// only: to a screen reader the button is still called "check answer". The
// result is spoken once, when the answer is checked; a reader who comes
// back to the question later hears "check answer, button" whether it is
// solved or not.
//
// This file keeps the button's name in step with what it shows:
//   * not checked yet:  "check answer" (as Ximera names it);
//   * correct:          "Correct". The button is also reported as
//                       unavailable ("dimmed"), since nothing is left to
//                       do, and a button with the word "Check" on it shows
//                       "Correct" instead;
//   * incorrect:        "Incorrect. Check answer again";
//   * a free response that has been submitted: "Response submitted".
// For an answer box inside a matrix the position follows, as before:
// "Correct, row 1, column 2".
//
// It covers every Check button: answer boxes, multipleChoice, selectAll
// and freeResponse. (\wordChoice has no button; see word-choice-a11y.js.)
//
// Loaded by answer-a11y.js. Nothing changes in how questions are written.

const info = new WeakMap();   // button -> { verb, where, text }

function about(btn) {
  let entry = info.get(btn);
  if (!entry) {
    entry = {
      // Ximera's own name for the button, read before this file changes it.
      verb: btn.getAttribute('aria-label') ||
        (btn.classList.contains('ximera-submit-btn') ? 'submit response' : 'check answer'),
      where: '',
      // The word on the button, if it has one (the small "?" button has none).
      text: btn.textContent.trim(),
    };
    info.set(btn, entry);
  }
  return entry;
}

function set(el, attribute, value) {
  if (value == null) { if (el.hasAttribute(attribute)) el.removeAttribute(attribute); }
  else if (el.getAttribute(attribute) !== value) el.setAttribute(attribute, value);
}

const capital = (words) => words.charAt(0).toUpperCase() + words.slice(1);

function update(btn) {
  const entry = about(btn);
  const state = btn.dataset.state || '';
  const where = entry.where ? ', ' + entry.where : '';
  const submit = btn.classList.contains('ximera-submit-btn');
  let name = entry.verb + where;
  let text = entry.text;
  let locked = false;
  if (state === 'correct' && submit) {
    name = 'Response submitted' + where;
  } else if (state === 'correct') {
    name = 'Correct' + where;
    if (text) text = 'Correct';
    locked = true;
  } else if (state === 'attempted' || state === 'incorrect') {
    name = `Incorrect. ${capital(entry.verb)} again${where}`;
  }
  set(btn, 'aria-label', name);
  set(btn, 'aria-disabled', locked ? 'true' : null);
  if (entry.text && btn.textContent !== text) btn.textContent = text;
}

// For answer-a11y.js: a button in a matrix is "check work, row 1, column 2".
export function describeCheckButton(btn, verb, where) {
  if (!btn) return;
  const entry = about(btn);
  entry.verb = verb;
  entry.where = where || '';
  update(btn);
}

const BUTTONS = '.ximera-check-btn, .ximera-submit-btn';

function updateAll(root) {
  if (root.matches?.(BUTTONS)) update(root);
  root.querySelectorAll?.(BUTTONS).forEach(update);
}

new MutationObserver((records) => {
  for (const record of records) {
    if (record.type === 'attributes') {
      if (record.target.matches?.(BUTTONS)) update(record.target);
    } else {
      record.addedNodes.forEach(updateAll);
    }
  }
}).observe(document.documentElement, {
  attributes: true, attributeFilter: ['data-state'], childList: true, subtree: true,
});
updateAll(document);
