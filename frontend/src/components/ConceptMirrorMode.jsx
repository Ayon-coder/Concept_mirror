import { useState, useCallback } from 'react';
import { analyzeConceptExplanation } from '../services/geminiService';

const EXAMPLE_CONCEPTS = [
    { name: 'Binary Search', description: 'Algorithm for finding items' },
    { name: 'Recursion', description: 'Functions calling themselves' },
    { name: 'REST API', description: 'Web service architecture' },
    { name: 'Machine Learning', description: 'AI pattern recognition' },
    { name: 'Big O Notation', description: 'Algorithm efficiency' },
];

function ConceptMirrorMode() {
    const [conceptName, setConceptName] = useState('');
    const [explanation, setExplanation] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedConcept, setAnalyzedConcept] = useState('');

    const handleAnalyze = useCallback(async () => {
        if (!conceptName.trim() || !explanation.trim()) return;

        setIsAnalyzing(true);
        setAnalyzedConcept(conceptName.trim());

        try {
            const result = await analyzeConceptExplanation(conceptName.trim(), explanation.trim());
            setAnalysisResult(result);
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [conceptName, explanation]);

    const handleNewAnalysis = useCallback(() => {
        setConceptName('');
        setExplanation('');
        setAnalysisResult(null);
        setAnalyzedConcept('');
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && e.metaKey && isInputValid) {
            handleAnalyze();
        }
    };

    const isInputValid = conceptName.trim().length > 0 && explanation.trim().length >= 20;

    // Show loading state
    if (isAnalyzing) {
        return (
            <div className="mirror-container">
                <div className="mirror-loading">
                    <div className="loading-spinner loading-spinner-lg"></div>
                    <p className="mirror-loading-text">Analyzing your understanding...</p>
                    <p className="mirror-loading-subtext">Comparing against mental models and identifying gaps</p>
                </div>
            </div>
        );
    }

    // Show results
    if (analysisResult) {
        const sections = [
            {
                number: '01',
                title: 'What You Got Right',
                icon: '✓',
                iconType: 'success',
                items: analysisResult.understood,
                type: 'list'
            },
            {
                number: '02',
                title: 'What You Missed',
                icon: '○',
                iconType: 'warning',
                items: analysisResult.missing,
                type: 'list'
            },
            {
                number: '03',
                title: 'What Needs Fixing',
                icon: '✕',
                iconType: 'error',
                items: analysisResult.incorrect,
                type: 'list'
            },
            {
                number: '04',
                title: 'Hidden Assumptions',
                icon: '◈',
                iconType: 'info',
                items: analysisResult.assumptions,
                type: 'list'
            },
            {
                number: '05',
                title: 'Your Thinking Style',
                icon: '◉',
                iconType: 'neutral',
                content: analysisResult.summary,
                type: 'paragraph',
                special: true
            }
        ];

        return (
            <div className="mirror-container">
                <div className="mirror-results">
                    <div className="mirror-results-header">
                        <div className="mirror-results-title">
                            <div className="mirror-results-icon">🪞</div>
                            <div>
                                <p className="mirror-concept-label">Concept Reflection</p>
                                <h2 className="mirror-concept-name">{analyzedConcept}</h2>
                            </div>
                        </div>
                        <button className="btn btn-secondary" onClick={handleNewAnalysis}>
                            ↻ New Analysis
                        </button>
                    </div>

                    <div className="mirror-results-grid">
                        {sections.map((section, index) => (
                            <div
                                key={index}
                                className={`reflection-card ${section.special ? 'special' : ''}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="reflection-header">
                                    <span className="reflection-number">{section.number}</span>
                                    <div className={`reflection-icon ${section.iconType}`}>
                                        {section.icon}
                                    </div>
                                    <span className="reflection-title">{section.title}</span>
                                </div>
                                <div className="reflection-content">
                                    {section.type === 'list' ? (
                                        section.items && section.items.length > 0 ? (
                                            <ul className="reflection-list">
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="reflection-list-item">{item}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="reflection-empty">Nothing to note here</p>
                                        )
                                    ) : (
                                        <p className="reflection-paragraph">{section.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mirror-new-analysis">
                        <p className="mirror-new-analysis-text">
                            If you walk away slightly uncomfortable but clearer about what you don't understand yet, the mirror did its job.
                        </p>
                        <button className="btn btn-ghost" onClick={handleNewAnalysis}>
                            Analyze Another Concept
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show input form
    return (
        <div className="mirror-container">
            <div className="mirror-hero">
                <div className="mirror-hero-icon">🪞</div>
                <h2>Concept Mirror</h2>
                <p>
                    Reveal the structure of your understanding. Explain a concept and discover what you truly know.
                </p>
            </div>

            <div className="mirror-input-card">
                <div className="mirror-input-group">
                    <label className="mirror-input-label" htmlFor="concept-name">
                        <span>📚</span>
                        <span>Concept Name</span>
                    </label>
                    <input
                        id="concept-name"
                        type="text"
                        className="input mirror-concept-input"
                        placeholder="e.g., Binary Search, Recursion, REST API..."
                        value={conceptName}
                        onChange={(e) => setConceptName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="mirror-example-chips">
                        {EXAMPLE_CONCEPTS.map((example) => (
                            <button
                                key={example.name}
                                className="mirror-chip"
                                onClick={() => setConceptName(example.name)}
                                title={example.description}
                            >
                                {example.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mirror-input-group">
                    <label className="mirror-input-label" htmlFor="explanation">
                        <span>💭</span>
                        <span>Your Explanation</span>
                    </label>
                    <div className="mirror-explanation-wrapper">
                        <textarea
                            id="explanation"
                            className="input textarea mirror-explanation-textarea"
                            placeholder="Explain this concept in your own words. Be as detailed or brief as you naturally would — don't worry about being 'correct'. The analysis works best when you explain it how you actually understand it..."
                            value={explanation}
                            onChange={(e) => setExplanation(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <span className="mirror-char-count">
                            {explanation.length} characters
                        </span>
                    </div>
                </div>

                <div className="mirror-action-bar">
                    <div className="mirror-hints">
                        <span className="mirror-hint">
                            <span>💡</span>
                            <span>Explain naturally, as if teaching someone</span>
                        </span>
                        <span className="mirror-hint">
                            <span>⌘</span>
                            <span>Press ⌘ + Enter to analyze</span>
                        </span>
                    </div>

                    <button
                        className="btn btn-primary mirror-analyze-btn"
                        onClick={handleAnalyze}
                        disabled={!isInputValid}
                    >
                        <span>Analyze Understanding</span>
                        <span>→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConceptMirrorMode;
