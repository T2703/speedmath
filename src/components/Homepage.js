// import React from 'react';
import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth,db } from '../backend/firebaseConfig.js'
import { doc, getDoc } from 'firebase/firestore';


function Homepage() {
    const navigate = useNavigate();
    const [scores, setScores] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [improvement, setImprovement] = useState({});
    const [celebrationMessage, setCelebrationMessage] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('Select Leaderboard');

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Handle leaderboard selection
    const handleLeaderboardSelect = (type) => {
        setSelectedLeaderboard(type);
        toggleDrawer(); // Close the drawer after selection
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

        fetchScores();
    }, []);    
    // // Fetch scores and calculate improvements
    // useEffect(() => {
    //     const fetchScores = async () => {
    //         try {
    //             const user = auth.currentUser;
    //             if (user) {
    //                 const scoreDoc = await getDoc(doc(db, 'Users', user.uid));
    //                 if (scoreDoc.exists()) {
    //                     const { additionScore, subtractionScore, multiplicationScore, divisionScore } = scoreDoc.data();
    //                     const scores = { additionScore, subtractionScore, multiplicationScore, divisionScore };
    //                     setScores(scores);

    //                     // Assuming these fields are arrays storing all previous scores for each category
    //                     const { additionScores = [], subtractionScores = [], multiplicationScores = [], divisionScores = [] } = scoreDoc.data();

    //                     // Calculate averages for each category
    //                     const averages = {
    //                         addition: additionScores.length > 0 ? additionScores.reduce((a, b) => a + b, 0) / additionScores.length : 0,
    //                         subtraction: subtractionScores.length > 0 ? subtractionScores.reduce((a, b) => a + b, 0) / subtractionScores.length : 0,
    //                         multiplication: multiplicationScores.length > 0 ? multiplicationScores.reduce((a, b) => a + b, 0) / multiplicationScores.length : 0,
    //                         division: divisionScores.length > 0 ? divisionScores.reduce((a, b) => a + b, 0) / divisionScores.length : 0,
    //                     };
    //                     setAverageScores(averages); // Store averages in state

    //                     // Calculate improvement over average only if the current score is greater than the average
    //                     const improvementData = {};
    //                     let improvementCount = 0;

    //                     if (scores.additionScore > averages.addition) {
    //                         improvementData.addition = scores.additionScore - averages.addition;
    //                         improvementCount++;
    //                     }
    //                     if (scores.subtractionScore > averages.subtraction) {
    //                         improvementData.subtraction = scores.subtractionScore - averages.subtraction;
    //                         improvementCount++;
    //                     }
    //                     if (scores.multiplicationScore > averages.multiplication) {
    //                         improvementData.multiplication = scores.multiplicationScore - averages.multiplication;
    //                         improvementCount++;
    //                     }
    //                     if (scores.divisionScore > averages.division) {
    //                         improvementData.division = scores.divisionScore - averages.division;
    //                         improvementCount++;
    //                     }

    //                     setImprovement(improvementData);

    //                     // Set a celebration message if there’s any improvement
    //                     if (improvementCount > 0) {
    //                         setCelebrationMessage("🎉 Congratulations! You've improved your scores! 🎉");
    //                     } else {
    //                         setCelebrationMessage(""); // No message if there's no improvement
    //                     }
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error fetching scores:', error);
    //         }
    //     };

    //     fetchScores();
    // }, []);
    
    // Well I mean it's the logout.
    const handleLogout = async () => {      
        try {
            await signOut(auth);
            navigate('/'); // Redirect to login page after successful sign-out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    return (
        <div className="homepage min-h-screen flex flex-col items-center bg-gray-50 p-4">
                 {/* Drawer Toggle Button */}
                <button onClick={toggleDrawer} className="fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg">
                ☰
            </button>

            {/* Sidebar / Drawer */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
                <div className="flex flex-col h-full p-4">
                    <h2 className="text-2xl font-semibold text-blue-500 mb-6">Profile</h2>
                    <div className="mb-6">
                        <p className="font-bold text-gray-800">Welcome, [User Name]</p>
                        <p className="text-sm text-gray-500">user@example.com</p>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Leaderboards</h3>
                    <div className="mb-4">
                        <select
                            value={selectedLeaderboard}
                            onChange={(e) => handleLeaderboardSelect(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option disabled>Select Leaderboard</option>
                            <option value="Addition">Addition</option>
                            <option value="Subtraction">Subtraction</option>
                            <option value="Multiplication">Multiplication</option>
                            <option value="Division">Division</option>
                            <option value="Random">Random</option>
                        </select>
                    </div>
                    <button onClick={handleLogout} className="mt-auto bg-red-500 text-white py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </div>
            
            {/* Header Section */}
            <header className="header bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8">
                <h1 className="text-4xl font-bold">Welcome to Speed Math!</h1>
                <p className="mt-2 text-lg">The fun way to learn math and play games!</p>
            </header>
    
            {/* Celebratory Message */}
            {celebrationMessage && (
                <div className="celebration-message bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold p-4 rounded-lg mb-8 flex items-center gap-2 text-xl">
                    🎉 {celebrationMessage} 🎉
                </div>
            )}
    
            {/* Progress Section */}
            <section className="progress mb-8 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Your Progress</h2>
                <div className="score-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Progress Card Example for Each Category */}
                    {improvement.addition && averageScores && (
                        <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-bold text-green-600">Addition</h3>
                            <p className="text-lg mt-2 text-gray-700">+{improvement.addition.toFixed(2)} Improvement</p>
                            <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
                                <div
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${Math.min((improvement.addition / averageScores.addition) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {improvement.subtraction && averageScores && (
                        <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-bold text-green-600">Subtraction</h3>
                            <p className="text-lg mt-2 text-gray-700">+{improvement.subtraction.toFixed(2)} Improvement</p>
                            <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
                                <div
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${Math.min((improvement.subtraction / averageScores.subtraction) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {improvement.multiplication && averageScores && (
                        <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-bold text-green-600">Multiplication</h3>
                            <p className="text-lg mt-2 text-gray-700">+{improvement.multiplication.toFixed(2)} Improvement</p>
                            <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
                                <div
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${Math.min((improvement.multiplication / averageScores.multiplication) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {improvement.division && averageScores && (
                        <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
                            <h3 className="text-xl font-bold text-green-600">Division</h3>
                            <p className="text-lg mt-2 text-gray-700">+{improvement.division.toFixed(2)} Improvement</p>
                            <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
                                <div
                                    className="h-full bg-green-500 rounded"
                                    style={{ width: `${Math.min((improvement.division / averageScores.division) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
    
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
    
            {/* Main Action Button (Start Playing) */}
            <button onClick={() => navigate('/math/all')} className="play-button bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 mb-8 animate-pulse">
                Start Playing!
            </button>
    
            {/* Features Section */}
            <section className="features mb-8 w-full max-w-4xl text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Features</h2>
                <div className="feature-card grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-600">Learn Math While Playing</h3>
                        <p className="mt-2 text-gray-600">Interactive games make learning addition, subtraction, and more enjoyable.</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-600">Compete with Friends</h3>
                        <p className="mt-2 text-gray-600">Challenge friends and climb the leaderboard!</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold text-blue-600">Earn Rewards</h3>
                        <p className="mt-2 text-gray-600">Collect stars and badges as you progress.</p>
                    </div>
                </div>
            </section>


            <button onClick={() => navigate('/profile')} className="play-button bg-green-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-600 transition duration-200 mb-8">
                Profile Placeholder
            </button>

        </div>
    );
    
//         <div className="homepage min-h-screen flex flex-col items-center bg-gray-50 p-4">
//             {/* Header Section */}
//             <header className="header bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center p-8 rounded-lg shadow-lg w-full max-w-4xl mb-8">
//                 <h1 className="text-4xl font-bold">Welcome to Speed Math!</h1>
//                 <p className="mt-2 text-lg">The fun way to learn math and play games!</p>
//             </header>
    
//             {/* Celebratory Message */}
//             {celebrationMessage && (
//                 <div className="celebration-message bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold p-4 rounded-lg mb-8 flex items-center gap-2 text-xl">
//                     🎉 {celebrationMessage} 🎉
//                 </div>
//             )}
    
//             {/* Progress Section */}
//             <section className="progress mb-8 w-full max-w-4xl">
//                 <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Your Progress</h2>
//                 <div className="score-info grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                     {/* Progress Card Example for Each Category */}
//                     {improvement.addition && (
//                         <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
//                             <h3 className="text-xl font-bold text-green-600">Addition</h3>
//                             <p className="text-lg mt-2 text-gray-700">+{improvement.addition.toFixed(2)} Improvement</p>
//                             <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
//                                 <div
//                                     className="h-full bg-green-500 rounded"
//                                     style={{ width: `${Math.min((improvement.addition / averages.addition) * 100, 100)}%` }}
//                                     ></div>
//                             </div>
//                         </div>
//                     )}
//                     {improvement.subtraction && (
//                         <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
//                             <h3 className="text-xl font-bold text-green-600">Subtraction</h3>
//                             <p className="text-lg mt-2 text-gray-700">+{improvement.subtraction.toFixed(2)} Improvement</p>
//                             <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
//                                 <div
//                                     className="h-full bg-green-500 rounded"
//                                     style={{ width: `${Math.min((improvement.subtraction / averages.subtraction) * 100, 100)}%` }}
//                                     ></div>
//                             </div>
//                         </div>
//                     )}
//                     {improvement.multiplication && (
//                         <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
//                             <h3 className="text-xl font-bold text-green-600">Multiplication</h3>
//                             <p className="text-lg mt-2 text-gray-700">+{improvement.multiplication.toFixed(2)} Improvement</p>
//                             <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
//                                 <div
//                                     className="h-full bg-green-500 rounded"
//                                     style={{ width: `${Math.min((improvement.multiplication / averages.multiplication) * 100, 100)}%` }}
//                                     ></div>
//                             </div>
//                         </div>
//                     )}
//                     {improvement.division && (
//                         <div className="progress-card bg-green-100 rounded-lg p-6 shadow hover:shadow-lg transition duration-200">
//                             <h3 className="text-xl font-bold text-green-600">Division</h3>
//                             <p className="text-lg mt-2 text-gray-700">+{improvement.division.toFixed(2)} Improvement</p>
//                             <div className="progress-bar w-full bg-green-300 h-2 rounded mt-4">
//                                 <div
//                                     className="h-full bg-green-500 rounded"
//                                     style={{ width: `${Math.min((improvement.division / averages.division) * 100, 100)}%` }}
//                                     ></div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </section>
    
//             {/* Levels Section */}
//             <section className="levels mb-8 w-full max-w-4xl text-center">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Your Level</h2>
//                 <div className="level-buttons flex flex-wrap justify-center gap-4">
//                     <button onClick={() => navigate('/math/addition')} className="level bg-blue-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-blue-600 transition duration-200">
//                         Addition
//                     </button>
//                     <button onClick={() => navigate('/math/subtraction')} className="level bg-red-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-red-600 transition duration-200">
//                         Subtraction
//                     </button>
//                     <button onClick={() => navigate('/math/multiplication')} className="level bg-yellow-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-yellow-600 transition duration-200">
//                         Multiplication
//                     </button>
//                     <button onClick={() => navigate('/math/division')} className="level bg-green-500 text-white py-2 px-6 rounded-full font-semibold hover:bg-green-600 transition duration-200">
//                         Division
//                     </button>
//                 </div>
//             </section>
    
//             {/* Main Action Button (Start Playing) */}
//             <button onClick={() => navigate('/math/all')} className="play-button bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-full font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-200 mb-8 animate-pulse">
//                 Start Playing!
//             </button>
    
//             {/* Features Section */}
//             <section className="features mb-8 w-full max-w-4xl text-center">
//                 <h2 className="text-2xl font-semibold text-gray-800 mb-6">Features</h2>
//                 <div className="feature-card grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                     <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
//                         <h3 className="text-xl font-bold text-blue-600">Learn Math While Playing</h3>
//                         <p className="mt-2 text-gray-600">Interactive games make learning addition, subtraction, and more enjoyable.</p>
//                     </div>
//                     <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
//                         <h3 className="text-xl font-bold text-blue-600">Compete with Friends</h3>
//                         <p className="mt-2 text-gray-600">Challenge friends and climb the leaderboard!</p>
//                     </div>
//                     <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition duration-200">
//                         <h3 className="text-xl font-bold text-blue-600">Earn Rewards</h3>
//                         <p className="mt-2 text-gray-600">Collect stars and badges as you progress.</p>
//                     </div>
//                 </div>
//             </section>
    
//             {/* Logout Button */}
//             <button onClick={handleLogout} className="play-button bg-red-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 transition duration-200 mb-8">
//                 Logout
//             </button>
    
//             {/* Footer Section */}
//             <footer className="footer text-gray-600 text-center mt-auto py-4 w-full max-w-4xl border-t border-gray-200">
//                 <p className="text-sm">Contact Support | Privacy Policy | Terms of Service</p>
//             </footer>
//         </div>
//     );
    
// }
    }
export default Homepage;
