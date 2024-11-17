import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../backend/firebaseConfig.js'
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
    const [celebrate, setCelebrate] = useState(false); 
    const [motivate,setMotivate]=useState(true);
    const [motivationalQuote, setMotivationalQuote] = useState(''); // New state for the selected quote
    const Math = window.Math;

    const [timeLeft, setTimeLeft] = useState(90);

    // For navigating around the pages
    const navigate = useNavigate();

        // Array of motivational quotes
        const motivationalQuotes = [
          "Don't give up!",
          "Keep going, you’re doing great!",
          "You’ve got this!", 
          "Mistakes are proof that you’re trying.",
          "Practice makes perfect!",
          "Keep pushing, you’ll get there!",
          "Stay positive and try again!",
          "Believe in yourself!",
          "Each mistake is a step closer to success!",
      ];

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
            break;
        case '/':
            correctAnswer = num1 / num2;
            break;
        default:
            correctAnswer = null;
        }

        if (parseFloat(answer) === correctAnswer) {
            setScore((prevScore) => prevScore + 1);
            setIsCorrect(true);
            setCelebrate(true);
            setTimeout(() => setCelebrate(false), 1000); // Stop celebration after 1 second
        } else {
            console.log(parseFloat(answer));
            console.log(correctAnswer);
            setIsCorrect(false);
            setCelebrate(false);
            setMotivate(true);
            setTimeout(() => setMotivate(false), 2000)
            // Select a random motivational quote for incorrect answers
            const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
            setMotivationalQuote(randomQuote); // Update the selected quote
        }
    };

    const updateUserScore = async () => {
        if (!auth.currentUser) {
            console.error('User is not authenticated');
            return;
        }

        try {
            const scoreField = `${operatorType}Score`

            const userRef = doc(db, 'Users', auth.currentUser.uid);
            const userDoc = await getDoc(userRef); 

            if (!userDoc.exists()) {
                console.error('User does not exist!');
                return;
            }    

            const currentScore = userDoc.data()[scoreField] || 0;

            if (score > currentScore) {
                const updatedData = {
                    [scoreField]: score
                };
    
                if (auth.currentUser.uid) {
                    // Update the listing in Firestore
                    await updateDoc(doc(db, 'Users', auth.currentUser.uid), updatedData);
                } else {
                    alert('User ID is missing.');
                }
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
        }
    }

    useEffect(() => {
        generateProblems();

        // Set up the timer
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setIsCorrect(false); 
                    updateUserScore();
                    navigate(`/leaderboards/${operatorType}`)
                }
                return prevTime - 1;
            });
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(timer);
    }, [score]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
            <h1 className="text-3xl font-bold text-blue-500 mb-4">Math Problems</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Score: <span className="text-green-600">{score}</span>
            </h2>
            <h2 className="text-lg text-red-500 mb-6">Time Left: {timeLeft} seconds</h2>

            <div className="bg-white p-6 rounded shadow-md mb-4 w-full max-w-md">
                <p className="text-2xl font-bold mb-4">
                    {num1} {operator} {num2} = ?
                </p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        checkAnswer();
                        generateProblems();
                    }}
                >
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Submit
                    </button>
                </form>
                {isCorrect !== null && (
                    <p className={`mt-4 text-lg font-semibold ${isCorrect ? "text-green-500 animate-pulse" : "text-red-500 animate-shake"}`}>
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </p>
                )}
            </div>
            {motivate && (
                <div className="text-xl text-red-500 font-semibold animate-shake mb-4">
                {motivationalQuote}
            </div>
            )}
            {celebrate && (
                <div className="text-6xl text-green-500 animate-bounce font-extrabold mb-4">
                    🎉 Great Job! 🎉
                </div>
            )}
        </div>
    );
}

export default Math;