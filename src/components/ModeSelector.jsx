function ModeSelector({ activeMode, onModeChange }) {
    return (
        <div className="mode-selector">
            <div className="mode-selector-inner">
                <button
                    className={`mode-btn ${activeMode === 'mentor' ? 'active' : ''}`}
                    onClick={() => onModeChange('mentor')}
                >
                    <span className="mode-btn-icon">🎓</span>
                    <span>Mentor Mode</span>
                </button>

                <button
                    className={`mode-btn ${activeMode === 'mirror' ? 'active' : ''}`}
                    onClick={() => onModeChange('mirror')}
                >
                    <span className="mode-btn-icon">🪞</span>
                    <span>Concept Mirror</span>
                </button>
            </div>
        </div>
    );
}

export default ModeSelector;
