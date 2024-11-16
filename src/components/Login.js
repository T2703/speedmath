import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { db } from '../backend/firebaseConfig.js'

/**
 * The login where the user can login.
 * @returns the login page.
 */
const Login = () => {
    // User information for logging in.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // The login functionality.
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
    
        const auth = getAuth();
        try {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User logged in successfully');
          alert('Login successful!');
    
          // Check the accountSetup status
          const user = auth.currentUser;
          
          // Check if user is not null before accessing its properties (I think TypeScript gets mad at me if I don't)
          if (user) {
            const userDocRef = doc(db, `Users/${user.uid}`);
            const userDoc = await getDoc(userDocRef);
        
            if (userDoc.exists()) {
                navigate('/user'); 
            } else {
              console.log('No user document found');
              alert('User data not found.');
            }
          } else {
            console.log('User is not logged in');
            alert('Error logging in. Please try again.');
          }
        } catch (error) {
          console.error('Error logging in:', error);
          alert('Error logging in. Please check your email and password.');
        }
    };

    return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <form onSubmit={handleLoginSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    Login
                </button>
            </form>
            <p className="mt-4">
                Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
            </p>
            <p>
                Forgot Password? <Link to="/forgotpass" className="text-blue-500 hover:underline">Click here</Link>
            </p>
        </div>
    );

}

export default Login;