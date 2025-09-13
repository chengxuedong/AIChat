
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "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" });

async function main() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
}

export default main();