import React, { useState } from 'react';
import './SecureSharing.css'; 

export const SecureSharing: React.FC = () => {
  const [secureLink, setSecureLink] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string>('');

  
  const handleGenerateLink = async () => {
    setError('');  
    try {
      const response = await fetch('/api/generateSecureLink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: 'encrypted-file-content' })
      });

      if (!response.ok) {
        throw new Error('Failed to generate secure link.');
      }

      const data = await response.json();
      setSecureLink(data.secureLink);
      setIsExpired(false);

      setTimeout(() => {
        setIsExpired(true);
      }, 1800000); // setting expiration to 30 minutes for now
    } catch (err) {
      setError('An error occurred while generating the secure link.');
    }
  };

  const handleEmailShare = () => {
    if (!secureLink) {
      return;
    }
    
    const emailSubject = 'Secure License and Encrypted File';
    const emailBody = `Here is your secure link for the license and encrypted file:\n\n${secureLink}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleDownloadEncryptedFile = async () => {
    try {
      const response = await fetch('/api/downloadEncryptedFile', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download the encrypted file.');
      }

      const fileBlob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.download = 'encrypted-file.bin'; 
      link.click();
    } catch (err) {
      setError('An error occurred while downloading the encrypted file.');
    }
  };

  return (
    <div className="secure-sharing-container">
      <button
        onClick={handleGenerateLink}
        className="generate-link-button"
      >
        Generate Secure Link
      </button>

      {secureLink && !isExpired && (
        <div className="secure-link-section">
          <p className="font-medium text-gray-700">Secure Link:</p>
          <a
            href={secureLink}
            target="_blank"
            rel="noopener noreferrer"
            className="secure-link"
          >
            {secureLink}
          </a>
        </div>
      )}

      {isExpired && (
        <div className="expired-message">
          <p>The secure link has expired and is no longer accessible.</p>
        </div>
      )}

      {secureLink && (
        <div>
          <button
            onClick={handleEmailShare}
            className="share-email-button"
          >
            Share via Email
          </button>
        </div>
      )}

      {secureLink && (
        <div>
          <button
            onClick={handleDownloadEncryptedFile}
            className="download-file-button"
          >
            Download Encrypted File
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
