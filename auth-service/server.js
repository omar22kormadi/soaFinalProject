const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const path = require('path');
const User = require('./models/user');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../protos/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/auth_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// // Setup Kafka producer
const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

// Connect to Kafka
async function connectToKafka() {
  try {
    await producer.connect();
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka', error);
  }
}

connectToKafka();

// Service implementation
const signUp = async (call, callback) => {
  try {
    const { name, email, password } = call.request;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return callback({
        code: grpc.status.ALREADY_EXISTS,
        message: 'User already exists'
      });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    try{
    // Send event to Kafka
    await producer.send({
      topic: 'test-topic',
      messages: [
        { 
          key: user._id.toString(),
          value: JSON.stringify({
            eventType: 'user-signup',
            userId: user._id,
            name: user.name,
            email: user.email,
            timestamp: new Date().toISOString(),
            
          })
        
        }
      ]
    });
    console.log('User created and event sent to Kafka');
    }catch(e){console.log(e)}
    
    // Return response
    callback(null, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token: 'dummy-jwt-token-' + user._id.toString()
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error'
    });
  }
};

const signIn = async (call, callback) => {
  try {
    const { email, password } = call.request;
    
    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found'
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return callback({
        code: grpc.status.PERMISSION_DENIED,
        message: 'Invalid password'
      });
    }
    
   // Send event to Kafka
   try {
     await producer.send({
       topic: 'test-topic',
       messages: [
         { 
          
           key: user._id.toString(),
           value: JSON.stringify({
            eventType: 'user-login',
             userId: user._id,
             email: user.email,
             timestamp: new Date().toISOString(),
             
           })
         }
         
       ]
     });
      console.log('User signed in and event sent to Kafka');
   }catch(e){console.log(e)}
    
    // Return response
    callback(null, {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token: 'dummy-jwt-token-' + user._id.toString()
    });
  } catch (error) {
    console.error('Error in signIn:', error);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error'
    });
  }
};

// Start gRPC server
function startServer() {
  const server = new grpc.Server();
  
  server.addService(authProto.AuthService.service, {
    signUp,
    signIn
  });
  
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to bind server:', error);
      return;
    }
    
    console.log(`Auth service running on port ${port}`);
    server.start();
  });
}

startServer();