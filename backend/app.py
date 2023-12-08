from flask import Flask, request, jsonify
from tensorflow.keras.applications.inception_v3 import InceptionV3
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.inception_v3 import preprocess_input, decode_predictions
import numpy as np
from io import BytesIO

app = Flask(__name__)
model = InceptionV3(weights='imagenet')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image from the request
        image_file = request.files['image']

        # Read the image from FileStorage object
        img = image.load_img(BytesIO(image_file.read()), target_size=(299, 299))

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)