import requests
import unittest

class TestFlaskApp(unittest.TestCase):
    def test_predict(self):
        data = {
            'ticker': 'AAPL'
        }
        response = requests.post('http://127.0.0.1:5000/fetch_data', json=data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('predicted_price', response.json())

if __name__ == '__main__':
    unittest.main()