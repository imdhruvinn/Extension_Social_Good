# Backend for Extension with Emotion Analysis

This project is the backend for a extension that collects user browsing data and performs emotion analysis on that data. It stores the data in a MongoDB database and triggers certain actions (like chatbot interaction) based on emotional thresholds.

## Project Structure

```
/backend
  ├── package.json
  ├── server.js
  ├── routes
       └── userRoutes.js
  ├── controllers
       └── userController.js
       └── emotionController.js
  ├── models
       └── userModel.js
       └── browsingDataModel.js
       └── emotionModel.js
  ├── config
       └── db.js
  ├── middleware
       └── validateCookies.js
  ├── scripts
       └── emotion_analysis.py
       └── weeklyAnalysis.js
```

### /package.json

Contains the project dependencies and scripts.

### /server.js

The main entry point of the backend server, responsible for handling routes, connecting to MongoDB, and running the background processes.

### /routes

Contains route handlers. In this case:

- `userRoutes.js`: Handles user registration and browsing data submission.

### /controllers

Contains the business logic for handling:

- `userController.js`: User registration and saving user browsing data.
- `emotionController.js`: Emotion analysis and triggering actions like chatbot interaction when sadness exceeds a threshold.

### /models

Contains MongoDB schemas for:

- `userModel.js`: Defines the schema for user registration.
- `browsingDataModel.js`: Stores user browsing data.
- `emotionModel.js`: Stores emotion analysis results for each user.

### /config

- `db.js`: Handles MongoDB connection.

### /middleware

- `validateCookies.js`: Middleware to ensure the user has accepted cookie policy.

### /scripts

- `emotion_analysis.py`: Python script to analyze user browsing data using a pre-trained emotion analysis model.
- `weeklyAnalysis.js`: JS file to calculate weekly emotion averages and detect critical sadness levels.

---

## Setup Instructions

### Prerequisites

- Node.js (v12+)
- MongoDB
- Python (for emotion analysis)
- Chrome browser

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-repo-url
   cd backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up MongoDB**
   Ensure MongoDB is running and update the connection URL in `config/db.js`.

4. **Run the Server**
   ```bash
   npm start
   ```
   Server will run on `http://localhost:3000`.

### Emotion Analysis Setup

1. **Install Python Dependencies**

   ```bash
   pip install pymongo transformers
   ```

2. **Run the Emotion Analysis Script**
   ```bash
   python scripts/emotion_analysis.py
   ```

### Chrome Extension Integration

1. **Load the Extension**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" and click "Load unpacked."
   - Select the folder with `manifest.json` and `background.js`.

---

## API Endpoints

### User Registration

- **POST /register**: Registers a user with name, email, and phone.

### Submit Browsing Data

- **POST /data**: Sends browsing data to the server.

### Trigger Emotion Analysis

- **POST /analyze**: Analyzes user browsing data and returns emotion percentages.

### Weekly Emotion Average

- **POST /weekly-average**: Calculates the weekly average and checks sadness threshold.

---

## License

Licensed under the MIT License. See the `LICENSE` file for more details.
