// @desc    Process a natural language command and update portfolio data
// @route   POST /ai/command
// @access  Private
exports.handleAICommand = async (req, res) => {
  try {
    const { command, portfolioData } = req.body;

    if (!command || !portfolioData) {
      return res.status(400).json({ success: false, message: 'Command and portfolioData are required.' });
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant inside a portfolio builder. When given portfolio data and a user command, return ONLY the complete updated portfolioData as raw valid JSON — no markdown, no code blocks, no explanations.'
          },
          {
            role: 'user',
            content: `Portfolio data:\n${JSON.stringify(portfolioData, null, 2)}\n\nCommand: "${command}"\n\nRules:\n1. Return ONLY raw JSON\n2. Keep ALL existing fields intact unless the command changes them\n3. For color/style changes: add or update a "customStyles" object with CSS-compatible values e.g. { "customStyles": { "nameColor": "#7c3aed" } }\n4. For section visibility: update "hiddenSections" array\n5. For adding content: append to the relevant array\n\nReturn the complete updated JSON object only.`
          }
        ],
        temperature: 0.3,
        max_tokens: 4096
      })
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}));
      const status = groqRes.status;
      const message = status === 429
        ? 'AI quota exceeded. Please try again in a moment.'
        : errBody?.error?.message || 'AI request failed.';
      return res.status(status).json({ success: false, message });
    }

    const groqData = await groqRes.json();
    let text = groqData.choices?.[0]?.message?.content?.trim() || '';

    // Strip markdown code blocks if the model wraps the response
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    let updatedData;
    try {
      updatedData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      return res.status(500).json({
        success: false,
        message: 'AI returned an invalid response. Please rephrase your command and try again.'
      });
    }

    res.status(200).json({
      success: true,
      portfolioData: updatedData,
      message: 'Changes applied successfully!'
    });

  } catch (error) {
    console.error('AI command error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to process AI command.' });
  }
};
