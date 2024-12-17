const { Storage } = require("@google-cloud/storage");
const path = require("path");

// Path to your GCP service account key JSON file
const keyFilename = path.join(__dirname, "../../smart-recipe-hub-8e88fa8e3567.json");

// GCP Storage Configuration
const storage = new Storage({ keyFilename });
const bucketName = "recipe-image-storage-full-stack"; // Replace with your GCP bucket name
const bucket = storage.bucket(bucketName);

module.exports = { bucket };
