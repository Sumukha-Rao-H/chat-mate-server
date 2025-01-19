const admin = require("firebase-admin");

// Check if running in a Render environment
const isRender = process.env.FIREBASE_SERVICE_ACCOUNT;

const serviceAccount = isRender
  ? JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf8")
    )
  : require("../chat-app-8f477-firebase-adminsdk-i4r5u-f9a91f2fe4.json"); // Local JSON file for development

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;

