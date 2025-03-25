import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Add tools and resources to the MCP server.
 */
export default function setupServer() {
  const server = new McpServer({
    name: "ping",
    version: "1.0.0",
  });

  server.tool("echo", { message: z.string() }, async ({ message }) => ({
    content: [{ type: "text", text: "you said " + message }],
  }));
}
