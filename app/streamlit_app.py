import streamlit as st
import requests
import json
import time
from flask_socketio import SocketIO, emit
import pandas as pd

st.title('Real-Time Stock Price Prediction and Signal Analysis')

ticker = st.text_input('Enter Stock Ticker', 'AAPL')
date = st.date_input('Select Date', value=pd.Timestamp.now())
open_price = st.number_input('Open Price', value=0.0)
high_price = st.number_input('High Price', value=0.0)
low_price = st.number_input('Low Price', value=0.0)
volume = st.number_input('Volume', value=0.0)
ma_50 = st.number_input('50-day MA', value=0.0)
ma_200 = st.number_input('200-day MA', value=0.0)

if st.button('Fetch Data'):
    data = {
        'ticker': ticker
    }
    response = requests.post('http://127.0.0.1:5000/fetch_data', json=data)
    prediction = response.json()['predicted_price']
    st.write(f'Predicted Close Price: {prediction}')

uploaded_file = st.file_uploader("Upload a screenshot of the market", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    image = uploaded_file.read()
    response = requests.post('http://127.0.0.1:5000/upload_image', files={'image': image})
    signal = response.json()['signal']
    tp = response.json()['tp']
    sl = response.json()['sl']
    st.write(f'Signal: {signal}')
    st.write(f'Take Profit (TP): {tp}')
    st.write(f'Stop Loss (SL): {sl}')