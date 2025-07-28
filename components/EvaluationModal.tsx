import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { EvaluationResult } from '../types';

interface EvaluationModalProps {
  result: EvaluationResult;
  onClose: () => void;
}

const ScoreCircle: React.FC<{ score: number; maxScore: number }> = ({ score, maxScore }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = score / maxScore;
    const strokeDashoffset = circumference * (1 - progress);

    let colorClass = 'text-green-500';
    if (progress < 0.5) colorClass = 'text-red-500';
    else if (progress < 0.8) colorClass = 'text-yellow-500';

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 140 140">
                <circle
                    className="text-gray-200 dark:text-gray-600"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="70"
                    cy="70"
                />
                <motion.circle
                    className={colorClass}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="70"
                    cy="70"
                    transform="rotate(-90 70 70)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Scor Final</span>
                <span className={`text-4xl font-bold ${colorClass.replace('text-', 'dark:text-')}`}>{score}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ {maxScore}</span>
            </div>
        </div>
    );
};

const EvaluationModal: React.FC<EvaluationModalProps> = ({ result, onClose }) => {
  return (
    // Click on the backdrop will close the modal
    <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] pointer-events-auto"
    >
      <motion.div
        // Stop propagation to prevent closing when clicking on the modal content
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-slate-100 dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col items-center p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rezultatul Evaluării</h2>
        
        <ScoreCircle score={result.score} maxScore={result.maxScore} />

        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md">{result.feedback}</p>

        <div className="w-full max-h-48 overflow-y-auto my-6 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-left space-y-2">
            {result.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-3">
                    {detail.type === 'correct' ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                        <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${detail.type === 'correct' ? 'text-gray-700 dark:text-gray-200' : 'text-red-800 dark:text-red-400'}`}>
                        <span className="font-bold">[{detail.type === 'correct' ? 'CORECT' : 'INCORECT'}]</span> {detail.text}
                    </span>
                </div>
            ))}
            {result.details.length === 0 && <p className="text-center text-gray-500">Nicio acțiune relevantă de afișat.</p>}
        </div>
        {/* The restart button has been completely removed as requested. */}
      </motion.div>
    </div>
  );
};

export default EvaluationModal;