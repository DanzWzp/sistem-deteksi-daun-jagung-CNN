const fileInput = document.getElementById('fileInput');
const uploadedImage = document.getElementById('uploadedImage');
const predictionText = document.getElementById('prediction');
const accuracyText = document.getElementById('accuracy');
const descriptionText = document.getElementById('description');

fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        uploadedImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/predict', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data =>{
            if (data.error) {
                predictionText.textContent = `Error: ${data.error}`;
                accuracyText.textContent = '';
                descriptionText.textContent = ''; // Clear description on error
            } else {
                predictionText.textContent = `Hasil Deteksi: ${data.prediction}`;
                accuracyText.textContent = `Akurasi: ${data.accuracy}%`;
                descriptionText.textContent = `Keterangan: ${data.description}`; // Display description
            }
        })
        .catch(error => {
            console.error('Error:', error);
            predictionText.textContent = `Error: ${error.message}`;
            accuracyText.textContent = '';
        });
        resetButton.addEventListener('click', function () {
            fileInput.value = ''; // Mengosongkan input file
            uploadedImage.src = ''; // Mengosongkan gambar yang diupload
            predictionText.textContent = ''; // Mengosongkan hasil prediksi
            accuracyText.textContent = ''; // Mengosongkan akurasi
            descriptionText.textContent = ''; // Mengosongkan keterangan
        });

        
});