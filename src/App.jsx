import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from './components/ImageCard';
import SearchBar from './components/SearchBar';
import AdminUpload from './components/AdminUpload';
import AdminLogin from './components/AdminLogin'; // <-- Add this import

const IMAGES_PER_PAGE = 2;

function App() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingImage, setEditingImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  // Fetch images from backend
  const fetchImages = () => {
    axios.get('https://back-end-image.onrender.com/api/images')
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Get all unique categories
  const allCategories = [
    "All",
    ...Array.from(new Set(images.flatMap(img => img.categories)))
  ];

  // Filter images by description and category
  const filteredImages = images.filter(img => {
    const matchesSearch = img.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || img.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  // Handle category change (reset to page 1)
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle search change (reset to page 1)
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await axios.delete(`https://back-end-image.onrender.com/api/images/${id}`);
      fetchImages();
    }
  };

  // Handle edit (for now, just show an alert)
  const handleEdit = (image) => {
    alert("Edit feature coming soon! (You clicked edit for: " + image.description + ")");
    // setEditingImage(image); // Uncomment this when you add the edit form
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  // Show login form if not admin
  if (!isAdmin) {
    return <AdminLogin onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "20px" }}>Logout</button>
      <h1>Image Gallery</h1>
      {/* Admin Upload Form */}
      <AdminUpload onUpload={fetchImages} />
      {/* Category Filter Buttons */}
      <div style={{ marginBottom: "20px", marginLeft: "20px" }}>
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              background: selectedCategory === category ? "#333" : "#eee",
              color: selectedCategory === category ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <SearchBar searchTerm={searchTerm} onSearch={handleSearchChange} />
      <div className="image-gallery">
        {paginatedImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          paginatedImages.map((img, idx) => (
            <ImageCard
              key={img._id || idx}
              imageUrl={img.imageUrl}
              description={img.description}
              link={img.link}
              onDelete={isAdmin ? () => handleDelete(img._id) : undefined}
              onEdit={isAdmin ? () => handleEdit(img) : undefined}
            />
          ))
        )}
      </div>
      {/* Pagination Controls */}
      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            background: "#eee",
            color: "#333",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer"
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "1.1rem", margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            background: "#eee",
            color: "#333",
            border: "none",
            borderRadius: "4px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;