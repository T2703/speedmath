import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, limit, orderBy, setDoc, query, getDoc, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../backend/firebaseConfig.js'

/**
 * Leaderboards for showing the score against other competitors
 * @returns The leaderboards for the math. 
 */
const Leaderboard = () => {
    const { operatorType } = useParams();
    const [leaderboard, setLeaderBoard] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [currentUserScore, setCurrentUserScore] = useState(null);
    const [loading, setLoading] = useState(true);

    // For navigating around the pages
    const navigate = useNavigate();

    // This fetches the data of scores for each leaderboard.
    const fetchLeaderboard = async (operator) => {
        const userRef = collection(db, "Users");
        const leaderboardQuery = query(userRef, orderBy(`${operator}Score`, "desc"), limit(10));

        try {
            const querySnapshot = await getDocs(leaderboardQuery);
            const leaderboard = [];
            querySnapshot.forEach((doc) => {
                leaderboard.push({ id: doc.id, ...doc.data() });
            });
            return leaderboard;
        } catch (error) {
            console.error("Error fetching leaderboard: ", error);
            return [];
        }
    }

    // Fetch current score of the logged in user.
    const fetchCurrentUserScore = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.error('No user logged in');
            return;
        }

        const userDocRef = doc(db, "Users", currentUser.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData[`${operatorType}Score`] || 0;
            }
        } catch (error) {
            console.error('Error fetching current user data:', error);
        }
    };

    // Determine user's rank
    const getUserRank = (leaderboard, score) => {
        if (score == null) return null;
        const rank = leaderboard.findIndex((user) => user[`${operatorType}Score`] === score);
        return rank !== -1 ? rank + 1 : null;
    };

    // Leaderboard loading.
    const loadLeaderboard = async () => {
        try {
            const [leaderboardData, userScore] = await Promise.all([
                fetchLeaderboard(operatorType),
                fetchCurrentUserScore(),
            ]);
            setLeaderBoard(leaderboardData);
            setCurrentUserScore(userScore);

            // Calculate rank after fetching leaderboard and score
            const rank = getUserRank(leaderboardData, userScore);
            setUserRank(rank);
        } catch (error) {
            console.error("Error loading leaderboard:", error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in, load leaderboard
                loadLeaderboard().then(() => setLoading(false));
            } else {
                // User is not logged in, redirect to login
                navigate('/');
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [operatorType, navigate]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center mb-4">
            {userRank !== null && currentUserScore !== null ? (
                <p className="text-lg font-semibold">Your Rank: {userRank} with {currentUserScore} points</p>
            ) : (
                <p className="text-lg font-semibold">Loading your rank...</p>
            )}
        </div>
        <h1 className="text-3xl font-bold text-blue-500 mb-6">
            {operatorType.charAt(0).toUpperCase() + operatorType.slice(1)} Leaderboard
        </h1>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr>
                        <th className="border-b-2 p-3 text-gray-700 font-semibold">Rank</th>
                        <th className="border-b-2 p-3 text-gray-700 font-semibold">User</th>
                        <th className="border-b-2 p-3 text-gray-700 font-semibold">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.length > 0 ? (
                        leaderboard.map((entry, index) => (
                            <tr key={entry.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="p-3 text-gray-800">{index + 1}</td>
                                <td className="p-3 text-gray-800">{entry.username || "Anonymous"}</td>
                                <td className="p-3 text-gray-800">{entry[`${operatorType}Score`] || 0}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="p-3 text-center text-gray-500">No scores yet!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);
}

// <<<<<<< HEAD
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//             <h1 className="text-3xl font-bold text-blue-500 mb-6">Leaderboard - {operatorType}</h1>
// =======
//         <div>
//             <div>
//                 {userRank !== null && currentUserScore !== null ? (
//                     <p>Your Rank: {userRank} with {currentUserScore} points</p>
//                 ) : (
//                     <p>Loading your rank...</p>
//                 )}
//             </div>
//             <h1>{operatorType.charAt(0).toUpperCase() + operatorType.slice(1)} Leaderboard</h1>
//             <ul>
//                 {leaderboard.map((user, index) => (
//                     <li key={user.id}>
//                         {index + 1}. {user.username} - {user[`${operatorType}Score`]} points
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// >>>>>>> 67299534b5cc96391c6fc0f0d76c15491a43d311

//             <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr>
//                             <th className="border-b-2 p-3 text-gray-700 font-semibold">Rank</th>
//                             <th className="border-b-2 p-3 text-gray-700 font-semibold">User</th>
//                             <th className="border-b-2 p-3 text-gray-700 font-semibold">Score</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {leaderboard.length > 0 ? (
//                             leaderboard.map((entry, index) => (
//                                 <tr key={entry.id} className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                                     <td className="p-3 text-gray-800">{index + 1}</td>
//                                     <td className="p-3 text-gray-800">{entry.username || "Anonymous"}</td>
//                                     <td className="p-3 text-gray-800">{entry[`${operatorType}Score`] || 0}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="3" className="p-3 text-center text-gray-500">No scores yet!</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
        
//     );
// }

export default Leaderboard;

