// word-choice-a11y.js
//
// Makes the drop-down list of \wordChoice usable with a screen reader and
// with the keyboard.
//
// Ximera builds the list from <span> elements (not a native <select>, so
// that a choice can hold a formula): a <span role="combobox"> showing the
// chosen answer, and inside it a <span role="listbox"> with one
// <span role="option"> for each \choice. As it comes from Ximera:
//   * the list has no name, so a screen reader says only "combo box";
//   * with nothing chosen it shows a dash, read as "dash" or not at all;
//   * right and wrong are shown by colour only and never spoken;
//   * choosing with Enter or Space opens the list again, and after a
//     correct answer the keyboard focus is lost;
//   * a correct answer can no longer be reached with Tab;
//   * Home, End and typing a letter do nothing, and Tab leaves the list
//     hanging open.
//
// This file keeps Ximera's elements and its checking, and takes over the
// keyboard and the mouse clicks on the list:
//   * the list is named ("Choose the missing word"; \xmaWordChoiceWord in
//     the preamble changes it);
//   * the keyboard focus stays on the list itself while the arrow keys move
//     through the choices (aria-activedescendant), so it cannot be lost;
//   * Enter, Space, the arrow keys or Alt+Down open the list; arrow keys,
//     Home, End or a typed letter move; Enter or Space choose; Escape, Tab
//     or Alt+Up close without choosing;
//   * "Correct." or "Incorrect. Try another choice." is spoken after a
//     choice, and "correct" or "incorrect" stays attached to the list as its
//     description;
//   * an empty list says "no answer chosen";
//   * a correct answer stays reachable with Tab, and is reported as
//     unavailable because it can no longer be changed.
//
// Ximera still does the checking: choosing here clicks Ximera's own option.
//
// Loaded by answer-a11y.js. Nothing changes in how \wordChoice is written.
// The matching styles are in src/custom.css.

import { announce } from './choice-a11y.js';

const DEFAULT_LABEL = 'Choose the missing word';
const EMPTY_TEXT = 'no answer chosen';

const done = new WeakSet();
let counter = 0;

