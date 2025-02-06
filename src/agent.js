const { OpenAI } = require("@langchain/openai");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { CheerioWebBaseLoader } = require("langchain/document_loaders/web/cheerio");
const { WebBrowser } = require("langchain/tools/webbrowser");

class ResearchAgent {
  constructor() {
    this.model = new OpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      streaming: true
    });
  }

  async initialize() {
    const tools = [
      new WebBrowser({ model: this.model }),
    ];

    this.executor = await initializeAgentExecutorWithOptions(
      tools,
      this.model,
      {
        agentType: "zero-shot-react-description",
        verbose: true,
        maxIterations: 5,
        earlyStoppingMethod: "generate"
      }
    );
  }

  async search(query) {
    try {
      const result = await this.executor.call({
        input: `Research the following topic and provide detailed information: ${query}. 
               Focus on finding at least 3 accurate and up-to-date information from reliable sources.`
      });
      
      return result;
    } catch (error) {
      console.error("Error in search:", error);
      throw error;
    }
  }

  async analyze(searchResults) {
    try {
      const analysis = await this.model.call(
        `Analyze these search results and extract key insights, main points, and supporting evidence:
         ${JSON.stringify(searchResults)}
         
         Format the analysis with clear sections and bullet points.`
      );
      return analysis;
    } catch (error) {
      console.error("Error in analysis:", error);
      throw error;
    }
  }

  async *composeStream(analysis) {
    try {
      const stream = await this.model.stream(
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
  }

  async compose(analysis) {
    try {
      const article = await this.model.call(
        `Create a well-structured article based on this analysis: ${analysis}`
      );
      return article;
    } catch (error) {
      console.error("Error in composition:", error);
      throw error;
    }
  }

  async factCheck(content) {
    try {
      const verification = await this.model.call(
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
  }
}

module.exports = ResearchAgent; 