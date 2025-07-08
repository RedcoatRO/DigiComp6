import { FormData } from './types';

export const SPECIALIZATIONS = [
  "Medicină de Familie",
  "Cardiologie",
  "Dermatologie",
  "Pediatrie",
];

export const DOCTORS = [
  { id: 1, name: "Dr. Popescu Maria", specialization: "Medicină de Familie" },
  { id: 2, name: "Dr. Ionescu Vasile", specialization: "Medicină de Familie" },
  { id: 3, name: "Dr. Stan Ana", specialization: "Cardiologie" },
  { id: 4, name: "Dr. Georgescu Mihai", specialization: "Cardiologie" },
  { id: 5, name: "Dr. Radu Elena", specialization: "Dermatologie" },
  { id: 6, name: "Dr. Tudor Andrei", specialization: "Pediatrie" },
];

export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"
];

export const INITIAL_FORM_DATA: FormData = {
    fullName: '',
    cnp: '',
    specialization: '',
    doctor: '',
    appointmentDate: null,
    appointmentTime: '',
    symptoms: '',
    identityDocument: null,
    termsAccepted: false,
};

export const FORM_STORAGE_KEY = 'appointment-form-data';
export const APPOINTMENTS_STORAGE_KEY = 'medical-appointments';
