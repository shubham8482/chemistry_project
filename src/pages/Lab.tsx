import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ChevronLeft, BookOpen, CheckCircle2, XCircle, Zap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Sequence1CosmicZoom } from '../components/LabSequences/Sequence1CosmicZoom';
import { Sequence2NatureOfMetals } from '../components/LabSequences/Sequence2NatureOfMetals';
import { Sequence3GreatDivider } from '../components/LabSequences/Sequence3GreatDivider';
import { Sequence4Matchmaker } from '../components/LabSequences/Sequence4Matchmaker';

type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const quizzes: Record<number, QuizQuestion> = {
  1: {
    question: "What is the smallest unit of matter that retains the properties of an element?",
    options: ["A molecule", "An atom", "A cell", "An electron"],
    correctIndex: 1,
    explanation: "An atom is the smallest unit of matter. Molecules are combinations of atoms, cells are biological, and electrons are subatomic particles.",
  },
  2: {
    question: "Why can metals conduct electricity?",
    options: ["They are very hard", "They have free-flowing electrons", "They reflect light", "They are heavy"],
    correctIndex: 1,
    explanation: "Metals have a 'sea of electrons' — outer electrons are free to move through the lattice, allowing current to flow.",
  },
  3: {
    question: "What happens when Sodium touches water?",
    options: ["Nothing happens", "It dissolves slowly", "It reacts violently", "It turns into gold"],
    correctIndex: 2,
    explanation: "Sodium is a highly reactive alkali metal. It reacts violently with water, producing hydrogen gas and heat — sometimes even catching fire!",
  },
  4: {
    question: "When Sodium gives its electron to Chlorine, what type of bond forms?",
    options: ["Covalent bond", "Metallic bond", "Ionic bond", "No bond"],
    correctIndex: 2,
    explanation: "An ionic bond forms when one atom donates an electron to another. Na becomes Na⁺ and Cl becomes Cl⁻, attracting each other to form NaCl (table salt).",
  },
};

