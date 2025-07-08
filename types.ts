export interface FormData {
  fullName: string;
  cnp: string;
  specialization: string;
  doctor: string;
  appointmentDate: Date | null;
  appointmentTime: string;
  symptoms: string;
  identityDocument: File | null;
  termsAccepted: boolean;
}

export type FormErrors = {
  [K in keyof FormData]?: string;
};

// Represents a successfully saved appointment
export interface Appointment extends Omit<FormData, 'identityDocument' | 'termsAccepted' | 'appointmentDate'> {
  id: string; // Unique ID for each appointment
  identityDocumentName: string; // We only store the name, not the file
  appointmentDate: string; // Store date as ISO string in localStorage
}

// Represents a notification object for the toast system
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type Theme = 'light' | 'dark' | 'system';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
}

// Represents a file in the simulated file explorer
export interface FictionalFile {
    name: string; // The base name, e.g., "act de identitate"
    extension: string; // The extension, e.g., "jpg"
    size: number; // in bytes
    type: string; // mime type, e.g., "image/jpeg"
}

// Represents a folder in the simulated file explorer
export interface FictionalFolder {
    name: string;
    files: FictionalFile[];
}