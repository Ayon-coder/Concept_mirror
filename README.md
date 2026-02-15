Demo Line: https://conceptmirror.vercel.app

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
  <img src="https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask 3" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">🤖 AI Assistant</h1>

<p align="center">
  <strong>A dual-mode AI assistant with Mentor Mode for interactive learning and Concept Mirror for understanding analysis — powered by Gemini & Groq.</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

### 🎓 Mentor Mode
> Your personal AI tutor that adapts to your learning pace.

- **Multi-turn conversations** — context-aware follow-ups for deeper understanding
- **Syntax-highlighted code** — beautiful code examples with language detection
- **Topic-scoped sessions** — focused learning on Python, DSA, Web Dev, and more
- **Smart fallbacks** — graceful demo responses when API keys aren't configured

### 🪞 Concept Mirror
> Reflect on what you *think* you know — and discover what you're missing.

- **Understanding analysis** — breaks down what you got right, wrong, and missed
- **Gap detection** — surfaces blind spots in your mental models
- **Structured feedback** — organized into Understood, Missing, Incorrect, and Assumptions
- **Actionable insights** — clear summary with next steps for improvement

### ⚡ Additional Highlights

| Feature | Description |
|---------|-------------|
| 🔄 **Dual AI Providers** | Switch between Google Gemini and Groq (LLaMA/Mixtral) with one env variable |
| 🎭 **Demo Mode** | Full functionality without API keys for testing and development |
| 🌐 **REST API** | Clean Flask API — use it headless or integrate with any frontend |
| 📱 **Responsive UI** | Modern React interface that works on desktop and mobile |

---

## 🎬 Demo

> **Demo mode** is built in — just run the app without API keys and it works out of the box with mock responses.

---

## 📁 Project Structure

```
AI-ASSISTANT/
├── backend/                  # Python Flask API server
│   ├── api.py                # REST endpoints (/mentor, /analyze, /generate)
│   ├── ai_client.py          # AI provider factory & client
│   ├── base.py               # Abstract base class for providers
│   ├── config.py             # Environment configuration loader
│   ├── prompts.py            # System prompts for each mode
│   ├── demo.py               # Fallback mock responses
│   ├── run.py                # Server entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment template
│   ├── gemini_provider/      # Google Gemini integration
│   └── groq_provider/        # Groq (LLaMA/Mixtral) integration
│
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx           # Main app with mode switching
│   │   ├── components/
│   │   │   ├── MentorMode.jsx        # Interactive tutor chat
│   │   │   ├── ConceptMirrorMode.jsx # Understanding analyzer
│   │   │   ├── ModeSelector.jsx      # Mode toggle UI
│   │   │   ├── Header.jsx            # App header with settings
│   │   │   └── ApiKeyModal.jsx       # API key configuration
│   │   └── services/
│   │       └── geminiService.js      # Backend API client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── vercel.json               # Vercel deployment config
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** and **pip**
- **Node.js 18+** and **npm**
- API key from [Google AI Studio](https://aistudio.google.com/apikey) or [Groq Console](https://console.groq.com/keys) *(optional — demo mode works without keys)*

### 1. Clone the Repository

```bash
git clone https://github.com/tech-akash010/AI-ASSISTANT.git
cd AI-ASSISTANT
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate    # Linux/macOS
.venv\Scripts\activate       # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys (or leave defaults for demo mode)

# Start the API server
python run.py
```

The backend will start at **http://localhost:5000**.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser. 🎉

---

## 🔑 API Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ACTIVE_PROVIDER` | `gemini` | AI provider to use (`gemini` or `groq`) |
| `ACTIVE_MODEL` | *(auto)* | Override model (e.g., `gemini-2.0-flash`, `llama-3.3-70b-versatile`) |
| `GOOGLE_API_KEY` | — | Your Google Gemini API key |
| `GROQ_API_KEY` | — | Your Groq API key |
| `FLASK_HOST` | `127.0.0.1` | Server bind address |
| `FLASK_PORT` | `5000` | Server port |
| `FLASK_DEBUG` | `True` | Enable Flask debug mode |
| `DEMO_MODE` | `False` | Force demo mode (mock responses) |

