const fs = require('fs');
const path = require('path');

// This function loads the GraphQL schema from a string
const loadSchema = async () => {
  return `
    type User {
      id: ID!
      name: String!
      email: String!
    }

    type AuthResponse {
      user: User
      token: String
    }

    type LlamaResponse {
      text: String!
    }

    type Film {
      id: ID!
      title: String!
      genre: String!
      releaseYear: Int!
      rating: Float
    }

    type Query {
      me: User
      getRecommendations(genres: [String]): [Film]
    }

    type Mutation {
      signUp(name: String!, email: String!, password: String!): AuthResponse
      signIn(email: String!, password: String!): AuthResponse
      generateText(prompt: String!): LlamaResponse
    }
  `;
};

module.exports = { loadSchema };