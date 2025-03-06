import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    specialty: '',
    experience: '',
    city: '',
    state: '',
    consultationLocations: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    userType, 
    specialty, 
    experience, 
    city, 
    state, 
    consultationLocations 
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Prepare user data based on user type
      let userData = { name, email, password };
      
      if (userType === 'doctor') {
        // Split consultation locations by comma
        const locationsArray = consultationLocations
          .split(',')
          .map(location => location.trim())
          .filter(location => location !== '');
        
        userData = {
          ...userData,
          specialty,
          experience: parseInt(experience, 10),
          location: {
            city,
            state,
          },
          consultationLocations: locationsArray,
        };
      }

      await register(userData, userType);
      
      // Redirect based on user type
      if (userType === 'patient') {
        navigate('/patient/dashboard');
      } else {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      setError(error.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="userType-patient"
                name="userType"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                value="patient"
                checked={userType === 'patient'}
                onChange={onChange}
              />
              <label htmlFor="userType-patient" className="ml-2 block text-sm text-gray-900">
                Register as Patient
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="userType-doctor"
                name="userType"
                type="radio"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                value="doctor"
                checked={userType === 'doctor'}
                onChange={onChange}
              />
              <label htmlFor="userType-doctor" className="ml-2 block text-sm text-gray-900">
                Register as Doctor
              </label>
            </div>
          </div>

          {userType === 'doctor' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <input
                  id="specialty"
                  name="specialty"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Cardiologist, Dermatologist"
                  value={specialty}
                  onChange={onChange}
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Experience (years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  min="0"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Years of experience"
                  value={experience}
                  onChange={onChange}
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="City"
                  value={city}
                  onChange={onChange}
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="State"
                  value={state}
                  onChange={onChange}
                />
              </div>
              
              <div>
                <label htmlFor="consultationLocations" className="block text-sm font-medium text-gray-700">
                  Consultation Locations (comma separated)
                </label>
                <input
                  id="consultationLocations"
                  name="consultationLocations"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., City Hospital, Downtown Clinic"
                  value={consultationLocations}
                  onChange={onChange}
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 