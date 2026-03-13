import { PdfToolError } from '../utils/errors';
import { loadPdfJsDocument, type PdfJsTextItem } from './loader';
import type { PdfDocumentHandle } from './types';

type AdapterOutlineNode = {
  title: string;
  dest: string | Array<unknown> | null;
  items: AdapterOutlineNode[];
};

function getMetadataValue(
  metadata: { info?: { Title?: string; Producer?: string } } | null,
  key: 'Title' | 'Producer'
) {
  const value = metadata?.info?.[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

export async function loadPdfDocument(filePath: string): Promise<PdfDocumentHandle> {
  try {
    const document = await loadPdfJsDocument(filePath);
    const metadataPromise = document.getMetadata().catch(() => null);

    const getPageTextItems = async (page: number) => {
      const pdfPage = await document.getPage(page);
      const textContent = await pdfPage.getTextContent();

      return textContent.items
        .filter((item): item is PdfJsTextItem => typeof (item as { str?: string }).str === 'string')
        .map((item) => {
          const transform = Array.isArray(item.transform) ? item.transform : [];
          return {
            text: item.str ?? '',
            x: Number(transform[4] ?? 0),
            y: Number(transform[5] ?? 0),
            w: Number(item.width ?? 0),
            h: Number(item.height ?? 0)
          };
        })
        .filter((item) => item.text.trim().length > 0);
    };

    const normalizeDestArray = async (dest: Array<unknown>) => {
      const target = dest[0];
      if (typeof target === 'number') {
        return target + 1;
      }

      if (target && typeof target === 'object') {
        const pageIndex = await document.getPageIndex(target);
        return pageIndex + 1;
      }

      return null;
    };

    return {
      pageCount: document.numPages,
      isEncrypted: false,
      async getTitle() {
        return getMetadataValue(await metadataPromise, 'Title');
      },
      async getProducer() {
        return getMetadataValue(await metadataPromise, 'Producer');
      },
      async getTextItemCount(page: number) {
        const items = await getPageTextItems(page);
        return items.length;
      },
      async getPageTextItems(page: number) {
        return getPageTextItems(page);
      },
      async getPageDimensions(page: number) {
        const pdfPage = await document.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1 });
        return {
          width: viewport.width,
          height: viewport.height
        };
      },
      async getOutline() {
        const outline = await document.getOutline();
        if (!outline) {
          return [];
        }

        const convert = (node: AdapterOutlineNode): AdapterOutlineNode => ({
          title: node.title,
          dest: node.dest,
          items: node.items.map((item: AdapterOutlineNode) => convert(item))
        });

        return outline.map((item: AdapterOutlineNode) =>
          convert({
            title: item.title,
            dest: item.dest,
            items: item.items
          })
        );
      },
      async resolveDestinationToPage(dest: string | Array<unknown> | null) {
        if (!dest) {
          return null;
        }

        if (typeof dest === 'string') {
          const resolved = await document.getDestination(dest);
          if (!resolved) {
            return null;
          }

          return normalizeDestArray(resolved);
        }

        return normalizeDestArray(dest);
      },
      async close() {
        await document.destroy();
      }
    };
  } catch (error) {
    throw new PdfToolError('EXTRACTION_FAILED', 'Failed to load PDF document.', {
      cause: error instanceof Error ? error.message : String(error)
    });
  }
}
