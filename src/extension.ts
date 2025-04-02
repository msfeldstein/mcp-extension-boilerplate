// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { findAvailablePort } from "./utils.js";
import setupServer from "./server.js";

console.log("LOADED A FILE EVEN");
export async function activate(context: vscode.ExtensionContext) {
  console.log("activatee mcp extension");


  const server = setupServer();

  const app = express();

  let transport: SSEServerTransport | null = null;

  app.get("/sse", (req, res) => {
    // Configure headers to prevent timeout
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    
    transport = new SSEServerTransport("/messages", res);
    server.connect(transport);
    
    // Send a heartbeat every 30 seconds
    const heartbeat = setInterval(() => {
      res.write('event: heartbeat\ndata: ping\n\n');
    }, 30000);
    
    // Clean up on connection close
    req.on('close', () => {
      clearInterval(heartbeat);
      transport = null;
    });
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
