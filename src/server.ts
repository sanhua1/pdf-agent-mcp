import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { extractPdfOutline } from './tools/extractPdfOutline';
import { extractPdfPage } from './tools/extractPdfPage';
import { extractPdfText } from './tools/extractPdfText';
import { inspectPdf } from './tools/inspectPdf';

const toolNames = [
  'inspect_pdf',
  'extract_pdf_text',
  'extract_pdf_outline',
  'extract_pdf_page'
] as const;

const inspectPdfSchema = z.object({
  path: z.string().min(1)
});

const extractPdfTextSchema = z.object({
  path: z.string().min(1),
  page_range: z.string().optional(),
  mode: z.enum(['raw', 'lines', 'blocks']).optional(),
  normalize_whitespace: z.boolean().optional()
});

const extractPdfOutlineSchema = z.object({
  path: z.string().min(1)
});

const extractPdfPageSchema = z.object({
  path: z.string().min(1),
  page: z.number().int().positive(),
  mode: z.enum(['raw', 'blocks']).optional()
});

type ToolName = (typeof toolNames)[number];
type ToolSchemaMap = {
  inspect_pdf: typeof inspectPdfSchema;
  extract_pdf_text: typeof extractPdfTextSchema;
  extract_pdf_outline: typeof extractPdfOutlineSchema;
  extract_pdf_page: typeof extractPdfPageSchema;
};

type ToolHandlerMap = {
  inspect_pdf: (args: z.infer<typeof inspectPdfSchema>) => Promise<Record<string, unknown>>;
  extract_pdf_text: (args: z.infer<typeof extractPdfTextSchema>) => Promise<Record<string, unknown>>;
  extract_pdf_outline: (args: z.infer<typeof extractPdfOutlineSchema>) => Promise<Record<string, unknown>>;
  extract_pdf_page: (args: z.infer<typeof extractPdfPageSchema>) => Promise<Record<string, unknown>>;
};

const toolSchemas: ToolSchemaMap = {
  inspect_pdf: inspectPdfSchema,
  extract_pdf_text: extractPdfTextSchema,
  extract_pdf_outline: extractPdfOutlineSchema,
  extract_pdf_page: extractPdfPageSchema
};

const toolHandlers: ToolHandlerMap = {
  inspect_pdf: async (args) => inspectPdf(args),
  extract_pdf_text: async (args) => extractPdfText(args),
  extract_pdf_outline: async (args) => extractPdfOutline(args),
  extract_pdf_page: async (args) => extractPdfPage(args)
};

function createMcpServer() {
  const server = new McpServer({
    name: 'pdf-agent-mcp',
    version: '0.1.0'
  });

  server.registerTool(
    'inspect_pdf',
    {
      description: 'Inspect a local PDF and return document metadata and text-layer hints.',
      inputSchema: inspectPdfSchema
    },
    async (args) => {
      const result = await inspectPdf(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'extract_pdf_text',
    {
      description: 'Extract text from selected pages in raw, lines, or blocks mode.',
      inputSchema: extractPdfTextSchema
    },
    async (args) => {
      const result = await extractPdfText(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'extract_pdf_outline',
    {
      description: 'Read PDF outline/bookmark tree and resolve page numbers when possible.',
      inputSchema: extractPdfOutlineSchema
    },
    async (args) => {
      const result = await extractPdfOutline(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: result
      };
    }
  );

  server.registerTool(
    'extract_pdf_page',
    {
      description: 'Extract positioned text items from a single page.',
      inputSchema: extractPdfPageSchema
    },
    async (args) => {
      const result = await extractPdfPage(args);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: result
      };
    }
  );

  return server;
}

export function createServer() {
  const mcpServer = createMcpServer();
  let started = false;

  return {
    getToolNames() {
      return [...toolNames];
    },
    async callTool<TName extends ToolName>(
      toolName: TName,
      args: z.input<ToolSchemaMap[TName]>
    ): Promise<Record<string, unknown>> {
      const schema = toolSchemas[toolName];
      const parsedArgs = schema.parse(args);
      return toolHandlers[toolName](parsedArgs as never);
    },
    async start() {
      if (started) {
        return;
      }

      const transport = new StdioServerTransport();
      await mcpServer.connect(transport);
      started = true;
    }
  };
}
