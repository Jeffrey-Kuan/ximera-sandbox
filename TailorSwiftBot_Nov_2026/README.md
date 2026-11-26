# TailorSwiftBot_Nov_2026

The LaTeX package `TailorSwiftBot_Nov_2026.sty` (accessibility helpers for
tagged PDF) and small test documents for it, with the PDFs they produce. The PDFs
were compiled with LuaLaTeX on TeX Live 2026, LaTeX release 2026-11-01.

They show the heading structure the package gives a tagged PDF: open a PDF
in Adobe Acrobat and look at the Tags panel.

| Source | PDF | What it shows |
|---|---|---|
| `article.tex` | `article_LaTeX-2026-11.pdf` | Standard article: title H1, section H2, subsection H3, theorem head H4 |
| `book.tex` | `book_LaTeX-2026-11.pdf` | Standard book: title H1, chapter H2, section H3, subsection H4, theorem head H5 |
| `ximera-title-H1.tex` | `ximera-title-H1_LaTeX-2026-11.pdf` | Ximera class: title H1, section H2, theorem heads one level below what contains them |
| the same with `\chapterstyle` | `ximera-chapterstyle_LaTeX-2026-11.pdf` | Ximera chapter style: as above |
| the same with `\sectionstyle` | `ximera-sectionstyle_LaTeX-2026-11.pdf` | Ximera section style: title H2, everything else one level further down |
| `ximera.tex` | (none) | Ximera class without `\author` |

With the Ximera class the package is loaded before the class:

    \DocumentMetadata{...}
    \RequirePackage{TailorSwiftBot_Nov_2026}
    \documentclass{ximera}

Version 2.6 adds `\xmnewsymbol[Y-conjugate-transpose]{\Yct}{Y^*}`: a symbol
with a spoken name of the author's choosing.
Version 2.3 adds `\xmlang{el}{...}` to mark words in another language, and
version 2.4 makes `\xmalt{...}` after a picture its alternative text.
From version 2.2 the package also makes `tabularray` tables (`tblr`) come out
as tagged tables, with header rows and columns from the settings `rowhead`
and `xmcolhead`; see Part 13 in the file.

The package is `TailorSwiftBot_Nov_2026.sty` in this folder. Put it next to
your document, or anywhere LaTeX looks for packages. The comments at the top
of the file describe every command and explain why this version exists.

This folder is not part of the website; the site build does not read it.
