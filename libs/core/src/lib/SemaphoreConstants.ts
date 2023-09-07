import { TKeyType } from '@veramo/core';
import { ContextDoc } from '@veramo/credential-ld';

export const SEMAPHORE_TYPE = 'Semaphore2023' as TKeyType;
export const SEMAPHORE_HIDDEN_PUBLIC_KEY = '00000000000000';
export const SEMAPHORE_CONTEXT_URI = 'https://tw-did.github.io/context';
export const SEMAPHORE_EXTRA_CONTEXTS: Record<string, ContextDoc> = {
  [SEMAPHORE_CONTEXT_URI]: {
    '@context': {
      group: SEMAPHORE_CONTEXT_URI,
    },
  },
};
