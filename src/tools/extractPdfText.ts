import { groupItemsIntoLines } from '../reconstruct/lines';
import { normalizeWhitespace } from '../reconstruct/normalize';
import { loadPdfDocument } from '../pdf/pdfjsAdapter';
import { PdfToolError } from '../utils/errors';
import { parsePageRange } from '../utils/pageRange';
import { normalizePdfPath } from '../utils/path';

type ExtractMode = 'raw' | 'lines' | 'blocks';

type ExtractPdfTextInput = {
  path: string;
  page_range?: string;
  mode?: ExtractMode;
  normalize_whitespace?: boolean;
};

type PositionedItem = {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

function assertMode(mode: string): asserts mode is ExtractMode {
  if (mode !== 'raw' && mode !== 'lines' && mode !== 'blocks') {
    throw new PdfToolError('EXTRACTION_FAILED', 'Invalid extraction mode.', {
      mode
    });
  }
}

function toText(
  mode: ExtractMode,
  items: PositionedItem[],
  normalizeSpace: boolean
): string {
  if (mode === 'raw') {
    const raw = items.map((item) => item.text).join(' ');
    return normalizeSpace ? normalizeWhitespace(raw) : raw;
  }

  if (mode === 'lines') {
    const lines = groupItemsIntoLines(items).map((line: { text: string }) => line.text);
    const text = lines.join('\n');
    return normalizeSpace ? normalizeWhitespace(text.replace(/\n+/g, '\n')) : text;
  }

  const lines = groupItemsIntoLines(items).map((line: { y: number; text: string }) => ({
    y: line.y,
    text: normalizeSpace ? normalizeWhitespace(line.text) : line.text
  }));
  return JSON.stringify(lines);
}

export async function extractPdfText(input: ExtractPdfTextInput) {
  const normalizedPath = normalizePdfPath(input.path);
  const mode = input.mode ?? 'lines';
  assertMode(mode);

  const document = await loadPdfDocument(normalizedPath);
  try {
    const pages = parsePageRange(input.page_range, document.pageCount);
    const normalizeSpace = input.normalize_whitespace !== false;

    const pageResults = await Promise.all(
      pages.map(async (page: number) => {
        const items = await document.getPageTextItems(page);
        const text = toText(mode, items, normalizeSpace);
        return {
          page,
          text,
          char_count: text.length
        };
      })
    );

    return {
      path: normalizedPath,
      page_count: document.pageCount,
      mode,
      pages: pageResults,
      warnings: []
    };
  } finally {
    await document.close();
  }
}
