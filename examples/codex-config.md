# Codex MCP Config Example

Add an MCP server entry in your Codex MCP config:

```toml
[mcp_servers.pdf-agent-mcp]
command = "node"
args = ["dist/index.js"]
cwd = "/path/to/pdf-agent-mcp"
```

After saving config, restart the Codex client and verify the server is listed.
