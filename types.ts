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

// --- Evaluation System Types ---

/**
 * Defines the types of actions a user can perform that are relevant for scoring.
 */
export enum ActionType {
  FORM_FIELD_BLUR = 'FORM_FIELD_BLUR',
  FILE_UPLOAD_VALID = 'FILE_UPLOAD_VALID',
  FILE_UPLOAD_INVALID = 'FILE_UPLOAD_INVALID',
  INVALID_CNP_ATTEMPT = 'INVALID_CNP_ATTEMPT',
  FORM_SUBMIT_ATTEMPT_INVALID = 'FORM_SUBMIT_ATTEMPT_INVALID',
  FORM_SUBMIT_SUCCESS = 'FORM_SUBMIT_SUCCESS',
  HINT_REQUEST = 'HINT_REQUEST',
}

/**
 * Represents a single logged action by the user.
 */
export interface ActionLogEntry {
  type: ActionType;
  payload?: any;
  timestamp: number;
}

/**
 * Represents a single piece of feedback in the evaluation result.
 */
export interface EvaluationDetail {
    text: string;
    type: 'correct' | 'incorrect';
}

/**
 * Represents the entire result of the evaluation.
 */
export interface EvaluationResult {
    score: number;
    maxScore: number;
    feedback: string;
    details: EvaluationDetail[];
    tasksCompleted: number;
    totalTasks: number;
}