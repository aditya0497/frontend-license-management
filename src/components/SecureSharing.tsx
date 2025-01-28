import React, { useState } from 'react';
import './SecureSharing.css';

export const SecureSharing: React.FC = () => {
  const [secureLink, setSecureLink] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerateLink = async () => {
    setError('');
    try {
      const response = await fetch('/api/generateSecureLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      }, 1800000); // 30 minutes expiry
    } catch (err) {
      setError('An error occurred while generating the secure link.');
    }
  };

  const handleEmailShare = () => {
    if (!secureLink) return;
    const emailSubject = 'Secure License and Encrypted File';
    const emailBody = `Here is your secure link:\n\n${secureLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  };

  const handleDownloadEncryptedFile = async () => {
    try {
      const response = await fetch('/api/downloadEncryptedFile', { method: 'GET' });

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
    <div>
      <button onClick={() => setIsOpen(true)} className="open-popup-btn">
        🔐 Secure Sharing
      </button>

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setIsOpen(false)}>✖</button>
            <h2 className="popup-title">🔒 Secure Sharing</h2>

            <button onClick={handleGenerateLink} className="action-button">
              Generate Secure Link
            </button>

            {secureLink && !isExpired && secureLink && (
              <div className="secure-link-container">
                <p>✅ Secure Link Generated:</p>
                <a href={secureLink} target="_blank" rel="noopener noreferrer" className="secure-link">
                  {secureLink}
                </a>
              </div>
            )}

            {isExpired && (
              <div className="expired-message">
                <p>⚠️ This link has expired.</p>
              </div>
            )}

            {secureLink && (
              <>
                <button onClick={handleEmailShare} className="action-button email-btn">
                  ✉️ Share via Email
                </button>
                <button onClick={handleDownloadEncryptedFile} className="action-button download-btn">
                  ⬇️ Download File
                </button>
              </>
            )}

            {error && <p className="error-message">⚠️ {error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};