import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/api';

const SearchDoctors = () => {
  const [formData, setFormData] = useState({
    specialty: '',
    location: '',
    name: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { specialty, location, name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await doctorService.getDoctors(formData);
      setDoctors(data);
    } catch (error) {
      setError('Error fetching doctors. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch all doctors on component mount
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await doctorService.getDoctors();
        setDoctors(data);
      } catch (error) {
        setError('Error fetching doctors. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
        
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={specialty}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Cardiologist"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="City or State"
            />
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doctor's name"
            />
          </div>
          
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <div key={doctor._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                <p className="text-gray-600 mb-1"><span className="font-medium">Specialty:</span> {doctor.specialty}</p>
                <p className="text-gray-600 mb-1"><span className="font-medium">Experience:</span> {doctor.experience} years</p>
                <p className="text-gray-600 mb-3"><span className="font-medium">Location:</span> {doctor.location.city}, {doctor.location.state}</p>
                
                <Link 
                  to={`/doctors/${doctor._id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Profile & Book
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600 text-lg">
              {loading ? 'Loading doctors...' : 'No doctors found. Please adjust your search criteria.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDoctors; 