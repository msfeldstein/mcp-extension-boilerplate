import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Add tools and resources to the MCP server.
 */
export default function setupServer(server: McpServer) {
  server.tool("echo", { message: z.string() }, async ({ message }) => ({
    content: [{ type: "text", text: "you said " + message }],
  }));

  server.resource(
    "example-resource",
    "https://example.com/resource",
    async () => ({
      contents: [
        { text: "some contents", uri: "https://example.com/resource" },
      ],
    })
  );
}
