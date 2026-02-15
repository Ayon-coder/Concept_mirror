import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import MentorMode from './components/MentorMode';
import ConceptMirrorMode from './components/ConceptMirrorMode';
import ApiKeyModal from './components/ApiKeyModal';
import { hasApiKey } from './services/geminiService';

function App() {
  const [activeMode, setActiveMode] = useState('mentor'); // 'mentor' or 'mirror'
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    setApiConfigured(hasApiKey());
  }, []);

  const handleApiKeySaved = () => {
    setApiConfigured(true);
    setShowApiModal(false);
  };

  return (
    <div className="app">
      <Header
        onOpenSettings={() => setShowApiModal(true)}
        apiConfigured={apiConfigured}
      />

      <main className="main-content">
        <ModeSelector
          activeMode={activeMode}
          onModeChange={setActiveMode}
        />

        <div className="mode-container">
          {activeMode === 'mentor' ? (
            <MentorMode />
          ) : (
            <ConceptMirrorMode />
          )}
        </div>
      </main>

      {showApiModal && (
        <ApiKeyModal
          onClose={() => setShowApiModal(false)}
          onSave={handleApiKeySaved}
        />
      )}
    </div>
  );
}

export default App;