### Supported Models

<details>
<summary><strong>Google Gemini Models</strong></summary>

| Model | Best For |
|-------|----------|
| `gemini-2.0-flash` | Fast responses, general use |
| `gemini-1.5-flash` | Balanced speed & quality |
| `gemini-1.5-pro` | Complex reasoning tasks |

</details>

<details>
<summary><strong>Groq Models</strong></summary>

| Model | Best For |
|-------|----------|
| `llama-3.3-70b-versatile` | High quality, versatile |
| `llama-3.1-8b-instant` | Ultra-fast responses |
| `mixtral-8x7b-32768` | Long context, balanced |

</details>

---

## 📡 API Reference

### `GET /health`

Health check endpoint.

```json
{
  "status": "healthy",
  "provider": "gemini",
  "model": "gemini-2.0-flash",
  "has_api_key": true,
  "demo_mode": false
}
```

### `POST /mentor`

Multi-turn Mentor Mode chat.

```json
// Request
{
  "messages": [
    { "role": "user", "content": "Explain recursion with an example" }
  ],
  "topic": "Python"
}

// Response
{
  "response": "Recursion is when a function calls itself...",
  "provider": "gemini",
  "model": "gemini-2.0-flash"
}
```

### `POST /analyze`

Concept Mirror analysis.

```json
// Request
{
  "concept": "Binary Search",
  "explanation": "Binary search divides the array in half each time..."
}

// Response
{
  "understood": ["Divide and conquer approach", "Halving the search space"],
  "missing": ["Sorted array prerequisite", "Time complexity analysis"],
  "incorrect": [],
  "assumptions": ["Works on any array"],
  "summary": "Good grasp of the core idea, but missing key prerequisites..."
}
```

### `POST /generate`

Simple text generation.

```json
// Request
{ "prompt": "Explain DSA in simple terms" }

// Response
{
  "response": "Data Structures and Algorithms (DSA)...",
  "provider": "gemini"
}
```

---

## 🚢 Deployment

Frontend and backend are deployed **separately** on Vercel (each has its own `vercel.json`).

### Deploy Backend

1. On [vercel.com](https://vercel.com), click **Add New → Project**
2. Import your GitHub repo
3. Set **Root Directory** to `backend`
4. Add **Environment Variables** in the Vercel dashboard:
   | Variable | Value |
   |----------|-------|
   | `ACTIVE_PROVIDER` | `gemini` or `groq` |
   | `GOOGLE_API_KEY` | Your Gemini key |
   | `GROQ_API_KEY` | Your Groq key *(if using Groq)* |
   | `DEMO_MODE` | `False` |
5. Deploy — note your backend URL (e.g., `https://your-backend.vercel.app`)

### Deploy Frontend

1. Create a **second** Vercel project from the same repo
2. Set **Root Directory** to `frontend`
3. Add **Environment Variables**:
   | Variable | Value |
   |----------|-------|
   | `VITE_API_URL` | Your backend URL from above (e.g., `https://your-backend.vercel.app`) |
4. Deploy — your frontend will connect to the backend automatically

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center"><strong>Frontend</strong></td>
    <td align="center"><strong>Backend</strong></td>
    <td align="center"><strong>AI Providers</strong></td>
  </tr>
  <tr>
    <td>
      React 19<br/>
      Vite 7<br/>
      react-markdown<br/>
      react-syntax-highlighter
    </td>
    <td>
      Python 3.10+<br/>
      Flask 3<br/>
      Flask-CORS<br/>
      python-dotenv
    </td>
    <td>
      Google Gemini<br/>
      Groq (LLaMA 3.3, Mixtral)
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request



<p align="center">
  Made with  by <a href="https://github.com/tech-akash010">tech-akash010</a>
  Also by <a href="https://github.com/Ayon-coder">Ayon-coder</a>
</p>
