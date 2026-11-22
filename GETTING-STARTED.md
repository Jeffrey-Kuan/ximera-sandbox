AI Transparency Statement: this was written with Claude Code, Fable 5.2. I reviewed the content before sharing it. 

# Getting started: your own Ximera website, step by step

This guide is for someone who has never used GitHub. At the end you will
have your own copy of this small Ximera course, published as a website at
an address of your own, and you will know how to change it.

You need a web browser and an email address. Nothing has to be installed on
your computer, and everything here is free. Allow about 20 minutes.

Your copy is completely separate from the original. Nothing you do can
change or break anyone else's site.

## Getting updates

Accessibility tools change quickly, and these instructions will change with
them. To hear about updates, join the mailing list:

https://forms.cloud.microsoft/r/JE6pQeD0N5

Emails go out at most once a month.

## A few words you will meet

- **GitHub**: a website that stores files and keeps every earlier version
  of them.
- **Repository** (or "repo"): one project's folder of files on GitHub.
- **Commit**: saving a change. GitHub asks for a short note saying what you
  changed.
- **Actions**: GitHub's robot. Each time you commit, it turns the LaTeX
  files into web pages. This is called a **build** and takes a few minutes.
- **Pages**: the part of GitHub that shows those web pages to the world.

## Step 1. Create a GitHub account

1. Go to https://github.com/signup
2. Enter your email address, choose a password and a username. The username
   becomes part of your website's address, so pick one you are happy to
   show, for example `tswift-math`.
3. Confirm your email address with the code GitHub sends you.

If you already have an account, sign in instead.

## Step 2. Make your own copy

1. Go to https://github.com/Jeffrey-Kuan/ximera-sandbox
2. Click the green **Use this template** button near the top right, then
   **Create a new repository**.
3. Under **Repository name** type a short name without spaces, for example
   `my-course`. This also becomes part of the website's address.
