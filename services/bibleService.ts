
import { BibleApiResponse, BibleTranslation, CommentaryEntry } from '../types';
import { GoogleGenAI } from "@google/genai";

// Fix: Always use process.env.API_KEY directly as per SDK guidelines
const apiKey = process.env.API_KEY || 'missing-api-key';
const ai = new GoogleGenAI({ apiKey });

export const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", 
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", 
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", 
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", 
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", 
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// Simple in-memory cache for Bible chapters to drastically improve response times
const bibleCache = new Map<string, BibleApiResponse>();

export const fetchBibleChapter = async (book: string, chapter: number, translation: BibleTranslation = 'kjv'): Promise<BibleApiResponse> => {
  const formattedBook = book.replace(/ /g, '+');
  const cacheKey = `${formattedBook}-${chapter}-${translation}`;
  
  if (bibleCache.has(cacheKey)) {
    return bibleCache.get(cacheKey)!;
  }

  const url = `https://bible-api.com/${formattedBook}+${chapter}?translation=${translation}`;
  
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error(`Chapter ${chapter} was not found in ${book} (${translation.toUpperCase()}).`);
    }
    if (!response.ok) {
      throw new Error(`The Bible service returned an error (${response.status}).`);
    }
    const data = await response.json();
    bibleCache.set(cacheKey, data);
    return data;
  } catch (err: any) {
    console.error("Bible Fetch Error:", err);
    throw new Error(err.message || 'Connection to Bible service failed.');
  }
};

/**
 * Fetches actual public domain commentary text using GenAI.
 * This simulates a live integration of historical texts like Matthew Henry's Commentary.
 */
export const fetchCommentary = async (authorKey: 'MHC' | 'JFB', book: string, chapter: number, verse: number): Promise<CommentaryEntry> => {
  const authorName = authorKey === 'MHC' ? "Matthew Henry's Complete Commentary" : "Jamieson-Fausset-Brown Bible Commentary";
  const reference = `${book} ${chapter}:${verse}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Retrieve the actual historical commentary text for ${reference} from ${authorName}. 
      Do not summarize. Provide the literal public domain text as found in original volumes. 
      If the specific verse text is part of a larger paragraph, provide that paragraph.
      Only return the commentary text itself, no intro or outro.`,
    });

    const text = response.text || "Commentary text unavailable for this specific verse.";
    
    return {
      author: authorName,
      reference,
      text: text.trim()
    };
  } catch (error) {
    console.error("Commentary Fetch Error:", error);
    return {
      author: authorName,
      reference,
      text: "Unable to retrieve live commentary at this moment. Please check your connection."
    };
  }
};
