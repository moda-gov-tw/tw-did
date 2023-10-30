import { TKeyType } from '@veramo/core';

export const SEMAPHORE_GROUP_ID = 1;
export const SEMAPHORE_GROUP_DEPTH = 20;
export const SEMAPHORE_HIDDEN_DID = 'did:web:tw-did.github.io:hidden';
export const SEMAPHORE_DID_ALIAS = 'semaphore';
export const SEMAPHORE_TYPE = 'Semaphore2023' as TKeyType;
export const SEMAPHORE_HIDDEN_PUBLIC_KEY = '00000000000000';
export const SEMAPHORE_CONTEXT_URI = 'https://tw-did.github.io/context';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SEMAPHORE_EXTRA_CONTEXTS: Record<string, any> = {
  [SEMAPHORE_CONTEXT_URI]: {
    '@context': {
      group: SEMAPHORE_CONTEXT_URI,
    },
  },
};
