# Neona

Neona is a chat bot that helps people understand artificial intelligence: http://www.neona.chat/. People interacting with her will learn about the topics students of AI study.

Her conversational user interface design, technical architecture, and code will also be used for live lessons and demos about how to build bots: https://www.slideshare.net/PaulPrae/azure-as-a-chatbot-service-from-purpose-to-production-with-a-cloud-bot-architecture  

The code in this repository is the actual bot code that is deployed to the Azure Bot Service. This post explains how she works in detail: http://blog.paulprae.com/neona-a-conversational-agent-that-teaches-ai-2/

What's next for Neona? In the future, she will be used by students to find courses and jobs in the field of AI. From the perspective of universities and employers, she will also be used as a teaching assistant and a recruiting tool.

# Development

1. Clone the repo
2. Install dependencies: `cd messages && npm install`
3. Set up environment variables documented in this spreadsheet: https://docs.google.com/spreadsheets/d/1KAWTYOf28QzcU7S7ERohmYKmfQS7LepYMZCqlEexVes/edit?usp=sharing
4. Add NODE_ENV=development to your .env file.
5. Don't forget, you need to restart the server for code changes to take effect.