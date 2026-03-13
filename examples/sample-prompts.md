# Sample Prompts

## Inspect first

Analyze this PDF path with `inspect_pdf` and tell me if it has a text layer:

`/path/to/your/document.pdf`

## Extract lines

Use `extract_pdf_text` in `lines` mode for pages `1-3`, then draft a Markdown summary.

## Resolve difficult page

Use `extract_pdf_page` in `blocks` mode on page `10` and reconstruct the main reading order.

## Outline-aware summary

Use `extract_pdf_outline` first, then extract the pages under each top-level outline node and summarize by chapter.
