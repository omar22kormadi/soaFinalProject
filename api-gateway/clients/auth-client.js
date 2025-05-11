const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../../protos/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

// Create gRPC client
const client = new authProto.AuthService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Promisify the gRPC methods
const signUp = (userData) => {
  return new Promise((resolve, reject) => {
    client.signUp(userData, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

const signIn = (credentials) => {
  return new Promise((resolve, reject) => {
    client.signIn(credentials, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};

module.exports = {
  authClient: {
    signUp,
    signIn
  }
};