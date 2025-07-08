import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import { X, CalendarPlus, List } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import MyApointments from './MyApointments';

interface WindowProps {
    title: string;
    onClose: () => void;
}

type ActiveTab = 'new' | 'view';

const Window: React.FC<WindowProps> = ({ title, onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('new');
  const nodeRef = useRef(null);

  const TabButton: React.FC<{tabId: ActiveTab, icon: React.ReactNode, label: string}> = ({ tabId, icon, label }) => (
      <button onClick={() => setActiveTab(tabId)} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${activeTab === tabId ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-500 dark:text-gray-400 hover:bg-slate-200/60 dark:hover:bg-gray-700/60'}`}>
          {icon}
          <span>{label}</span>
      </button>
  );

  return (
    <Draggable handle=".handle" bounds="parent" nodeRef={nodeRef}>
      <motion.div
        ref={nodeRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full max-w-4xl h-[90vh] max-h-[800px] bg-slate-100 dark:bg-slate-900/95 backdrop-blur-2xl rounded-lg shadow-2xl flex flex-col border border-white/20 dark:border-white/10 overflow-hidden pointer-events-auto"
      >
        <div className="handle flex-shrink-0 h-10 bg-slate-200/50 dark:bg-gray-900/50 flex items-center justify-between px-3 cursor-grab active:cursor-grabbing">
            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{title}</p>
            <button onClick={onClose} className="p-1 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors" aria-label="Close window">
                <X size={18} />
            </button>
        </div>
        <div className="flex-shrink-0 flex items-end border-b border-slate-300 dark:border-gray-700 px-4 pt-2 bg-slate-100 dark:bg-slate-900/95">
            <TabButton tabId='new' icon={<CalendarPlus size={16}/>} label="Programare Nouă" />
            <TabButton tabId='view' icon={<List size={16}/>} label="Programările Mele" />
        </div>
        <div className="flex-grow p-1 overflow-y-auto bg-white dark:bg-gray-800">
            {activeTab === 'new' && <AppointmentForm />}
            {activeTab === 'view' && <MyApointments />}
        </div>
      </motion.div>
    </Draggable>
  );
};

export default Window;