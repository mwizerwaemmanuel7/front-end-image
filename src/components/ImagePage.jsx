import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ImagePage() {
  const { id } = useParams();
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`https://abroadscholar.icu/api/images/${id}`)
      .then(res => setImage(res.data))
      .catch(err => setImage(null));
  }, [id]);

  if (!image) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <img src={image.imageUrl} alt={image.description} style={{ width: "70%", maxWidth: 400 }} />
      <h2>{image.description}</h2>
      <p>{image.paragraph}</p>
      <a href={image.link} target="_blank" rel="noopener noreferrer">
        <button style={{ padding: "10px 30px", fontSize: "1.1rem" }}>Go to link</button>
      </a>
    </div>
  );
}

export default ImagePage;