export interface PdfDocumentHandle {
  pageCount: number;
  isEncrypted: boolean;
  getTitle(): Promise<string | null>;
  getProducer(): Promise<string | null>;
  getTextItemCount(page: number): Promise<number>;
  getPageTextItems(page: number): Promise<
    Array<{
      text: string;
      x: number;
      y: number;
      w: number;
      h: number;
    }>
  >;
  getPageDimensions(page: number): Promise<{ width: number; height: number }>;
  getOutline(): Promise<
    Array<{
      title: string;
      dest: string | Array<unknown> | null;
      items: Array<unknown>;
    }>
  >;
  resolveDestinationToPage(dest: string | Array<unknown> | null): Promise<number | null>;
  close(): Promise<void>;
}
