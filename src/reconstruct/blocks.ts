import type { PositionedTextItem } from './lines';

export function buildBlocks(items: PositionedTextItem[]): PositionedTextItem[] {
  return [...items].sort((left, right) => {
    if (left.y === right.y) {
      return left.x - right.x;
    }

    return right.y - left.y;
  });
}
