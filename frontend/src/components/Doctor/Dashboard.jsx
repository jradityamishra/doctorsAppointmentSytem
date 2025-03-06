import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import SetAvailability from './SetAvailability';
import ViewAppointments from './ViewAppointments';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [consultationLocations, setConsultationLocations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Debug: Log user data to see what's available
  useEffect(() => {
    if (user) {
      console.log('User data in dashboard:', user);
    }
  }, [user]);

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

  const handleLocationChange = (e) => {
    setConsultationLocations(e.target.value);
  };

  const addConsultationLocations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const locations = consultationLocations
      .split(',')
      .map(location => location.trim())
      .filter(location => location !== '');

    if (locations.length === 0) {
      setError('Please enter at least one consultation location');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put('/api/doctors/update-locations', {
        consultationLocations: locations
      });

      console.log('Update response:', response.data);

      // Update user in localStorage to reflect changes
      const updatedUser = {
        ...user,
        consultationLocations: response.data.consultationLocations
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Force reload to update the user context
      window.location.reload();
      
      setSuccess('Consultation locations updated successfully');
      setConsultationLocations('');
    } catch (error) {
      console.error('Error updating locations:', error);
      setError(error.response?.data?.error || 'Error updating consultation locations');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a value is empty
  const isEmpty = (value) => {
    return value === undefined || value === null || value === '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome, Dr. {user.name}</p>
        </div>
        <button
          onClick={logout}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <p className="text-gray-600"><span className="font-medium">Name:</span> {user.name}</p>
              <p className="text-gray-600"><span className="font-medium">Email:</span> {user.email}</p>
              <p className="text-gray-600"><span className="font-medium">Specialty:</span> {isEmpty(user.specialty) ? 'Not specified' : user.specialty}</p>
              <p className="text-gray-600"><span className="font-medium">Experience:</span> {isEmpty(user.experience) ? 'Not specified' : `${user.experience} years`}</p>
              <p className="text-gray-600">
                <span className="font-medium">Location:</span> {
                  user.location && (user.location.city || user.location.state) 
                  ? `${user.location.city || ''}, ${user.location.state || ''}`.replace(', ,', '')
                  : 'Not specified'
                }
              </p>
              
              <div>
                <p className="font-medium text-gray-600">Consultation Locations:</p>
                {user.consultationLocations && user.consultationLocations.length > 0 ? (
                  <ul className="list-disc list-inside mt-1">
                    {user.consultationLocations.map((location) => (
                      <li key={location} className="text-gray-600">{location}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 mt-1">No consultation locations added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Consultation Locations</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            
            <form onSubmit={addConsultationLocations}>
              <div className="mb-4">
                <label htmlFor="consultationLocations" className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Locations (comma separated)
                </label>
                <input
                  id="consultationLocations"
                  name="consultationLocations"
                  type="text"
                  value={consultationLocations}
                  onChange={handleLocationChange}
                  placeholder="e.g., City Hospital, Downtown Clinic"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Updating...' : 'Update Locations'}
              </button>
            </form>
          </div>

          <SetAvailability />
        </div>

        <div className="md:col-span-2">
          <ViewAppointments />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 