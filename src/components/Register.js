import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

        // Get authentication. 
        const auth = getAuth();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store additional user details in Firestore
            await setDoc(doc(db, 'Users', user.uid), {
                username,
                email,
                additionScore,
                subtractionScore,
                multiplicationScore,
                divisionScore,
            });

            console.log('User registered successfully');
            alert('User registered successfully!');
            
            navigate('/'); 
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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegisterSubmit}>
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/">Log in here</Link></p>
        </div>
    );

}

export default Register;