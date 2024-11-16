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
                navigate('/marketplace'); 
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
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLoginSubmit}>
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
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
            <p>Forgot Passowrd? <Link to="/forgotpass">Click here</Link></p>
        </div>
    );

}

export default Login;