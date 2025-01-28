import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EncryptionWorkflow } from './EncryptionWorkflow';

global.fetch = jest.fn();

describe('EncryptionWorkflow Component', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test('shows an error when trying to encrypt without a license key', async () => {
    render(<EncryptionWorkflow />);

    fireEvent.click(screen.getByText('Encrypt File'));

    fireEvent.change(screen.getByLabelText('Upload File'), {
      target: { files: [new File(['file content'], 'test.txt')] },
    });

    fireEvent.change(screen.getByPlaceholderText('Enter License Key'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByText('Encrypt'));

    await waitFor(() => screen.getByText('Please provide a license key.'));
    expect(screen.getByText('Please provide a license key.')).toBeInTheDocument();
  });

  test('shows an error when trying to encrypt without uploading a file', async () => {
    render(<EncryptionWorkflow />);

    fireEvent.click(screen.getByText('Encrypt File'));

    fireEvent.change(screen.getByPlaceholderText('Enter License Key'), {
      target: { value: 'testLicenseKey' },
    });

    fireEvent.click(screen.getByText('Encrypt'));

    await waitFor(() => screen.getByText('Please upload a file first.'));
    expect(screen.getByText('Please upload a file first.')).toBeInTheDocument();
  });
});
