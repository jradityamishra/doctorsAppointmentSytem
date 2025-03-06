import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import SearchDoctors from './SearchDoctors';
import AppointmentsList from './AppointmentsList';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">You need to login to access the dashboard.</span>
        </div>
        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Find a Doctor</h2>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <SearchDoctors />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <AppointmentsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 