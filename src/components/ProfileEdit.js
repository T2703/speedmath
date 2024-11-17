import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth,db } from '../backend/firebaseConfig.js'

/**
 * ProfileEdit component for updating/editing user profile information.
 * @returns the profile edit page
 */
const ProfileEdit = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Fetch user data from the database
    const fetchUserData = async () => {
        if (!auth.currentUser) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const docRef = doc(db, "Users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUsername(data.username || "");
                setEmail(data.email || "");
            } else {
                console.error("User not found");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Fetch user data when the component is mounted
    useEffect(() => {
        fetchUserData();
    }, []);

    // Handle form submission to update user data
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const updatedData = {
                username,
                email,
            };

            if (auth.currentUser.uid) {
                // Update user data in Firestore
                await updateDoc(doc(db, "Users", auth.currentUser.uid), updatedData);
                alert("User updated successfully!");
                navigate("/profile");
            } else {
                alert("User ID is missing.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user. Please try again.");
        }
    };

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfileEdit;
