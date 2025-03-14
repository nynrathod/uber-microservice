import {
  loadPackageDefinition,
  credentials,
  ChannelCredentials,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import * as path from 'path';

// Define available services
const SERVICES = {
  RIDE_SERVICE: {
    protoPath: path.resolve(__dirname, '../../../../proto/ride.proto'),
    packageName: 'ride',
    serviceName: 'RideService',
    localUrl: 'localhost:4040', // Local Go service URL
    prodUrl: process.env.RIDE_SERVICE_URL ?? 'localhost:4040', // AWS URL (to be set later)
  },
  // Future services can be added here
};

// Function to create gRPC clients dynamically
export function createGrpcClient(serviceKey: keyof typeof SERVICES) {
  const serviceConfig = SERVICES[serviceKey];

  console.log(`🔍 Loading proto from: ${serviceConfig.protoPath}`);

  const packageDefinition = loadSync(serviceConfig.protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  console.log(`✅ Proto file loaded successfully: ${serviceConfig.protoPath}`);

  const grpcObject = loadPackageDefinition(packageDefinition) as any;
  const servicePackage = grpcObject[serviceConfig.packageName];

  if (!servicePackage) {
    throw new Error(
      `❌ Package ${serviceConfig.packageName} not found in proto file.`,
    );
  }

  console.log(`✅ Found package: ${serviceConfig.packageName}`);

  const Client = servicePackage[serviceConfig.serviceName];

  if (!Client) {
    throw new Error(
      `❌ Service ${serviceConfig.serviceName} not found in package ${serviceConfig.packageName}.`,
    );
  }

  console.log(`✅ Found service: ${serviceConfig.serviceName}`);

  const client = new Client(
    serviceConfig.prodUrl,
    credentials.createInsecure(),
  );

  console.log(
    `🚀 gRPC client created for ${serviceConfig.serviceName} at ${serviceConfig.prodUrl}`,
  );

  return client;
}
export async function checkGrpcConnection(serviceKey: keyof typeof SERVICES) {
  const client = createGrpcClient(serviceKey);

  return new Promise((resolve, reject) => {
    client.waitForReady(Date.now() + 5000, (err) => {
      if (err) {
        console.error(
          `❌ gRPC connection failed for ${serviceKey}:`,
          err.message,
        );
        reject(err);
      } else {
        console.log(`✅ gRPC connection established for ${serviceKey}`);

        // Now send a request (Example: GetRide)
        client.getRide({ rideId: 'test-123' }, (error: any, response: any) => {
          if (error) {
            console.error(
              `❌ Error calling GetRide for ${serviceKey}:`,
              error.message,
            );
            reject(error);
          } else {
            console.log(`🚀 GetRide response from ${serviceKey}:`, response);
            resolve(response);
          }
        });
      }
    });
  });
}
