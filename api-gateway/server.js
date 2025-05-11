const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const { loadSchema } = require('./schema');
const { resolvers } = require('./resolvers');
const { authClient } = require('./clients/auth-client');
const { llamaClient } = require('./clients/llama-client');
const { recommendationClient } = require('./clients/recommendation-client');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// REST routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const response = await authClient.signUp({ email, password, name });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await authClient.signIn({ email, password });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/llama/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await llamaClient.generateText({ prompt });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const { userId, genres } = req.query;
    const response = await recommendationClient.getRecommendations({ 
      userId, 
      genres: genres ? genres.split(',') : [] 
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Setup Apollo Server for GraphQL
async function startApolloServer() {
  const typeDefs = await loadSchema();
  const server = new ApolloServer({ typeDefs, resolvers });
  
  await server.start();
  server.applyMiddleware({ app });
  
  console.log(`🚀 GraphQL endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
}

// Start the server
app.listen(PORT, async () => {
  console.log(`🌐 API Gateway running on http://localhost:${PORT}`);
  await startApolloServer();
});