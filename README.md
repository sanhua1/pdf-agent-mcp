# pdf-agent-mcp

## 中文说明

`pdf-agent-mcp` 是一个本地 MCP 服务，用来为 Claude/Codex 等 agent 提供稳定的 PDF 文本层读取能力。  
它是“能力层”，不是“一步到位 PDF 转 Markdown 黑盒”。

### 公共工具

- `inspect_pdf`：检查 PDF 基本信息并判断是否可能存在文本层。
- `extract_pdf_text`：按 `raw` / `lines` / `blocks` 三种模式抽取文本。
- `extract_pdf_outline`：提取书签/目录树。
- `extract_pdf_page`：提取单页定位文本项（含坐标）。

### 支持范围

- 仅支持本地 `.pdf` 文件路径输入。
- 仅处理可抽取文本层的 PDF。
- 输出结构化 JSON，供 agent 二次加工成 Markdown。

### 非目标（v0.1.0）

- OCR（扫描件识别）
- 复杂表格完美还原
- 远程 URL 拉取
- 服务端直接生成最终 Markdown

### 环境要求

- Node.js 22+
- npm 10+

### 使用方式

安装依赖：

```bash
npm install
```

本地开发启动（stdio MCP）：

```bash
npm run dev
```

直接用 GitHub 仓库通过 `npx` 启动（推荐配置到 MCP 客户端）：

```bash
npx -y github:sanhua1/pdf-agent-mcp
```

构建：

```bash
npm run build
```

测试：

```bash
npm test
```

### 推荐调用流程

1. 先调用 `inspect_pdf`。
2. 若 `has_text_layer=true`，调用 `extract_pdf_text`，推荐 `mode="lines"`。
3. 某页排版复杂时，调用 `extract_pdf_page`（`mode="blocks"`）做精细重建。
4. 需要章节结构时再调用 `extract_pdf_outline`。
5. 最终 Markdown 由 agent 负责组织。

### 接入示例

- `examples/claude-config.json`
- `examples/codex-config.md`
- `examples/sample-prompts.md`

最小 Codex/Claude 配置核心参数：

```json
{
  "command": "npx",
  "args": ["-y", "github:sanhua1/pdf-agent-mcp"]
}
```

### 已知限制

- 无文本层的扫描件会返回告警，文本结果可能为空或很少。
- 多栏/复杂布局页面可能需要额外后处理。
- 目录目标页解析受 PDF 生产器实现差异影响。

---

## English

`pdf-agent-mcp` is a local MCP server that provides stable PDF text-layer extraction for agent workflows.  
It is a capability layer, not a one-shot PDF-to-Markdown black box.

### Public Tools

- `inspect_pdf`: inspect metadata and infer text-layer availability.
- `extract_pdf_text`: extract text in `raw`, `lines`, or `blocks` mode.
- `extract_pdf_outline`: extract bookmark/outline tree.
- `extract_pdf_page`: extract positioned text items for one page.

### Scope

- Local `.pdf` path input only.
- Text-layer extraction with structured JSON output.
- Agent-first architecture for downstream Markdown formatting.

### Non-goals (v0.1.0)

- OCR fallback
- Perfect table reconstruction
- Remote URL fetching
- Server-side final Markdown generation

### Quick Start

```bash
npm install
npm run dev
```

Run directly from GitHub via `npx` (recommended for MCP client config):

```bash
npx -y github:sanhua1/pdf-agent-mcp
```

Useful commands:

```bash
npm run lint
npm test
npm run build
```

### Typical Workflow

1. Call `inspect_pdf`.
2. If `has_text_layer=true`, call `extract_pdf_text` with `mode="lines"`.
3. For difficult layout pages, call `extract_pdf_page` with `mode="blocks"`.
4. Optionally call `extract_pdf_outline` for chapter structure.
5. Let the agent produce final Markdown.
