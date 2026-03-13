import { loadPdfDocument } from '../pdf/pdfjsAdapter';
import { buildBlocks } from '../reconstruct/blocks';
import { PdfToolError } from '../utils/errors';
import { normalizePdfPath } from '../utils/path';

type ExtractPdfPageInput = {
  path: string;
  page: number;
  mode?: 'raw' | 'blocks';
};

export async function extractPdfPage(input: ExtractPdfPageInput) {
  const normalizedPath = normalizePdfPath(input.path);
  const mode = input.mode ?? 'raw';
  if (mode !== 'raw' && mode !== 'blocks') {
    throw new PdfToolError('EXTRACTION_FAILED', 'Invalid page extraction mode.', { mode });
  }

  const document = await loadPdfDocument(normalizedPath);
  try {
    if (!Number.isInteger(input.page) || input.page < 1 || input.page > document.pageCount) {
      throw new PdfToolError('PAGE_OUT_OF_RANGE', 'Requested page is out of range.', {
        page: input.page,
        page_count: document.pageCount
      });
    }

    const dimensions = await document.getPageDimensions(input.page);
    const pageItems = await document.getPageTextItems(input.page);
    const items = mode === 'blocks' ? buildBlocks(pageItems) : pageItems;

    return {
      page: input.page,
      width: dimensions.width,
      height: dimensions.height,
      items,
      warnings: []
    };
  } finally {
    await document.close();
  }
}
