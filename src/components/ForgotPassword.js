import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

/**
 * This is where users can reset their password. If they forgor.
 * @returns the forgot password page.
 */
const ForgotPassword = () => {
    // User information really we only need the email. 
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // This sends in the email so the user can reset the password.
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
    
        const auth = getAuth();
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Recovery email sent!. Check your inbox");
          navigate('/login');

        } catch (error) {
          console.error('Error logging in:', error);
          alert('Error logging in. Please check your email and password.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
            <form onSubmit={handleForgotSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
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
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    Send Reset Email
                </button>
            </form>
            <p className="mt-4">
                Remember your password? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
            </p>
        </div>
    );

}

export default ForgotPassword;