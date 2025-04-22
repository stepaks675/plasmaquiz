'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { checkAnswers } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

const quizQuestions = [
  {
    id: 1,
    fact: "Plasma employs the traditional Proof of Work consensus mechanism, similar to Bitcoin.",
  },
  {
    id: 2,
    fact: "Plasma is fully compatible with the Ethereum Virtual Machine.",
  },
  {
    id: 3,
    fact: "Plasma operates independently and does not interact with the Bitcoin network.",
  },
  {
    id: 4,
    fact: "Plasma allows transaction fees to be paid in popular assets like USDT or BTC through an automated swap mechanism.",
  },
    {
      id: 5,
      fact: "Plasma offers zero-fee USDT transfers.",
    },
    {
      id: 6,
      fact: "Plasma is a general-purpose blockchain.",
    },
    {
      id: 7,
      fact: "Plasma is a Layer 2 scaling solution for Ethereum.",
    },
    {
      id: 8,
      fact: "Plasma's execution layer is built on Reth.",
    },
    {
      id: 9,
      fact: "Plasma does not support any form of transaction confidentiality, exposing all transaction details publicly.​",
    },
    {
      id: 10,
      fact: "Plasma has no any investment in the project.",
    },
    {
      id: 11,
      fact: "Plasma's development roadmap does not prioritize collaborations with external financial entities.",
    },
    {
      id: 12,
      fact: "Plasma focuses primarily on NFT trading.",
    },
    {
      id: 13,
      fact: "Plasma lacks a consensus protocol and relies entirely on external networks for transaction validation.",
    },
    {
      id: 14,
      fact: "SC contributor is a role for 50 lvl on Discord Server.",
    },
    {
      id: 15,
      fact: "scene has pre-trillions diagnosis.​",
    },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(7);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [direction, setDirection] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (isQuizFinished || loading) return;
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      } else {
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion, isQuizFinished, loading]);


  useEffect(() => {
    if (results && getPercentage(results) >= 60) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [results]);

  const handleAnswer = (answer) => {
    if (buttonDisabled) return;
    
    setButtonDisabled(true);
    const isLastQuestion = currentQuestion === quizQuestions.length - 1;
    const updatedAnswers = {
      ...answers,
      [quizQuestions[currentQuestion].id]: answer
    };
    
    setAnswers(updatedAnswers);
    setDirection(answer ? 'right' : 'left');
    
    if (isLastQuestion) {
      setTimeout(() => {
        setIsQuizFinished(true);
        submitAnswersWithFinalAnswer(updatedAnswers);
        setButtonDisabled(false);
      }, 300);
    } else {
      setTimeout(() => {
        handleNextQuestion();
      }, 300);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(7);
      setDirection(null);
      setButtonDisabled(false);
    } else {
      // This branch should never execute now since we handle the last question in handleAnswer
      setIsQuizFinished(true);
      submitAnswers();
      setButtonDisabled(false);
    }
  };

  const submitAnswersWithFinalAnswer = async (finalAnswers) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Make sure all questions have an answer
      const completeAnswers = { ...finalAnswers };
      quizQuestions.forEach(q => {
        if (completeAnswers[q.id] === undefined) {
          // Default to false if user didn't answer
          completeAnswers[q.id] = false;
        }
      });

      const result = await checkAnswers(completeAnswers);

      setResults(result);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      // Make sure all questions have an answer
      const completeAnswers = { ...answers };
      quizQuestions.forEach(q => {
        if (completeAnswers[q.id] === undefined) {
          // Default to false if user didn't answer
          completeAnswers[q.id] = false;
        }
      });

      const result = await checkAnswers(completeAnswers);

      setResults(result);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting answers:", error);
      setLoading(false);
    }
  };

  const getPercentage = (resultData) => {
    return Math.round((resultData.score / resultData.total) * 100);
  };

  const getMessage = (percentage) => {
    if (percentage >= 80) {
      return "Trillions!";
    } else if (percentage >= 60) {
      return "Good result!";
    } else if (percentage >= 40) {
      return "Not that bad!";
    } else {
      return "bro...";
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) {
      return '#22c55e'; // green-500
    } else if (percentage >= 60) {
      return '#3b82f6'; // blue-500
    } else if (percentage >= 40) {
      return '#f59e0b'; // amber-500
    } else {
      return '#ef4444'; // red-500
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-plasma-dark">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Checking your answers...</h2>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }


  if (results) {
    const percentage = getPercentage(results);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-plasma-dark">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Your Result</h1>
          
          <div className="flex justify-center items-center mb-8">
            <div className="relative w-40 h-40">
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div 
                className="absolute top-0 left-0 w-full h-full rounded-full"
                style={{
                  background: `conic-gradient(${getScoreColor(percentage)} ${percentage}%, transparent ${percentage}%)`,
                  transition: 'all 1s ease-out'
                }}
              ></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white dark:bg-gray-800" style={{ 
                width: '80%', 
                height: '80%', 
                margin: '10%',
                borderRadius: '50%'
              }}></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold">{percentage}%</span>
                <span className="text-sm">{results.score} / {results.total}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl mb-8">{getMessage(percentage)}</p>
          
          <div className="flex justify-center">
            <Link href="/" className="mr-4 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Home
            </Link>
            <button 
              onClick={() => {
                setResults(null);
                setIsQuizFinished(false);
                setCurrentQuestion(0);
                setAnswers({});
                setTimeLeft(7);
                setDirection(null);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        
        {showConfetti && <Confetti />}
      </div>
    );
  }

  const currentQuestionData = quizQuestions[currentQuestion];

  // Animation variants
  const variants = {
    enter: (direction) => ({
      x: direction === 'left' ? 300 : -300,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    exit: (direction) => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    })
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center relative overflow-x-hidden bg-plasma-dark">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex justify-between items-center text-white">
          <span className="text-lg font-medium">Question<span className="text-plasma"> {currentQuestion + 1}</span> of <span className="text-plasma">{quizQuestions.length}</span></span>
          <span className="text-lg font-medium px-4 py-2 text-plasma rounded-lg">
            {timeLeft} sec
          </span>
        </div>
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="animate"
            exit="exit"
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3 
            }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-8 border-2 border-plasma-light"
          >
            <h2 className="text-2xl font-bold mb-6 text-plasma-dark">{currentQuestionData.fact}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleAnswer(true)}
                disabled={buttonDisabled}
                className={`py-4 px-6 bg-green-500 text-white rounded-lg transition-colors text-xl ${buttonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-600'}`}
              >
                True
              </button>
              <button 
                onClick={() => handleAnswer(false)}
                disabled={buttonDisabled}
                className={`py-4 px-6 bg-red-500 text-white rounded-lg transition-colors text-xl ${buttonDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-600'}`}
              >
                False
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-plasma-light h-3 rounded-full transition-all"
            style={{ width: `${((currentQuestion) / (quizQuestions.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Simple confetti component
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {Array.from({ length: 100 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
            animation: `fall ${1 + Math.random() * 4}s linear forwards, sway ${1 + Math.random() * 3}s ease-in-out infinite alternate`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
        @keyframes sway {
          from {
            transform: translateX(-10px);
          }
          to {
            transform: translateX(10px);
          }
        }
      `}</style>
    </div>
  );
} 