from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from flask_cors import CORS
import joblib
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# --- Model Loading and Training ---
def load_and_prepare_data():
    """Loads crime data and preprocesses it."""
    df = pd.read_csv("crime_data.csv")
    df['datetime'] = pd.to_datetime(df['date'] + ' ' + df['time'])
    df['hour'] = df['datetime'].dt.hour
    df['day_of_week'] = df['datetime'].dt.dayofweek
    
    def assign_danger(crime):
        if crime in ['Murder', 'Assault', 'Robbery']:
            return 2
        elif crime in ['Theft', 'Burglary']:
            return 1
        else:
            return 0
            
    df['danger_level_actual'] = df['crime_type'].apply(assign_danger)
    return df

def train_model(df):
    """Trains a random forest model on the entire dataset."""
    X = df[['latitude', 'longitude', 'hour', 'day_of_week']]
    y = df['danger_level_actual']
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

# Load data and train model on startup
crime_df = load_and_prepare_data()
model = train_model(crime_df)
# joblib.dump(model, 'crime_model.pkl') # Optional: Save model

@app.route('/predict', methods=['POST'])
def predict():
    """Predicts danger level for a single point and time."""
    data = request.get_json()
    lat = data['lat']
    lng = data['lng']
    # Use provided hour and day_of_week or use current time
    hour = data.get('hour', datetime.now().hour)
    day_of_week = data.get('day_of_week', datetime.now().weekday())

    prediction_df = pd.DataFrame({
        'latitude': [lat],
        'longitude': [lng],
        'hour': [hour],
        'day_of_week': [day_of_week]
    })
    
    danger_level = model.predict(prediction_df)[0]
    return jsonify({'danger_level': int(danger_level)})

@app.route('/heatmap', methods=['GET'])
def get_heatmap_data():
    """
    Generates heatmap data for the visible map area and time.
    Accepts bounding box and time parameters from the query string.
    """
    # Get bounding box from query params
    north = request.args.get('north', type=float)
    south = request.args.get('south', type=float)
    east = request.args.get('east', type=float)
    west = request.args.get('west', type=float)

    # Get time from query params, default to now
    hour = request.args.get('hour', default=datetime.now().hour, type=int)
    day_of_week = request.args.get('day', default=datetime.now().weekday(), type=int)

    # Filter data by bounding box if provided
    if all([north, south, east, west]):
        filtered_df = crime_df[
            (crime_df['latitude'].between(south, north)) &
            (crime_df['longitude'].between(west, east))
        ].copy()
    else:
        # If no bounds, use the whole dataset (the original behavior)
        filtered_df = crime_df.copy()

    if filtered_df.empty:
        return jsonify([])

    # For prediction, we need to create a feature set for the given time
    prediction_features = filtered_df[['latitude', 'longitude']].copy()
    prediction_features['hour'] = hour
    prediction_features['day_of_week'] = day_of_week

    # Predict danger for each point in the filtered data
    predicted_dangers = model.predict(prediction_features)
    
    # Assign predictions back to the filtered dataframe to avoid index mismatches
    filtered_df = filtered_df.assign(predicted_danger=predicted_dangers)

    heatmap_points = []
    for _, row in filtered_df.iterrows():
        heatmap_points.append({
            'lat': row['latitude'],
            'lng': row['longitude'],
            'danger': int(row['predicted_danger'])
        })
        
    return jsonify(heatmap_points)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
