import React, { useState, useEffect } from 'react';
import './LicenseForm.css';

const API_URL = '/api/createLicense';
const MAX_LICENSES_PER_DAY = 5;

const createLicense = async (licenseDetails: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(licenseDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to generate license');
  }

  const data = await response.json();
  return data.licenseKey;
};

export const LicenseForm: React.FC = () => {
  const [licenseType, setLicenseType] = useState('time-bound');
  const [expirationDate, setExpirationDate] = useState('');
  const [hardwareId, setHardwareId] = useState('');
  const [usageLimit, setUsageLimit] = useState(0);
  const [licenseKey, setLicenseKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [licenseCount, setLicenseCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('licenseDate');
    const storedCount = parseInt(localStorage.getItem('licenseCount') || '0', 10);

    if (storedDate === today) {
      setLicenseCount(storedCount);
      setIsRateLimited(storedCount >= MAX_LICENSES_PER_DAY);
    } else {
      localStorage.setItem('licenseDate', today);
      localStorage.setItem('licenseCount', '0');
    }
  }, []);

  const validateForm = () => {
    const formErrors: any = {};

    if (!licenseType) formErrors.licenseType = 'License type is required';
    if (licenseType === 'time-bound' && !expirationDate) formErrors.expirationDate = 'Expiration date is required';
    if (licenseType === 'hardware-specific' && !hardwareId) formErrors.hardwareId = 'Hardware ID is required';
    if (licenseType === 'usage-limited' && !usageLimit) formErrors.usageLimit = 'Usage limit is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleGenerateLicense = async () => {
    if (isRateLimited) {
      alert(`You have reached the daily limit of ${MAX_LICENSES_PER_DAY} licenses.`);
      return;
    }

    if (!validateForm()) return;

    const licenseDetails = { licenseType, expirationDate, hardwareId, usageLimit };

    setIsGenerating(true);
    try {
      const generatedKey = await createLicense(licenseDetails);
      setLicenseKey(generatedKey);

      const newCount = licenseCount + 1;
      setLicenseCount(newCount);
      localStorage.setItem('licenseCount', newCount.toString());
      if (newCount >= MAX_LICENSES_PER_DAY) {
        setIsRateLimited(true);
      }
    } catch (error) {
      console.error('Error generating license:', error);
      alert('Failed to generate license. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerateLicense();
  };

  const handleCopyLicense = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      alert('License key copied to clipboard!');
    }
  };

  const handleDownloadLicense = () => {
    if (licenseKey) {
      const fileContent = JSON.stringify({ licenseKey }, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'license.json';
      link.click();
    }
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)} className="btn-primary">
        Create New License
      </button>

      {isModalOpen && (
        <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`}>
          <div className={`modal-content ${isModalOpen ? 'open' : ''}`}>
            <button onClick={() => setIsModalOpen(false)} className="close-btn">✕</button>
            <h2 className="form-header">Create a New License</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="input-group">
                <label htmlFor="licenseType" className="label">License Type</label>
                <select
                  id="licenseType"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="input-field"
                >
                  <option value="time-bound">Time-bound</option>
                  <option value="usage-limited">Usage-limited</option>
                  <option value="hardware-specific">Hardware-specific</option>
                </select>
                {errors.licenseType && <p className="error-text">{errors.licenseType}</p>}
              </div>

              {licenseType === 'time-bound' && (
                <div className="input-group">
                  <label htmlFor="expirationDate" className="label">Expiration Date</label>
                  <input
                    type="date"
                    id="expirationDate"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="input-field"
                  />
                  {errors.expirationDate && <p className="error-text">{errors.expirationDate}</p>}
                </div>
              )}

              {licenseType === 'hardware-specific' && (
                <div className="input-group">
                  <label htmlFor="hardwareId" className="label">Hardware ID / MAC Address</label>
                  <input
                    type="text"
                    id="hardwareId"
                    value={hardwareId}
                    onChange={(e) => setHardwareId(e.target.value)}
                    className="input-field"
                  />
                  {errors.hardwareId && <p className="error-text">{errors.hardwareId}</p>}
                </div>
              )}

              {licenseType === 'usage-limited' && (
                <div className="input-group">
                  <label htmlFor="usageLimit" className="label">Usage Limit</label>
                  <input
                    type="number"
                    id="usageLimit"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="input-field"
                  />
                  {errors.usageLimit && <p className="error-text">{errors.usageLimit}</p>}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isGenerating || isRateLimited}>
                {isGenerating ? 'Generating...' : 'Generate License'}
              </button>

              {isRateLimited && <p className="error-text">Daily limit reached. Try again tomorrow.</p>}
            </form>

            {licenseKey && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Generated License Key</h3>
                <pre className="mt-2 p-3 bg-gray-100 border rounded">{licenseKey}</pre>
                <div className="mt-4 flex gap-2">
                  <button onClick={handleCopyLicense} className="btn-copy">Copy License</button>
                  <button onClick={handleDownloadLicense} className="btn-download">Download License</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
