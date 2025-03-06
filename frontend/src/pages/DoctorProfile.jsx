import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../services/api';
import BookAppointment from '../components/Patient/BookAppointment';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        setError('Error fetching doctor details. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Loading doctor profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error || 'Doctor not found'}</span>
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        &larr; Back to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">Dr. {doctor.name}</h1>
              <p className="text-gray-600 mb-4">{doctor.specialty}</p>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-600"><span className="font-medium">Experience:</span> {doctor.experience} years</p>
                <p className="text-gray-600"><span className="font-medium">Location:</span> {doctor.location?.city}, {doctor.location?.state}</p>
                
                <div>
                  <p className="font-medium text-gray-600">Consultation Locations:</p>
                  {doctor.consultationLocations && doctor.consultationLocations.length > 0 ? (
                    <ul className="list-disc list-inside mt-1">
                      {doctor.consultationLocations.map((location) => (
                        <li key={location} className="text-gray-600">{location}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 mt-1">No consultation locations specified.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <BookAppointment doctorId={id} />
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 