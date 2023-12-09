from flask import Flask, request, jsonify
import os
os.environ['CUDA_VISIBLE_DEVICES'] = ''
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input, decode_predictions
import numpy as np
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
model = MobileNetV2(weights='imagenet')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image from the request
        image_file = request.files['image']

        # Read the image from FileStorage object
        img = image.load_img(BytesIO(image_file.read()), target_size=(224, 224))

        # Rest of the code remains unchanged
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        predictions = model.predict(img_array)

        decoded_predictions = decode_predictions(predictions, top=10)[0]

        result = [{'label': label, 'score': float(score)} for _, label, score in decoded_predictions]

        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 400
    
    
@app.route('/hello', methods=['GET'])
def hello_world():
    app.logger.info('Received a request to /hello')
    return {'answer' : 'hello'}



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
