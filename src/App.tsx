import { LicenseForm } from './components/LicenseForm';
import { EncryptionWorkflow } from './components/EncryptionWorkflow';
import { SecureSharing } from './components/SecureSharing';
import './App.css';

const sections = [
  { component: <LicenseForm />, title: 'License Form' },
  { component: <EncryptionWorkflow />, title: 'Encryption Workflow' },
  { component: <SecureSharing />, title: 'Secure Sharing' },
];

interface SectionCardProps {
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ children }) => (
  <div className="section-card">
    {children}
  </div>
);

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <h1 className="app-title">License Management Dashboard</h1>

        <div className="section-container">
          {sections.map((section, index) => (
            <section className="section" key={index}>
              <SectionCard>{section.component}</SectionCard>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
