/**
 * Construiește și trimite rezultatul evaluării către fereastra părinte (host).
 * Acest mecanism este esențial pentru integrarea într-o platformă de e-learning
 * sau un sistem extern care trebuie să primească scorul utilizatorului.
 *
 * @param score Scorul obținut de utilizator.
 * @param maxScore Scorul maxim posibil.
 * @param details O listă de mesaje de feedback detaliate.
 * @param tasksCompleted Numărul de obiective îndeplinite.
 * @param totalTasks Numărul total de obiective.
 */
export const sendEvaluationResult = (
    score: number,
    maxScore: number,
    details: string,
    tasksCompleted: number,
    totalTasks: number
): void => {
    // Construiește obiectul conform specificațiilor
    const resultPayload = {
        type: 'evaluationResult', // Tipul mesajului, OBLIGATORIU
        score,
        maxScore,
        details,
        tasksCompleted,
        totalTasks,
        extractedText: `${score} ${details}`, // Concatenare pentru procesare simplificată
        timestamp: new Date().toISOString(),
    };

    // Trimite mesajul către fereastra părinte
    // '*' permite trimiterea către orice origine, ceea ce este flexibil pentru diverse medii de hosting.
    // Pentru securitate sporită într-un mediu de producție, '*' ar trebui înlocuit cu originea specifică a platformei gazdă.
    if (window.parent) {
       window.parent.postMessage(resultPayload, '*');
    }

    // Afișează obiectul trimis în consolă pentru debugging
    console.log('Trimit rezultat:', resultPayload);
};
