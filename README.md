# Ximera Sandbox

A small Ximera course for trying things out. It is built with the npm-based
Ximera toolchain (`tex4npm` and the `@ximera/*` packages), which turns LaTeX
sources into a static website. GitHub Actions does the build; nothing has to be
installed on your own computer.

**New to GitHub?** [GETTING-STARTED.md](GETTING-STARTED.md) walks through making
your own copy of this course and publishing it as a website, step by step.

## What is here

    src/sandbox.tex            the course ("xourse") file: title and list of activities
    src/preamble.tex           macros shared by every activity
    src/first-steps/main.tex   one example of each basic question type
    src/lines/main.tex         a short activity with a TikZ picture
    src/intent/main.tex        test page for MathML intent (screen readers)
    src/matrices/main.tex      answer boxes inside matrices and vectors
    src/intent.cfg             MathJax setup for intent: \xmunits, \xmabs
    src/custom.css             site-specific styling
    static/                    hand-written pages, copied into the site as they are
    static/answer-a11y.js      screen reader support for \answer boxes, loaded on every page
    static/answer-box/         the stock answer box on its own page, without (before)
                               and with (after) MathJax's assistive MathML
    latex/xmintent.sty         the \xm... commands for LaTeX (web version of TailorSwiftBot.sty)
    .devcontainer/             editing environment for GitHub Codespaces
    package.json               the Ximera packages the build uses
    tex4npm.config.js          where sources live (src) and where output goes (dist)
    .github/workflows/deploy.yml   the build, and the optional upload to S3

## Adding an activity

1. Create a folder under `src/` with a `main.tex` in it, for example
   `src/my-topic/main.tex`. Copying `src/first-steps/main.tex` is the easiest start.
2. Add `\activity{my-topic/main}` to `src/sandbox.tex`.
3. Push. The Actions tab shows a green check when the site builds, or a red X
   with the LaTeX error if it does not.

## Tagged PDFs

Besides its web page, each activity is published as a tagged, accessible
PDF made from the same `.tex` file: `first-steps/main.pdf` next to
`first-steps/main.html`, and so on. Each page has a link to its PDF at the
top. The build compiles the activity a second time with LuaLaTeX, with
tagging switched on and `TailorSwiftBot_Nov_2026/TailorSwiftBot_Nov_2026.sty`
loaded before the class; nothing has to be added to the activity. The
`\xm...` commands put the same MathML intent into the PDF as into the web
page. An activity that LuaLaTeX cannot compile gets no PDF and no link, and
the build shows a warning saying why.

## Editing in a Codespace

A Codespace is VS Code in the browser with TeX Live already installed.

1. On the repository page choose Code > Codespaces > Create codespace on main.
   The first start takes several minutes, because TeX Live is large.
2. Open a `.tex` file. Saving it compiles it; View LaTeX PDF (the icon at the
   top right) shows the PDF beside the source.
3. Commit and push from the Source Control panel on the left. The push
   starts the build that publishes the site.

To write with someone at the same time, install the Live Share extension
in the Codespace, start a session, and send them the link.

A Codespace uses your GitHub Codespaces allowance while it is running. It
stops by itself after 30 minutes without activity.

## Editing in Overleaf

1. In Overleaf, choose New project > Import from GitHub and pick this repository.
   GitHub sync needs a premium Overleaf plan.
2. Edit, then use Menu > GitHub > Push Overleaf changes to GitHub. Sync is
   manual; each push starts a build.
3. If the repository changed on GitHub since your last sync, pull those changes
   into Overleaf first (Menu > GitHub > Pull GitHub changes into Overleaf).

Overleaf's Recompile button only makes a PDF preview. It does not run the web
build, so the Actions run is the real check.

## Publishing to S3 (optional)

Without any settings the workflow only builds. To publish, add these under
Settings > Secrets and variables > Actions:

- Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Variables: `S3_BUCKET`, `AWS_REGION`, and optionally `S3_PREFIX`

`S3_PREFIX` puts the site in a folder of the bucket, so the course page is at
`http://BUCKET.s3-website.REGION.amazonaws.com/PREFIX/sandbox.html`.

The deploy removes files that are no longer part of the site. With a prefix it
only touches that folder. Without a prefix it covers the whole bucket, so do
not point a prefix-less deploy at a bucket that holds anything else.

## MathML intent

`src/intent.cfg` makes `\xmunits{cm}` and `\xmabs{x}` (inside math) carry the
MathML `intent` attribute on the web page, so NVDA or JAWS with MathCAT reads
them as a unit and as an absolute value. It also turns on MathJax's assistive
MathML for every formula on the site. The build inserts the file into
`ximera.cfg`; delete `src/intent.cfg` to switch all of this off.

The commands are only defined for the web page. The PDF pass of the build
reports them as undefined and carries on.

## Workarounds in this repository

These work around problems in the published 2.0.0 packages and can be removed
once fixed versions are released.

- `package.json` pins `@modulus-learning/agent` to 0.9.1. `@ximera/core` 2.0.0
  imports a `ModulusAgent` class that later agent versions replaced, so the
  build fails without the pin.
- `package.json` pins `math-expressions` to 2.0.0-alpha96, the version the
  answer checker was written against. The newer 3.0.0 alpha is a rewrite, and
  with it correct answers were marked wrong.
- The workflow patches `tex4npm` after install. Without the patch, photos
  (PNG or JPG) show as broken on the copy of each activity that sits inside a
  course folder, because the image link points one folder too high.
- The workflow patches `@ximera/answer` after install. Without the patch,
  `\answer` inside display math is not turned into an input box and shows up
  on the page as a red `\answer`.

Known limitation: `tex4npm` 2.0.0 recompiles every file on every build, so
build time grows with the size of the course.
