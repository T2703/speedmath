import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaUser, FaGamepad, FaRocket, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="font-sans text-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-500 to-green-400 min-h-screen flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 animate-bounce">
                    Welcome to Speed Math!
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8">
                    The fun and interactive way to learn math through gaming.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-white text-blue-500 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg"
                >
                    Get Started
                </button>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50 text-center">
                <h2 className="text-4xl font-semibold mb-12">Why Choose Us?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    <Feature icon={<FaGamepad />} title="Play & Learn" description="Learn math while playing fun games." />
                    <Feature icon={<FaRocket />} title="Progress Fast" description="Unlock levels and rewards as you improve." />
                    <Feature icon={<FaUser />} title="Challenge Friends" description="Compete with friends and climb leaderboards!" />
                    <Feature icon={<FaStar />} title="Enjoy Learning Again!" description="So much fun you wouldnt even realize youre learning!" />
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <h2 className="text-4xl font-semibold text-center mb-12">What People Say</h2>
                <div className="flex justify-center">
                    <div className="w-11/12 md:w-8/12 lg:w-6/12">
                        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg mb-8">
                            <p className="text-xl mb-4">"Speed Math has helped my child enjoy learning math! Highly recommend it."</p>
                            <p className="text-right font-semibold">– Sarah L.</p>
                        </div>
                        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg mb-8">
                            <p className="text-xl mb-4">"Learning math is now fun and competitive. Love the rewards!"</p>
                            <p className="text-right font-semibold">– John M.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="py-8 bg-gray-800 text-white text-center">
                <h3 className="text-2xl font-semibold mb-4">Connect with Us</h3>
                <div className="flex justify-center space-x-6 text-2xl mb-4">
                    <a href="#" className="hover:text-blue-500 transition duration-300"><FaFacebook /></a>
                    <a href="#" className="hover:text-blue-400 transition duration-300"><FaTwitter /></a>
                    <a href="#" className="hover:text-pink-500 transition duration-300"><FaInstagram /></a>
                </div>
                <p className="text-gray-400">© 2024 Speed Math. All rights reserved.</p>
            </div>
        </div>
    );
};

const Feature = ({ icon, title, description }) => (
    <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300">
        <div className="text-blue-500 text-4xl mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default LandingPage;
