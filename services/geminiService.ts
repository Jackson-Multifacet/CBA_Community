
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as per SDK guidelines
const apiKey = process.env.API_KEY || 'missing-api-key';
const ai = new GoogleGenAI({ apiKey });

// System instruction for the spiritual companion
const CHATBOT_INSTRUCTION = `You are a warm, wise, and empathetic spiritual assistant for Christ Believers Assembly. 
Your goal is to provide biblical encouragement, answer theological questions based on standard Christian doctrine, 
and help users find peace. You are not a replacement for a human pastor but a helpful guide. 
Always speak with kindness, grace, and hope. If a user is in crisis, urge them to seek professional help or call emergency services immediately.
Keep responses concise but meaningful.`;

export const generatePrayerResponse = async (request: string, name: string): Promise<string> => {
  // Fix: Removed redundant API key check as it's assumed to be present
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, comforting, and scripturally sound prayer for ${name} regarding this request: "${request}". 
      The tone should be hopeful and faithful. Do not exceed 100 words.`,
    });
    return response.text || "May God bless you and keep you.";
  } catch (error) {
    console.error("Error generating prayer:", error);
    return "Father, we lift this request up to you, knowing you hear us. Amen.";
  }
};

export const chatWithSpiritualCompanion = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  // Fix: Removed redundant API key check
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: CHATBOT_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const summarizeSermon = async (sermonTitle: string, passage: string): Promise<string> => {
   // Fix: Removed redundant API key check
   try {
     const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a brief, inspiring 3-sentence summary of the spiritual themes typically associated with the Bible passage ${passage} and a sermon titled "${sermonTitle}".`,
     });
     return response.text || "A powerful message on faith.";
   } catch (error) {
     return "Join us to hear this powerful message.";
   }
};

export const generateDevotionalThought = async (journalEntry: string): Promise<string> => {
  // Fix: Removed redundant API key check
  try {
    const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `Read this personal journal entry from a church member: "${journalEntry}". 
       Provide a single relevant Bible verse (Reference and text) and a one-sentence encouraging thought related to their entry.
       Format it as: "**Scripture Reference:** Verse text... \n\n**Insight:** Thought..."`,
    });
    return response.text || "God is with you.";
  } catch (error) {
    return "Peace be with you.";
  }
};

// --- Trivia Game Service ---

export const generateTriviaQuestion = async (): Promise<{ question: string; options: string[]; correctAnswer: string; reference: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a multiple-choice Bible trivia question. It can be from the Old or New Testament. Ensure the options are plausible.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
            reference: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "reference"]
        }
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Trivia generation error:", error);
    // Fallback questions to cycle through if offline or error
    const fallbacks = [
        {
            question: "Who was swallowed by a great fish?",
            options: ["Jonah", "Moses", "Peter", "Paul"],
            correctAnswer: "Jonah",
            reference: "Jonah 1:17"
        },
        {
            question: "Where was Jesus born?",
            options: ["Nazareth", "Jerusalem", "Bethlehem", "Galilee"],
            correctAnswer: "Bethlehem",
            reference: "Matthew 2:1"
        },
        {
            question: "Who led the Israelites out of Egypt?",
            options: ["Aaron", "Moses", "Joshua", "Caleb"],
            correctAnswer: "Moses",
            reference: "Exodus 3"
        }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
