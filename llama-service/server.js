
// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');
// const fetch = require('node-fetch'); // استخدم node-fetch بدل ollama

// // Load proto file
// const PROTO_PATH = path.join(__dirname, '../protos/llama.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });

// const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// // Service implementation
// const generateText = async (call, callback) => {
//   try {
//     const { prompt, max_tokens = 256, temperature = 0.7 } = call.request;

//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'llama3',
//         prompt: prompt,
//         options: {
//           temperature: temperature,
//           num_predict: max_tokens
//         },
//         stream: false
//       })
//     });
    
//     const data = await response.json();

//     callback(null, {
//       text: data.response
//     });

//   } catch (error) {
//     console.error('Error in generateText:', error);

//     if (error.code === 'ECONNREFUSED') {
//       return callback(null, {
//         text: "Fallback: Ollama is not running."
//       });
//     }

//     callback({
//       code: grpc.status.INTERNAL,
//       message: 'Internal server error'
//     });
//   }
// };

// // Start gRPC server
// function startServer() {
//   const server = new grpc.Server();

//   server.addService(llamaProto.LlamaService.service, {
//     generateText
//   });

//   server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
//     if (error) {
//       console.error('Failed to bind server:', error);
//       return;
//     }

//     console.log(`Llama service running on port ${port}`);
//     server.start();
//   });
// }

// startServer();






























// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const ollama = require('ollama');
// const path = require('path');

// // Load proto file
// const PROTO_PATH = path.join(__dirname, '../protos/llama.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });

// const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// // Service implementation
// const generateText = async (call, callback) => {
//   try {
//     const { prompt, max_tokens = 256, temperature = 0.7 } = call.request;
    
//     // Call Ollama API
//     const response = await ollama.generate({
//       model: 'llama3',
//       prompt: prompt,
//       options: {
//         num_predict: max_tokens,
//         temperature: temperature
//       }
//     });
    
//     // Return response
//     callback(null, {
//       text: response.response
//     });
//   } catch (error) {
//     console.error('Error in generateText:', error);
    
//     // Fallback if Ollama is not properly configured
//     if (error.code === 'ECONNREFUSED') {
//       return callback(null, {
//         text: "This is a fallback response since Ollama is not running. In a real implementation, this would connect to your local Llama 3 model."
//       });
//     }
    
//     callback({
//       code: grpc.status.INTERNAL,
//       message: 'Internal server error'
//     });
//   }
// };

// // Start gRPC server
// function startServer() {
//   const server = new grpc.Server();
  
//   server.addService(llamaProto.LlamaService.service, {
//     generateText
//   });
  
//   server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
//     if (error) {
//       console.error('Failed to bind server:', error);
//       return;
//     }
    
//     console.log(`Llama service running on port ${port}`);
//     server.start();
//   });
// }

// startServer();

// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');
// const fetch = require('node-fetch'); // تأكد أنك مثبت هذا: npm install node-fetch

// // Load proto
// const PROTO_PATH = path.join(__dirname, '../protos/llama.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });
// const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// // gRPC method
// const generateText = async (call, callback) => {
//   const { prompt, max_tokens = 128, temperature = 0.7 } = call.request;

//   try {
//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         model: 'llama3',
//         prompt: prompt,
//         options: {
//           temperature: temperature,
//           num_predict: max_tokens
//         },
//         stream: false
//       })
//     });

//     const data = await response.json();

//     callback(null, { text: data.response });
//   } catch (error) {
//     console.error('Error in generateText:', error);
//     callback({
//       code: grpc.status.INTERNAL,
//       message: 'Failed to generate text: ' + error.message
//     });
//   }
// };

// // Start server
// function startServer() {
//   const server = new grpc.Server();
//   server.addService(llamaProto.LlamaService.service, { generateText });

//   server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
//     if (err) return console.error('Bind failed:', err);
//     console.log(`Llama service running on port ${port}`);
//     server.start(); // يمكن إبقاؤها رغم التحذير
//   });
// }

// startServer();




// CLAUDE
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load proto file
const PROTO_PATH = path.join(__dirname, '../protos/llama.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// Service implementation
const generateText = async (call, callback) => {
  try {
    const { prompt, max_tokens = 256, temperature = 0.7 } = call.request;
    
    // Call Ollama API using fetch
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        options: {
          num_predict: max_tokens,
          temperature: temperature
        },
        stream: false 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Return response
    callback(null, {
      text: data.response
    });
  } catch (error) {
    console.error('Error in generateText:', error);
    
    callback({
      code: grpc.status.INTERNAL,
      message: 'Failed to generate text: ' + error.message
    });
  }
};

// Start gRPC server
function startServer() {
  const server = new grpc.Server();
  
  server.addService(llamaProto.LlamaService.service, {
    generateText
  });
  
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error('Failed to bind server:', error);
      return;
    }
    
    console.log(`Llama service running on port ${port}`);
    server.start();
  });
}

startServer();

























// //BEST ONE

// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');
// const path = require('path');

// // Load proto file
// const PROTO_PATH = path.join(__dirname, '../protos/llama.proto');
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true
// });

// const llamaProto = grpc.loadPackageDefinition(packageDefinition).llama;

// // Service implementation
// const generateText = async (call, callback) => {
//   try {
//     const { prompt, max_tokens = 256, temperature = 0.7 } = call.request;
    
//     // Call Ollama API using fetch
//     const response = await fetch('http://localhost:11434/api/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'llama3',
//         prompt: prompt,
//         options: {
//           num_predict: max_tokens,
//           temperature: temperature
//         }
//       })
//     });

//     const data = await response.json();
    
//     // Return response
//     callback(null, {
//       text: data.response
//     });
//   } catch (error) {
//     console.error('Error in generateText:', error);
    
//     callback({
//       code: grpc.status.INTERNAL,
//       message: 'Failed to generate text: ' + error.message
//     });
//   }
// };

// // Start gRPC server
// function startServer() {
//   const server = new grpc.Server();
  
//   server.addService(llamaProto.LlamaService.service, {
//     generateText
//   });
  
//   server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
//     if (error) {
//       console.error('Failed to bind server:', error);
//       return;
//     }
    
//     console.log(`Llama service running on port ${port}`);
//     server.start();
//   });
// }

// startServer();