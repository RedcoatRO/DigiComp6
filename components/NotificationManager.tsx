import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationManager: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const icons = {
      success: <CheckCircle className="h-6 w-6 text-green-500" />,
      error: <AlertCircle className="h-6 w-6 text-red-500" />,
      info: <Info className="h-6 w-6 text-blue-500" />
  };

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative flex items-start w-full p-4 mb-4 overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700 pointer-events-auto"
          >
            <div className="flex-shrink-0">{icons[notification.type]}</div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button onClick={() => removeNotification(notification.id)} className="inline-flex text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationManager;
