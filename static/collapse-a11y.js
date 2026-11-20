// collapse-a11y.js
//
// Opens and closes expandable, accordion-item and hint.
//
// The page arrives with each of these as a heading followed by its panel:
//
//   <h4 class="accordion-header">A worked example</h4>
//   <div id="accordion-item13" class="accordion-item">...</div>
//
// (the markup comes from latex/xm-a11y.4ht; the heading level depends on
// where the piece stands). Nothing in the npm version of Ximera makes such a
// pair open and close, so without this file the panel is simply always shown.
//
// This file follows the usual accordion pattern: the heading stays a heading,
// so heading navigation finds it at the right level, and its text is put in
// a <button aria-expanded aria-controls> that shows and hides the panel.
// Panels start closed. A closed panel is still found by the browser's
// "find in page" where the browser supports that, and opens when it is.
//
// Without JavaScript nothing is hidden: the headings and panels are all
// there to read.
//
// Loaded by answer-a11y.js.

const done = new WeakSet();
let counter = 0;

function setOpen(button, panel, open) {
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) panel.removeAttribute('hidden');
  else panel.setAttribute('hidden', 'until-found');
}

function upgrade(header) {
  if (done.has(header)) return;
  const panel = header.nextElementSibling;
  if (!panel || !panel.classList.contains('accordion-item')) return;
  done.add(header);

  if (!panel.id) panel.id = 'xm-panel-' + (++counter);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'xm-accordion-button';
  button.setAttribute('aria-controls', panel.id);
  button.append(...header.childNodes);
  header.append(button);

  setOpen(button, panel, false);
  button.addEventListener('click', () => {
    setOpen(button, panel, button.getAttribute('aria-expanded') !== 'true');
  });
  // The browser found text inside a closed panel and is about to show it.
  panel.addEventListener('beforematch', () => setOpen(button, panel, true));
}

function upgradeAll() {
  document.querySelectorAll('.accordion-header').forEach(upgrade);
}

upgradeAll();
new MutationObserver(upgradeAll).observe(document.documentElement, { childList: true, subtree: true });
