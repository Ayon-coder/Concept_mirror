function Header({ onOpenSettings, apiConfigured }) {
    return (
        <header className="header">
            <div className="header-brand">
                <div className="header-logo">🤖</div>
                <div>
                    <div className="header-title">AI Assistant</div>
                    <div className="header-subtitle">Mentor & Concept Mirror</div>
                </div>
            </div>

            <div className="header-actions">
                <div className={`api-status ${apiConfigured ? 'connected' : 'disconnected'}`}>
                    <span className="api-status-dot"></span>
                    <span>{apiConfigured ? 'API Connected' : 'Demo Mode'}</span>
                </div>

                <button className="settings-btn" onClick={onOpenSettings}>
                    <span>⚙️</span>
                    <span>Settings</span>
                </button>
            </div>
        </header>
    );
}

export default Header;
