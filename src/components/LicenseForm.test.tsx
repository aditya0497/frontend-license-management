import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LicenseForm } from './LicenseForm';

global.fetch = jest.fn();

describe('LicenseForm Component', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
        window.alert = jest.fn(); 
    
        Object.defineProperty(navigator, 'clipboard', {
          value: {
            writeText: jest.fn(),
          },
          writable: true,
        });
      });      

  test('renders form and modal correctly', () => {
    render(<LicenseForm />);

    expect(screen.queryByText('Create a New License')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Create New License'));
    
    expect(screen.getByText('Create a New License')).toBeInTheDocument();
    expect(screen.getByText('Generate License')).toBeInTheDocument();
  });

  test('generates a license key successfully', async () => {
    const mockLicenseKey = 'mockedLicenseKey123';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ licenseKey: mockLicenseKey }),
    });

    render(<LicenseForm />);

    fireEvent.click(screen.getByText('Create New License'));

    fireEvent.change(screen.getByLabelText('Expiration Date'), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText('Generate License'));

    await waitFor(() => {
      expect(screen.getByText(mockLicenseKey)).toBeInTheDocument();
    });
  });

  test('shows error when license generation fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to generate license'));

    render(<LicenseForm />);

    fireEvent.click(screen.getByText('Create New License'));

    fireEvent.change(screen.getByLabelText('Expiration Date'), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText('Generate License'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to generate license. Please try again.');
    });
  });

  test('copies license key to clipboard', async () => {
    const mockLicenseKey = 'mockedLicenseKey123';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ licenseKey: mockLicenseKey }),
    });

    render(<LicenseForm />);

    fireEvent.click(screen.getByText('Create New License'));

    fireEvent.change(screen.getByLabelText('Expiration Date'), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText('Generate License'));

    await waitFor(() => {
      expect(screen.getByText(mockLicenseKey)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Copy License'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockLicenseKey);
    });
  });

  test('downloads license as JSON file', async () => {
    const mockLicenseKey = 'mockedLicenseKey123';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ licenseKey: mockLicenseKey }),
    });
  
    global.URL.createObjectURL = jest.fn();
  
    render(<LicenseForm />);
  
    fireEvent.click(screen.getByText('Create New License'));
  
    fireEvent.change(screen.getByLabelText('Expiration Date'), { target: { value: '2025-01-01' } });
    fireEvent.click(screen.getByText('Generate License'));
  
    await waitFor(() => {
      expect(screen.getByText(mockLicenseKey)).toBeInTheDocument();
    });
  
    const createElementSpy = jest.spyOn(document, 'createElement');
    
    const downloadButton = screen.getByText('Download License');
    fireEvent.click(downloadButton);
  
    expect(createElementSpy).toHaveBeenCalledWith('a');
  
    expect(URL.createObjectURL).toHaveBeenCalled();
  
    createElementSpy.mockRestore();
  });  
});
