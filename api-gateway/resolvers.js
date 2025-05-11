const { authClient } = require('./clients/auth-client');
const { llamaClient } = require('./clients/llama-client');
const { recommendationClient } = require('./clients/recommendation-client');

const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) return null;
      return context.user;
    },
    getRecommendations: async (_, { genres }) => {
      try {
        const response = await recommendationClient.getRecommendations({ 
          genres: genres || [] 
        });
        return response.films;
      } catch (error) {
        console.error('Error getting recommendations:', error);
        throw new Error('Failed to get recommendations');
      }
    }
  },
  Mutation: {
    signUp: async (_, { name, email, password }) => {
      try {
        return await authClient.signUp({ name, email, password });
      } catch (error) {
        console.error('Error during signup:', error);
        throw new Error('Signup failed');
      }
    },
    signIn: async (_, { email, password }) => {
      try {
        return await authClient.signIn({ email, password });
      } catch (error) {
        console.error('Error during signin:', error);
        throw new Error('Signin failed');
      }
    },
    generateText: async (_, { prompt }) => {
      try {
        const response = await llamaClient.generateText({ prompt });
        return { text: response.text };
      } catch (error) {
        console.error('Error generating text:', error);
        throw new Error('Text generation failed');
      }
    }
  }
};

module.exports = { resolvers };