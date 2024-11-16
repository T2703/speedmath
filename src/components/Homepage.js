import React from 'react';
import { Route, useNavigate } from 'react-router-dom';



function Homepage() {
    const navigate = useNavigate();
    return (
        <div className="homepage min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <header className="header text-center bg-blue-500 text-white p-6 rounded w-full max-w-3xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold">Welcome to Speed Math!</h1>
                <p className="mt-2 text-lg">The fun way to learn math and play games!</p>
            </header>

            <section className="features mb-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Features</h2>
                <div className="feature-card grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-500">Learn Math While Playing</h3>
                        <p className="mt-2 text-gray-600">Interactive games make learning addition, subtraction, and more enjoyable.</p>
                    </div>
                    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-500">Compete with Friends</h3>
                        <p className="mt-2 text-gray-600">Challenge friends and climb the leaderboard!</p>
                    </div>
                    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-500">Earn Rewards</h3>
                        <p className="mt-2 text-gray-600">Collect stars and badges as you progress.</p>
                    </div>
                </div>
            </section>

            <section className="levels mb-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-gray-700 text-center mb-4">Choose Your Level</h2>
                <div className="level-buttons flex flex-wrap justify-center gap-4">
                    <button className="level bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Addition</button>
                    <button className="level bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Subtraction</button>
                    <button className="level bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Multiplication</button>
                    <button className="level bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Division</button>
                </div>
            </section>

            <button onClick={() => navigate('/math')} className="play-button bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition duration-200 mb-8">
                Start Playing!
            </button>

            <footer className="footer text-gray-600 text-center mt-auto">
                <p className="text-sm">Contact Support | Privacy Policy | Terms of Service</p>
            </footer>
        </div>
    );
}

export default Homepage;
