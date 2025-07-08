import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, CheckCircle2, FolderUp, ShieldCheck } from 'lucide-react';
import { FormData, FormErrors, FictionalFile } from '../types';
import { INITIAL_FORM_DATA, FORM_STORAGE_KEY, SPECIALIZATIONS, DOCTORS, TIME_SLOTS } from '../constants';
import { isValidCNP } from '../utils/validation';
import { useAppointments } from '../hooks/useAppointments';
import { useNotifications } from '../hooks/useNotifications';
import CalendarInput from './CalendarInput';
import TimeSlotPicker from './TimeSlotPicker';
import ConfirmationModal from './ConfirmationModal';
import FileExplorer from './FileExplorer';

const AppointmentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(() => {
    try {
        const savedData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.appointmentDate) parsed.appointmentDate = new Date(parsed.appointmentDate);
            parsed.identityDocument = null; // Don't restore the file object
            return { ...INITIAL_FORM_DATA, ...parsed };
        }
    } catch(e) { console.error("Failed to parse form data from local storage", e); }
    return INITIAL_FORM_DATA;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
  const [isFileExplorerOpen, setFileExplorerOpen] = useState(false);
  const { addAppointment } = useAppointments();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Save form data to local storage, but without the file object
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ ...formData, identityDocument: null }));
  }, [formData]);

  const availableDoctors = useMemo(() => {
    return formData.specialization ? DOCTORS.filter(d => d.specialization === formData.specialization) : [];
  }, [formData.specialization]);
  
  const validateField = useCallback((name: keyof FormData, value: any): string | undefined => {
    switch (name) {
      case 'fullName': return value.trim().split(' ').length < 2 ? 'Numele complet trebuie să conțină cel puțin două cuvinte.' : undefined;
      case 'cnp': if (!/^\d{13}$/.test(value)) return 'CNP-ul trebuie să conțină exact 13 cifre.'; if (!isValidCNP(value)) return 'CNP-ul introdus nu este valid.'; return undefined;
      case 'specialization': return !value ? 'Vă rugăm selectați o specializare.' : undefined;
      case 'doctor': return !value ? 'Vă rugăm selectați un medic.' : undefined;
      case 'appointmentDate': if (!value) return 'Vă rugăm selectați o dată.'; const today = new Date(); today.setHours(0, 0, 0, 0); return value < today ? 'Data nu poate fi în trecut.' : undefined;
      case 'appointmentTime': return !value ? 'Vă rugăm selectați o oră.' : undefined;
      case 'symptoms': return value.trim().length < 10 ? 'Vă rugăm descrieți simptomele (minim 10 caractere).' : undefined;
      case 'identityDocument': {
        if (!value) return 'Actul de identitate este obligatoriu.';
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(value.type)) return 'Format fișier invalid. Acceptat: PDF, JPG, PNG.';
        if (value.size > 5 * 1024 * 1024) return 'Fișierul depășește limita de 5MB.';
        
        // Specific validation for allowed file names
        const validNames = ["trimitere medicala", "istoric medical", "act de identitate"];
        const baseName = value.name.substring(0, value.name.lastIndexOf('.'));
        if (!validNames.includes(baseName)) {
            return `Nume fișier invalid. Sunt permise doar: ${validNames.join(', ')}.`;
        }
        return undefined;
      }
      case 'termsAccepted': return !value ? 'Trebuie să fiți de acord cu prelucrarea datelor.' : undefined;
      default: return undefined;
    }
  }, []);
  
  useEffect(() => {
    const newErrors: FormErrors = {};
    let isAllValid = true;
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
        const error = validateField(key, formData[key]);
        if (error) {
            newErrors[key] = error;
            isAllValid = false;
        }
    });
    setErrors(newErrors);
    setIsFormValid(isAllValid);
  }, [formData, validateField]);

  useEffect(() => {
    if (formData.doctor && formData.appointmentDate) {
      const seed = formData.doctor.length + formData.appointmentDate.getDate();
      const unavailable = TIME_SLOTS.filter((_, index) => (seed * (index + 1)) % 4 === 0);
      setUnavailableSlots(unavailable);
      if (unavailable.includes(formData.appointmentTime)) {
          setFormData(prev => ({...prev, appointmentTime: ''}));
      }
    } else {
      setUnavailableSlots([]);
    }
  }, [formData.doctor, formData.appointmentDate, formData.appointmentTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'specialization') {
        setFormData(prev => ({ ...prev, specialization: value, doctor: '', appointmentTime: '' }));
    } else if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleValueChange = (name: keyof FormData, value: any) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileSelect = (file: FictionalFile | null) => {
    setFileExplorerOpen(false);
    if (!file) return;

    // --- Start of Validation Logic ---
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.type)) {
      addNotification({ message: 'Format fișier invalid. Acceptat: PDF, JPG, PNG.', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification({ message: 'Fișierul depășește limita de 5MB.', type: 'error' });
      return;
    }
    
    const validNames = ["trimitere medicala", "istoric medical", "act de identitate"];
    if (!validNames.includes(file.name)) {
        addNotification({ message: `Nume fișier invalid. Sunt permise doar fișierele: ${validNames.join(', ')}.`, type: 'error' });
        return;
    }
    // --- End of Validation Logic ---

    // Create a mock File object to be compatible with the existing infrastructure
    const mockFile = new File(['mock content'], `${file.name}.${file.extension}`, { type: file.type });
    // Hack to set the size property on the mock File object
    Object.defineProperty(mockFile, 'size', {
        value: file.size,
        writable: false,
    });
    
    handleValueChange('identityDocument', mockFile);
    addNotification({ message: 'Fișier selectat cu succes!', type: 'success' });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      addAppointment(formData);
      setSubmittedData(formData);
      setShowConfirmation(true);
      addNotification({ message: 'Programare trimisă cu succes!', type: 'success' });
      setFormData(INITIAL_FORM_DATA);
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
  };

  const getBorderClass = (field: keyof FormData) => {
      if (!formData[field] && !['termsAccepted'].includes(field)) {
          return 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500';
      }
      return errors[field] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-green-500 dark:border-green-600 focus:border-green-500 focus:ring-green-500';
  }

  return (
    <>
      <div className="p-6 h-full text-gray-900 dark:text-gray-100">
        <div className="text-center mb-6"><h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Formular de Programare Online</h1><p className="text-sm text-gray-500 dark:text-gray-400">Completați toți pașii pentru a finaliza programarea.</p></div>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">Date Personale</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nume și Prenume</label><input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="ex: Popescu Ion" className={`w-full p-2.5 border rounded-md shadow-sm transition-all bg-white dark:bg-gray-700 ${getBorderClass('fullName')}`} />{errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}</div>
                <div><label htmlFor="cnp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cod Numeric Personal (CNP)</label><input type="text" id="cnp" name="cnp" value={formData.cnp} onChange={handleChange} placeholder="Introduceți 13 cifre" className={`w-full p-2.5 border rounded-md shadow-sm transition-all bg-white dark:bg-gray-700 ${getBorderClass('cnp')}`} />{errors.cnp && <p className="mt-1 text-xs text-red-600">{errors.cnp}</p>}</div>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 my-4">Detalii Programare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specializare</label><select id="specialization" name="specialization" value={formData.specialization} onChange={handleChange} className={`w-full p-2.5 border rounded-md shadow-sm transition-all bg-white dark:bg-gray-700 ${getBorderClass('specialization')}`}><option value="">Selectați specializarea</option>{SPECIALIZATIONS.map(spec => <option key={spec} value={spec}>{spec}</option>)}</select>{errors.specialization && <p className="mt-1 text-xs text-red-600">{errors.specialization}</p>}</div>
                <div><label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Medic</label><select id="doctor" name="doctor" value={formData.doctor} onChange={handleChange} disabled={!formData.specialization} className={`w-full p-2.5 border rounded-md shadow-sm transition-all bg-white dark:bg-gray-700 disabled:bg-gray-200 dark:disabled:bg-gray-600 ${getBorderClass('doctor')}`}><option value="">Selectați medicul</option>{availableDoctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}</select>{errors.doctor && <p className="mt-1 text-xs text-red-600">{errors.doctor}</p>}</div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"><CalendarInput label="Data Programării" value={formData.appointmentDate} onChange={(date) => handleValueChange('appointmentDate', date)} error={errors.appointmentDate} /><TimeSlotPicker label="Ora Programării" value={formData.appointmentTime} onChange={(time) => handleValueChange('appointmentTime', time)} unavailableSlots={unavailableSlots} error={errors.appointmentTime} /></div>
                <div className="md:col-span-2"><label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Simptome / Motivul vizitei</label><textarea id="symptoms" name="symptoms" value={formData.symptoms} onChange={handleChange} rows={3} placeholder="Descrieți pe scurt motivul programării..." className={`w-full p-2.5 border rounded-md shadow-sm transition-all bg-white dark:bg-gray-700 ${getBorderClass('symptoms')}`}></textarea>{errors.symptoms && <p className="mt-1 text-xs text-red-600">{errors.symptoms}</p>}</div>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 my-4">Documente și Confirmare</h2>
            {/* This is the new File Explorer trigger */}
            <button type="button" onClick={() => setFileExplorerOpen(true)} className={`relative flex flex-col items-center justify-center w-full h-32 border-2 ${errors.identityDocument && !formData.identityDocument ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FolderUp className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click pentru a deschide File Explorer</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Selectați un document fictiv</p>
                </div>
            </button>
             {formData.identityDocument && (<div className={`mt-2 p-2 rounded-md flex items-center justify-between text-sm ${errors.identityDocument ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}><span>{formData.identityDocument.name} ({(formData.identityDocument.size / 1024 / 1024).toFixed(2)} MB)</span>{errors.identityDocument ? <AlertCircle size={18} /> : <CheckCircle2 size={18}/>}</div>)}
            {errors.identityDocument && !formData.identityDocument && <p className="mt-1 text-xs text-red-600">{errors.identityDocument}</p>}
            <div className="flex items-start mt-6"><input id="termsAccepted" name="termsAccepted" type="checkbox" checked={formData.termsAccepted} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" /><div className="ml-3 text-sm"><label htmlFor="termsAccepted" className="font-medium text-gray-700 dark:text-gray-300">Sunt de acord cu <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">prelucrarea datelor cu caracter personal</a>.</label>{errors.termsAccepted && <p className="text-xs text-red-600">{errors.termsAccepted}</p>}</div></div>
            <div className="flex items-center justify-between pt-4"><div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-400"><ShieldCheck size={18} /><span>Conexiune securizată</span></div><button type="submit" disabled={!isFormValid} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">Trimite Cererea</button></div>
        </form>
      </div>
      {showConfirmation && submittedData && (<ConfirmationModal formData={submittedData} onClose={() => setShowConfirmation(false)} />)}
      <FileExplorer isOpen={isFileExplorerOpen} onClose={() => setFileExplorerOpen(false)} onFileSelect={handleFileSelect} />
    </>
  );
};

export default AppointmentForm;