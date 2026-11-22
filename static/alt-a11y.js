// alt-a11y.js
//
// Gives each picture its description as real alternative text.
//
// \xmalt{...} puts the description on the page in a "Show Alt Text" block
// under the picture. That block is for people who can see the page. The
// picture itself is left without a usable name: a photo arrives with
// alt="PIC", and a drawn picture (TikZ, an inline <svg>) with no name at
// all, so a screen reader says "PIC" or reads loose labels from inside the
// drawing.
//
// This file copies the description to where a screen reader looks for it:
//   * a photo (<img>) gets it as its alt attribute;
//   * a drawing (<svg>) gets role="img" and aria-label;
//   * Ximera's wrapper around an image, which claims role="img" itself and
//     points at a label that does not exist, gets the description too.
// The "Show Alt Text" block stays as it is.
//
// A description is given to the nearest picture before it, and each picture
// takes one description only.
//
// Loaded by answer-a11y.js.

const described = new WeakSet();
const used = new WeakSet();

function pictures() {
  const root = document.querySelector('main') || document.body;
  return [...root.querySelectorAll('img, svg')].filter(
    (el) => !el.closest('mjx-container, button, summary, .ximera-chrome, nav, header')
  );
}

function describe(details) {
  if (described.has(details)) return;
  const summary = details.querySelector('summary');
  if (!summary || !/alt text/i.test(summary.textContent)) return;
  const copy = details.cloneNode(true);
  copy.querySelector('summary').remove();
  copy.querySelectorAll('mjx-assistive-mml').forEach((n) => n.remove());
  const text = copy.textContent.replace(/\s+/g, ' ').trim();
  if (!text) return;

  // The nearest picture that comes before this block and is not yet described.
  let target = null;
  for (const pic of pictures()) {
    const before = pic.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING;
    if (before && !used.has(pic)) target = pic;
    if (!before) break;
  }
  if (!target) return;
  described.add(details);
  used.add(target);

  if (target.tagName.toLowerCase() === 'img') {
    target.alt = text;
  } else {
    target.setAttribute('role', 'img');
    target.setAttribute('aria-label', text);
  }
  const wrapper = target.closest('.image-environment[role="img"]');
  if (wrapper) {
    const ref = wrapper.getAttribute('aria-labelledby');
    if (!ref || !document.getElementById(ref)) {
      wrapper.removeAttribute('aria-labelledby');
      wrapper.setAttribute('aria-label', text);
    }
  }
}

function describeAll() {
  document.querySelectorAll('details').forEach(describe);
}

describeAll();
new MutationObserver(describeAll).observe(document.documentElement, { childList: true, subtree: true });
