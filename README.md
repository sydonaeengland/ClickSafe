# ClickSafe 🛡️
### AI-Powered Scam & Phishing Detection for Students

ClickSafe helps students identify phishing attempts and online scams before they become victims. Using a hybrid AI + rule-based approach, it analyses suspicious messages, URLs, and screenshots in real time — providing plain-language explanations students can actually understand.

---

## The Problem

Students are prime targets for phishing and scams:
- **50%+** of students receive phishing emails every year
- **2,300+** phishing emails target university students annually
- Financial pressure makes them vulnerable to "easy money" scams
- Less experience spotting sophisticated phishing attempts

Yet students lack access to enterprise-grade security tools. ClickSafe fills that gap — free, accessible, and built for them.

---

## Features

| Feature | Description |
|---|---|
| **Paste Message or Link** | Manually check suspicious messages and URLs instantly |
| **Screenshot OCR** | Upload images of WhatsApp, SMS, or social media scams for analysis |
| **Automatic Email Scan** | Scan your inbox for risky emails with risk level classification |
| **Interactive Tutorial** | Guided walkthroughs that teach students how to spot scams themselves |
| **Real-Time Risk Scoring** | 0–100 risk score with clear, plain-language explanations |

---

## How It Works

1. **Input** — Paste a suspicious message or URL, or upload a screenshot
2. **Scan** — A hybrid AI + rule-based engine analyses the content for red flags
3. **Results** — Receive a 0–100 risk score with a plain-language explanation
4. **Action** — Follow tailored safety advice or report to your IT department

### Hybrid Intelligence Approach

**Rule-Based Detection** ensures consistency and auditability:
- Urgency language pattern detection
- Suspicious domain analysis
- Credential request detection
- URL shortener identification
- Brand impersonation checks

**AI Explanation Layer** provides context and clarity:
- Scam category classification
- Plain-language risk explanation
- Context-aware safety advice
- Student-friendly tone
- OCR text extraction from images

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Supabase, OpenRouter API |
| AI | LLM APIs via OpenRouter, OCR |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites
- Node.js & npm installed

### Installation

```bash
# Clone the repository
git clone https://github.com/sydonaeengland/ClickSafe.git

# Navigate into the project
cd ClickSafe

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenRouter API key and Supabase credentials

# Start the development server
npm run dev
```

### Environment Variables

```env
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---
