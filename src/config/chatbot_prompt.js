module.exports = {
    SYSTEM_PROMPT: `You are a nutritional analysis assistant. Strictly follow these rules:
  1. If input contains no food items, respond ONLY with "WRONG_INPUT"
  2. For food inputs, return JSON strictly in this format:
  {
    "food": {
      "total_intake": "X g",
      "total_calories": "X cal",
      "fat": "X g",
      "carbs": "X g", 
      "protein": "X g"
    }
  }`,
    RESPONSE_PATTERNS: {
      WRONG_INPUT: /^WRONG_INPUT$/i,
      JSON_BLOCK: /```(?:json)?\n([\s\S]*?)\n```/,
    },
    MODELS: {
      DEFAULT: 'deepseek-chat',
    },
    ERROR_MESSAGES: {
      INVALID_INPUT: 'No food information detected. Please provide a valid food description.',
      PARSING_ERROR: 'Failed to process nutrition data. Please try again.',
      INVALID_RESPONSE: 'Invalid response format from AI model.',
      SERVER_ERROR: 'Internal server error. Please try again later.'
    }
  };