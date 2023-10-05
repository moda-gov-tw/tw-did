import { generatePayload } from './utils';

describe('generatePayload', () => {
  it('should concatenate non-null and non-undefined properties', () => {
    const properties = ['a', 'b', null, undefined, 'c'];
    const result = generatePayload(...properties);
    expect(result).toBe('abc');
  });

  it('should return an empty string if the array is empty', () => {
    const properties: string[] = [];
    const result = generatePayload(...properties);
    expect(result).toBe('');
  });

  it('should handle arrays containing only null and undefined', () => {
    const properties = [null, undefined];
    const result = generatePayload(...properties);
    expect(result).toBe('');
  });
});
