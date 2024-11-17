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
    //const [email, setEmail] = useState("");
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
                //setEmail(data.email || "");
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
                >
                    Update Profile
                </button>
            </form>
        </div>
    </div>
);
};

export default ProfileEdit;
