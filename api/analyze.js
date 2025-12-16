export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { policy, action, principles, customResources } = req.body;

  if (!policy) {
    return res.status(400).json({ error: 'Policy text is required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    let systemPrompt, userPrompt;

    if (action === 'optimize') {
      const principleText = principles?.map(p => `${p.name}: ${p.desc}`).join('\n') || '';
      
      systemPrompt = `You are an expert in behavioral design and compliance communication. Rewrite company compliance policies to make customers WANT to comply, while maintaining legal accuracy.`;
      
      userPrompt = `Rewrite this compliance policy to make customers WANT to comply, using these behavioral principles:
${principleText}
${customResources ? `\nAdditional guidelines: ${customResources}` : ''}

Original policy:
${policy}

Return ONLY valid JSON with no markdown formatting: {"versions": [{"original": "exact text segment from policy", "optimized": "rewritten version", "principles": ["principle names used"], "rationale": "brief explanation"}]}`;
    } else {
      systemPrompt = `You are a regulatory compliance expert. Analyze policies and identify applicable FTC and FDA regulations.`;
      
      userPrompt = `Analyze this compliance policy and identify which regulations apply. Choose from these regulation IDs:

FTC: safeguards, glba, coppa, endorsements, fees, negative
FDA: nutrition, allergens, claims, otc, cosmetic

Policy: ${policy}

Return ONLY valid JSON with no markdown formatting: {"matches": ["id1", "id2"], "explanations": {"id1": "why this regulation applies"}}`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: userPrompt }
        ],
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ error: 'API request failed', details: errorData });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    
    // Clean up the response - remove markdown code blocks if present
    const cleanJson = text.replace(/```json\n?|```\n?/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      return res.status(200).json(parsed);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw text:', text);
      return res.status(200).json({ raw: text, parseError: true });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}
