# Cast Spell Wizard Duels 🧙‍♂️⚡

**Cast Spell Wizard Duels** is a fast-paced, strategic real-time spell dueling web game, completely integrated with Base Mainnet, powered by Web3 technologies, and equipped with a fully compliant ERC-8004 AI Agent (A2A). 

You step into the shoes of a battle mage who duels other wizards in magical arenas. Craft spells on the fly, outsmart your opponent with clever combinations, and dominate the battlefield with spectacular magic. Record your victories on-chain!

## 🔥 Core Features

* **Real-Time Canvas Combat:** Dual-zone touch controls engineered for mobile-first gameplay. Move your wizard with a virtual joystick while crafting devastating elemental combos.
* **Dynamic Spell Crafting:** Combine elements like Fire, Frost, Arcane, and Lightning to summon unique, powerful spells (e.g., Fire + Lightning = Thunderstorm).
* **On-Chain Progression:** Fully integrated with **Base Mainnet** via Wagmi and Viem. Record your highest duel ratings and win streaks immutably on the blockchain.
* **Agent-to-Agent (A2A) Ready:** Operates a fully compliant ERC-8004 Autonomous Agent, providing real-time game state, combat orchestration, and ecosystem coordination.
* **Trustless Agent Actions (ERC-8004):** Supports smart contract delegation for agent-driven gameplay parameters.
* **Attribution Engine (ERC-8021):** Implements transaction attribution building to support creator attribution and revenue distribution.
* **SIWE (Sign-In with Ethereum):** Secure wallet connection to track identities seamlessly across leaderboards.

## 🤖 Agentic Architecture & MCP

This project natively implements the Machine Context Protocol (MCP) and ERC-8004 Agent Card specifications.

### A2A Configuration
* **Agent Card Endpoint:** `/.well-known/agent-card.json`
* **Agent Standard:** EIP-8004 Registration V1
* **Supported Chains:** Base Mainnet (`eip155:8453`)

### MCP Endpoints (`/api/mcp`)
The built-in MCP server provides external AI agents the capability to:
* **Tools:** Execute `castSpell` or `queryStats` directly within the context of the game.
* **Prompts:** Request `strategyAdvice` against specific opponent elements.
* **Resources:** Access the competitive `Element Guide` for weakness insights.

## 🛠 Technology Stack

* **Frontend Framework:** React 19, TypeScript, Vite
* **Styling & Animations:** Tailwind CSS v4, Framer Motion
* **Web3 Integration:** Wagmi, Viem, @tanstack/react-query
* **Game Engine:** Custom HTML5 Canvas Entity-Component System
* **Backend Delivery:** Express.js (dev/prod), Vercel Serverless Ready

## 🚀 Local Development

### Prerequisites
* Node.js (v18+)
* npm (v10+)

### Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment variables and adjust as needed. (Do **not** commit real private keys or secrets).
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server:**
   This runs both the Vite frontend and Express APIs/Endpoints concurrently.
   ```bash
   npm run dev
   ```
   The game will be available at `http://localhost:3000`.

5. **Build for Production:**
   ```bash
   npm run build
   ```

## 🌐 Hosting & Deployment

This project is configured out-of-the-box for serverless deployment on platforms like **Vercel** or containerized cloud platforms like **Google Cloud Run**.

* **Vercel:** The included `vercel.json` ensures all API routes (`/api/*`) and well-known configurations (`/.well-known/*`) resolve correctly as Serverless Functions alongside the statically generated React frontend.

## 🔐 Security & Best Practices

* **No Hardcoded Secrets:** Private keys and sensitive API keys are purely managed through secure server environment variables.
* **Wallet Security:** The frontend strictly uses standard connectors (e.g., Injected, WalletConnect) and never intercepts raw private keys.
* **Agent Boundaries:** The Agent endpoints (`/api/agent`, `/api/mcp`) operate strictly with explicit context boundaries limits, avoiding unregulated execution.

## 📜 License

[MIT License](LICENSE)
