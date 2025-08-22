import { useState } from 'react';
import axios from 'axios';

function AdminUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [categories, setCategories] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !description || !link || !categories) {
      setMessage('Please fill in all fields and select an image.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('description', description);
      formData.append('link', link);
      formData.append('categories', categories);

      await axios.post('https://back-end-image.onrender.com/api/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Image uploaded!');
      setFile(null);
      setDescription('');
      setLink('');
      setCategories('');
      if (onUpload) onUpload();
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  return (
    <div style={{ margin: "30px 20px", padding: "20px", background: "#fff", borderRadius: "8px", maxWidth: "400px" }}>
      <h2>Admin Upload</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={e => setLink(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={categories}
          onChange={e => setCategories(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminUpload;