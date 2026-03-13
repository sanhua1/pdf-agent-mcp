import { loadPdfDocument } from '../pdf/pdfjsAdapter';
import { normalizePdfPath } from '../utils/path';

type OutlineNode = {
  title: string;
  page: number | null;
  children?: OutlineNode[];
};

export async function extractPdfOutline(input: { path: string }) {
  const normalizedPath = normalizePdfPath(input.path);
  const document = await loadPdfDocument(normalizedPath);

  try {
    const outlineItems = await document.getOutline();
    const convert = async (
      items: Array<{
        title: string;
        dest: string | Array<unknown> | null;
        items: Array<unknown>;
      }>
    ): Promise<OutlineNode[]> => {
      const nodes: OutlineNode[] = [];
      for (const item of items) {
        const node: OutlineNode = {
          title: item.title,
          page: await document.resolveDestinationToPage(item.dest)
        };

        const children = await convert(
          item.items as Array<{
            title: string;
            dest: string | Array<unknown> | null;
            items: Array<unknown>;
          }>
        );
        if (children.length > 0) {
          node.children = children;
        }

        nodes.push(node);
      }

      return nodes;
    };

    return {
      path: normalizedPath,
      outline: await convert(outlineItems),
      warnings: []
    };
  } finally {
    await document.close();
  }
}
