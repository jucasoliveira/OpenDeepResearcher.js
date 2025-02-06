# Automode Research Agent

The **Automode Research Agent** is a project designed to automate the process of generating articles based on a user query. It performs the following steps:

1. **Searches the web** using a specified query.
2. **Analyzes search results** to extract relevant information.
3. **Refines the query** if necessary and performs additional searches.
4. **Composes an article** based on the gathered information.
5. **Fact-checks** the generated content for accuracy.

The agent uses **LangChain.js** to handle the language model interactions and provides a server-side solution built with **Node.js** (Fastify or Next.js) for API integration. Streaming of results is enabled for real-time responses to the user.

## Features:

- **Search**: Automatically searches relevant sources.
- **Analyze**: Processes results for key insights.
- **Refine**: Improves search queries for more accurate information.
- **Compose**: Generates structured, readable content.
- **Fact-Check**: Verifies content before final composition.

## Setup Instructions

Follow these steps to set up the project.
