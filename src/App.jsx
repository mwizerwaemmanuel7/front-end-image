import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalleryPage from './components/GalleryPage'; // You will create this file
import AdminPage from './components/AdminPage';     // You will create this file

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;