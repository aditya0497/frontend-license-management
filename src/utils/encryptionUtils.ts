import { AES, enc } from 'crypto-js';

export const encryptFile = (content: string, key: string): string => {
  const encrypted = AES.encrypt(content, key).toString();
  return encrypted;
};

export const base64Encode = (text: string): string => {
  return Buffer.from(text).toString('base64');
};

export const decryptFile = (encryptedContent: string, key: string): string => {
  const bytes = AES.decrypt(encryptedContent, key);
  return bytes.toString(enc.Utf8);
};

