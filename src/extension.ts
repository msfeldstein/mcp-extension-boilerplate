// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { findAvailablePort } from "./utils.js";
import setupServer from "./server.js";

export async function activate(context: vscode.ExtensionContext) {
  console.log("activatee mcp extension");

  const server = new McpServer({
    name: "ping",
    version: "1.0.0",
  });

  setupServer(server);

  const app = express();

  let transport: SSEServerTransport | null = null;

  app.get("/sse", (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
  });

  app.post("/messages", (req, res) => {
    if (transport) {
      transport.handlePostMessage(req, res);
    }
  });

  const port = await findAvailablePort(3000);
  app.listen(port);
  console.log(`MCP Server is running on port ${port}`);
  vscode.cursor.mcp.registerServer("ping", `http://localhost:${port}/sse`);
  vscode.window.showInformationMessage(`MCP Server is running on port ${port}`);
}

export function deactivate() {
  vscode.cursor.mcp.unregisterServer("ping");
}
