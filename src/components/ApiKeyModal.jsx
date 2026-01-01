import { useState } from 'react';
import { setApiKey } from '../services/geminiService';

function ApiKeyModal({ onClose, onSave }) {
    const [apiKey, setApiKeyValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!apiKey.trim()) return;

        setIsSaving(true);

        try {
            setApiKey(apiKey.trim());
            onSave();
        } catch (error) {
            console.error('Failed to save API key:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && apiKey.trim()) {
            handleSave();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">⚙️ API Configuration</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <p className="modal-description">
                        Enter your Gemini API key to enable AI-powered responses. Without an API key,
                        the assistant will run in demo mode with simulated responses.
                    </p>

                    <div className="modal-input-group">
                        <label className="modal-label" htmlFor="api-key">
                            Gemini API Key
                        </label>
                        <input
                            id="api-key"
                            type="password"
                            className="input"
                            placeholder="Enter your API key..."
                            value={apiKey}
                            onChange={(e) => setApiKeyValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <a
                            href="https://aistudio.google.com/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="modal-link"
                        >
                            🔑 Get your free API key from Google AI Studio →
                        </a>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!apiKey.trim() || isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save API Key'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApiKeyModal;