4. Leave **Public** selected. (With a free account, the website only works
   for a public repository. Public means anyone can see the files,
   including the answers written in them. See "Keeping your files
   private" below for what can be hidden.)
5. Click **Create repository**.

After a few seconds you are looking at your own repository. Its address is
`https://github.com/YOUR-USERNAME/my-course`.

## Step 3. Switch on the website

1. In your repository, click **Settings** in the row of tabs along the top.
   (On a narrow window it may be hidden under a **...** button.)
2. In the list on the left, click **Pages**.
3. Under **Build and deployment**, open the **Source** menu and choose
   **GitHub Actions**. There is no Save button; the choice is kept at once.

You only do this once.

## Step 4. Build the site for the first time

1. Click the **Actions** tab at the top of your repository.
2. In the list on the left, click **Build and deploy**.
3. On the right, click **Run workflow**, then the green **Run workflow**
   button in the small box that opens.
4. After a few seconds a new line appears with a yellow circle. The build
   is running. It takes about three to five minutes.
5. When the circle becomes a green check mark, the site is published.

You may also see an older line with a red X, from the moment the copy was
made. That one ran before the website was switched on. Ignore it.

## Step 5. Look at your website

Your site's address is

    https://YOUR-USERNAME.github.io/my-course/

with your own username and repository name. You can also find it under
**Settings > Pages**, where it says "Your site is live at ...".

If the page looks old after a change, reload it with Ctrl+F5 (Windows) or
Cmd+Shift+R (Mac).

## Step 6. See what you already have

Your copy is not empty. It comes with seven finished pages, which are
already on your website. Each page of a course is called an **activity**
and has a folder of its own inside the `src` folder:

| File | What it shows |
|---|---|
| `src/first-steps/main.tex` | One example of each basic kind of question, a Desmos graph, and text that folds away |
| `src/lines/main.tex` | A short lesson with a drawn picture |
| `src/pictures/main.tex` | Photos, with descriptions for screen readers |
| `src/intent/main.tex` | Formulas written so that screen readers read them well |
| `src/matrices/main.tex` | Answer boxes inside matrices |
| `src/tables/main.tex` | Tables that screen readers can read by row and column |
| `src/showcase/main.tex` | One example of every accessibility feature, for testing with a screen reader |

One more file, `src/sandbox.tex`, is the course itself: its title and the
list of activities.

Compare a page on your website with its `main.tex` to see which LaTeX
makes what. You do not have to start from a blank file.

## Step 7. Make a page your own

The easiest start is to change the page `first-steps` into what you want.

1. Click the **Code** tab to see the files.
2. Click the folder `src`, then `first-steps`, then the file `main.tex`.
3. Click the pencil icon at the top right of the file to edit it.
4. Change something. For example, find the line

       An answer box inside a sentence: $2+2=\answer{4}$.

   and change it to

       An answer box inside a sentence: $3+4=\answer{7}$.

   `\answer{7}` makes a box where a student types, and 7 is the answer
   that will be marked correct. Change the `\title{...}` line and the text
   as you like, and delete the questions you do not need.
5. Click the green **Commit changes...** button at the top right, write a
   few words (don't forget this step or it will freeze) such as "Change the first question", and click
   **Commit changes**.

Committing starts a new build by itself. Watch it on the **Actions** tab;
when the check mark is green, reload your website to see the change.

## Step 8. Add another page

A new page is a new folder in `src` with a file `main.tex` in it. Start
from a copy of a page you already have.

1. Open the page you want to copy, for example `src/first-steps/main.tex`,
   and click the **Copy raw file** icon (two overlapping squares) at the
   top right of the file.
2. Go back to the `src` folder and click **Add file > Create new file**.
3. In the name box type `my-topic/main.tex`. Typing the `/` makes the
   folder `my-topic` for you.
4. Paste (Ctrl+V, or Cmd+V on a Mac), then change the title and the
   contents.
5. Click **Commit changes...**, then **Commit changes**.
6. Tell the course about the new page: open `src/sandbox.tex`, click the
   pencil, and add this line next to the other `\activity` lines:

       \activity{my-topic/main}

7. Commit that change too. After the build, the new page appears in the
   course's list.

If you would rather start small, this is a complete page you can paste in
at step 4 instead:

    \documentclass{ximera}
    \input{../preamble.tex}

    \title{My Topic}

    \begin{document}
    \begin{abstract}
    A first page of my own.
    \end{abstract}
    \maketitle

    Some text, and a formula: $a^2+b^2=c^2$.

    \begin{problem}
    What is $5\cdot 6$? $\answer{30}$
    \end{problem}

    \end{document}

To remove a page you do not want, delete its `\activity{...}` line from
`src/sandbox.tex`. To change the course title, edit the `\title{...}` line
in the same file.

## Writing in Overleaf instead

If you already write LaTeX in Overleaf, you can keep doing so. Overleaf
becomes your editor, GitHub still stores the files, and GitHub still builds
the website.

This needs Overleaf's GitHub synchronization, which is a paid Overleaf
feature. You have it if you pay for Overleaf yourself or if your
institution provides Overleaf to you.

**Set it up, once**

1. In Overleaf, open **Account Settings**, find **GitHub Sync** and click
   **Link to your GitHub account**. Sign in to GitHub and approve the
   request.
2. On Overleaf's project list, click **New Project > Import from GitHub**.
3. Find your repository (for example `my-course`) and click
   **Import to Overleaf**.

Overleaf now has a project with the same files as your repository. Each
activity is at `src/NAME/main.tex`, as on GitHub.

**Each time you work**

1. Open the GitHub sync box in the Overleaf editor. In the classic design
   it is under **Menu > Sync > GitHub**; in the newer design, look for
   **Integrations** in the bar at the left.
2. If it says there are changes on GitHub, click
   **Pull GitHub changes into Overleaf** first.
3. Edit your files.
4. Open the same box again and click **Push Overleaf changes to GitHub**.
   Write a few words saying what you changed.

Nothing is sent to GitHub until you push, and nothing arrives from GitHub
until you pull. Overleaf does neither by itself.

The push is a commit, so it starts a build like any other. Watch it on the
**Actions** tab of your repository, and reload your website when the check
mark is green.

**Things to know**

- Pull before you start, every time. If the files changed on GitHub since
  your last pull, Overleaf may put your push on a separate branch, with a
  name starting with `overleaf-`, instead of on the main one. Your website
  does not change until that branch is merged: on GitHub, open the **Pull
  requests** tab, click **New pull request**, choose the `overleaf-` branch
  and click **Merge pull request**.
- The website is built by GitHub, not by Overleaf. Overleaf's own
  **Recompile** button only makes Overleaf's PDF preview, and that preview
  may stop with errors, because some of the files the pages use are put in
  place by the GitHub build and are not in your project. The website is
  what counts.
- An Overleaf project made some other way cannot be connected to an
  existing repository afterwards. Start from **Import from GitHub**.

## Keeping your files private

In a public repository anyone can read your LaTeX files, including every
answer. With a free GitHub account the website only works from a public
repository.

**GitHub Education** is GitHub's free program for teachers and students at
schools, colleges and universities. One of its benefits for teachers is a
free upgraded plan that allows private repositories with a website.

1. Go to https://education.github.com and choose the option for teachers.
2. Sign in, and apply with your school email address and proof that you
   work there, such as a faculty ID or a page on your institution's website
   that names you. Approval can take a few days.
3. Once you are approved, follow GitHub's instructions to get the upgraded
   plan, then make your repository private under
   **Settings > General > Danger Zone > Change visibility**.

Three things to keep in mind:

- **The website stays public.** Anyone with the address can open it, and it
  cannot be put behind a login this way. (GitHub can restrict a website to
  chosen people only on its Enterprise plan, which GitHub Education does
  not include.) To keep the pages themselves off the public web, see "If
  you do not want your content public at all" below.
- **The answers are not hidden.** A page checks answers in the student's
  browser, so the answers are inside the page. Anyone who chooses "View
  page source" in their browser can read them, whether or not your
  repository is private. A private repository hides your LaTeX files, your
  comments in them, and anything you have not published. That is fine
  for homework and practice. Do not use the pages for an exam.
- GitHub changes what the program includes from time to time. Check
  https://education.github.com for what it offers now before you rely on
  it.

## If you do not want your content public at all

You can have GitHub build your pages without publishing them. Nothing is
ever on the public web: you download the finished website as a zip file
and decide yourself where it goes.

1. Make the repository private. Either choose **Private** instead of
   Public in Step 2, or later go to
   **Settings > General > Danger Zone > Change visibility**. A free account
   can have private repositories; it is only the website that needs a
   public one.
2. Tell the build not to publish. Go to **Settings > Secrets and variables
   > Actions**, click the **Variables** tab, then **New repository
   variable**. Type `PUBLISH` as the name and `false` as the value, and
   click **Add variable**.
3. Skip Step 3 ("Switch on the website"). If your site was already
   published, open **Settings > Pages** and choose **Unpublish site** from
   the menu next to its address. Keep in mind that a page that has been
   public may already have been copied by a search engine.
4. Build as usual: commit a change, or use **Run workflow** as in Step 4.
5. When the build has a green check mark, click it on the **Actions** tab.
   At the bottom of that page, under **Artifacts**, click **website**. A
   zip file with the whole website downloads. It is kept for 30 days; any
   later build makes a new one.

**What you can do with the downloaded website**

The pages only work fully when a web server delivers them. Two things
that look as if they should work do not:

- Opening the files on your own computer by double-clicking them. The text
  appears, but answer boxes and choices do not work, because browsers
  block the page's scripts for files opened that way.
- Pasting the HTML into a course site's page editor. See the next section.

What does work is putting the unzipped folder on a web server that asks
for a login, for example web space from your institution behind its
single sign-on. Ask your IT or teaching support where you can host "a
folder of static web pages for enrolled students only". Without such a
place, you still have the PDFs and the text of your pages, but not working
questions.

## Using your pages in Canvas or another course site

A learning management system (LMS) such as Canvas only shows its pages to
students enrolled in your course. There are three ways to bring your
Ximera pages into it. They differ in what still works.

**1. Show the live page inside a Canvas page (everything works)**

1. In Canvas, create or edit a **Page**.
2. Below the editing box, click the **</>** button to switch to the HTML
   editor.
3. Paste this line, with the address of your own page and a short
   description of it:

       <iframe src="https://YOUR-USERNAME.github.io/my-course/first-steps/main.html" title="First Steps" width="100%" height="800"></iframe>

4. Save the page.

Students see your page inside the course, with working answer boxes and
formulas. The page itself is still public: this puts a window onto it in
Canvas, it does not move it there. Some institutions limit which websites
may be shown this way; if the box stays empty, ask your Canvas support.

**2. Copy the page's HTML into a Canvas page (text only)**

This puts a copy of the page in Canvas itself, where only your students
can see it.

1. Open your page in a browser, right-click it and choose **View page
   source**.
2. Select everything from the line that starts with `<main` to the line
   `</main>`, and copy it.
3. In Canvas, edit a **Page**, switch to the HTML editor with **</>**,
   paste, and save.

Canvas removes all scripts from what you paste, for security, and so do
most other systems (Moodle, Blackboard, Brightspace and others). That has
consequences:

- Answer boxes, multiple choice, hints and expandable sections do not
  work. What remains is the text to read.
- Check every formula after saving. Canvas shows formulas with its own
  tools, which do not know the commands defined in your course.
- Pictures still point to your website. Upload them to Canvas and insert
  them again if the copy must not depend on the website.
- When you change the page on GitHub, the copy in Canvas does not change.
  You have to paste it again.

Use this for reading material, not for practice questions.

**3. Upload the PDF (private, nothing interactive)**

Each page has a tagged PDF, with blanks where the answers go. Download it
with the "This page as a tagged PDF" link and upload it to your course
files. Only your students can open it, and the answers are not in it.

## If the build fails

A red X on the **Actions** tab means the build stopped, almost always
because of a LaTeX mistake such as a missing `}` or a misspelled command.
Your website keeps showing the last version that worked.

1. Click the line with the red X, then the box named **build**.
2. The step that failed is open and marked in red. Lines starting with `!`
   are LaTeX's error messages; they name the file and the line number.
3. Fix the file, commit, and the build runs again.

If you cannot find the mistake, undo it: open the file, click **History**
at the top right, and look at what changed in the last commit.

## Good to know

- **Everything is public**: the website and the LaTeX files, including the
  answers inside `\answer{...}`. "Keeping your files private" above
  explains what can be hidden and what cannot.
- **A PDF of every page**: each page has a link, "This page as a tagged
  PDF", to a version made for printing and for PDF screen readers. In it,
  answers appear as blanks.
- **Editing more comfortably**: the green **Code** button has a
  **Codespaces** tab. "Create codespace on main" opens a full editor in
  your browser with LaTeX installed, where saving a file shows it as a PDF
  straight away. A free account includes about 60 hours of this a month.
- **Uploading files**: **Add file > Upload files** lets you drag in
  pictures or `.tex` files from your computer. Put a picture in the same
  folder as the activity that uses it.
- **Screen readers**: the site is set up so that formulas and answer boxes
  work with a screen reader. `README.md` describes the pieces.
- **More about writing Ximera activities**: `README.md` in your repository,
  and the examples in `src/first-steps/main.tex`.
