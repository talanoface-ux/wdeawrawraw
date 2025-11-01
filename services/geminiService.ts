import { Message, Role, SafetyLevel } from "../types";

export const getChatResponse = async (
  messages: Message[],
  systemInstruction: string,
  safetyLevel: SafetyLevel
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    if (!apiKey) {
      throw new Error("متغیر محیطی VITE_OPENROUTER_API_KEY تنظیم نشده است.");
    }

    // تبدیل پیام‌ها به ساختار Chat API
    const formattedMessages = [
      { role: "system", content: systemInstruction || "You are a helpful assistant." },
      ...messages.map((m) => ({
        role: m.role === Role.ASSISTANT ? "assistant" : "user",
        content: m.content,
      })),
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "My Chatbot",
      },
      body: JSON.stringify({
        model: "google/gemini-pro", // 🔹 می‌تونی هر مدل OpenRouter رو اینجا بذاری
        messages: formattedMessages,
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`خطا از OpenRouter: ${response.status} → ${text}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "پاسخی دریافت نشد.";
    return text;
  } catch (error) {
    console.error("Error fetching from OpenRouter API:", error);
    if (error instanceof Error) {
      return `خطا: ${error.message}`;
    }
    return "یک خطای ناشناخته رخ داد.";
  }
};
