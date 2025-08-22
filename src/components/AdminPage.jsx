import { useState } from 'react';
import AdminLogin from './AdminLogin';
import AdminUpload from './AdminUpload';
// Import other admin components if needed (like edit/delete)

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  if (!isAdmin) {
    return <AdminLogin onLogin={() => setIsAdmin(true)} />;
  }

  return (
    <div>
      <button onClick={handleLogout} style={{ float: "right", margin: "20px" }}>Logout</button>
      <h1>Admin Panel</h1>
      <AdminUpload onUpload={() => { /* refresh images if needed */ }} />
      {/* Add your admin-only features here, like edit/delete if you want */}
    </div>
  );
}

export default AdminPage;