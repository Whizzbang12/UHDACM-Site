import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { env_vars } from '../tools/env/envVars';
import { LogMessage } from '../log/log';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const API_KEYS = env_vars.AI_APIKEYS;
let keyIndex = 0;

function normalizeKeyIndex() {
  if (!Number.isFinite(keyIndex) || keyIndex < 0) keyIndex = 0;
  if (API_KEYS.length > 0) keyIndex = keyIndex % API_KEYS.length;
}

function getCurrentKey(): string {
  normalizeKeyIndex();
  return API_KEYS[keyIndex];
}

function advanceKey(): string {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  return getCurrentKey();
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function shouldRotateKey(err: unknown): boolean {
  const msg = getErrorMessage(err).toLowerCase();

  const quotaLike =
    msg.includes('429') ||
    msg.includes('too many requests') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('quota') ||
    msg.includes('resource has been exhausted') ||
    msg.includes('resource exhausted') ||
    msg.includes('exceeded quota') ||
    msg.includes('quota exceeded') || msg.includes('expired');

  const transient =
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('fetch failed') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout') ||
    msg.includes('enotfound') ||
    msg.includes('503') ||
    msg.includes('502') ||
    msg.includes('500') ||
    msg.includes('temporarily unavailable');

  return quotaLike || transient;
}

let mcpClient: Client | null = null;
let mcpTools: DynamicStructuredTool[] = [];

async function initializeMCP() {
  try{
    if (mcpClient) return; 

    const transport = new StdioClientTransport({
      command: "node",
      args: ["./dist/chatbot-backend/src/MCPServer.js"],
    });

    mcpClient = new Client({ name: "uhd-acm-client", version: "1.0.0" }, { capabilities: {} });
    await mcpClient.connect(transport);

    const { tools } = await mcpClient.listTools();

    mcpTools = tools.map((t) => {
      return new DynamicStructuredTool({
        name: t.name,
        description: t.description || "", 
        schema: z.object({ query: z.string().describe("The search query") }),
        func: async ({ query }) => {
          const result = await mcpClient!.callTool({
            name: t.name,
            arguments: { query },
          });
          return (result as any).content[0]?.text || "No results found.";
        },
      });
    });
  } catch (err) {
    await LogMessage("Error initializing MCP client", {
      function: 'initializeMCP',
      error: getErrorMessage(err)
    });
    throw new Error("\n \nRun npm run build\n You need the dist folder to be built before starting the server. \n \n");
  }
}

initializeMCP() 

export async function handleQuestion(question: string): Promise<string> {
  let lastErr: unknown = null;
  console.log("working on it");
  const systemInstruction = `You are the official UHD ACM (Association for Computing Machinery) chatbot. 
  Your sole purpose is to assist students with questions about the UHD ACM club, its events, officers, and computer science topics. 
  If a user asks you to do something unrelated to the club, computer science, or UHD (like writing a story, answering general trivia, or roleplaying), you MUST politely decline and steer the conversation back to UHD ACM.`;
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const apiKey = getCurrentKey();
    try {
      const modelName = env_vars.AI_MODEL;
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey,
        apiVersion: "v1beta",
      }).bindTools(mcpTools);
      console.log("attempt", attempt);
      const response = await model.invoke([
        ["system", systemInstruction],
        ["human", question]
      ]);
      // Token usage
      if (response.usage_metadata) {
        console.log(`📊 [Tokens - Initial] Input: ${response.usage_metadata.input_tokens} | Output: ${response.usage_metadata.output_tokens} | Total: ${response.usage_metadata.total_tokens}`);
      }
      //Check if the database use is necessary
      if (response.tool_calls && response.tool_calls.length > 0) {
        const toolCall = response.tool_calls[0];
        const tool = mcpTools.find(t => t.name === toolCall.name);

        if (tool) {
          console.log(`[Tool Called] Searching for:`, toolCall.args);
          const toolResult = await tool.invoke(toolCall.args as any);
          const finalResponse = await model.invoke([
            ["system", systemInstruction], 
            ["human", question],
            response,
            { role: "tool", tool_call_id: toolCall.id, name: tool.name, content: toolResult }
          ]);
          if (finalResponse.usage_metadata) {
            console.log(`📊 [Tokens - Final] Input: ${finalResponse.usage_metadata.input_tokens} | Output: ${finalResponse.usage_metadata.output_tokens} | Total: ${finalResponse.usage_metadata.total_tokens}`);
          }

          console.log("finished with tool", attempt);
          return typeof finalResponse.content === "string"
            ? finalResponse.content
            : JSON.stringify(finalResponse.content);
        }
      }

      console.log("finished direct", attempt);
      return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    } catch (err: unknown) {
      console.error(err);
      lastErr = err;
      if (!shouldRotateKey(err)) {
        await LogMessage((err as Error).message, {
          function: 'handleQuestion'
        })
        throw err instanceof Error ? err : new Error(getErrorMessage(err));
      }
      advanceKey();
    }
  }
  throw new Error(
    `All API keys failed. Last error: ${getErrorMessage(lastErr)}`,
  );
}
