export type PdfToolErrorCode =
  | 'FILE_NOT_FOUND'
  | 'INVALID_PATH'
  | 'UNSUPPORTED_FORMAT'
  | 'PDF_ENCRYPTED'
  | 'NO_TEXT_LAYER'
  | 'PAGE_OUT_OF_RANGE'
  | 'EXTRACTION_FAILED';

export class PdfToolError extends Error {
  constructor(
    public code: PdfToolErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'PdfToolError';
  }
}
