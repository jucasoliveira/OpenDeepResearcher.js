require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const ResearchAgent = require('./src/agent');

// Initialize the research agent
const agent = new ResearchAgent();

// Setup CORS
fastify.register(cors, {
  origin: true
});

// Initialize the agent when the server starts
fastify.addHook('onReady', async () => {
  await agent.initialize();
  fastify.log.info('Research agent initialized successfully');
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Main research endpoint
fastify.post('/automode', async (request, reply) => {
  const { query } = request.body;

  if (!query) {
    reply.code(400).send({ error: 'Query is required' });
    return;
  }

  // Set up SSE headers for streaming
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const sendEvent = (type, data) => {
    reply.raw.write(`data: ${JSON.stringify({ type, data })}\n\n`);
  };

  try {
    // Start the research process
    sendEvent('status', 'Starting research...');

    // Search phase
    sendEvent('status', 'Searching for information...');
    const searchResults = await agent.search(query);
    sendEvent('search', searchResults);

    // Analysis phase
    sendEvent('status', 'Analyzing results...');
    const analysis = await agent.analyze(searchResults);
    sendEvent('analysis', analysis);

    // Composition phase with streaming
    sendEvent('status', 'Composing article...');
    let fullArticle = '';
    for await (const chunk of agent.composeStream(analysis)) {
      fullArticle += chunk;
      sendEvent('composing', chunk);
    }
    sendEvent('article', fullArticle);

    // Fact checking phase
    sendEvent('status', 'Fact checking...');
    const factCheck = await agent.factCheck(fullArticle);
    sendEvent('factCheck', factCheck);

    // Complete
    sendEvent('status', 'Research complete');
    reply.raw.end();
  } catch (error) {
    console.error('Error during research:', error);
    sendEvent('error', {
      message: error.message,
      phase: error.phase || 'unknown'
    });
    reply.raw.end();
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 