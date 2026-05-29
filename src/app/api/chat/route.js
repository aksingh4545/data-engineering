import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, userMessage, systemPrompt, customApiKey } = await req.json();

    // Determine the API Key to use
    // Priority: customApiKey from settings panel -> process.env.llm_api -> process.env.LLM_API
    const apiKey = (customApiKey && customApiKey.trim() !== '') 
      ? customApiKey 
      : (process.env.llm_api || process.env.LLM_API);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please define `llm_api` in your `.env` file or set it in the Settings panel.' },
        { status: 400 }
      );
    }

    // Prepare messages array for the chat completions API
    let apiMessages = [];
    if (messages) {
      apiMessages = messages;
    } else {
      apiMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];
    }

    // Call Groq API
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        temperature: 0.2
      })
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      throw new Error(`Groq API returned status ${groqRes.status}: ${errorText}`);
    }

    const data = await groqRes.json();
    const content = data?.choices?.[0]?.message?.content || 'No response from Groq.';

    return NextResponse.json({ content });
  } catch (err) {
    console.error('Groq API Error inside route:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred during completion.' },
      { status: 500 }
    );
  }
}
