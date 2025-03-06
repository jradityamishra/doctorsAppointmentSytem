import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/api';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoading, setCancelLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await appointmentService.getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      setError('Error fetching appointments. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    setCancelLoading(id);
    setError('');
    setSuccessMessage('');
    
    try {
      await appointmentService.cancelAppointment(id);
      setSuccessMessage('Appointment cancelled successfully');
      // Update the appointments list
      fetchAppointments();
    } catch (error) {
      setError(error.error || 'Error cancelling appointment. Please try again.');
      console.error(error);
    } finally {
      setCancelLoading(null);
    }
  };

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

  // Check if appointment is upcoming
  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  // Group appointments by upcoming and past
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status === 'booked' && isUpcoming(appointment.availability.start)
  );
  
  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === 'canceled' || !isUpcoming(appointment.availability.start)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-6 mb-8">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Dr. {appointment.doctor.name}</h3>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Specialty:</span> {appointment.doctor.specialty}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Date:</span> {formatDate(appointment.availability.start)}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Time:</span> {formatTime(appointment.availability.start)} - {formatTime(appointment.availability.end)}</p>
                        <p className="text-gray-600 mb-3"><span className="font-medium">Location:</span> {appointment.availability.location}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => cancelAppointment(appointment._id)}
                          disabled={cancelLoading === appointment._id}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          {cancelLoading === appointment._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <p className="text-gray-600">You don't have any upcoming appointments.</p>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
          {pastAppointments.length > 0 ? (
            <div className="grid gap-6">
              {pastAppointments.map((appointment) => (
                <div key={appointment._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Dr. {appointment.doctor.name}</h3>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Specialty:</span> {appointment.doctor.specialty}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Date:</span> {formatDate(appointment.availability.start)}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Time:</span> {formatTime(appointment.availability.start)} - {formatTime(appointment.availability.end)}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Location:</span> {appointment.availability.location}</p>
                        <p className={`font-medium ${appointment.status === 'booked' ? 'text-green-600' : 'text-red-600'}`}>
                          {appointment.status === 'booked' ? 'Completed' : 'Cancelled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <p className="text-gray-600">You don't have any past appointments.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentsList; 