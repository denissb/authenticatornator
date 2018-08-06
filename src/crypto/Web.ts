import ICrypto from '../ICrypto';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HAS_CRYPTO = typeof window !== 'undefined' && !!(global as any).crypto;
const encoder = (global as any).TextEncoder ? new (global as any).TextEncoder('utf-8') : undefined;

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new global.Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return (global as any).btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const bufferToString = (buffer) => {
  const state = [];
  for (let i = 0; i < buffer.byteLength; i += 1) {
    /* tslint:disable */
    const index = (buffer[i] % CHARSET.length) | 0;
    /* tslint:enable */
    state.push(CHARSET[index]);
  }
  return state.join('').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

class NodeCrypto implements ICrypto {
  public async sha256(input: string) {
    const encoded = encoder.encode(input);
    const hashed = await (global as any).crypto.subtle.digest('SHA-256', encoded);
    return hashed;
  }

  public async base64UrlEncode(value: string) {
    return arrayBufferToBase64(value);
  }

  public async random(type: string) {
    const sizeInBytes = 64;
    const buffer = new Uint8Array(sizeInBytes);
    if (HAS_CRYPTO) {
      (global as any).crypto.getRandomValues(buffer);
    } else {
      // fall back to Math.random() if nothing else is available
      for (let i = 0; i < sizeInBytes; i += 1) {
        buffer[i] = Math.random();
      }
    }
    return bufferToString(buffer);
  }
}

export default NodeCrypto;