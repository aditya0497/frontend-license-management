import { rest } from 'msw';

interface CreateLicenseRequest {
  licenseType: string;
  expirationDate?: string; 
  hardwareId?: string; 
  usageLimit?: number;
}

interface EncryptFileRequest {
  file: string;
  licenseKey: string;
  encryptionType: 'AES' | 'RSA' | 'None';
}

export const handlers = [
  rest.post('/api/createLicense', (req, res, ctx) => {
    const { licenseType } = req.body as CreateLicenseRequest;
    const licenseKey = `${licenseType}-${Math.random().toString(36).substr(2, 9)}`;
    return res(ctx.status(200), ctx.json({ licenseKey }));
  }),
  
  rest.post('/api/encryptFile', (req, res, ctx) => {
    const { file, licenseKey, encryptionType } = req.body as EncryptFileRequest;
  
    // encryptionType (AES or RSA)
    let encryptedFile = '';
    
    if (encryptionType === 'AES') {
      encryptedFile = `${file}-encrypted-with-AES-and-license-${licenseKey}`;
    } else if (encryptionType === 'RSA') {
      encryptedFile = `${file}-encrypted-with-RSA-and-license-${licenseKey}`;
    } else {
      encryptedFile = `${file}-encrypted-with-unknown-method`;
    }
  
    return res(ctx.status(200), ctx.json({ encryptedFile }));
  }),  

  rest.post('/api/generateSecureLink', (_req, res, ctx) => {
    const secureLink = 'https://secure.example.com/share/1234';
    return res(ctx.status(200), ctx.json({ secureLink }));
  }),
];
