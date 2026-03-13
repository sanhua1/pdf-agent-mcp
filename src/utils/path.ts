import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PdfToolError } from './errors';

export function assertPdfExtension(filePath: string): void {
  if (!filePath.toLowerCase().endsWith('.pdf')) {
    throw new PdfToolError('UNSUPPORTED_FORMAT', 'Only .pdf files are supported.', {
      path: filePath
    });
  }
}

export function normalizePdfPath(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new PdfToolError('INVALID_PATH', 'A PDF path is required.');
  }

  const resolvedPath = resolve(trimmed);
  assertPdfExtension(resolvedPath);

  if (!existsSync(resolvedPath)) {
    throw new PdfToolError('FILE_NOT_FOUND', 'PDF file was not found.', {
      path: resolvedPath
    });
  }

  return resolvedPath;
}
