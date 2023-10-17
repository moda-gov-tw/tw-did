import * as crypto from 'crypto';
import { SPTicket } from '.';

export function parseSpTicket(payload: string): SPTicket {
  const [body] = payload
    .split('.')
    .map((part) => Buffer.from(part, 'base64').toString('utf8'));

  const spTicket: SPTicket = JSON.parse(body);
  return spTicket;
}

export function generatePayload(...properties: string[]): string {
  return properties
    .map((p) => (p !== undefined && p !== null ? p : ''))
    .join('');
}

export function calculateChecksum(key: string, payload: string): string {
  const payloadHashHex = crypto
    .createHash('sha256')
    .update(payload, 'utf-8')
    .digest('hex');

  const payloadHashBuffer = Buffer.from(payloadHashHex, 'utf-8');

  const iv = Buffer.alloc(12).fill(0);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'base64'),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(payloadHashBuffer),
    cipher.final(),
    cipher.getAuthTag(),
  ]);

  return iv.toString('hex') + encrypted.toString('hex');
}

export function verifyChecksum(
  key: string,
  payload: string,
  checksum: string
): boolean {
  const binaryChecksum = Buffer.from(checksum, 'hex');
  const payloadHashHex = crypto
    .createHash('sha256')
    .update(payload, 'utf-8')
    .digest('hex');

  const iv = binaryChecksum.subarray(0, 12);
  const encrypted = binaryChecksum.subarray(12, binaryChecksum.length - 16);
  const authTag = binaryChecksum.subarray(
    binaryChecksum.length - 16,
    binaryChecksum.length
  );

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'base64'),
    iv
  );
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf-8') === payloadHashHex;
}
