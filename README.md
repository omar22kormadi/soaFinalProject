# Simple Microservices Project

This is a simple school project demonstrating a microservices architecture with gRPC communication and Kafka event handling.

## Project Structure

```
├── api-gateway         # API Gateway with REST and GraphQL endpoints
├── auth-service        # Authentication service using MongoDB
├── llama-service       # LLama 3 integration service
├── recommendation-service # Film recommendation service using MySQL
└── protos              # Protocol Buffers definitions
```

## Prerequisites

Before running this project, make sure you have:

1. Node.js installed
2. MongoDB Compass running locally
3. MySQL Server running locally
4. Kafka server running locally
5. Ollama with llama3 model (or LM Studio)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Make sure MongoDB is running on `localhost:27017`

3. Make sure MySQL is running and create a database named `recommendation_service`

4. Make sure Kafka is running on `localhost:9092`

5. Start all services:

   Start Auth Service:
   ```
   node server.js
   ```

   Start Llama Service:
   ```
   node server.js
   ```

   Start Recommendation Service:
   ```
   node server.js
   ```

   Start API Gateway:
   ```
   node server.js
   ```

## Testing with Postman

### REST API Endpoints

1. Sign Up:
   ```
   POST http://localhost:3000/api/auth/signup
   Body: { "name": "Test User", "email": "test@example.com", "password": "password123" }
   ```

2. Sign In:
   ```
   POST http://localhost:3000/api/auth/signin
   Body: { "email": "test@example.com", "password": "password123" }
   ```

3. Generate Text with Llama:
   ```
   POST http://localhost:3000/api/llama/generate
   Body: { "prompt": "What is microservices architecture?" }
   ```

4. Get Film Recommendations:
   ```
   GET http://localhost:3000/api/recommendations?genres=Sci-Fi,Drama
   ```

### GraphQL Endpoint

URL: `http://localhost:3000/graphql`

Example Queries:

1. Sign Up:
   ```graphql
   mutation {
     signUp(name: "Test User", email: "test@example.com", password: "password123") {
       token
       user {
         id
         name
         email
       }
     }
   }
   ```

2. Sign In:
   ```graphql
   mutation {
     signIn(email: "test@example.com", password: "password123") {
       token
       user {
         id
         name
         email
       }
     }
   }
   ```

3. Generate Text:
   ```graphql
   mutation {
     generateText(prompt: "What is microservices architecture?") {
       text
     }
   }
   ```

4. Get Recommendations:
   ```graphql
   query {
     getRecommendations(genres: ["Sci-Fi", "Drama"]) {
       id
       title
       genre
       releaseYear
       rating
     }
   }
   ```