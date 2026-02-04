import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { env_vars } from '../tools/env/envVars';

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
    msg.includes('quota exceeded');

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

export async function handleQuestion(question: string): Promise<string> {
  let lastErr: unknown = null;

  console.log("working on it");
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const apiKey = getCurrentKey();
    try {
      const modelName = env_vars.AI_MODEL;
      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey,
      });
      console.log("attempt", attempt);
      const response = await model.invoke(question);
      console.log("finished", attempt);
      return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
    } catch (err: unknown) {
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
