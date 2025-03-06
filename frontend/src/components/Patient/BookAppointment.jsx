import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { availabilityService, appointmentService } from '../../services/api';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const BookAppointment = ({ doctorId, selectedDate }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch availabilities when doctorId or selected date changes
  useEffect(() => {
    if (!doctorId) return;

    const fetchAvailabilities = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await availabilityService.getAvailability(doctorId, selectedDate);
        setAvailabilities(data);
      } catch (error) {
        setError('Error fetching available slots. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [doctorId, selectedDate]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`/api/availability/${doctorId}?date=${selectedDate}`);
        const slots = response.data.filter(slot => !slot.isBooked);
        setAvailableSlots(slots);
      } catch (error) {
        setError('Error fetching available slots. Please try again.');
        console.error('Error fetching available slots:', error);
      }
    };

    fetchAvailableSlots();
  }, [doctorId, selectedDate]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Handle slot selection
  const handleSlotSelect = (availabilityId) => {
    setSelectedSlot(availabilityId);
  };

  // Book appointment
  const bookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      await appointmentService.bookAppointment(selectedSlot);
      setSuccess('Appointment booked successfully!');
      // Reset selection
      setSelectedSlot('');
      // Refresh availabilities
      const data = await availabilityService.getAvailability(doctorId, selectedDate);
      setAvailabilities(data);
      // Navigate to appointments list after a delay
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);
    } catch (error) {
      setError(error.error || 'Error booking appointment. Please try again.');
      console.error(error);
    } finally {
      setBookingLoading(false);
    }
  };

  // Group availabilities by date
  const groupedAvailabilities = availabilities.reduce((acc, availability) => {
    const date = new Date(availability.start).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(availability);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>

      {!user && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">You need to login to book an appointment.</span>
        </div>
      )}

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

      <div className="mb-6">
        <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          type="date"
          id="appointmentDate"
          name="appointmentDate"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
          onChange={(e) => setSelectedSlot('')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading available slots...</p>
        </div>
      ) : (
        <>
          {Object.keys(groupedAvailabilities).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedAvailabilities).map(([date, slots]) => (
                <div key={date} className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium text-lg mb-3">{formatDate(date)}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => handleSlotSelect(slot._id)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          selectedSlot === slot._id
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-gray-300 hover:border-blue-500'
                        }`}
                        disabled={slot.isBooked || bookingLoading}
                      >
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                        <div className="text-xs mt-1 text-gray-500">
                          {slot.location}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                onClick={bookAppointment}
                disabled={!selectedSlot || !user || bookingLoading}
                className={`w-full px-4 py-2 rounded-md text-white ${
                  !selectedSlot || !user
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {bookingLoading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">
                {selectedDate
                  ? 'No available slots for the selected date.'
                  : 'Please select a date to view available slots.'}
              </p>
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Available Slots</h3>
        <ul>
          {availableSlots.map(slot => (
            <li key={slot._id}>
              {new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleString()}
              <button onClick={() => handleSlotSelect(slot._id)}>Book</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookAppointment; 