function upgrade(el) {
  if (done.has(el)) return;
  const widget = el.querySelector('.ximera-word-select');
  const panel = widget?.querySelector('.ximera-word-select__panel');
  const display = widget?.querySelector('.ximera-word-select__display');
  if (!widget || !panel || !display) return;      // Ximera has not set it up yet
  done.add(el);

  const base = el.id || 'xm-word-choice-' + (++counter);
  const label = el.dataset.xmLabel || DEFAULT_LABEL;
  const options = [...panel.querySelectorAll('.ximera-word-option')];

  panel.id = base + '-list';
  panel.setAttribute('aria-label', label);
  widget.setAttribute('aria-label', label);
  widget.setAttribute('aria-controls', panel.id);
  options.forEach((opt, i) => {
    opt.id = base + '-option-' + (i + 1);
    // The focus stays on the list itself, so an option must not take it.
    opt.removeAttribute('tabindex');
  });

  // "correct" or "incorrect", read after the name and the chosen answer.
  const status = document.createElement('span');
  status.id = base + '-status';
  status.className = 'ximera-sr-only';
  el.append(status);
  widget.setAttribute('aria-describedby', status.id);

  const isOpen = () => !panel.hidden;
  const isLocked = () => widget.getAttribute('aria-disabled') === 'true';
  const active = () => options.find((opt) => opt.classList.contains('xm-active'));

  function setActive(opt) {
    options.forEach((o) => o.classList.toggle('xm-active', o === opt));
    if (opt) {
      widget.setAttribute('aria-activedescendant', opt.id);
      opt.scrollIntoView?.({ block: 'nearest' });
    } else {
      widget.removeAttribute('aria-activedescendant');
    }
  }

  function open(opt) {
    if (isLocked()) return;
    panel.hidden = false;
    widget.setAttribute('aria-expanded', 'true');
    setActive(opt || options.find((o) => o.getAttribute('aria-selected') === 'true') || options[0]);
  }

  function close() {
    panel.hidden = true;
    widget.setAttribute('aria-expanded', 'false');
    setActive(null);
  }

  // Typing letters moves to the choice that starts with them.
  let typed = '';
  let typedTimer;
  function typeAhead(char) {
    clearTimeout(typedTimer);
    typed += char.toLowerCase();
    typedTimer = setTimeout(() => { typed = ''; }, 600);
    const start = options.indexOf(active());
    // One letter, pressed again, moves on to the next choice with that letter.
    const from = typed.length === 1 ? start + 1 : Math.max(start, 0);
    for (let i = 0; i < options.length; i++) {
      const opt = options[(from + i) % options.length];
      if (opt.textContent.trim().toLowerCase().startsWith(typed)) return opt;
    }
    return null;
  }

  // These listeners sit on the element around Ximera's list and run on the
  // way down to it, so they act before Ximera's own listeners and can keep
  // an event away from them.
  el.addEventListener('keydown', (e) => {
    if (!widget.contains(e.target)) return;
    e.stopPropagation();                     // Ximera's key handling is replaced
    if (e.ctrlKey || e.metaKey) return;
    if (isLocked()) return;
    const key = e.key;
    if (e.altKey) {
      // The usual Windows keys for a drop-down list: Alt+Down opens it and
      // Alt+Up closes it. Closing does not choose, since choosing here is
      // also what gets the answer checked.
      if (key === 'ArrowDown' && !isOpen()) { e.preventDefault(); open(); }
      else if (key === 'ArrowUp' && isOpen()) { e.preventDefault(); close(); }
      return;
    }
    const letter = key.length === 1 && key !== ' ';

    if (!isOpen()) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        open();
      } else if (key === 'Home') { e.preventDefault(); open(options[0]); }
      else if (key === 'End') { e.preventDefault(); open(options[options.length - 1]); }
      else if (letter) {
        const opt = typeAhead(key);
        if (opt) { e.preventDefault(); open(opt); }
      }
      return;
    }

    const i = options.indexOf(active());
    if (key === 'ArrowDown') { e.preventDefault(); setActive(options[Math.min(i + 1, options.length - 1)]); }
    else if (key === 'ArrowUp') { e.preventDefault(); setActive(options[Math.max(i - 1, 0)]); }
    else if (key === 'Home') { e.preventDefault(); setActive(options[0]); }
    else if (key === 'End') { e.preventDefault(); setActive(options[options.length - 1]); }
    else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      const opt = active();
      close();
      // Ximera's own click handler on the option records and checks it.
      if (opt) opt.click();
    }
    else if (key === 'Escape') { e.preventDefault(); close(); }
    else if (key === 'Tab') close();         // moving on is not an answer
    else if (letter) {
      const opt = typeAhead(key);
      if (opt) { e.preventDefault(); setActive(opt); }
    }
  }, true);

  el.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) return;
    if (e.target.closest('.ximera-word-option')) {
      // A choice was made, by mouse or by the Enter key above. Let Ximera
      // hear this click, then report the result and keep the focus.
      setTimeout(() => {
        setActive(null);
        widget.focus();
        const state = el.dataset.state || '';
        if (/\bcorrect\b/.test(state)) announce('Correct.');
        else if (state) announce('Incorrect. Try another choice.');
      }, 60);
      return;
    }
    // A click on the list itself: open or close it here. Ximera would move
    // the focus onto the first choice.
    e.stopPropagation();
    if (isOpen()) close(); else open();
    widget.focus();
  }, true);

  // Moving the pointer over a choice marks it, as the arrow keys do.
  panel.addEventListener('mousemove', (e) => {
    const opt = e.target.closest('.ximera-word-option');
    if (opt && opt !== active()) setActive(opt);
  });

  widget.addEventListener('focusout', (e) => {
    if (isOpen() && !widget.contains(e.relatedTarget)) close();
  });

  // Ximera redraws the list whenever its state changes. Put back what the
  // redraw takes away, and keep the description in step.
  function sync() {
    if (!widget.hasAttribute('tabindex')) widget.setAttribute('tabindex', '0');
    if (panel.hidden && widget.hasAttribute('aria-activedescendant')) setActive(null);

    const state = el.dataset.state || '';
    const text = /\bcorrect\b/.test(state) ? 'correct' : state ? 'incorrect' : '';
    if (status.textContent !== text) status.textContent = text;

    // Nothing chosen: keep the dash on screen, and give it words.
    if (!widget.dataset.chosen && !display.querySelector('.ximera-sr-only')) {
      const dash = document.createElement('span');
      dash.setAttribute('aria-hidden', 'true');
      dash.textContent = '—';
      const words = document.createElement('span');
      words.className = 'ximera-sr-only';
      words.textContent = EMPTY_TEXT;
      display.replaceChildren(dash, words);
    }
  }
  new MutationObserver(sync).observe(el, {
    attributes: true, childList: true, subtree: true,
    attributeFilter: ['data-state', 'data-chosen', 'tabindex', 'hidden', 'aria-disabled'],
  });
  sync();
}

function upgradeAll() {
  document.querySelectorAll('.word-choice').forEach(upgrade);
}

upgradeAll();
new MutationObserver(upgradeAll).observe(document.documentElement, { childList: true, subtree: true });
