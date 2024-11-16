import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../backend/firebaseConfig.js'
import Leaderboard from "./Leaderboard.js";

/**
 * The maht and depending on the math give problems based on that.
 * @returns The math page. 
 */
const Math = () => {
    const { operatorType } = useParams();
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
        const maxNumber = 10;

        const number1 = (Math.floor(Math.random() * maxNumber) + 1);
        const number2 = (Math.floor(Math.random() * maxNumber) + 1);
        
        switch (operatorType) {
            case 'addition':
                setNum1(number1);
                setNum2(number2);
                setOperator('+');   
                break;
            case 'subtraction':
                setNum1(number1);
                setNum2(number2);
                setOperator('-');
                break;
            case 'multiplication':
                setNum1(number1);
                setNum2(number2);
                setOperator('*');
                break;
            case 'division':
                setNum2(number2); 
                setNum1(number2 * (Math.floor(Math.random() * maxNumber) + 1));
                setOperator('/');
                break;
            case 'all':
                const operators = ['+', '-', '*', '/'];
                setOperator(operators[Math.floor(Math.random() * operators.length)]);

                if (operator === '/') {
                    setNum2(number2);
                    setNum1(number2 * (Math.floor(Math.random() * maxNumber) + 1));
                } else {
                    setNum1(number1);
                    setNum2(number2);
                }
            default:
                break;
        }
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
        case '/':
            correctAnswer = num1 / num2;
            break;
        default:
            correctAnswer = null;
        }

        if (parseFloat(answer) === correctAnswer) {
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
                    navigate(`/leaderboards/${operatorType}`)
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
          <form
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default form submission behavior
                checkAnswer();
                generateProblems();
            }}
        >
            <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
            />
            <button type="submit">Submit</button>
        </form>
          {isCorrect !== null && (
            <p>{isCorrect ? 'Correct!' : 'Incorrect'}</p>
          )}
        </div>
      );

}

export default Math;