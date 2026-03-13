import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export type PdfJsTextItem = {
  str?: string;
  width?: number;
  height?: number;
  transform?: number[];
};

export type PdfJsPage = {
  getTextContent(): Promise<{
    items: Array<PdfJsTextItem | { type?: string }>;
  }>;
  getViewport(params: { scale: number }): { width: number; height: number };
};

export type PdfJsOutlineItem = {
  title: string;
  dest: string | Array<unknown> | null;
  items: PdfJsOutlineItem[];
};

export type PdfJsDocument = {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfJsPage>;
  getPageIndex(ref: unknown): Promise<number>;
  getDestination(dest: string): Promise<Array<unknown> | null>;
  getOutline(): Promise<PdfJsOutlineItem[] | null>;
  getMetadata(): Promise<{
    info?: {
      Title?: string;
      Producer?: string;
    };
  }>;
  destroy(): Promise<void>;
};

export async function loadPdfJsDocument(filePath: string): Promise<PdfJsDocument> {
  const data = await readFile(filePath);
  const loadingTask = getDocument({
    data: new Uint8Array(data)
  });

  return (await loadingTask.promise) as PdfJsDocument;
}
