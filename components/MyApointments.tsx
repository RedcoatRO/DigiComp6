import React from 'react';
import { CalendarOff, Info, Trash2 } from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useNotifications } from '../hooks/useNotifications';

const MyApointments: React.FC = () => {
    const { appointments, cancelAppointment } = useAppointments();
    const { addNotification } = useNotifications();

    const handleCancel = (id: string, name: string) => {
        if (window.confirm(`Sunteți sigur că doriți să anulați programarea pentru ${name}?`)) {
            cancelAppointment(id);
            addNotification({ message: 'Programarea a fost anulată.', type: 'info' });
        }
    };

    return (
        <div className="p-6 h-full text-gray-900 dark:text-gray-100">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Programările Mele</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vizualizați sau anulați programările viitoare.</p>
            </div>
            {appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-80 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <CalendarOff size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Nicio programare activă</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Puteți face o programare nouă din tab-ul "Programare Nouă".</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments
                        .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
                        .map(app => (
                        <div key={app.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                           <div className="flex-grow">
                               <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{app.doctor}</p>
                               <p className="text-sm text-gray-600 dark:text-gray-300">{app.specialization}</p>
                               <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                   <span className="font-semibold">Data:</span> {new Date(app.appointmentDate).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                               </div>
                               <div className="text-sm text-gray-800 dark:text-gray-200">
                                   <span className="font-semibold">Ora:</span> {app.appointmentTime}
                               </div>
                           </div>
                           <button onClick={() => handleCancel(app.id, app.fullName)} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 rounded-md transition-colors">
                               <Trash2 size={16} />
                               <span>Anulează</span>
                           </button>
                        </div>
                    ))}
                     <div className="flex items-center gap-2 p-3 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300" role="alert">
                         <Info size={20} />
                         <span className="font-medium">Info:</span> Programările sunt salvate local, în browserul dumneavoastră.
                     </div>
                </div>
            )}
        </div>
    );
};

export default MyApointments;
