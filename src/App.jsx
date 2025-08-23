import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalleryPage from './components/GalleryPage';
import AdminPage from './components/AdminPage';
import ImagePage from './components/ImagePage'; // <-- Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/image/:id" element={<ImagePage />} /> {/* <-- Add this line */}
      </Routes>
    </Router>
  );
}

export default App;