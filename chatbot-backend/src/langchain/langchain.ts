import 'dotenv/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

type GeminiModelName = 'gemma-3-1b-it';

const RAW_KEYS: string =
  process.env.GOOGLE_API_KEYS ?? process.env.GOOGLE_API_KEY ?? '';

const API_KEYS: string[] = RAW_KEYS.split(',')
  .map((key) => key.trim())
  .filter((key): key is string => Boolean(key));

if (API_KEYS.length === 0) {
  throw new Error(
    'No API keys found. Set GOOGLE_API_KEYS=key1,key2,... (or GOOGLE_API_KEY).',
  );
}

let keyIndex = 0;

function getCurrentKey(): string {
  return API_KEYS[keyIndex];
}

function advanceKey(): string {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  return getCurrentKey();
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

function shouldRotateKey(err: unknown): boolean {
  const msg = getErrorMessage(err).toLowerCase();

  return (
    msg.includes('quota') ||
    msg.includes('resource has been exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('429') ||
    msg.includes('exceeded') ||
    msg.includes('insufficient') ||
    msg.includes('token')
  );
}

export async function handleQuestion(question: string): Promise<string> {
  let lastErr: unknown = null;

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const apiKey = getCurrentKey();
    try {
      const modelName: GeminiModelName = 'gemma-3-1b-it';
      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey,
      });
      const response = await model.invoke(question);
      return typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);
    } catch (err: unknown) {
      lastErr = err;
      if (!shouldRotateKey(err)) {
        throw err instanceof Error ? err : new Error(getErrorMessage(err));
      }
      advanceKey();
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error(`All API keys failed. Last error: ${getErrorMessage(lastErr)}`);
}
