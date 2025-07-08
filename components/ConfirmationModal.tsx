import React from 'react';
import { CheckCircle, Download, X } from 'lucide-react';
import { FormData } from '../types';
import { generateConfirmationPDF } from '../services/pdfService';

interface ConfirmationModalProps {
    formData: FormData;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ formData, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center transform transition-all scale-100">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4"><CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" /></div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Programare înregistrată!</h3>
        <div className="mt-4 text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-md border dark:border-gray-600">
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-800 dark:text-gray-100">Nume:</strong> {formData.fullName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-800 dark:text-gray-100">Specializare:</strong> {formData.specialization}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-800 dark:text-gray-100">Medic:</strong> {formData.doctor}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-800 dark:text-gray-100">Data:</strong> {formData.appointmentDate ? new Date(formData.appointmentDate).toLocaleDateString('ro-RO') : 'N/A'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-800 dark:text-gray-100">Ora:</strong> {formData.appointmentTime}</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto" onClick={() => generateConfirmationPDF(formData)}><Download className="mr-2 -ml-1 h-5 w-5" />Descarcă confirmarea</button>
          <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto" onClick={onClose}><X className="mr-2 -ml-1 h-5 w-5" />Închide</button>
        </div>
      </div>
    </div>
);

export default ConfirmationModal;
