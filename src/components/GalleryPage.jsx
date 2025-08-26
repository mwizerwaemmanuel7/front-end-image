import { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom'; // <-- Import Link

const IMAGES_PER_PAGE = 8;

function GalleryPage() {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get('https://back-end-image.onrender.com/api/images')
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  const allCategories = [
    "All",
    ...Array.from(new Set(images.flatMap(img => img.categories)))
  ];

  const filteredImages = images.filter(img => {
    const matchesSearch = img.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || img.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  return (
    <div>
      <h1>Katandika Movie Base</h1>
      <div style={{ marginBottom: "20px", marginLeft: "20px" }}>
        {allCategories.map(category => (
          <button
            key={category}
            onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
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
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
      <div className="image-gallery">
        {paginatedImages.length === 0 ? (
          <p>No images found.</p>
        ) : (
          paginatedImages.map((img, idx) => (
            <Link
              to={`/image/${img._id}`}
              key={img._id || idx}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ImageCard
                imageUrl={img.imageUrl}
                description={img.description}
                link={img.link}
              />
            </Link>
          ))
        )}
      </div>
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

export default GalleryPage;