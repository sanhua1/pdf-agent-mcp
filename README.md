# pdf-agent-mcp

<p align="right">
  <a href="#readme-zh">中文</a> | <a href="#readme-en">English</a>
</p>

## <a id="readme-zh"></a>中文

`pdf-agent-mcp` 是一个本地 MCP 服务，给 AI agent 提供 PDF 文本层读取能力。

### 工具列表

- `inspect_pdf`：检查 PDF 基本信息、页数、是否可能有文本层
- `extract_pdf_text`：按 `raw` / `lines` / `blocks` 抽取文本
- `extract_pdf_outline`：提取 PDF 目录（书签）
- `extract_pdf_page`：提取单页文本项和坐标

### 使用说明

环境要求：Node.js 22+

```bash
npm install
npm run dev
```

```bash
npm run lint
npm test
npm run build
```

推荐直接用 `npx` 启动：

```bash
npx -y github:sanhua1/pdf-agent-mcp
```

### Agent 自然语言交互示例

在 Claude/Codex 里可直接说：

1. `先帮我 inspect 这个 PDF：/path/to/doc.pdf`
2. `把 1-5 页按 lines 模式提取出来`
3. `第 10 页排版乱，改用 blocks 模式再提取一次`
4. `先读取目录，再按章节整理成 Markdown 摘要`

### Claude Code 配置方法

```json
{
  "mcpServers": {
    "pdf-agent-mcp": {
      "command": "npx",
      "args": ["-y", "github:sanhua1/pdf-agent-mcp"]
    }
  }
}
```

### Codex 配置方法

```toml
[mcp_servers.pdf-agent-mcp]
command = "npx"
args = ["-y", "github:sanhua1/pdf-agent-mcp"]
```

## <a id="readme-en"></a>English

`pdf-agent-mcp` is a local MCP server for extracting text-layer content from PDF files.

### Tools

- `inspect_pdf`: inspect metadata, page count, and text-layer hints
- `extract_pdf_text`: extract text in `raw` / `lines` / `blocks` modes
- `extract_pdf_outline`: read PDF bookmarks/outlines
- `extract_pdf_page`: extract text items with coordinates from a single page

### Quick Start

Requirement: Node.js 22+

```bash
npm install
npm run dev
```

Run with `npx`:

```bash
npx -y github:sanhua1/pdf-agent-mcp
```
