const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../protos/llama.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// Create gRPC client
const client = new llamaProto.LlamaService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

// Promisify the gRPC methods
const generateText = (request) => {
  return new Promise((resolve, reject) => {
    client.generateText(request, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = {
  llamaClient: {
    generateText
  }
};