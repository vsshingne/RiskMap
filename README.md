🔥 AI-Powered Crime Heatmap 
An interactive web application that visualizes the predicted danger level of areas across London using a machine learning model trained on historical crime data. Built with React, Flask, and scikit-learn, the app helps identify high-risk areas at different times of day, aiding awareness and prevention.

🚀 Features
📍 Heatmap Visualization: See real-time crime danger levels (red = high risk, yellow = moderate, green = low).

🧠 ML Model Prediction: Random Forest Classifier predicts danger level based on location, hour, and day of week.

🕒 Time-Aware: Query predictions by custom date & time.

📡 REST API: /predict for single-point queries and /heatmap for bounding-box predictions.

🌐 Full-Stack Setup: React frontend + Flask backend integrated with CORS and concurrently.

🛠️ Tech Stack
Layer	Tools Used
Frontend	React, Tailwind CSS, Leaflet (Map)
Backend	Python, Flask, Flask-CORS
ML Model	scikit-learn (RandomForest)
Data	Custom CSV-based synthetic crime data
Dev Tools	concurrently, npm, CORS

📦 Folder Structure
bash
Copy
Edit
Crime-Heatmap/
├── frontend/          # React App (map + UI)
├── backend/           # Flask API (ML model + endpoints)
│   └── app.py         # Main backend logic
│   └── crime_data.csv # Sample training data
├── package.json       # Dev script to run both client + server
⚙️ Setup Instructions
🔧 1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/crime-heatmap.git
cd crime-heatmap
🖥️ 2. Install Dependencies
bash
Copy
Edit
npm install             # For root (concurrently)
cd frontend && npm install   # React frontend
cd ../backend && pip install -r requirements.txt  # Flask backend
🚀 3. Start the App
bash
Copy
Edit
npm run start
This runs:

React app on http://localhost:3000

Flask API on http://localhost:5000

🔍 API Endpoints
POST /predict
Predicts danger level at a single point.

json
Copy
Edit
{
  "lat": 51.5074,
  "lng": -0.1278,
  "hour": 22,
  "day_of_week": 5
}
GET /heatmap
Returns all crimes (with predicted danger) within a bounding box.

sql
Copy
Edit
/heatmap?north=...&south=...&east=...&west=...&hour=...&day=...
🧠 AI Model Details
Model: RandomForestClassifier

Features: latitude, longitude, hour, day_of_week

Output: danger_level → 0 (Low), 1 (Medium), 2 (High)

Trained on demo data covering Greater London

📊 Demo Dataset
Includes a CSV file with synthetic crime data (200 rows) for London, with varied:

Coordinates

Times & dates

Crime types like: Murder, Theft, Littering, etc.

📌 To Do / Ideas
Integrate with live crime datasets (e.g. UK Police API)

Add borough-specific clustering

Deploy via Docker or Vercel + Render

Push notifications for high-risk zones

📸 Screenshots
(Add screenshots of your React map with red/yellow/green points)

🧑‍💻 Author
Made by [Your Name] — feel free to connect or fork!
