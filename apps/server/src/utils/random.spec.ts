import { getRandomHexString } from './random';

describe('getRandomHexString', () => {
  it('should return a string of length 32', () => {
    const result = getRandomHexString();
    expect(result.length).toBe(32);
  });

  it('should only contain hexadecimal characters', () => {
    const result = getRandomHexString();
    expect(/^[0-9a-fA-F]+$/.test(result)).toBeTruthy();
  });
});
