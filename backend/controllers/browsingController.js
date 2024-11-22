const path = require("path");
const { exec } = require("child_process");
const BrowsingData = require("../models/BrowsingData");

const scrapeScriptPath = path.join(__dirname, "../scripts/scrapeanalyze.py");

// Helper function to determine if the URL should be skipped
function isSkippableUrl(url) {
  const skipPatterns = [
    "http://localhost:3000/api",
    "https://localhost:3000/api",
    "http://127.0.0.1:3000/api",
  ];
  return skipPatterns.some((pattern) => url.startsWith(pattern));
}

// Save browsing data for a user and trigger processing
exports.saveBrowsingData = async (req, res) => {
  const { uid, data } = req.body;

  if (!uid || !data) {
    return res.status(400).json({ message: "UID and data are required" });
  }

  try {
    // Filter out skippable URLs
    const filteredData = data.filter((item) => {
      const url = item.data?.url;
      return url && !isSkippableUrl(url);
    });

    // Save filtered data to MongoDB
    if (filteredData.length > 0) {
      await BrowsingData.updateOne(
        { uid },
        { $push: { data: { $each: filteredData } }, $set: { timestamp: new Date() } },
        { upsert: true }
      );
    }

    // Process each URL with the Python script
    const promises = filteredData.map((item) => {
      const url = item.data?.url;
      if (url) return scrapeAndProcess(url, uid);
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    res.status(200).json({ message: "Data processed successfully" });
  } catch (error) {
    console.error("Error saving browsing data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to scrape and process data using the Python script
async function scrapeAndProcess(url, uid) {
  const pythonCommand = process.platform === "win32" ? "python" : "python3";

  // Fetch emotion data from MongoDB
  const emotionData = await getEmotionData(uid);

  // Check if any emotion exceeds the 95% threshold
  const emotionThreshold = 95;
  const negativeEmotions = ["sadness", "anger", "disgust", "fear"];
  
  let triggerChatbot = false;

  // Check if any negative emotion exceeds the threshold
  negativeEmotions.forEach((emotion) => {
    if (emotionData[emotion] && emotionData[emotion] > emotionThreshold) {
      console.log(`${emotion} exceeded threshold of ${emotionThreshold}%`);
      triggerChatbot = true;
    }
  });

  if (triggerChatbot) {
    console.log("Triggering chatbot...");
    // Trigger the chatbot (this could be a different function)
    triggerChatbotFunction(uid);
  }

  // Run Python script if necessary
  return new Promise((resolve, reject) => {
    exec(`${pythonCommand} "${scrapeScriptPath}" "${url}" "${uid}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error scraping URL ${url}:`, err);
        reject(err); // Reject the promise if there's an error
        return;
      }

      if (stderr) {
        console.error(`stderr for URL ${url}:`, stderr);
      }

      try {
        // Parse Python script output
        const output = JSON.parse(stdout);
        console.log(`Processed data for ${url}:`, output);

        resolve(output);
      } catch (parseError) {
        console.error("Failed to parse Python script output:", stdout);
        reject(parseError); // Reject the promise if parsing fails
      }
    });
  });
}

// Function to get emotion data from MongoDB
async function getEmotionData(uid) {
  try {
    const browsingData = await BrowsingData.findOne({ uid });
    if (!browsingData || !browsingData.data) {
      return {}; // No data found for this user
    }

    // Assuming emotion data is stored in the 'data' array with emotions like 'sadness', 'anger', etc.
    let emotions = {};

    browsingData.data.forEach((item) => {
      if (item.data && item.data.emotions) {
        emotions = item.data.emotions;
      }
    });

    return emotions;
  } catch (error) {
    console.error("Error fetching emotion data:", error);
    return {}; // Return empty object in case of error
  }
}

// Function to trigger chatbot
function triggerChatbotFunction(uid) {
  console.log(`Chatbot triggered for user with UID: ${uid}`);
  // Add your chatbot-specific logic here, e.g., storing the trigger event
  // You can also send a notification, initiate a dialog, etc.
}

// Fetch browsing data for a user
exports.getBrowsingDataByUser = async (req, res) => {
  const { uid } = req.params;

  try {
    const browsingData = await BrowsingData.findOne({ uid });
    if (!browsingData) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    res.status(200).json(browsingData);
  } catch (error) {
    console.error("Error fetching browsing data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
