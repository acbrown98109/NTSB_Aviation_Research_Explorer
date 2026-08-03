export interface ResearchAnalysis {
  summary: string;
  patterns: string[];
  goalInsights: string;
  recommendations: string[];
  limitations: string;
}

export async function analyzeResearch(
  _apiKey: string,
  topic: string,
  goal: string,
  contextData: string
): Promise<ResearchAnalysis> {
  const res = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, goal, contextData }),
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error ?? `Server error ${res.status}`);
  return data as ResearchAnalysis;
}
