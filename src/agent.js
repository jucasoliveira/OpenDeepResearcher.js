const { OpenAI } = require("@langchain/openai");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { WebBrowser } = require("langchain/tools/webbrowser");

// Initialize the OpenAI model
const createModel = () => new OpenAI({
  temperature: 0.7,
  modelName: "gpt-4",
  streaming: true
});

// Initialize the agent executor
const initializeAgent = async (model) => {
  const tools = [
    new WebBrowser({ model })
  ];

  return await initializeAgentExecutorWithOptions(
    tools,
    model,
    {
      agentType: "zero-shot-react-description",
      verbose: true,
      maxIterations: 5,
      earlyStoppingMethod: "generate"
    }
  );
};

// Search function
const search = async (executor, query) => {
  try {
    const result = await executor.call({
      input: `Research the following topic and provide detailed information: ${query}. 
             Focus on finding at least 3 accurate and up-to-date information from reliable sources.`
    });
    return result;
  } catch (error) {
    console.error("Error in search:", error);
    throw error;
  }
};

// Analysis function
const analyze = async (model, searchResults) => {
  try {
    const analysis = await model.call(
      `Analyze these search results and extract key insights, main points, and supporting evidence:
       ${JSON.stringify(searchResults)}
       
       Format the analysis with clear sections and bullet points.`
    );
    return analysis;
  } catch (error) {
    console.error("Error in analysis:", error);
    throw error;
  }
};

// Composition generator function
const composeStream = async function* (model, analysis) {
  try {
    const stream = await model.stream(
      `Create a well-structured article based on this analysis: ${analysis}
       
       The article should include:
       - An engaging introduction
       - Clear main sections with headings
       - Supporting evidence and examples
       - A conclusion
       
       Make it informative yet readable for a general audience.`
    );

    let content = '';
    for await (const chunk of stream) {
      content += chunk;
      yield chunk;
    }

    return content;
  } catch (error) {
    console.error("Error in composition:", error);
    throw error;
  }
};

// Fact checking function
const factCheck = async (model, content) => {
  try {
    const verification = await model.call(
      `Verify the accuracy of this content and identify any potential issues:
       ${content}
       
       Check for:
       - Factual accuracy
       - Source reliability
       - Potential biases
       - Currency of information`
    );
    return verification;
  } catch (error) {
    console.error("Error in fact checking:", error);
    throw error;
  }
};

// Create the research agent interface
const createResearchAgent = () => {
  const model = createModel();
  let executor = null;

  return {
    initialize: async () => {
      executor = await initializeAgent(model);
    },

    search: async (query) => {
      if (!executor) throw new Error("Agent not initialized");
      return await search(executor, query);
    },

    analyze: async (searchResults) => {
      return await analyze(model, searchResults);
    },

    composeStream: (analysis) => {
      return composeStream(model, analysis);
    },

    factCheck: async (content) => {
      return await factCheck(model, content);
    }
  };
};

module.exports = createResearchAgent; 