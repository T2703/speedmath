import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../backend/firebaseConfig.js'

/**
 * The maht and depending on the math give problems based on that.
 * @returns The math page. 
 */
const Math = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [operator, setOperator] = useState('+');
    const [answer, setAnswer] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const Math = window.Math;

    const [timeLeft, setTimeLeft] = useState(90);

    // For navigating around the pages
    const navigate = useNavigate();

    // This generate problems.
    const generateProblems = () => {
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        const operators = ['+', '-'];
        setOperator(operators[Math.floor(Math.random() * operators.length)]);
        setIsCorrect(null);
        setAnswer('');
    };
    
    // This checks answer. 
    const checkAnswer = () => {
        let correctAnswer;
        switch (operator) {
          case '+':
            correctAnswer = num1 + num2;
            break;
          case '-':
            correctAnswer = num1 - num2;
            break;
          case '*':
            correctAnswer = num1 * num2;
            break;
        }
        setIsCorrect(parseInt(answer) === correctAnswer);

        if (parseInt(answer) === correctAnswer) {
            setScore((prevScore) => prevScore + 1);
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    useEffect(() => {
        generateProblems();

        // Set up the timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsCorrect(false); 
                    generateProblems(); 
                    alert("You suck");
                    //return 60; 
                }
                return prevTime - 1;
            });
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div>
          <h1>Math Problems</h1>
          <h1>Score {score}</h1>
          <h2>Time Left: {timeLeft} seconds</h2>
          <p>
            {num1} {operator} {num2} = ?
          </p>
          <input 
            type="number" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} 
          />
          <button onClick={() => { checkAnswer(); generateProblems(); }}>Submit</button>
          {isCorrect !== null && (
            <p>{isCorrect ? 'Correct!' : 'Incorrect'}</p>
          )}
        </div>
      );

}

export default Math;