export const Lab = () => {
  const navigate = useNavigate();
  const [currentSequence, setCurrentSequence] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<number>>(new Set());
  const totalSequences = 4;

  const markStepVisited = useGameStore((s: any) => s.markStepVisited);
  const addPoints = useGameStore((s: any) => s.addPoints);

  useEffect(() => {
    markStepVisited(1);
  }, [markStepVisited]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const quiz = quizzes[currentSequence];
    if (index === quiz.correctIndex) {
      setQuizResult('correct');
      addPoints(10);
    } else {
      setQuizResult('wrong');
    }
  };

  const dismissQuiz = () => {
    setCompletedQuizzes(prev => new Set(prev).add(currentSequence));
    setShowQuiz(false);
    setSelectedAnswer(null);
    setQuizResult(null);
  };

  const nextSequence = () => {
    if (currentSequence < totalSequences) {
      if (!completedQuizzes.has(currentSequence)) {
        setShowQuiz(true);
        setSelectedAnswer(null);
        setQuizResult(null);
      } else {
        setCurrentSequence(curr => curr + 1);
      }
    }
  };

  const proceedToNext = () => {
    dismissQuiz();
    setCurrentSequence(curr => curr + 1);
  };

  const prevSequence = () => {
    if (currentSequence > 1) setCurrentSequence(curr => curr - 1);
  };

  const sequenceText = [
    {
      title: "The Cosmic Zoom",
      text: "EVERYTHING IS MADE OF ATOMS.",
      description: "Dive deep into the skin of an everyday apple, past the cells, down into the bustling molecular world where atoms bind together."
    },
    {
      title: "Inside the Shiny Stuff",
      text: "METALS: A SEA OF ELECTRONS IN A STURDY GRID.",
      description: "Fly through a rigid copper lattice. See how a free-flowing sea of electrons allows metals to conduct electricity and bend without breaking."
    },
    {
      title: "The Great Divider",
      text: "PRECIOUS METALS VS ALKALI METALS.",
      description: "Watch how stable gold ignores water, while highly reactive sodium violently explodes upon contact due to its unstable electron configuration."
    },
    {
      title: "The Ultimate Matchmaker",
      text: "BONDING: DANGEROUS ELEMENTS BECOME DELICIOUS SALT.",
      description: "Witness the literal transfer of an electron from Sodium to Chlorine, snapping them together to form a stable crystal lattice of table salt."
    }
  ];

  const currentInfo = sequenceText[currentSequence - 1];
  const currentQuiz = quizzes[currentSequence];

  return (
    <div className="w-full h-screen bg-[#050508] relative overflow-hidden font-sans text-white">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={['#050508']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Suspense fallback={null}>
            {currentSequence === 1 && <Sequence1CosmicZoom />}
            {currentSequence === 2 && <Sequence2NatureOfMetals />}
            {currentSequence === 3 && <Sequence3GreatDivider />}
            {currentSequence === 4 && <Sequence4Matchmaker />}
          </Suspense>

          <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {/* Top Header */}
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto pointer-events-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
          
          {/* Journey Progress */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4].map(s => (
                <div key={s} className={`w-8 h-1 rounded-full transition-all duration-500 ${
                  s <= currentSequence ? 'bg-indigo-500' : 'bg-white/10'
                }`} />
              ))}
            </div>
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Step 1 of 3</span>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="w-full max-w-4xl mx-auto pointer-events-auto mb-8">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              <div className="col-span-2 space-y-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                  {currentInfo.title}
                </h2>
                <h3 className="text-xl font-bold text-indigo-400 tracking-wide">
                  {currentInfo.text}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {currentInfo.description}
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <button 
                  onClick={prevSequence}
                  disabled={currentSequence === 1}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    currentSequence === 1 
                      ? 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>
                {currentSequence === totalSequences ? (
                  <button 
                    onClick={() => navigate('/syllabus')}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all"
                  >
                    <BookOpen size={18} />
                    Continue to Study Material
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={nextSequence}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Quick Check Quiz Overlay */}
      {showQuiz && currentQuiz && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 bg-[#0d0d14] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500" />
            
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Quick Check — +10 XP</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-6 leading-snug">
              {currentQuiz.question}
            </h3>
            
            <div className="space-y-3 mb-6">
              {currentQuiz.options.map((opt, i) => {
                let btnClass = "w-full text-left px-5 py-3.5 rounded-2xl border transition-all text-sm font-medium ";
                if (selectedAnswer === null) {
                  btnClass += "bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.08] hover:border-white/20 cursor-pointer";
                } else if (i === currentQuiz.correctIndex) {
                  btnClass += "bg-emerald-500/10 border-emerald-500/40 text-emerald-300";
                } else if (i === selectedAnswer && i !== currentQuiz.correctIndex) {
                  btnClass += "bg-red-500/10 border-red-500/40 text-red-300";
                } else {
                  btnClass += "bg-white/[0.02] border-white/5 text-zinc-600";
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswer(i)}>
                    <span className="inline-flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {selectedAnswer !== null && i === currentQuiz.correctIndex && <CheckCircle2 size={16} className="text-emerald-400 ml-auto" />}
                      {selectedAnswer !== null && i === selectedAnswer && i !== currentQuiz.correctIndex && <XCircle size={16} className="text-red-400 ml-auto" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {quizResult && (
              <div className={`p-4 rounded-xl mb-4 text-sm leading-relaxed ${
                quizResult === 'correct' 
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
              }`}>
                {quizResult === 'correct' 
                  ? <span className="font-bold">✨ Correct! +10 XP — </span>
                  : <span className="font-bold">Not quite — </span>
                }
                {currentQuiz.explanation}
              </div>
            )}

            {quizResult && (
              <button 
                onClick={proceedToNext}
                className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continue to Next Sequence
                <ChevronRight size={18} />
              </button>
            )}

            {!quizResult && (
              <button 
                onClick={proceedToNext}
                className="w-full py-2.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Skip (No points)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
