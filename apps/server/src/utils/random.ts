import * as crypto from 'crypto';

export function getRandomHexString(): string {
  const byteLength = 16;
  const hexDigits = 16;
  return Array.from(crypto.getRandomValues(new Uint8Array(byteLength)))
    .map((b) => {
      return b.toString(hexDigits).padStart(2, '0');
    })
    .join('');
}
