# Setup Instructions

This guide will help you set up the **Automode Research Agent** from scratch.

## Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- A **LangChain.js API key** for accessing the OpenAI API (e.g., GPT-4).

## Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/automode-research-agent.git
cd automode-research-agent
Step 2: Install Dependencies
Install the project dependencies using npm or yarn.
```

```bash
npm install
```

or

```bash
yarn install
```

## Step 3: Set up LangChain.js

You need to set up LangChain.js and the OpenAI API key.

Create a .env file in the root of the project.
Add your OpenAI API key to the .env file:

```
OPENAI_API_KEY=your-api-key
```

## Step 4: Install Fastify or Next.js

Fastify (for streaming results)

```bash
npm install fastify
```

OR
Next.js (for API routes)

```bash
npm install next react react-dom
```

After installing the dependencies, you can proceed to the next steps for either Fastify or Next.js.

## Step 5: Run the server

```bash
npm run dev
```

OR

```bash
yarn dev
```
