import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { queryCollection } from "./context/context.js";

const server = new McpServer({
  name: "uhd-acm-chatbot-server",
  version: "1.0.0"
});

server.tool(
  "search_club_info",
  "Searches the UHD ACM database for club events, leadership, meeting times, media, and general club information. Use this when the user asks a question requiring factual knowledge.",
  {
    query: z.string().describe("The search query to look up in the database. Keep it concise (e.g., 'web development workshop', 'president').")
  },
  async ({ query }) => {
    try {
      const results = await queryCollection(query);
      const formattedResults = results.map(([doc, metadata]) => {
        return `Document\n${doc}\nMetadata\n${JSON.stringify(metadata, null, 2)}`;
      }).join('\n\n');

      return {
        content: [{ type: "text", text: formattedResults || "No results found." }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching database: ${(error as Error).message}` }],
        isError: true
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("UHD ACM MCP Server is running..."); 
}

main().catch(console.error);