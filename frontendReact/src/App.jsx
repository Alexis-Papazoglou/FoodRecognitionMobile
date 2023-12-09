import React from 'react';

class ImageUploader extends React.Component {
  handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', this.fileInput.files[0]);

      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully');
        console.log(await response.json());
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  render() {
    return (
      <div>
        <input
          type="file"
          ref={(input) => (this.fileInput = input)}
          accept="image/*"
        />
        <button onClick={this.handleUpload}>Upload Image</button>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <h1>Image Uploader</h1>
      <ImageUploader />
    </div>
  );
}

export default App;
