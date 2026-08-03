const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Cloudflare environment variables.' }),
        { status: 500, headers: CORS }
      );
    }

    const { topic, goal, contextData } = await context.request.json();

    if (!topic || !goal) {
      return new Response(
        JSON.stringify({ error: 'topic and goal are required.' }),
        { status: 400, headers: CORS }
      );
    }

    const prompt = `You are an expert research analyst. The user is researching the following topic:

TOPIC: ${topic}

RESEARCH GOAL / INTENTION: ${goal}

RELEVANT DATA & CONTEXT:
${contextData ?? 'No additional context provided.'}

Please analyze this data and provide a structured response in valid JSON matching this exact shape:
{
  "summary": "A 2-3 paragraph summary of the key findings relevant to the topic",
  "patterns": ["pattern 1", "pattern 2", "pattern 3", "...up to 6 patterns"],
  "goalInsights": "A focused analysis of how the findings relate specifically to the user's stated goal or intention",
  "recommendations": ["recommendation 1", "recommendation 2", "...up to 5 actionable recommendations"],
  "limitations": "Brief note on the limitations of this data for the stated research goal"
}

Return ONLY the JSON object, no markdown fences or extra text.`;

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(
        JSON.stringify({ error: err?.error?.message ?? `Gemini error ${res.status}` }),
        { status: res.status, headers: CORS }
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

    return new Response(JSON.stringify(JSON.parse(clean)), { status: 200, headers: CORS });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
}
