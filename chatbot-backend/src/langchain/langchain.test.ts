import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest';

type modelResponse = { content: unknown };

let invokeMock: MockedFunction<(input: string) => Promise<modelResponse>>;
let createdOpts: any[];

async function importFreshModule() {
  vi.resetModules();

  // cleans per import
  invokeMock = vi.fn();
  createdOpts = [];

  // doMock is NOT hoisted
  vi.doMock('../tools/env/envVars', () => ({
    env_vars: {
      AI_APIKEYS: ['KEY_1', 'KEY_2', 'KEY_3'],
      AI_MODEL: 'test-model',
    },
  }));

  class ChatGoogleGenerativeAI {
    constructor(opts: any) {
      createdOpts.push(opts);
    }
    invoke(input: string) {
      return invokeMock(input);
    }
  }

  // ✅ doMock is NOT hoisted
  vi.doMock('@langchain/google-genai', () => ({
    ChatGoogleGenerativeAI,
  }));

  const mod = await import('./langchain');
  return { ...mod, createdOpts };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('handleQuestion', () => {
  it('returns string content when model returns string content', async () => {
    const { handleQuestion } = await importFreshModule();
    invokeMock.mockResolvedValueOnce({ content: 'hello' });

    await expect(handleQuestion('hi')).resolves.toBe('hello');
  });

  it('stringifies non-string content', async () => {
    const { handleQuestion } = await importFreshModule();
    invokeMock.mockResolvedValueOnce({ content: { a: 1 } });

    await expect(handleQuestion('hi')).resolves.toBe(JSON.stringify({ a: 1 }));
  });

  it('rotates key on quota/rate-limit style errors then succeeds', async () => {
    const { handleQuestion, createdOpts } = await importFreshModule();

    invokeMock
      .mockRejectedValueOnce(new Error('429 Too Many Requests'))
      .mockResolvedValueOnce({ content: 'worked' });

    await expect(handleQuestion('hi')).resolves.toBe('worked');

    // KEY_1 then KEY_2
    expect(createdOpts[0].apiKey).toBe('KEY_1');
    expect(createdOpts[1].apiKey).toBe('KEY_2');
  });

  it('does NOT rotate on non-transient errors (throws immediately)', async () => {
    const { handleQuestion, createdOpts } = await importFreshModule();

    invokeMock.mockRejectedValueOnce(new Error('some validation error'));

    await expect(handleQuestion('hi')).rejects.toThrow('some validation error');
    expect(createdOpts).toHaveLength(1); // only first key attempted
  });

  it('when all keys fail with rotatable errors, throws after trying all keys', async () => {
    const { handleQuestion, createdOpts } = await importFreshModule();

    invokeMock
      .mockRejectedValueOnce(new Error('quota exceeded'))
      .mockRejectedValueOnce(new Error('rate limit'))
      .mockRejectedValueOnce(new Error('rate limit'));

    await expect(handleQuestion('hi')).rejects.toThrow(/All API keys failed/i);
    expect(createdOpts).toHaveLength(3);
    expect(createdOpts[0].apiKey).toBe('KEY_1');
    expect(createdOpts[1].apiKey).toBe('KEY_2');
    expect(createdOpts[2].apiKey).toBe('KEY_3');
  });
});
