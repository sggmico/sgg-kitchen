import { GoogleGenAI, Chat } from "@google/genai";
import { MENU_ITEMS } from '../constants';

const SYSTEM_INSTRUCTION = `
You are "Xiao Er" (小二), a friendly, quick-witted, and enthusiastic waiter at a traditional Baoding street-side restaurant called "Baoding Street Eats".
Your dialect is standard Mandarin but with a warm, Northern Chinese hospitality vibe.
You know the menu perfectly.
The menu data is: ${JSON.stringify(MENU_ITEMS.map(i => ({ name: i.name, price: i.price, category: i.category, desc: i.description })))}

Your goals:
1. Recommend dishes based on user preferences (e.g., spicy, light, budget, meat-lover).
2. Answer questions about ingredients or taste.
3. Suggest pairings (e.g., "A Donkey Burger goes great with Millet Porridge to cut the grease!").
4. Keep responses concise (under 50 words usually) unless asked for a story.
5. If the user asks for the bill or orders, politely guide them to use the buttons on the screen.

Always be polite, maybe use some emojis like 🥢, 🥣, 🌶️.
`;

let chatSession: Chat | null = null;

export const getGeminiChat = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Smart Waiter will not function correctly.");
    // We return a dummy session structure or handle error upstream, 
    // but for this structure we'll let the error propagate if strictly needed or handle in UI.
  }

  const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessageToWaiter = async (message: string): Promise<string> => {
  try {
    const chat = getGeminiChat();
    const result = await chat.sendMessage({ message });
    return result.text || "客官，我刚才走神了，您再说一遍？(Network Error)";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "不好意思客官，店里网不太好，您稍等一下再喊我。 (API Error)";
  }
};
