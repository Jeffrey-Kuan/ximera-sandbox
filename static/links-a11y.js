// links-a11y.js -- links within the page: equation numbers, and where the
// keyboard focus goes.
//
// Loaded by answer-a11y.js. Nothing changes in how \ref, \eqref or \cite
// are written. The LaTeX side is latex/xm-links.4ht.
//
// 1. Links to equations. Ximera writes \ref{eq:one} as a link whose text is
//    the label's name ("eq:one") and whose target sits after the equation;
//    in an align only the first label gets a target at all. MathJax,
//    though, numbers every equation on the page, each row of an align
//    included, and marks each number with an id (mjx-eqn:eq:one). So, once
//    MathJax is done, each link to an equation gets MathJax's number as its
//    text, "(1)" for \eqref and "1" for \ref, and MathJax's number as its
//    target.
//
// 2. Focus. Following a link within the page only scrolled: the keyboard
//    focus, and with it a screen reader, stayed at the link. Now the focus
//    moves to what the link points to: the equation (which a screen reader
//    then reads), the section heading, the theorem, the entry of the
//    bibliography.

const HEADING = 'h1, h2, h3, h4, h5, h6';

function targetOf(link) {
  const href = link.getAttribute('href') || '';
  if (!href.startsWith('#') || href.length < 2) return null;
  let id;
  try { id = decodeURIComponent(href.slice(1)); } catch { id = href.slice(1); }
  return document.getElementById(id);
}

// ---- 1. equation numbers ------------------------------------------------------
function numberEquationLinks() {
  for (const link of document.querySelectorAll('a.reference[href^="#"]')) {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    if (id.startsWith('mjx-eqn:')) continue;            // done already
    const tag = document.getElementById('mjx-eqn:' + id);
    if (!tag) continue;                                  // not an equation
    const shown = tag.textContent.trim();                // "(1)"
    const m = shown.match(/^\((.*)\)$/);
    link.textContent = m ? m[1] : shown;                 // \eqref adds ( )
    link.setAttribute('href', '#mjx-eqn:' + id);
  }
}

function whenMathJaxIsDone(fn) {
  let tries = 0;
  const wait = () => {
    const p = window.MathJax?.startup?.promise;
    if (p) { p.then(fn, fn); return; }
    if (++tries < 100) setTimeout(wait, 100);            // MathJax loads async
  };
  wait();
}
whenMathJaxIsDone(numberEquationLinks);

// ---- 2. focus -------------------------------------------------------------------
// The element that should get the focus for a link's target.
function focusTarget(t) {
  // An equation: the whole display, which MathJax makes readable.
  const math = t.closest('mjx-container');
  if (math) return math;
  // A named spot with content of its own (a heading, a paragraph).
  if (t.textContent.trim() !== '' || t.matches(HEADING)) return t;
  // An empty anchor. In a bibliography entry: the entry.
  const parent = t.parentElement;
  if (!parent) return t;
  if (parent.tagName === 'DD' || parent.tagName === 'LI') return parent;
  // Inside a theorem, a problem, ...: the heading it starts with, if any.
  const block = t.closest('.theorem-like, .problem-environment');
  if (block) return block.querySelector(HEADING) || block;
  // The label of a section: Ximera puts it at the start of the paragraph
  // right after the heading; the heading is the place.
  if (parent.tagName === 'P' && parent.previousElementSibling?.matches(HEADING)) {
    let textBefore = '';
    for (let n = parent.firstChild; n && n !== t; n = n.nextSibling) textBefore += n.textContent;
    if (textBefore.trim() === '') return parent.previousElementSibling;
  }
  return parent;
}

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest?.('a[href^="#"]');
  if (!link) return;
  const t = targetOf(link);
  if (!t) return;
  const f = focusTarget(t);
  // After the browser has scrolled to the target.
  requestAnimationFrame(() => {
    if (!f.matches('a[href], button, input, select, textarea, [tabindex]')) {
      f.setAttribute('tabindex', '-1');
    }
    // Scrolls only if needed, for example to show a section's heading just
    // above the label the browser scrolled to.
    f.focus();
  });
});
