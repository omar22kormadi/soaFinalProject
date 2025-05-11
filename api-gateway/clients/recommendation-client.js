const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../protos/recommendation.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

// Create gRPC client
const client = new recommendationProto.RecommendationService(
  'localhost:50053',
  grpc.credentials.createInsecure()
);

// Promisify the gRPC methods
const getRecommendations = (request) => {
  return new Promise((resolve, reject) => {
    client.getRecommendations(request, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = {
  recommendationClient: {
    getRecommendations
  }
};