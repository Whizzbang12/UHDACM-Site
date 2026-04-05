"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const context_js_1 = require("./context/context.js");
const server = new mcp_js_1.McpServer({
    name: "uhd-acm-chatbot-server",
    version: "1.0.0"
});
server.tool("search_club_info", "Searches the UHD ACM database for club events, leadership, meeting times, media, and general club information. Use this when the user asks a question requiring factual knowledge.", {
    query: zod_1.z.string().describe("The search query to look up in the database. Keep it concise (e.g., 'web development workshop', 'president').")
}, async ({ query }) => {
    try {
        const results = await (0, context_js_1.queryCollection)(query);
        const formattedResults = results.map(([doc, metadata]) => {
            return `--- Document ---\n${doc}\n--- Metadata ---\n${JSON.stringify(metadata, null, 2)}`;
        }).join('\n\n');
        return {
            content: [{ type: "text", text: formattedResults || "No results found." }]
        };
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error searching database: ${error.message}` }],
            isError: true
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("UHD ACM MCP Server is running...");
}
main().catch(console.error);
