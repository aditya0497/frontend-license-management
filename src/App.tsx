import { LicenseForm } from "./components/LicenseForm";
import { EncryptionWorkflow } from "./components/EncryptionWorkflow";
import { SecureSharing } from "./components/SecureSharing";
import "./App.css";

const sections = [
  { component: <LicenseForm />, step: 1 },
  { component: <EncryptionWorkflow />, step: 2 },
  { component: <SecureSharing />, step: 3 },
];

interface SectionCardProps {
  children: React.ReactNode;
  step: number;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, step }) => (
  <div className="section-card">
    <div className="step-indicator">{step}</div>
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
              <SectionCard step={section.step}>
                {section.component}
              </SectionCard>
              {index < sections.length - 1 && <div className="step-arrow">↓</div>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
