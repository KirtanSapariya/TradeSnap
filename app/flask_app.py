from flask import Flask, jsonify, request, render_template
from flask_socketio import SocketIO, emit
import numpy as np
import joblib
import cv2
import os
import yfinance as yf
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)

# Load the model and scaler
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, 'models', 'xgboost_model.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'models', 'scaler.pkl'))
image_model = joblib.load(os.path.join(BASE_DIR, 'models', 'image_model.pkl'))
def fetch_stock_data(ticker):
    df = yf.download(ticker, period='1d')
    return df

def preprocess_data(df):
    df['MA_50'] = df['Close'].rolling(window=50).mean()
    df['MA_200'] = df['Close'].rolling(window=200).mean()
    df.dropna(inplace=True)
    return df

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('fetch_data')
def handle_fetch_data(data):
    ticker = data['ticker']
    df = fetch_stock_data(ticker)
    df = preprocess_data(df)
    last_row = df.iloc[-1]
    input_data = np.array([last_row['Open'], last_row['High'], last_row['Low'], last_row['Volume'], last_row['MA_50'], last_row['MA_200']])
    input_data = scaler.transform(input_data.reshape(1, -1))
    prediction = model.predict(input_data)
    emit('prediction', {'predicted_price': prediction[0]})

@socketio.on('upload_image')
def handle_upload_image(data):
    image_data = data['image']
    image_array = np.frombuffer(image_data, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    image = cv2.resize(image, (128, 128))
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    prediction = image_model.predict(image)
    emit('signal', {
        'signal': 'buy' if prediction[0][0] > 0.5 else 'sell',
        'tp': prediction[0][1],
        'sl': prediction[0][2]
    })

if __name__ == '__main__':
    socketio.run(app, debug=True)