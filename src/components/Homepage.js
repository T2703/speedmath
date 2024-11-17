// import React from 'react';
import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth,db } from '../backend/firebaseConfig.js'
import { doc, getDoc } from 'firebase/firestore';


function Homepage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [scores, setScores] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [improvement, setImprovement] = useState({});
    const [celebrationMessage, setCelebrationMessage] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('Select Leaderboard');

    const DELAY = 420;

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Handle leaderboard selection
    const handleLeaderboardSelect = (type) => {
        setSelectedLeaderboard(type);
        if (type != "Select Leaderboard") {
            navigate(`/leaderboards/${type.toLowerCase()}`);
        }
    

        toggleDrawer(); // Close the drawer after selection
    };

    const fetchUserData = async () => {
        if (!auth.currentUser) {
            console.error("User is not authenticated");
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const userListingDoc = await getDoc(doc(db, 'Users', auth.currentUser.uid));

            if (userListingDoc.exists()) {
                const userData = userListingDoc.data();
                if (userData && 'username' in userData && 'email' in userData) {
                    setUser({ id: userListingDoc.id, ...userData });
                } else {
                    console.error('User data is missing required fields');
                }
            } else {
                console.error("User not found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Fetch scores and calculate improvements
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const scoreDoc = await getDoc(doc(db, 'Users', user.uid));
                    if (scoreDoc.exists()) {
                        const { additionScore, subtractionScore, multiplicationScore, divisionScore } = scoreDoc.data();
                        const scores = { additionScore, subtractionScore, multiplicationScore, divisionScore };
                        setScores(scores);

                        // Assuming these fields are arrays storing all previous scores for each category
                        const { additionScores = [], subtractionScores = [], multiplicationScores = [], divisionScores = [] } = scoreDoc.data();

                        // Calculate averages for each category
                        const averages = {
                            addition: additionScores.length > 0 ? additionScores.reduce((a, b) => a + b, 0) / additionScores.length : 0,
                            subtraction: subtractionScores.length > 0 ? subtractionScores.reduce((a, b) => a + b, 0) / subtractionScores.length : 0,
                            multiplication: multiplicationScores.length > 0 ? multiplicationScores.reduce((a, b) => a + b, 0) / multiplicationScores.length : 0,
                            division: divisionScores.length > 0 ? divisionScores.reduce((a, b) => a + b, 0) / divisionScores.length : 0,
                        };
                        setAverageScores(averages); // Store averages in state

                        // Calculate improvement over average
                        const improvementData = {
                            addition: scores.additionScore - averages.addition,
                            subtraction: scores.subtractionScore - averages.subtraction,
                            multiplication: scores.multiplicationScore - averages.multiplication,
                            division: scores.divisionScore - averages.division,
                        };

                        setImprovement(improvementData);

                        // Set a celebration message if there’s any improvement
                        const totalImprovement = Object.values(improvementData).some(value => value > 0);
                        if (totalImprovement) {
                            setCelebrationMessage("🎉 Congratulations! You've improved your scores! 🎉");
                        } else {
                            setCelebrationMessage(""); // No message if there's no improvement
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData();
                fetchScores();
            } else {
                // User is not logged in, redirect to login
                navigate('/');
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);    

    // Only render user data if it exists
    if (!user) {
        return <div>Loading user data...</div>;
    }

    
    // Well I mean it's the logout.
    const handleLogout = async () => {      
        try {
            await signOut(auth);
            navigate('/'); // Redirect to login page after successful sign-out
        } catch (error) {
            console.error('Error signing out:', error);
        }
        
    };
    const areAllScoresZero = scores &&
    Object.values(scores).every(score => score === 0);

    return (
        <div className="homepage min-h-screen  flex flex-col items-center bg-gray-50 p-4">
            <button onClick={toggleDrawer} className="fixed top-4 right-4 z-50 p-2 bg-white-500 text-black rounded-full ">
                ☰
            </button>
    
            <div
    className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
>
    <div className="flex flex-col h-full p-6">
        <h2 className="text-3xl font-semibold text-blue-600 mb-8">Profile</h2>
        
        {/* User Info Section */}
        <div className="mb-8">
            <p className="font-bold text-gray-800 text-lg">Welcome, {user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Profile Button */}
        <button
            onClick={() => navigate('/profile')}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-200 mb-6"
        >
            View Profile
        </button>

        {/* Leaderboard Selector */}
        <div className="mb-6">
            <label className="block text-gray-600 font-semibold mb-2">Select Leaderboard</label>
            <select
                value={selectedLeaderboard}
                onChange={(e) => handleLeaderboardSelect(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
                <option disabled>Select Leaderboard</option>
                <option value="Addition">Addition</option>
                <option value="Subtraction">Subtraction</option>
                <option value="Multiplication">Multiplication</option>
                <option value="Division">Division</option>
                <option value="All">Random</option>
            </select>
        </div>

        {/* Logout Button */}
        <button
            onClick={handleLogout}
            className="mt-auto w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-200"
        >
            Logout
        </button>
    </div>
</div>
    
            <header className="header bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <h1 className="text-4xl font-bold">Welcome to Speed Math!</h1>
                <p className="mt-2 text-lg">The fun way to learn math and play games!</p>
            </header>
    
            {celebrationMessage && (
                <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold p-4 rounded-lg mb-8 flex items-center gap-2 text-xl">
                    🎉 {celebrationMessage} 🎉
                </div>
            )}
    
            {!areAllScoresZero && (
                <section className="progress mb-8 w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Your Progress</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {scores.additionScore > 0 && (
                            <div className="bg-green-100 rounded-lg p-6 shadow hover:shadow-lg">
                                <h3 className="text-xl font-bold text-green-600">Addition</h3>
                                <p className="text-lg mt-2 text-gray-700">+{improvement.addition.toFixed(2)} Improvement</p>
                                <div className="w-full bg-green-300 h-2 rounded mt-4">
                                    <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min((improvement.addition / averageScores.addition) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                        {scores.subtractionScore > 0 && (
                            <div className="bg-green-100 rounded-lg p-6 shadow hover:shadow-lg">
                                <h3 className="text-xl font-bold text-green-600">Subtraction</h3>
                                <p className="text-lg mt-2 text-gray-700">+{improvement.subtraction.toFixed(2)} Improvement</p>
                                <div className="w-full bg-green-300 h-2 rounded mt-4">
                                    <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min((improvement.subtraction / averageScores.subtraction) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                        {scores.multiplicationScore > 0 && (
                            <div className="bg-green-100 rounded-lg p-6 shadow hover:shadow-lg">
                                <h3 className="text-xl font-bold text-green-600">Multiplication</h3>
                                <p className="text-lg mt-2 text-gray-700">+{improvement.multiplication.toFixed(2)} Improvement</p>
                                <div className="w-full bg-green-300 h-2 rounded mt-4">
                                    <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min((improvement.multiplication / averageScores.multiplication) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                        {scores.divisionScore > 0 && (
                            <div className="bg-green-100 rounded-lg p-6 shadow hover:shadow-lg">
                                <h3 className="text-xl font-bold text-green-600">Division</h3>
                                <p className="text-lg mt-2 text-gray-700">+{improvement.division.toFixed(2)} Improvement</p>
                                <div className="w-full bg-green-300 h-2 rounded mt-4">
                                    <div className="h-full bg-green-500 rounded" style={{ width: `${Math.min((improvement.division / averageScores.division) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}
    
            {/* Levels Section */}
            <section className="levels mb-8 w-full max-w-4xl text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Your Level</h2>
                <div className="level-buttons flex flex-wrap justify-center gap-4">
                    <button onClick={() => navigate('/math/addition')} className="level bg-blue-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-600 transition duration-200">
                        Addition
                    </button>
                    <button onClick={() => navigate('/math/subtraction')} className="level bg-red-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-red-600 transition duration-200">
                        Subtraction
                    </button>
                    <button onClick={() => navigate('/math/multiplication')} className="level bg-yellow-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-yellow-600 transition duration-200">
                        Multiplication
                    </button>
                    <button onClick={() => navigate('/math/division')} className="level bg-green-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-600 transition duration-200">
                        Division
                    </button>
                </div>
            </section>
    
            {/* Main Action Button */}
            <button onClick={() => navigate('/math/all')} className="play-button bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 mb-8 animate-pulse">
                Random
            </button>
    
    
            {/* Footer Section */}
            <footer className="footer text-gray-600 text-center mt-auto py-4 w-full max-w-4xl border-t border-gray-200">
                <p className="text-sm">Contact Support | Privacy Policy | Terms of Service</p>
            </footer>
        </div>
        );
    }
    
    export default Homepage;
    
