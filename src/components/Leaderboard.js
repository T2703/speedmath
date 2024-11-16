import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, limit, orderBy, setDoc, query, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../backend/firebaseConfig.js'

/**
 * Leaderboards for showing the score against other competitors
 * @returns The leaderboards for the math. 
 */
const Leaderboard = () => {
    const { operatorType } = useParams();
    const [leaderboard, setLeaderBoard] = useState([]);

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


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-blue-500 mb-6">Leaderboard - {operatorType}</h1>

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

export default Leaderboard;

