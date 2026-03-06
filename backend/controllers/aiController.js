const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Process a natural language command and update portfolio data
// @route   POST /ai/command
// @access  Private
exports.handleAICommand = async (req, res) => {
  try {
    const { command, portfolioData } = req.body;

    if (!command || !portfolioData) {
      return res.status(400).json({ success: false, message: 'Command and portfolioData are required.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an AI assistant embedded inside a portfolio builder application called Portiqqo.

The user currently has the following portfolio data (JSON):
${JSON.stringify(portfolioData, null, 2)}

The user wants to make this change: "${command}"

Your job:
- Understand the user's intent from the command
- Apply the change to the portfolio data
- Return the COMPLETE updated portfolioData as a valid JSON object

Rules:
1. Return ONLY valid raw JSON — no markdown, no code blocks, no explanations
2. Keep ALL existing fields intact unless the command explicitly changes them
3. For text changes (bio, name, title, descriptions): update the relevant field directly
4. For color/style changes: add or update a "customStyles" object inside the relevant section with CSS-compatible values
   Example: { "customStyles": { "nameColor": "#7c3aed", "heroBg": "#0f172a" } }
5. For section visibility: update the "hiddenSections" array (add section name to hide, remove to show)
6. For adding new content (skills, projects, experience): append to the relevant array
7. If the command is unclear, make the most reasonable change and return the updated data
8. For "rewrite bio" or "make more professional" type commands: generate appropriate professional text

Respond with ONLY the updated JSON object.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown code blocks if Gemini wraps the response
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    let updatedData;
    try {
      updatedData = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
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
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process AI command.'
    });
  }
};
