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
}

export const handlers = [
  rest.post('/api/createLicense', (req, res, ctx) => {
    const { licenseType } = req.body as CreateLicenseRequest;
    const licenseKey = `${licenseType}-${Math.random().toString(36).substr(2, 9)}`;
    return res(ctx.status(200), ctx.json({ licenseKey }));
  }),

  rest.post('/api/encryptFile', (req, res, ctx) => {
    const { file, licenseKey } = req.body as EncryptFileRequest;
    const encryptedFile = `${file}-encrypted-with-${licenseKey}`;
    return res(ctx.status(200), ctx.json({ encryptedFile }));
  }),

  rest.get('/api/generateLink', (_req, res, ctx) => {
    const secureLink = 'https://secure.example.com/share/abcd1234';
    return res(ctx.status(200), ctx.json({ secureLink }));
  }),

  rest.post('/api/generateSecureLink', (_req, res, ctx) => {
    const secureLink = 'https://secure.example.com/share/abcd1234';
    return res(ctx.status(200), ctx.json({ secureLink }));
  }),
];
