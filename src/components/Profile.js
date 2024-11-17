import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../backend/firebaseConfig.js'

/**
 * The profile page where the user can view their information and listings.
 * @returns the profile page
 */
const Profile = () => {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [editError, setEditError] = useState('');
    
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData();
            } else {
                // User is not logged in, redirect to login
                navigate('/');
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [navigate]);

    const handleDelete = async () => {
        if (!auth.currentUser || !user?.email) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);

            await deleteDoc(doc(db, 'Users', auth.currentUser.uid));
            await deleteUser(auth.currentUser);

            navigate('/');
        } catch (error) {
            setDeleteError("Failed to delete account. Please check your password.");
            console.error("Error deleting account:", error);
        }
    }

    const handleUpdateProfile = async () => {
        if (!auth.currentUser || !user) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            navigate('/editprofile');
        } catch (error) {
            console.error("Error updating profile:", error);
            setEditError("Failed to edit account. Please check your password.");
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/'); 
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Only render user data if it exists
    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{user.username}</h2>
            <p className="text-gray-600 mb-6">{user.email}</p>
            <div className="flex space-x-4">
                <button onClick={() => navigate('/user')} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600">Home</button>

                <button onClick={() => setShowModal(true)} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                    Delete
                </button>
                <button onClick={() => setShowUpdateModal(true)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    Edit
                </button>
                <button onClick={handleLogout} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                    Logout
                </button>


            </div>
        </div>

        {/* Modal for delete */}
        {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h5 className="text-2xl font-bold mb-4">Confirm Deletion</h5>
                    <p className="mb-4">Are you sure you want to delete your account?</p>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {deleteError && <p className="text-red-600 mb-4">{deleteError}</p>}
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                            Yes
                        </button>
                        <button onClick={() => setShowModal(false)} className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">
                            No
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal for update */}
        {showUpdateModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h5 className="text-2xl font-bold mb-4">Edit Account</h5>
                    <p className="mb-4">Input your password to update your account.</p>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {editError && <p className="text-red-600 mb-4">{editError}</p>}
                    <div className="flex justify-end space-x-2">
                        <button onClick={handleUpdateProfile} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                            Yes
                        </button>
                        <button onClick={() => setShowUpdateModal(false)} className="bg-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400">
                            No
                        </button>
            
                    </div>
                </div>
            </div>
        )}
    </div>
);
}


export default Profile;
