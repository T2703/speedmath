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
        <div>
          <h1>Leaderboard</h1>
        </div>
      );

}

export default Leaderboard;