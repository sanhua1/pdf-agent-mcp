# pdf-agent-mcp

`pdf-agent-mcp` 是一个本地 MCP 服务，给 AI agent 提供 PDF 文本层读取能力。

## 工具列表

- `inspect_pdf`：检查 PDF 基本信息、页数、是否可能有文本层
- `extract_pdf_text`：按 `raw` / `lines` / `blocks` 抽取文本
- `extract_pdf_outline`：提取 PDF 目录（书签）
- `extract_pdf_page`：提取单页文本项和坐标

## 使用说明

环境要求：

- Node.js 22+

本地开发：

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run lint
npm test
npm run build
```

MCP 客户端推荐直接用 `npx` 启动：

```bash
npx -y github:sanhua1/pdf-agent-mcp
```

## Agent 自然语言交互示例

你可以在 Claude/Codex 里直接说：

1. `先帮我 inspect 这个 PDF：/path/to/doc.pdf`
2. `把 1-5 页按 lines 模式提取出来`
3. `第 10 页排版乱，改用 blocks 模式再提取一次`
4. `先读取目录，再按章节整理成 Markdown 摘要`

## Claude Code 配置方法

在 Claude Code MCP 配置中添加：

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

## Codex 配置方法

在 Codex 配置里添加：

```toml
[mcp_servers.pdf-agent-mcp]
command = "npx"
args = ["-y", "github:sanhua1/pdf-agent-mcp"]
```
