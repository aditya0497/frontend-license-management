import React, { useState } from 'react';
import './EncryptionWorkflow.css';

export const EncryptionWorkflow: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [licenseKey, setLicenseKey] = useState('');
  const [encryptedFile, setEncryptedFile] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const handleEncryptFile = async () => {
    if (!file) {
      setError('Please upload a file first.');
      return;
    }
    if (!licenseKey) {
      setError('Please provide a license key.');
      return;
    }

    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('licenseKey', licenseKey);

    try {
      const response = await fetch('/api/encryptFile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to encrypt the file.');
      }

      const data = await response.json();
      setEncryptedFile(data.encryptedFile);
      setIsModalOpen(false);
    } catch (err) {
      setError('An error occurred during encryption.');
    }
  };

  return (
    <div className="encryption-container">
      <button onClick={() => setIsModalOpen(true)} className="encrypt-button">
        Encrypt File
      </button>

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h2 className="modal-title">Encrypt File</h2>

            <div className="input-container">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) setFile(e.target.files[0]);
                }}
                className="input-field"
              />
            </div>

            <div className="input-container">
              <input
                type="text"
                placeholder="Enter License Key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="input-field"
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button onClick={handleEncryptFile} className="encrypt-modal-button">
              Encrypt
            </button>

            {encryptedFile && (
              <div className="download-container">
                <p>Encrypted File:</p>
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(encryptedFile)}`}
                  download="encrypted.txt"
                  className="download-link"
                >
                  Download Encrypted File
                </a>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="close-modal-button"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
