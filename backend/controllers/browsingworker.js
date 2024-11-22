const { MongoClient } = require('mongodb');
const { exec } = require('child_process');
const path = require('path');

const scrapeScriptPath = path.join(__dirname, "../scripts/scrapeanalyze.py");

// MongoDB connection settings
const mongoUri = "mongodb://localhost:27017/";
const dbName = "extensionDB";
const collectionName = "browsingdatas";

// MongoDB client setup
const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function processPendingUrls() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all URLs that need to be scraped
    const browsingData = await collection.find({ "data.url": { $exists: true } }).toArray();

    for (const data of browsingData) {
      for (const item of data.data) {
        const url = item.data?.url;
        if (url) {
          await scrapeAndProcess(url, data.uid);
        }
      }
    }
  } catch (err) {
    console.error('Error processing URLs:', err);
  } finally {
    await client.close();
  }
}

// Function to scrape and process URL by running the Python script
async function scrapeAndProcess(url, uid) {
  const pythonCommand = process.platform === "win32" ? "python" : "python3";
  return new Promise((resolve, reject) => {
    exec(`${pythonCommand} "${scrapeScriptPath}" "${url}" "${uid}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error scraping URL ${url}:`, err);
        resolve(); // Resolve so it doesn't block other URLs
        return;
      }
      if (stderr) {
        console.error(`stderr for URL ${url}: ${stderr}`);
      }
      console.log(`Scraped and processed data for ${url}:`, stdout);
      resolve(stdout); // Proceed even after error in stderr or output
    });
  });
}

// Start the worker to periodically process URLs
setInterval(processPendingUrls, 60000); // Run every 60 seconds
