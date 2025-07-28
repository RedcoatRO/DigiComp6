import { ActionLogEntry, ActionType, EvaluationResult, EvaluationDetail } from '../types';

export const MAX_SCORE = 100;
export const TOTAL_TASKS = 2; // Task 1: Submit form, Task 2: Upload valid file

/**
 * Calculează scorul final și generează feedback pe baza acțiunilor utilizatorului.
 * Logica a fost schimbată: scorul pornește de la 0, se adaugă puncte pentru succes
 * și se scad puncte pentru greșeli.
 * @param actions - O listă de acțiuni înregistrate.
 * @returns Un obiect EvaluationResult cu scorul, feedback și detalii.
 */
export const calculateScore = (actions: ActionLogEntry[]): EvaluationResult => {
    let score = 0; // Scorul pornește de la 0
    const details: EvaluationDetail[] = [];
    const tasks = {
        formSubmitted: false,
        fileUploaded: false,
    };

    // Acordă puncte pentru îndeplinirea obiectivelor principale
    if (actions.some(a => a.type === ActionType.FILE_UPLOAD_VALID)) {
        tasks.fileUploaded = true;
        score += 40;
        details.push({ text: `Ai încărcat un document valid (+40 puncte).`, type: 'correct' });
    } else {
        details.push({ text: 'Nu ai încărcat un document valid, care era necesar pentru programare.', type: 'incorrect' });
    }

    if (actions.some(a => a.type === ActionType.FORM_SUBMIT_SUCCESS)) {
        tasks.formSubmitted = true;
        score += 60;
        details.push({ text: `Ai trimis formularul de programare cu succes (+60 puncte).`, type: 'correct' });
    } else {
        details.push({ text: 'Nu ai reușit să trimiți formularul de programare.', type: 'incorrect' });
    }

    // Aplică penalizări pentru acțiuni ineficiente sau incorecte
    const invalidFormSubmits = actions.filter(a => a.type === ActionType.FORM_SUBMIT_ATTEMPT_INVALID).length;
    if (invalidFormSubmits > 0) {
        const penalty = invalidFormSubmits * 10;
        score -= penalty;
        details.push({ text: `Ai încercat să trimiți formularul cu erori de ${invalidFormSubmits} ori (-${penalty} puncte).`, type: 'incorrect' });
    }

    const invalidFileUploads = actions.filter(a => a.type === ActionType.FILE_UPLOAD_INVALID).length;
    if (invalidFileUploads > 0) {
        const penalty = invalidFileUploads * 5; // Penalizare redusă
        score -= penalty;
        details.push({ text: `Ai selectat un fișier invalid de ${invalidFileUploads} ori (-${penalty} puncte).`, type: 'incorrect' });
    }
    
    const uniqueInvalidCnpAttempts = new Set<string>();
    actions.forEach(action => {
        if (action.type === ActionType.INVALID_CNP_ATTEMPT) {
            uniqueInvalidCnpAttempts.add(action.payload.cnp);
        }
    });
    if (uniqueInvalidCnpAttempts.size > 0) {
        const penalty = uniqueInvalidCnpAttempts.size * 5;
        score -= penalty;
        details.push({ text: `Ai introdus un CNP invalid de ${uniqueInvalidCnpAttempts.size} ori (-${penalty} puncte).`, type: 'incorrect' });
    }

    const hintRequests = actions.filter(a => a.type === ActionType.HINT_REQUEST).length;
    if (hintRequests > 0) {
        const penalty = hintRequests * 2;
        score -= penalty;
        details.push({ text: `Ai cerut ajutor de ${hintRequests} ori (-${penalty} puncte).`, type: 'incorrect' });
    }

    // Calculul final
    const tasksCompleted = (tasks.formSubmitted ? 1 : 0) + (tasks.fileUploaded ? 1 : 0);
    const finalScore = Math.max(0, Math.round(score));

    // Generează feedback general pe baza performanței
    let feedback;
    if (finalScore === 0 && tasksCompleted === 0) {
        feedback = "Nu ai efectuat nicio acțiune corectă. Revizuiește cerințele și încearcă din nou.";
    } else if (tasksCompleted < TOTAL_TASKS) {
        feedback = "Nu ai îndeplinit toate obiectivele. Revizuiește pașii și asigură-te că finalizezi tot procesul.";
    } else if (finalScore < 70) {
        feedback = "Ai finalizat exercițiul, dar cu multe greșeli. Mai multă atenție la detalii te-ar fi ajutat să obții un scor mai bun.";
    } else if (finalScore < 95) {
        feedback = "Felicitări! Ai finalizat exercițiul cu succes, cu doar câteva mici greșeli.";
    } else {
        feedback = "Performanță excelentă! Ai finalizat exercițiul rapid și eficient.";
    }


    return {
        score: finalScore,
        maxScore: MAX_SCORE,
        feedback,
        details: details.sort((a, b) => { // Sortează detaliile: corect, apoi incorect
            if (a.type === b.type) return 0;
            return a.type === 'correct' ? -1 : 1;
        }),
        tasksCompleted,
        totalTasks: TOTAL_TASKS,
    };
};