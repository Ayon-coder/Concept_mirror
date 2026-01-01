# AI Assistant - Mentor & Concept Mirror

A dual-mode AI assistant built with React and powered by the Gemini API. This application combines two powerful learning tools:

1. **Mentor Mode** - An interactive AI tutor that guides you through topics with explanations, examples, and practice exercises
2. **Concept Mirror** - Analyzes your understanding of concepts and reveals gaps in your mental model

## ✨ Features

### Mentor Mode 🎓
- **Topic Selection** - Choose from popular topics or enter your own
- **Interactive Chat** - Engage in a conversation with your AI mentor
- **Code Examples** - Get properly formatted code snippets with syntax highlighting
- **Markdown Support** - Rich text formatting for better readability
- **No Progress Bar** - Clean, distraction-free learning experience

### Concept Mirror 🪞
- **Understanding Analysis** - Explain a concept and get detailed feedback
- **Reflection Cards** - Organized insights into:
  - ✓ What You Got Right
  - ○ What You Missed
  - ✕ What Needs Fixing
  - ◈ Hidden Assumptions
  - ◉ Your Thinking Style
- **Example Concepts** - Quick-select chips for common topics

### Design
- **Professional UI** - Clean white and blue theme
- **Responsive** - Works seamlessly on desktop and mobile
- **Modern Typography** - Inter and Fira Code fonts
- **Smooth Animations** - Polished interactions throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dual-mode-assistant.git
cd dual-mode-assistant
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up your Gemini API key:
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## 🔑 API Configuration

The app works in **Demo Mode** without an API key, providing simulated responses. For full AI capabilities:

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Either:
   - Add it to your `.env` file: `VITE_GEMINI_API_KEY=your_key_here`
   - Or configure it in the app by clicking Settings → Enter your API key

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Gemini API** - AI language model
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting

## 📁 Project Structure

```
dual-mode-assistant/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # App header with branding
│   │   ├── ModeSelector.jsx   # Mode toggle component
│   │   ├── MentorMode.jsx     # Mentor chat interface
│   │   ├── ConceptMirrorMode.jsx  # Concept analysis interface
│   │   └── ApiKeyModal.jsx    # API key configuration
│   ├── services/
│   │   └── geminiService.js   # Gemini API integration
│   ├── App.jsx                # Main app component
│   ├── App.css                # Component styles
│   └── index.css              # Global styles & design system
├── index.html                 # Entry HTML
└── package.json               # Dependencies
```

## 🎨 Customization

### Color Scheme
Edit the CSS variables in `src/index.css` to customize colors:

```css
:root {
  --primary-500: #3b82f6;  /* Main blue */
  --primary-600: #2563eb;  /* Darker blue */
  /* ... other variables */
}
```

### Topics
Add or modify topics in `src/components/MentorMode.jsx`:

```javascript
const POPULAR_TOPICS = [
  { name: 'Your Topic', icon: '📚', description: 'Topic description' },
  // ...
];
```

## 📄 License

MIT License - feel free to use this project for learning or building your own AI assistants!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React and Gemini AI
