import React, { useState, useEffect, useRef, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Theme } from '../types';
import Desktop from './Desktop';
import Window from './Window';
import StartMenu from './StartMenu';
import Taskbar from './Taskbar';
import NotificationManager from './NotificationManager';
import { EvaluationContext } from '../context/EvaluationContext';
import EvaluationModal from './EvaluationModal';

const App: React.FC = () => {
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme | null) || 'system');
  
  // Utilizează contextul de evaluare
  const evaluation = useContext(EvaluationContext);
  if (!evaluation) throw new Error("EvaluationContext not found");
  const { isEvaluationVisible, evaluationResult, score, maxScore, showEvaluation, requestHint, resetEvaluation } = evaluation;


  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close Start Menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isStartMenuOpen &&
        startMenuRef.current && 
        !startMenuRef.current.contains(event.target as Node) && 
        startButtonRef.current && 
        !startButtonRef.current.contains(event.target as Node)
      ) {
        setStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen]);

  const openAppointmentWindow = () => {
      setWindowOpen(true);
      setStartMenuOpen(false);
  };
  
  const handleToggleTheme = () => {
      if (theme === 'system') {
          const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(systemIsDark ? 'light' : 'dark');
      } else {
          setTheme(theme === 'light' ? 'dark' : 'light');
      }
  };
  
  // Handler for closing the evaluation modal.
  const handleCloseEvaluation = () => {
      resetEvaluation();
  };

  return (
    <div className="h-screen w-screen flex flex-col selection:bg-blue-500/80 selection:text-white">
      <main className="relative flex-grow">
        <Desktop onOpenAppointment={openAppointmentWindow} />
      
        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center p-4 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {isWindowOpen && <Window key="main-window" title="Centru Medical" onClose={() => setWindowOpen(false)} />}
          </AnimatePresence>
        </div>
        
        {/* Evaluation Modal displayed over everything */}
        <AnimatePresence>
          {isEvaluationVisible && evaluationResult && (
             <EvaluationModal 
                result={evaluationResult} 
                onClose={handleCloseEvaluation}
             />
          )}
        </AnimatePresence>
      </main>
      
      <AnimatePresence>
        {isStartMenuOpen && <StartMenu key="start-menu" ref={startMenuRef} onOpenAppointment={openAppointmentWindow} />}
      </AnimatePresence>

      <footer className="w-full flex-shrink-0">
         <Taskbar 
            ref={startButtonRef} 
            onStartClick={() => setStartMenuOpen(p => !p)} 
            onToggleTheme={handleToggleTheme}
            currentTheme={theme}
            score={score}
            maxScore={maxScore}
            onShowEvaluation={showEvaluation}
            onRequestHint={requestHint}
            isEvaluationComplete={isEvaluationVisible}
         />
      </footer>

      <NotificationManager />
    </div>
  );
};

export default App;