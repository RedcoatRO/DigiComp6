import React, { useState, useEffect } from 'react';
import { Grid2x2, MessageSquare, Sun, Moon } from 'lucide-react';
import { Theme } from '../types';

interface TaskbarProps {
    onStartClick: () => void;
    onChatClick: () => void;
    onToggleTheme: () => void;
    currentTheme: Theme;
}

const Taskbar = React.forwardRef<HTMLButtonElement, TaskbarProps>(({ onStartClick, onChatClick, onToggleTheme, currentTheme }, ref) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const currentTime = time.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const currentDate = time.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
      <div className="w-full h-12 bg-slate-200/80 dark:bg-gray-800/80 backdrop-blur-xl flex justify-center items-center shadow-t-2xl border-t border-white/20 dark:border-white/10 relative z-50">
        <div className="flex items-center space-x-2">
          <button ref={ref} onClick={onStartClick} className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/20 transition-colors" aria-label="Meniu Start"><Grid2x2 className="text-blue-600" size={28} /></button>
          <button onClick={onChatClick} className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/20 transition-colors" aria-label="Asistent Virtual"><MessageSquare className="text-purple-600" size={26} /></button>
        </div>
        <div className="absolute right-4 flex items-center space-x-4">
          <button onClick={onToggleTheme} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/20 transition-colors" aria-label="Schimbă tema">{isDark ? <Sun size={18} className="text-gray-200" /> : <Moon size={18} className="text-gray-800" />}</button>
          <div className="text-xs text-gray-800 dark:text-gray-200 text-center">
              <div>{currentTime}</div>
              <div>{currentDate}</div>
          </div>
        </div>
      </div>
    );
});

Taskbar.displayName = "Taskbar";

export default Taskbar;