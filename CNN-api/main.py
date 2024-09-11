from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from predictions import predict
import os
from PIL import Image
import pyautogui
import pygetwindow
from pymongo import MongoClient
from bson import ObjectId,Binary
from datetime import datetime
import base64
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app)
 
# Configure paths
project_folder = os.path.dirname(os.path.abspath(__file__))
folder_path = os.path.join(project_folder, 'images/')
upload_folder = os.path.join(project_folder, 'uploads/')
result_folder = os.path.join(project_folder, 'PredictResults/')
os.makedirs(upload_folder, exist_ok=True)
os.makedirs(result_folder, exist_ok=True)
 
# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string
db = client['Fracture-Analysis']
collection = db['users']
 
 
 
 
 
@app.route('/upload_predict', methods=['POST'])
def upload_predict_image():
    print(request.files['file'])
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({'error': 'File or User ID missing'}), 400
    
    file = request.files['file']
    user_id = request.form['user_id']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
 
    filename = secure_filename(file.filename)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    with open(filepath, "rb") as f:
        binary_data = f.read()
 
    # Perform predictions after the file is saved
    bone_type_result = predict(filepath)
    result = predict(filepath, bone_type_result)
    
    prediction_result = {
        
        'filename': filename,
        'file_data': Binary(binary_data),
        'result': result,
        'bone_type': bone_type_result,
        'timestamp': datetime.utcnow()
    }
 
    try:
        # Convert the user_id to an ObjectId
        user_object_id = ObjectId(user_id)
 
        # Fetch the document by _id
        existing_document = collection.find_one({'_id': user_object_id})
 
        # Print the existing document to the console
        print("Existing Document:", existing_document)
 
        if existing_document:
            # If the document exists, update it
            collection.update_one(
                {'_id': user_object_id},
                {'$set': prediction_result}
            )
        else:
            # If the document does not exist, insert a new one
          return jsonify({'error': 'User does not exist'}), 404
        updated_document = collection.find_one({'_id': user_object_id})
        updated_document['file_data'] = base64.b64encode(updated_document['file_data']).decode('utf-8')
 
        # Convert ObjectId to string for JSON serialization
        updated_document['_id'] = str(updated_document['_id'])
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

 
    return jsonify(updated_document), 200
 
 

 
@app.route('/save_result', methods=['POST'])
def save_result():
    data = request.json
    filename = data.get('filename')
    if not filename:
        return jsonify({'error': 'Filename not provided'}), 400
 
    screenshots_dir = os.path.join(result_folder, f"{filename}.png")
    
    window = pygetwindow.getWindowsWithTitle('Bone Fracture Detection')[0]
    left, top = window.topleft
    right, bottom = window.bottomright
    pyautogui.screenshot(screenshots_dir)
    im = Image.open(screenshots_dir)
    im = im.crop((left + 10, top + 35, right - 10, bottom - 10))
    im.save(screenshots_dir)
    
    return send_file(screenshots_dir, as_attachment=True), 200
 
@app.route('/rules', methods=['GET'])
def get_rules_image():
    im = Image.open(os.path.join(folder_path, 'rules.jpeg'))
    im = im.resize((700, 700))
    im.save(os.path.join(upload_folder, 'rules_temp.jpeg'))
    return send_file(os.path.join(upload_folder, 'rules_temp.jpeg'), mimetype='image/jpeg')
 
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=2002)
 
 
 
