// import * as sdk from "node-appwrite";

// export const {
//   NEXT_PUBLIC_ENDPOINT: ENDPOINT,
//   PROJECT_ID,
//   API_KEY,
//   DATABASE_ID,
//   PATIENT_COLLECTION_ID,
//   DOCTOR_COLLECTION_ID,
//   APPOINTMENT_COLLECTION_ID,
//   NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
// } = process.env;

// const client = new sdk.Client();

// client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

// export const databases = new sdk.Databases(client);
// export const users = new sdk.Users(client);
// export const messaging = new sdk.Messaging(client);
// export const storage = new sdk.Storage(client);


import * as sdk from "node-appwrite";

// Ensure environment variables are properly loaded
if (!process.env.NEXT_PUBLIC_ENDPOINT) throw new Error("Environment variable 'NEXT_PUBLIC_ENDPOINT' is missing.");
if (!process.env.PROJECT_ID) throw new Error("Environment variable 'PROJECT_ID' is missing.");
if (!process.env.API_KEY) throw new Error("Environment variable 'API_KEY' is missing.");
if (!process.env.DATABASE_ID) throw new Error("Environment variable 'DATABASE_ID' is missing.");
if (!process.env.PATIENT_COLLECTION_ID) throw new Error("Environment variable 'PATIENT_COLLECTION_ID' is missing.");
if (!process.env.DOCTOR_COLLECTION_ID) throw new Error("Environment variable 'DOCTOR_COLLECTION_ID' is missing.");
if (!process.env.APPOINTMENT_COLLECTION_ID) throw new Error("Environment variable 'APPOINTMENT_COLLECTION_ID' is missing.");
if (!process.env.NEXT_PUBLIC_BUCKET_ID) throw new Error("Environment variable 'NEXT_PUBLIC_BUCKET_ID' is missing.");

// Destructure and export environment variables
export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

// Initialize Appwrite client
const client = new sdk.Client();

try {
  client
    .setEndpoint(ENDPOINT!) // Appwrite endpoint
    .setProject(PROJECT_ID!) // Appwrite project ID
    .setKey(API_KEY!); // Appwrite API key
} catch (error) {
  console.error("Failed to initialize Appwrite client:", error);
  throw new Error("Appwrite client setup failed. Check your environment variables.");
}

// Export configured Appwrite services
export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);

