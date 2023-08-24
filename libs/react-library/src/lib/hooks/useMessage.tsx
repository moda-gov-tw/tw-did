import { MessageAction, NoOpenerError } from '@tw-did/core';

export function useMessage<T>(origin = '*') {
  const postMessage = (action: MessageAction, payload?: T) => {
    if (!window.opener) {
      throw new NoOpenerError();
    } else {
      const msg = JSON.parse(JSON.stringify({ action, payload }));
      window.opener.postMessage(msg, origin);
    }
  };

  return { postMessage };
}
