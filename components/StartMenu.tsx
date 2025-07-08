import React from 'react';
import { motion } from 'framer-motion';
import { BriefcaseMedical, Settings, Power } from 'lucide-react';

interface StartMenuProps {
    onOpenAppointment: () => void;
}

const StartMenu = React.forwardRef<HTMLDivElement, StartMenuProps>(({ onOpenAppointment }, ref) => {
  const MenuItem: React.FC<{icon: React.ElementType, label: string, onClick: () => void}> = ({ icon: Icon, label, onClick }) => (
      <button onClick={onClick} className="w-full flex items-center space-x-4 p-3 rounded-md text-left text-gray-800 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/20 transition-colors">
          <Icon className="h-6 w-6 text-blue-600" />
          <span className="font-medium">{label}</span>
      </button>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full max-w-lg bg-slate-200/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-2xl p-4 border border-white/20 dark:border-white/10 z-40"
    >
      <div className="w-full bg-white/50 dark:bg-black/20 rounded-md p-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-2">Aplicații Ancorate</h2>
        <div className="grid grid-cols-2 gap-4">
           <MenuItem icon={BriefcaseMedical} label="Programare Medicală" onClick={onOpenAppointment} />
           <MenuItem icon={Settings} label="Setări" onClick={() => alert('Funcționalitate neimplementată.')} />
           <MenuItem icon={Power} label="Alimentare" onClick={() => alert('Funcționalitate neimplementată.')} />
        </div>
      </div>
    </motion.div>
  );
});

StartMenu.displayName = "StartMenu";

export default StartMenu;
