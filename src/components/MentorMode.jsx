import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { sendMentorMessage } from '../services/geminiService';

const POPULAR_TOPICS = [
    { name: 'Data Structures', icon: '📊', description: 'Arrays, lists, trees, graphs' },
    { name: 'Algorithms', icon: '⚡', description: 'Sorting, searching, recursion' },
    { name: 'Web Development', icon: '🌐', description: 'HTML, CSS, JavaScript, React' },
    { name: 'Python Basics', icon: '🐍', description: 'Variables, functions, loops' },
    { name: 'Machine Learning', icon: '🤖', description: 'Models, training, prediction' },
    { name: 'Database Design', icon: '💾', description: 'SQL, normalization, queries' },
];

function MentorMode() {
    const [topic, setTopic] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleTopicSelect = async (selectedTopic) => {
        setTopic(selectedTopic);
        const userMessage = { role: 'user', content: `I want to learn about ${selectedTopic}` };
        setMessages([userMessage]);
        setIsLoading(true);

        try {
            const response = await sendMentorMessage([userMessage], selectedTopic);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { role: 'user', content: inputValue.trim() };

        // If no topic yet, use the message as the topic
        if (!topic) {
            setTopic(inputValue.trim());
        }

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const allMessages = [...messages, userMessage];
            const response = await sendMentorMessage(allMessages, topic || inputValue.trim());
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setTopic('');
        setMessages([]);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Render welcome screen if no topic selected
    if (!topic && messages.length === 0) {
        return (
            <div className="mentor-container">
                <div className="mentor-welcome">
                    <div className="mentor-welcome-icon">🎓</div>
                    <h1>AI Mentor</h1>
                    <p>
                        Your personal learning companion. Choose a topic below or type your own question to get started.
                    </p>

                    <div className="topic-grid">
                        {POPULAR_TOPICS.map((t) => (
                            <button
                                key={t.name}
                                className="topic-card"
                                onClick={() => handleTopicSelect(t.name)}
                            >
                                <div className="topic-card-icon">{t.icon}</div>
                                <div className="topic-card-content">
                                    <div className="topic-card-title">{t.name}</div>
                                    <div className="topic-card-description">{t.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mentor-input-area">
                    <form className="mentor-input-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="mentor-input"
                            placeholder="Or type your own topic or question..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                        />
                        <button
                            type="submit"
                            className="mentor-send-btn"
                            disabled={!inputValue.trim()}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Render chat interface
    return (
        <div className="mentor-container">
            <div className="mentor-chat-area">
                <div className="mentor-chat-header">
                    <div className="mentor-topic-info">
                        <div className="mentor-topic-badge">
                            <span>📚</span>
                            <span>{topic}</span>
                        </div>
                    </div>
                    <button className="mentor-clear-btn" onClick={handleClearChat}>
                        ✕ New Topic
                    </button>
                </div>

                <div className="mentor-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.role}`}>
                            <div className="message-avatar">
                                {message.role === 'assistant' ? '🎓' : '👤'}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    {message.role === 'assistant' ? (
                                        <ReactMarkdown
                                            components={{
                                                code({ className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    const isInline = !match;

                                                    return !isInline ? (
                                                        <SyntaxHighlighter
                                                            style={vscDarkPlus}
                                                            language={match[1]}
                                                            PreTag="div"
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code {...props}>{children}</code>
                                                    );
                                                },
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{message.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-avatar">🎓</div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <div className="mentor-input-area">
                    <form className="mentor-input-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="mentor-input"
                            placeholder="Ask a follow-up question..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="mentor-send-btn"
                            disabled={!inputValue.trim() || isLoading}
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MentorMode;
