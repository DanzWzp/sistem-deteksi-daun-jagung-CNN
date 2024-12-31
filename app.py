from flask import Flask, render_template, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import uuid

app = Flask(__name__)

# Load model
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model', 'corn_leaf_model.h5')
model = load_model(model_path)

# Kelas daun jagung
classes = ['Bercak Daun', 'Daun Sehat', 'Hawar Daun', 'Karat Daun']

# Keterangan untuk setiap kelas
descriptions = {
    'Bercak Daun': 'Kondisi daun yang menunjukkan bercak-bercak, biasanya disebabkan oleh penyakit.',
    'Daun Sehat': 'Daun yang tampak segar dan tidak menunjukkan tanda-tanda penyakit.',
    'Hawar Daun': 'Kondisi daun yang menguning dan layu, sering disebabkan oleh infeksi atau kekurangan nutrisi.',
    'Karat Daun': 'Kondisi daun yang menunjukkan bercak karat, biasanya disebabkan oleh jamur.'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Buat nama file unik
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        filepath = os.path.join('static', 'uploads', filename)
        
        # Simpan file
        file.save(filepath)
        
        try:
            # Proses gambar
            img = image.load_img(filepath, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array /= 255.
            
            # Prediksi
            prediction = model.predict(img_array)
            predicted_class = classes[np.argmax(prediction)]
            predicted_accuracy = float(prediction[0][np.argmax(prediction)] * 100)
            
            # Hapus file setelah diproses
            os.remove(filepath)
            
            return jsonify({
                'prediction': predicted_class,
                'accuracy': predicted_accuracy,
                'description': descriptions[predicted_class]  # Menambahkan keterangan
            })
        except Exception as e:
            # Jika terjadi error, pastikan file dihapus
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)