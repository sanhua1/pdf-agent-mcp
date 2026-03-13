# Codex MCP Config Example

Add an MCP server entry in your Codex MCP config:

```toml
[mcp_servers.pdf-agent-mcp]
command = "npx"
args = ["-y", "github:sanhua1/pdf-agent-mcp"]
```

After saving config, restart the Codex client and verify the server is listed.
