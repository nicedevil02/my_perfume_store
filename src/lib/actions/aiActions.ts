// src/lib/actions/aiActions.ts
"use server"; // این دستورالعمل مهم، این فایل را به عنوان یک ماژول Server Action مشخص می‌کند

interface SuggestionPayload {
  occasion?: string;
  scentPreference?: string;
  personality?: string;
}

interface GeminiResponsePart {
  text: string;
}

interface GeminiCandidate {
  content: {
    parts: GeminiResponsePart[];
    role: string;
  };
  // ... ممکن است فیلدهای دیگری هم داشته باشد
}

interface GeminiApiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: any; // برای مدیریت خطاهای احتمالی از سمت Gemini
  // ... ممکن است فیلدهای دیگری هم داشته باشد
}

export async function getSmartPerfumeSuggestionAction(
  payload: SuggestionPayload
): Promise<{ suggestion?: string; error?: string }> {
  const { occasion, scentPreference, personality } = payload;

  if (!occasion && !scentPreference && !personality) {
    return { error: "لطفا حداقل یکی از فیلدها را برای دریافت پیشنهاد پر کنید." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API Key is not configured.");
    return { error: "خطا در پیکربندی سمت سرور. لطفاً با پشتیبانی تماس بگیرید." };
  }

  // استفاده از یک مدل جدیدتر و در دسترس مثل gemini-1.5-flash-latest
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  let prompt = "شما یک متخصص عطر هستید. بر اساس اطلاعات زیر، چند پیشنهاد عطر (حداکثر ۳ مورد) به همراه دلیل کوتاه برای هر پیشنهاد ارائه دهید. پیشنهادات باید شامل نام عطر و برند باشند. خروجی باید فقط شامل لیست پیشنهادات باشد و از markdown استفاده نکنید.\n";
  if (occasion) prompt += `- مناسبت: ${occasion}\n`;
  if (scentPreference) prompt += `- نوع رایحه مورد علاقه: ${scentPreference}\n`;
  if (personality) prompt += `- توصیف شخصیت: ${personality}\n`;
  prompt += "\nپیشنهادات خود را به صورت یک لیست ساده، هر پیشنهاد در یک خط جدید (مثلاً: نام عطر (برند) - توضیح کوتاه) ارائه دهید.";

  const requestBody = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    // generationConfig: { // تنظیمات اختیاری برای نحوه تولید محتوا
    //   temperature: 0.7,
    //   topK: 1,
    //   topP: 1,
    //   maxOutputTokens: 256,
    // },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', response.status, errorBody);
      return { error: `خطا در ارتباط با سرویس هوش مصنوعی: ${response.statusText}` };
    }

    const result: GeminiApiResponse = await response.json();
    
    if (result.promptFeedback && result.promptFeedback.blockReason) {
      console.error('Gemini API Prompt Feedback:', result.promptFeedback);
      return { error: `درخواست شما توسط سرویس هوش مصنوعی مسدود شد: ${result.promptFeedback.blockReason}` };
    }

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return { suggestion: text.trim() };
    } else {
      console.error('Unexpected Gemini API response structure:', result);
      return { error: "متاسفانه پاسخی از سرویس هوش مصنوعی دریافت نشد یا ساختار پاسخ نامعتبر است." };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return { error: "خطای پیش‌بینی نشده در ارتباط با سرویس هوش مصنوعی. لطفاً دوباره تلاش کنید." };
  }
}

// تابع Server Action برای بخش "الهام‌بخش خرید شما" را هم می‌توانی به همین شکل اضافه کنی
// export async function getMoodPerfumeSuggestionAction(moodDescription: string): Promise<{ suggestion?: string; error?: string }> { ... }