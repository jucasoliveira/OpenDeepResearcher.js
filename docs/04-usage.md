# Usage Instructions

### Step 1: Start the Server

To start the server, you can use one of two options, depending on whether you're using **Fastify** or **Next.js**.

#### Fastify

````bash
node server.js
This will start the Fastify server on http://localhost:3001.

#### Next.js

```bash
npm run dev
````

This will start the Next.js application on http://localhost:3000.

### Step 2: Sending Requests

You can send a POST request to the /automode endpoint with a query to start the process of generating an article.

Example Request:

```json
{
  "query": "What is the future of artificial intelligence?"
}
```

```bash
curl -X POST http://localhost:3001/automode \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the future of artificial intelligence?"}'
```

### Step 3: Receiving the Result

The agent will return the final article, which can be streamed in real-time (if using Fastify). If you're using Next.js, the entire response will be returned once the process is complete.
