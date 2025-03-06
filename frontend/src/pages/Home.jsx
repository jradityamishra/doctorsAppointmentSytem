import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Find the Right Doctor & Book Appointments Online
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl text-center mb-8">
            Search for specialists, view their availability, and book appointments instantly.
            Take control of your healthcare journey with our easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl font-bold mb-4">01</div>
            <h3 className="text-xl font-semibold mb-2">Search for Doctors</h3>
            <p className="text-gray-600">
              Find specialists based on specialty, location, or name. Browse through profiles to find the perfect match for your healthcare needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl font-bold mb-4">02</div>
            <h3 className="text-xl font-semibold mb-2">Book an Appointment</h3>
            <p className="text-gray-600">
              Select from available time slots that fit your schedule. Book instantly with just a few clicks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-4xl font-bold mb-4">03</div>
            <h3 className="text-xl font-semibold mb-2">Manage Your Appointments</h3>
            <p className="text-gray-600">
              View your upcoming appointments, receive email confirmations, and easily cancel if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Registration Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Are you a Doctor?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Join our platform to manage your appointments, set your availability, and grow your practice.
            </p>
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
            >
              Register as a Doctor
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">Doctor Appointment System</h2>
              <p className="text-gray-400">Find doctors and book appointments online</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="hover:text-blue-400">Home</Link>
              <Link to="/register" className="hover:text-blue-400">Register</Link>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Doctor Appointment System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 