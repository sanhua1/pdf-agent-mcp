import { normalizeWhitespace } from './normalize';

export interface PositionedTextItem {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

type LineBucket = {
  y: number;
  items: PositionedTextItem[];
};

function findLineBucketIndex(lines: LineBucket[], y: number): number {
  let bestIndex = -1;
  let bestDelta = Number.POSITIVE_INFINITY;

  for (let index = 0; index < lines.length; index += 1) {
    const delta = Math.abs(lines[index].y - y);
    if (delta <= 1.5 && delta < bestDelta) {
      bestDelta = delta;
      bestIndex = index;
    }
  }

  return bestIndex;
}

export function groupItemsIntoLines(items: PositionedTextItem[]): { text: string; y: number }[] {
  const sortedItems = [...items].sort((left, right) => {
    if (left.y === right.y) {
      return left.x - right.x;
    }

    return right.y - left.y;
  });

  const lines: LineBucket[] = [];
  for (const item of sortedItems) {
    const lineIndex = findLineBucketIndex(lines, item.y);
    if (lineIndex === -1) {
      lines.push({
        y: item.y,
        items: [item]
      });
      continue;
    }

    lines[lineIndex].items.push(item);
  }

  return lines
    .sort((left, right) => right.y - left.y)
    .map((line) => {
      const joined = line.items
        .sort((left, right) => left.x - right.x)
        .map((item) => normalizeWhitespace(item.text))
        .filter((text) => text.length > 0)
        .join(' ');

      return {
        y: line.y,
        text: joined.trim()
      };
    })
    .filter((line) => line.text.length > 0);
}
