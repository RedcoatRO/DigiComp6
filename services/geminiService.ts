import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API key for Google GenAI is not defined.");
}
const ai = new GoogleGenAI({ apiKey: apiKey! });
const model = 'gemini-2.5-flash';

const systemInstruction = `You are a helpful and friendly virtual assistant for a medical clinic. 
Your purpose is to answer questions about the appointment scheduling process. 
You should be polite, concise, and provide clear information. 
Available specializations are: Medicină de Familie, Cardiologie, Dermatologie, Pediatrie.
Appointment hours are between 08:00-12:00 and 14:00-16:00.
The user needs an ID card (buletin) to schedule.
Keep your answers brief and to the point. Answer in Romanian.`;

export const getChatResponse = async (prompt: string): Promise<string> => {
    if (!apiKey) return "Serviciul de chat nu este configurat corect (lipsește cheia API).";
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { systemInstruction: systemInstruction },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw new Error("Failed to get a response from the AI assistant.");
    }
};

const idDataSchema = {
    type: Type.OBJECT,
    properties: {
        fullName: {
            type: Type.STRING,
            description: "Numele complet al persoanei de pe actul de identitate."
        },
        cnp: {
            type: Type.STRING,
            description: "Codul Numeric Personal (CNP) al persoanei de pe actul de identitate."
        },
    },
    required: ['fullName', 'cnp']
};

export const extractDataFromId = async (file: File): Promise<{ fullName: string; cnp: string }> => {
    if (!apiKey) throw new Error("Serviciul de extragere date nu este configurat (lipsește cheia API).");
    try {
        const base64Data = await fileToBase64(file);
        const imagePart = { inlineData: { mimeType: file.type, data: base64Data } };
        const textPart = { text: "Extrage numele complet și CNP-ul din acest document de identitate românesc." };
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [textPart, imagePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: idDataSchema,
            },
        });
        
        const jsonStr = response.text.trim();
        const parsedData = JSON.parse(jsonStr);

        if (!parsedData.fullName || !parsedData.cnp) {
             throw new Error("Datele extrase sunt incomplete. Încercați o imagine mai clară.");
        }

        return { fullName: parsedData.fullName, cnp: parsedData.cnp };
    } catch (error) {
        console.error("Gemini Vision API error:", error);
        if (error instanceof SyntaxError) { // JSON.parse error
             throw new Error("Răspunsul de la AI nu a putut fi procesat. Încercați din nou.");
        }
        throw new Error("Nu s-au putut extrage datele din imagine. Încercați o imagine mai clară.");
    }
};