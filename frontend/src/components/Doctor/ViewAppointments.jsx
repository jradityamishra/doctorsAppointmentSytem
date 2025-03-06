import { useState, useEffect } from 'react';
import { appointmentService } from '../../services/api';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await appointmentService.getDoctorAppointments();
        if (data && Array.isArray(data)) {
          setAppointments(data);
          setError(''); // Ensure error is cleared if data is successfully retrieved
        } else {
          setError('Error: Received invalid appointment data.');
          console.error('Invalid appointment data:', data);
        }
      } catch (error) {
        setError('Error fetching appointments. Please try again.');
        console.error('Appointment fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

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

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md mb-8">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="py-3 px-4">{appointment.patient.name}</td>
                      <td className="py-3 px-4">{formatDate(appointment.availability.start)}</td>
                      <td className="py-3 px-4">
                        {formatTime(appointment.availability.start)} - {formatTime(appointment.availability.end)}
                      </td>
                      <td className="py-3 px-4">{appointment.availability.location}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Booked
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <p className="text-gray-600">You don't have any upcoming appointments.</p>
            </div>
          )}

          <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
          {pastAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pastAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="py-3 px-4">{appointment.patient.name}</td>
                      <td className="py-3 px-4">{formatDate(appointment.availability.start)}</td>
                      <td className="py-3 px-4">
                        {formatTime(appointment.availability.start)} - {formatTime(appointment.availability.end)}
                      </td>
                      <td className="py-3 px-4">{appointment.availability.location}</td>
                      <td className="py-3 px-4">
                        {appointment.status === 'booked' ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Cancelled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default ViewAppointments; 