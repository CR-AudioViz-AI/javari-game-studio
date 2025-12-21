'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, Clock, Trophy, Brain, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Sample questions
const QUESTIONS = [
  {
    category: 'Science',
    question: 'What planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
  },
  {
    category: 'Geography',
    question: 'What is the capital of Japan?',
    options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
    correct: 2,
  },
  {
    category: 'History',
    question: 'In what year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correct: 2,
  },
  {
    category: 'Science',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
  },
  {
    category: 'Nature',
    question: 'What is the largest mammal in the world?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Hippopotamus'],
    correct: 1,
  },
  {
    category: 'Technology',
    question: 'Who founded Microsoft?',
    options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'],
    correct: 1,
  },
  {
    category: 'Sports',
    question: 'How many players are on a basketball team on the court?',
    options: ['4', '5', '6', '7'],
    correct: 1,
  },
  {
    category: 'Geography',
    question: 'What is the largest country by area?',
    options: ['China', 'USA', 'Canada', 'Russia'],
    correct: 3,
  },
  {
    category: 'Science',
    question: 'What is the hardest natural substance on Earth?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correct: 2,
  },
  {
    category: 'Entertainment',
    question: 'What year was the first iPhone released?',
    options: ['2005', '2006', '2007', '2008'],
    correct: 2,
  },
  {
    category: 'Nature',
    question: 'How many hearts does an octopus have?',
    options: ['1', '2', '3', '4'],
    correct: 2,
  },
  {
    category: 'History',
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    correct: 1,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Science: 'from-blue-500 to-cyan-500',
  Geography: 'from-green-500 to-emerald-500',
  History: 'from-amber-500 to-orange-500',
  Nature: 'from-green-600 to-lime-500',
  Technology: 'from-purple-500 to-violet-500',
  Sports: 'from-red-500 to-pink-500',
  Entertainment: 'from-yellow-500 to-amber-500',
};

const CATEGORY_ICONS: Record<string, string> = {
  Science: '🔬',
  Geography: '🌍',
  History: '📜',
  Nature: '🌿',
  Technology: '💻',
  Sports: '⚽',
  Entertainment: '🎬',
};

export default function QuizTemplate() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState(QUESTIONS);
  const [highScore, setHighScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Shuffle questions
  const shuffleQuestions = useCallback(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuestions(shuffled);
  }, []);

  // Start game
  const startGame = () => {
    shuffleQuestions();
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTotalTime(0);
    setGameState('playing');
  };

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(-1); // Time's up
          return 15;
        }
        return prev - 1;
      });
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, selectedAnswer, currentQuestion]);

  // Handle answer selection
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    const question = shuffledQuestions[currentQuestion];
    const correct = index === question.correct;

    setSelectedAnswer(index);
    setIsCorrect(correct);

    if (correct) {
      const timeBonus = Math.floor(timeLeft * 10);
      const streakBonus = streak * 50;
      const points = 100 + timeBonus + streakBonus;
      setScore(prev => prev + points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    // Next question or end
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setTimeLeft(15);
      } else {
        if (score > highScore) setHighScore(score);
        setGameState('result');
      }
    }, 1500);
  };

  const question = shuffledQuestions[currentQuestion];
  const categoryColor = CATEGORY_COLORS[question?.category] || 'from-gray-500 to-gray-600';
  const categoryIcon = CATEGORY_ICONS[question?.category] || '❓';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/create/template"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <div className="text-sm text-gray-400">Template: Quiz</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {/* Menu */}
          {gameState === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-4xl font-bold mb-4">Brain Blast</h1>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Test your knowledge with 10 random questions. Answer fast for bonus points!
              </p>

              <button
                onClick={startGame}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-xl mx-auto transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-6 h-6" />
                START QUIZ
              </button>

              {highScore > 0 && (
                <p className="mt-6 text-yellow-400">
                  <Trophy className="w-5 h-5 inline mr-2" />
                  High Score: {highScore}
                </p>
              )}

              {/* Categories preview */}
              <div className="mt-12">
                <h3 className="text-sm text-gray-500 mb-4">CATEGORIES</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm"
                    >
                      {icon} {cat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Playing */}
          {gameState === 'playing' && question && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="py-8"
            >
              {/* Progress & Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestion + 1}/{shuffledQuestions.length}
                  </span>
                  {streak > 0 && (
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {streak} streak
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-yellow-400">{score} pts</span>
                </div>
              </div>

              {/* Timer */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{timeLeft}s</span>
                  </div>
                  <span className={`text-sm ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-500'}`}>
                    +{timeLeft * 10} time bonus
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-green-500'}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${(timeLeft / 15) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${categoryColor} rounded-full mb-6`}>
                <span>{categoryIcon}</span>
                <span className="font-medium">{question.category}</span>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

              {/* Options */}
              <div className="grid gap-3">
                {question.options.map((option, index) => {
                  let buttonClass = 'bg-white/10 hover:bg-white/20 border-white/10';
                  
                  if (selectedAnswer !== null) {
                    if (index === question.correct) {
                      buttonClass = 'bg-green-500/30 border-green-500';
                    } else if (index === selectedAnswer && !isCorrect) {
                      buttonClass = 'bg-red-500/30 border-red-500';
                    } else {
                      buttonClass = 'bg-white/5 border-white/5 opacity-50';
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                      whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                      className={`p-4 rounded-xl text-left font-medium border-2 transition-all ${buttonClass}`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 mr-3 text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-xl text-center ${
                      isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <span className="text-2xl">✅</span>
                        <span className="ml-2 font-bold">Correct! +{100 + timeLeft * 10 + (streak - 1) * 50} points</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">❌</span>
                        <span className="ml-2 font-bold">
                          Wrong! The answer was: {question.options[question.correct]}
                        </span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results */}
          {gameState === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
              
              <div className="my-8 p-6 bg-white/5 rounded-2xl">
                <div className="text-5xl font-bold text-yellow-400 mb-2">{score}</div>
                <div className="text-gray-400">points</div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">
                    {shuffledQuestions.filter((_, i) => i < currentQuestion + 1).length}
                  </div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-orange-400">{bestStreak}</div>
                  <div className="text-sm text-gray-400">Best Streak</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">{totalTime}s</div>
                  <div className="text-sm text-gray-400">Total Time</div>
                </div>
              </div>

              {score > highScore && (
                <div className="mb-6 p-4 bg-yellow-500/20 rounded-xl text-yellow-400">
                  <Trophy className="w-6 h-6 inline mr-2" />
                  New High Score!
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-semibold transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>
                <Link
                  href="/create/template"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors"
                >
                  More Games
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customize CTA */}
        {gameState === 'menu' && (
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-white/10">
            <h3 className="text-xl font-semibold mb-2">Create your own quiz!</h3>
            <p className="text-gray-400 mb-4">
              Add custom questions, change categories, or create themed quizzes with Javari AI.
            </p>
            <Link
              href="/create/chat?template=quiz"
              className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold transition-colors"
            >
              Customize with AI
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
