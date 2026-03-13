import { stat } from 'node:fs/promises';
import { loadPdfDocument } from '../pdf/pdfjsAdapter';
import { normalizePdfPath } from '../utils/path';

export async function inspectPdf(input: { path: string }) {
  const normalizedPath = normalizePdfPath(input.path);
  const fileStats = await stat(normalizedPath);
  const document = await loadPdfDocument(normalizedPath);

  try {
    const textItemCount = await document.getTextItemCount(1);
    const hasTextLayer = textItemCount > 0;

    return {
      path: normalizedPath,
      exists: true,
      file_size: fileStats.size,
      page_count: document.pageCount,
      encrypted: document.isEncrypted,
      has_text_layer: hasTextLayer,
      title: await document.getTitle(),
      producer: await document.getProducer(),
      warnings: hasTextLayer ? [] : ['LIKELY_SCANNED_DOCUMENT']
    };
  } finally {
    await document.close();
  }
}
