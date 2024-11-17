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
        <div>
            <h1>Profile</h1>
            <h2>{user.username}</h2>
            <h2>{user.email}</h2>
            <button onClick={() => setShowModal(true)}>Delete</button>
            <button onClick={() => setShowUpdateModal(true)}>Edit</button>
            <button onClick={handleLogout}>Logout</button>

            {/* Modal for delete */}
            <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex={-1} role="dialog">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Confirm Deletion</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}>×</button>
                    </div>
        
                    <div className="modal-body">
                    <p>Are you sure you want to delete your account?</p>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {deleteError && <p className="error-text">{deleteError}</p>}
                    </div>
        
                    <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                    </div>
                </div>
                </div>
            </div>

            {/* Modal for update */}
            <div className={`modal ${showUpdateModal ? 'show' : ''}`} style={{ display: showUpdateModal ? 'block' : 'none' }} tabIndex={-1} role="dialog">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Edit Account</h5>
                    <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}>×</button>
                    </div>
        
                    <div className="modal-body">
                    <p>Input your password to update your account.</p>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {editError && <p className="error-text">{editError}</p>}
                    </div>
        
                    <div className="modal-footer">
                    <button type="button" className="btn btn-danger" onClick={handleUpdateProfile}>Yes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>No</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
