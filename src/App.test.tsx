import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/LicenseForm', () => ({
  LicenseForm: () => <div>License Form Component</div>,
}));

jest.mock('./components/EncryptionWorkflow', () => ({
  EncryptionWorkflow: () => <div>Encryption Workflow Component</div>,
}));

jest.mock('./components/SecureSharing', () => ({
  SecureSharing: () => <div>Secure Sharing Component</div>,
}));

describe('App Component', () => {
  it('should render the app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/License Management Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('should render LicenseForm component inside a section card', () => {
    render(<App />);
    const sectionTitle = screen.getByText(/License Form Component/i);
    const sectionCard = sectionTitle.closest('.section-card');
    expect(sectionCard).toBeInTheDocument();
  });

  it('should render EncryptionWorkflow component inside a section card', () => {
    render(<App />);
    const sectionTitle = screen.getByText(/Encryption Workflow Component/i);
    const sectionCard = sectionTitle.closest('.section-card');
    expect(sectionCard).toBeInTheDocument();
  });

  it('should render SecureSharing component inside a section card', () => {
    render(<App />);
    const sectionTitle = screen.getByText(/Secure Sharing Component/i);
    const sectionCard = sectionTitle.closest('.section-card');
    expect(sectionCard).toBeInTheDocument();
  });
});
