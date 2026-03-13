import { PdfToolError } from './errors';

function createPageOutOfRangeError(input: string, pageCount: number) {
  return new PdfToolError('PAGE_OUT_OF_RANGE', 'Page range is invalid.', {
    input,
    page_count: pageCount
  });
}

export function parsePageRange(input: string | undefined, pageCount: number): number[] {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw createPageOutOfRangeError(input ?? '', pageCount);
  }

  if (!input?.trim()) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>();

  for (const segment of input.split(',')) {
    const trimmed = segment.trim();

    if (!trimmed) {
      throw createPageOutOfRangeError(input, pageCount);
    }

    const rangeMatch = /^(\d+)-(\d+)$/.exec(trimmed);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);

      if (start > end) {
        throw createPageOutOfRangeError(input, pageCount);
      }

      for (let page = start; page <= end; page += 1) {
        if (page < 1 || page > pageCount) {
          throw createPageOutOfRangeError(input, pageCount);
        }

        pages.add(page);
      }

      continue;
    }

    const singlePage = Number(trimmed);
    if (!Number.isInteger(singlePage) || singlePage < 1 || singlePage > pageCount) {
      throw createPageOutOfRangeError(input, pageCount);
    }

    pages.add(singlePage);
  }

  return [...pages].sort((left, right) => left - right);
}
