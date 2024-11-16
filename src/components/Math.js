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
    const [celebrate, setCelebrate] = useState(false); 
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
          <h1 className="text-3xl font-bold text-blue-500 mb-4">Math Problems</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Score: <span className="text-green-600">{score}</span></h2>
          <h2 className="text-lg text-red-500 mb-6">Time Left: {timeLeft} seconds</h2>

          <div className="bg-white p-6 rounded shadow-md mb-4 w-full max-w-md">
              <p className="text-2xl font-bold mb-4">
                  {num1} {operator} {num2} = ?
              </p>
              <input 
                  type="number" 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 mb-4"
              />
              <button
                  onClick={() => { checkAnswer(); generateProblems(); }}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
              >
                  Submit
              </button>
              {isCorrect !== null && (
                  <p className={`mt-4 text-lg font-semibold ${isCorrect ? 'text-green-500 animate-pulse' : 'text-red-500 animate-shake'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
              )}
          </div>

          {celebrate && (
              <div className="text-6xl text-green-500 animate-bounce font-extrabold mb-4">
                  🎉 Great Job! 🎉
              </div>
          )}
      </div>
  );
}

export default Math;