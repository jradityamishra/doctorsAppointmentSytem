import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800  p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/" className="hover:text-gray-300 text-white italic font-bold text-2xl">Clinic360</Link>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          {user ? (
            <>
              <Link to={`/${user.userType}/dashboard`} className="text-white hover:text-gray-300">Dashboard</Link>
              <button onClick={handleLogout} className="text-white bg-red-500 hover:text-white">Logout</button>
            </>
          ) : (
            <Link to="/login" ><button className="text-white bg-blue-500 hover:text-gray-300">login</button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 