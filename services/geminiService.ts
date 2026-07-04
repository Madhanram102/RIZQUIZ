
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const SYSTEM_INSTRUCTION = `You are a high-level competitive examiner for prestigious institutions like Civil Services, Bank PO, and Corporate Technical Interviews. 
Analyze the provided content thoroughly and generate a professional quiz. 
STRICT RULES:
1. DO NOT generate simple or trivial questions.
2. Focus on analytical reasoning, conceptual depth, and complex application of ideas found in the content.
3. Questions must mimic the difficulty level of Government or Bank examinations (Aptitude, Reasoning, and specialized knowledge).
4. Each question must have 4 plausible options (A, B, C, D) where the distractors are challenging and logically consistent.
5. Provide a comprehensive, professional explanation for why the answer is correct.`;

const EYE_TEST_INSTRUCTION = `You are a professional Ophthalmology Board Examiner. Analyze the provided vision chart or search topic to generate a rigorous clinical quiz.
Focus on:
1. Identifying specific abnormalities (e.g., specific color blindness patterns, refractive errors).
2. Professional interpretation of vision testing standards (Snellen, Ishihara, etc.).
3. Clinical implications of the findings.
DO NOT ask simple questions. Questions should challenge a medical professional or a serious student of optometry.
Provide detailed explanations.`;

const QUIZ_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The high-level analytical quiz question.",
      },
      options: {
        type: Type.OBJECT,
        properties: {
          A: { type: Type.STRING },
          B: { type: Type.STRING },
          C: { type: Type.STRING },
          D: { type: Type.STRING },
        },
        required: ["A", "B", "C", "D"],
      },
      correct_answer: {
        type: Type.STRING,
        description: "The key of the correct option (A, B, C, or D).",
      },
      explanation: {
        type: Type.STRING,
        description: "A professional and detailed explanation of the logic behind the correct answer.",
      },
    },
    required: ["question", "options", "correct_answer", "explanation"],
  },
};

const extractSources = (response: any) => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      uri: chunk.web.uri,
      title: chunk.web.title || chunk.web.uri,
    }));
};

export const generateQuizFromVideo = async (
  videoBase64: string,
  mimeType: string
): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: videoBase64,
          },
        },
        { text: "Generate a professional-level competitive exam quiz based on this video content. Generate 5 questions." },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as QuizQuestion[];
};

export const generateQuizFromPDF = async (
  pdfBase64: string,
  slot: number = 1
): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: pdfBase64,
          },
        },
        { 
          text: `Examine this document thoroughly. This is Slot #${slot}. 
          Generate exactly 10 high-level analytical questions that focus on the technical details and core concepts of the document. 
          Use Google Search to cross-reference and add depth. 
          Ensure these 10 questions are unique and do not overlap with previous content analysis if possible.` 
        },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Could not parse the PDF content.");
  const questions = JSON.parse(text) as QuizQuestion[];
  const sources = extractSources(response);

  if (sources.length > 0) {
    return questions.map(q => ({ ...q, sources }));
  }
  return questions;
};

export const generateQuizFromImage = async (
  imageBase64: string,
  mimeType: string
): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64,
          },
        },
        { text: "Analyze this image and generate a professional clinical examination quiz. Generate 5 questions." },
      ],
    },
    config: {
      systemInstruction: EYE_TEST_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as QuizQuestion[];
};

export const generateQuizFromYoutube = async (url: string): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Conduct a professional analysis of the YouTube video at this URL: ${url}. 
  Use Google Search to retrieve the transcript, comprehensive summaries, or technical data. 
  Generate 5 high-level competitive examination questions based on these findings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI after browsing YouTube.");
  const questions = JSON.parse(text) as QuizQuestion[];
  const sources = extractSources(response);

  return sources.length > 0 ? questions.map(q => ({ ...q, sources })) : questions;
};

export const generateQuizFromSearch = async (topic: string): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Research technical and clinical details for the following eye/vision topic: ${topic}. 
  Generate a professional optometry board-level quiz (5 questions) based on your research.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction: EYE_TEST_INSTRUCTION,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI after searching.");
  const questions = JSON.parse(text) as QuizQuestion[];
  const sources = extractSources(response);

  return sources.length > 0 ? questions.map(q => ({ ...q, sources })) : questions;
};
