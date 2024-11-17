import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { db } from '../backend/firebaseConfig.js'

/**
 * The page where the user can create and register their account.
 * @returns The register page. 
 */
const Register = () => {
    // User information for the register page.
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [additionScore, setAdditionScore] = useState(0);
    const [subtractionScore, setSubtractionScore] = useState(0);
    const [multiplicationScore, setMultiplicationScore] = useState(0);
    const [divisionScore, setDivisionScore] = useState(0);

    // For checking the confirmation of the password.
    const [confirmPassword, setConfirmPassword] = useState('');

    // For navigating around the pages
    const navigate = useNavigate();

    /**
     * The register function.
     * @param e The element idk
     * @returns if the passwords don't match.
     */
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        else if (password.length < 6) {
            alert("Password length must be at least or greater than 6 characters");
            return;
        }

        // Get authentication. 
        const auth = getAuth();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            localStorage.setItem('username', username);

            // Store additional user details in Firestore
            /*await setDoc(doc(db, 'Users', user.uid), {
                username,
                email,
                additionScore,
                subtractionScore,
                multiplicationScore,
                divisionScore,
            });*/

            await sendEmailVerification(user);
            alert('Verification email has been sent. Please check your inbox.');
            
            navigate('/login'); 
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        } finally {
            // Clearing out senstive data.
            setPassword('');
            setConfirmPassword('');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-6">Register</h1>
            <form onSubmit={handleRegisterSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
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
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    Register
                </button>
            </form>
            <p className="mt-4">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in here</Link>
            </p>
        </div>
    );
}

export default Register;