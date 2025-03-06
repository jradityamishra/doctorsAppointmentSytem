import { useState, useEffect, useContext } from 'react';
import { availabilityService } from '../../services/api';
import AuthContext from '../../context/AuthContext';

const SetAvailability = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [consultationLocations, setConsultationLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { date, startTime, endTime, location } = formData;

  useEffect(() => {
    // Set consultation locations from user data
    if (user && user.consultationLocations) {
      setConsultationLocations(user.consultationLocations);
      // Set default location if available
      if (user.consultationLocations.length > 0) {
        setFormData((prev) => ({ ...prev, location: user.consultationLocations[0] }));
      }
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate inputs
    if (!date || !startTime || !endTime || !location) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Validate that start time is before end time
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    if (startDateTime >= endDateTime) {
      setError('Start time must be before end time');
      setLoading(false);
      return;
    }

    try {
      await availabilityService.createAvailability({
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        location,
      });

      setSuccess('Availability slot added successfully');
      // Reset form
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        location: location, // Keep the selected location
      });
    } catch (error) {
      setError(error.error || 'Error adding availability. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Set Availability</h2>

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

      {consultationLocations.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">You need to add consultation locations in your profile before setting availability.</span>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={onChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select a location</option>
              {consultationLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Adding...' : 'Add Availability'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SetAvailability; 