// this test requires logger env to be true.

import { it, expect, describe } from 'vitest';
import { LogMessage } from './log';
import { env_vars } from '../env/envVars';

describe('log.test.ts', () => {
  describe('log', () => {
    it('should enable logger', () => {
      expect(env_vars.ENABLE_LOGGER).toBe(true);
    })

    it('should succeed sending standard messages', async () => {
      expect(await LogMessage('Hello world')).toBe(true)
      expect(await LogMessage('AOSICJajscPoascpoajscpoajspoc')).toBe(true)
      expect(await LogMessage('AHHHHHHHHHHHHHHHHH')).toBe(true)
      expect(await LogMessage('Wha?')).toBe(true)
      expect(await LogMessage('Hell nah')).toBe(true)
    });


    it('should succeed sending standard messages with metadata', async () => {
      expect(await LogMessage('404 Hello world', {
        'error': 'Hell yeah'
      })).toBe(true);
      expect(await LogMessage('AOSICJajscPoascpoajscpoajspoc', {
        'info': 'Random string'
      })).toBe(true);
      expect(await LogMessage('AHHHHHHHHHHHHHHHHH', {
        'warning': 'Screaming detected'
      })).toBe(true);
      expect(await LogMessage('Wha?', {
        'question': 'Confusion'
      })).toBe(true);
      expect(await LogMessage('Hell nah', {
        'response': 'Negative reaction'
      })).toBe(true);
    })
  })
});