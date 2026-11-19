# Getting started: your own Ximera website, step by step

This guide is for someone who has never used GitHub. At the end you will
have your own copy of this small Ximera course, published as a website at
an address of your own, and you will know how to change it.

You need a web browser and an email address. Nothing has to be installed on
your computer, and everything here is free. Allow about 20 minutes.

Your copy is completely separate from the original. Nothing you do can
change or break anyone else's site.

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
   show, for example `jsmith-math`.
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
   including the answers written in them.)
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

Your copy is not empty. It comes with five finished pages, which are
already on your website. Each page of a course is called an **activity**
and has a folder of its own inside the `src` folder:

| File | What it shows |
|---|---|
| `src/first-steps/main.tex` | One example of each basic kind of question |
| `src/lines/main.tex` | A short lesson with a drawn picture |
| `src/pictures/main.tex` | Photos, with descriptions for screen readers |
| `src/intent/main.tex` | Formulas written so that screen readers read them well |
| `src/matrices/main.tex` | Answer boxes inside matrices |

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
   few words such as "Change the first question", and click
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
  answers inside `\answer{...}`.
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
