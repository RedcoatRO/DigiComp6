import React, { createContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { ActionLogEntry, ActionType, EvaluationResult } from '../types';
import { useNotifications } from '../hooks/useNotifications';
import { calculateScore, MAX_SCORE } from '../utils/evaluation';
import { sendEvaluationResult } from '../utils/communication';

interface EvaluationContextType {
  actions: ActionLogEntry[];
  score: number;
  maxScore: number;
  isEvaluationVisible: boolean;
  evaluationResult: EvaluationResult | null;
  logAction: (type: ActionType, payload?: any) => void;
  showEvaluation: () => void;
  requestHint: () => void;
  resetEvaluation: () => void;
}

export const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

const INITIAL_ACTIONS: ActionLogEntry[] = [];
const INITIAL_SCORE = MAX_SCORE;

export const EvaluationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [actions, setActions] = useState<ActionLogEntry[]>(INITIAL_ACTIONS);
  const [isEvaluationVisible, setIsEvaluationVisible] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [wasHintShown, setWasHintShown] = useState(false);

  const { addNotification } = useNotifications();

  // Calculează scorul "live" afișat în taskbar. Acesta pornește de la MAX_SCORE și scade pe măsură ce se fac greșeli.
  const score = useMemo(() => {
    if (isEvaluationVisible && evaluationResult) {
        return evaluationResult.score;
    }
    // Calcul "live" al penalităților
    let currentScore = MAX_SCORE;
    const uniqueInvalidCnpAttempts = new Set<string>();
     actions.forEach(action => {
        switch (action.type) {
            case ActionType.FORM_SUBMIT_ATTEMPT_INVALID:
                currentScore -= 10;
                break;
            case ActionType.FILE_UPLOAD_INVALID:
                currentScore -= 5; // Penalizare redusă, consistentă cu calculul final
                break;
            case ActionType.INVALID_CNP_ATTEMPT:
                // Se penalizează doar o dată pentru fiecare CNP greșit
                if (!uniqueInvalidCnpAttempts.has(action.payload.cnp)) {
                    uniqueInvalidCnpAttempts.add(action.payload.cnp);
                    currentScore -= 5;
                }
                break;
             case ActionType.HINT_REQUEST:
                currentScore -= 2; // Penalizare mică pentru cererea de ajutor
                break;
            default:
                break;
        }
    });
    return Math.max(0, currentScore);
  }, [actions, isEvaluationVisible, evaluationResult]);


  // Monitorizează acțiunile pentru a oferi indicii automate
  React.useEffect(() => {
    if (wasHintShown || isEvaluationVisible) return;

    const invalidSubmits = actions.filter(a => a.type === ActionType.FORM_SUBMIT_ATTEMPT_INVALID).length;
    if (invalidSubmits >= 2) {
      addNotification({ message: 'Indiciu: Asigură-te că toate câmpurile obligatorii sunt completate corect.', type: 'info' });
      setWasHintShown(true);
      return;
    }

    const invalidFiles = actions.filter(a => a.type === ActionType.FILE_UPLOAD_INVALID).length;
    if (invalidFiles >= 2) {
      addNotification({ message: "Indiciu: Numele fișierului trebuie să fie 'act de identitate', 'trimitere medicala' sau 'istoric medical'.", type: 'info' });
      setWasHintShown(true);
    }
  }, [actions, wasHintShown, isEvaluationVisible, addNotification]);

  // Funcția de înregistrare a unei acțiuni
  const logAction = useCallback((type: ActionType, payload?: any) => {
    if (isEvaluationVisible) return; // Nu se mai înregistrează acțiuni după finalizarea evaluării
    setActions(prev => [...prev, { type, payload, timestamp: Date.now() }]);
  }, [isEvaluationVisible]);

  // Funcția pentru afișarea rezultatului final
  const showEvaluation = useCallback(() => {
    if (isEvaluationVisible) return;
    const result = calculateScore(actions);
    setEvaluationResult(result);
    setIsEvaluationVisible(true);

    // Trimite rezultatul către fereastra părinte
    const detailsText = result.details.map(d => d.text).join('; ');
    sendEvaluationResult(result.score, result.maxScore, detailsText, result.tasksCompleted, result.totalTasks);
  }, [actions, isEvaluationVisible]);
  
  // Funcția pentru a oferi un indiciu la cerere
  const requestHint = useCallback(() => {
    logAction(ActionType.HINT_REQUEST);
    addNotification({ message: 'Indiciu: Obiectivul principal este să completezi și să trimiți formularul cu un document valid.', type: 'info' });
  }, [logAction, addNotification]);

  // Funcția pentru resetarea stării evaluării
  const resetEvaluation = useCallback(() => {
    setActions(INITIAL_ACTIONS);
    setIsEvaluationVisible(false);
    setEvaluationResult(null);
    setWasHintShown(false);
    // Golește și datele din Local Storage pentru a începe de la zero
    localStorage.removeItem('appointment-form-data');
  }, []);

  const value = {
    actions,
    score,
    maxScore: MAX_SCORE,
    isEvaluationVisible,
    evaluationResult,
    logAction,
    showEvaluation,
    requestHint,
    resetEvaluation,
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};