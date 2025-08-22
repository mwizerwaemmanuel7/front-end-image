import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminUpload from './AdminUpload';
import axios from 'axios';

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(null); // The image being edited
  const [editFields, setEditFields] = useState({ description: '', link: '', categories: '' });

  // Fetch images
  const fetchImages = () => {
    axios.get('https://back-end-image.onrender.com/api/images')
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAdmin) fetchImages();
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  // Start editing an image
  const startEdit = (img) => {
    setEditing(img._id);
    setEditFields({
      description: img.description,
      link: img.link,
      categories: img.categories.join(', ')
    });
  };

  // Save the edited image
  const saveEdit = async (img) => {
    await axios.put(`https://back-end-image.onrender.com/api/images/${img._id}`, {
      imageUrl: img.imageUrl,
      description: editFields.description,
      link: editFields.link,
      categories: editFields.categories.split(',').map(c => c.trim())
    });
    setEditing(null);
    fetchImages();
  };

  // Delete an image
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await axios.delete(`https://back-end-image.onrender.com/api/images/${id}`);
      fetchImages();
    }
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "20px" }}>Logout</button>
      <h1>Admin Panel</h1>
      <AdminUpload onUpload={fetchImages} />
      <h2>Manage Images</h2>
      <div className="image-gallery">
        {images.map(img => (
          <div key={img._id} className="image-card">
            <img src={img.imageUrl} alt={img.description} style={{ width: "100%", maxWidth: "300px" }} />
            {editing === img._id ? (
              <div>
                <input
                  type="text"
                  value={editFields.description}
                  onChange={e => setEditFields({ ...editFields, description: e.target.value })}
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={editFields.link}
                  onChange={e => setEditFields({ ...editFields, link: e.target.value })}
                  placeholder="Link"
                />
                <input
                  type="text"
                  value={editFields.categories}
                  onChange={e => setEditFields({ ...editFields, categories: e.target.value })}
                  placeholder="Categories (comma separated)"
                />
                <button onClick={() => saveEdit(img)}>Save</button>
                <button onClick={() => setEditing(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{img.description}</p>
                <a href={img.link} target="_blank" rel="noopener noreferrer">Go to link</a>
                <p>Categories: {img.categories.join(', ')}</p>
                <button onClick={() => startEdit(img)}>Edit</button>
                <button onClick={() => handleDelete(img._id)} style={{ color: "red" }}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;