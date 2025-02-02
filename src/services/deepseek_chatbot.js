// 修改后的 chatbot.js
const pool = require('../config/db');
const openai = require('../config/deepseek');
const {
  SYSTEM_PROMPT,
  RESPONSE_PATTERNS,
  MODELS,
  ERROR_MESSAGES
} = require('../config/constants');

const parseNutritionData = (output) => {
  // 优先检查错误输入
  if (RESPONSE_PATTERNS.WRONG_INPUT.test(output)) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  // 提取 JSON 数据
  const jsonMatch = output.match(RESPONSE_PATTERNS.JSON_BLOCK);
  if (!jsonMatch) throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);

  try {
    const data = JSON.parse(jsonMatch[1]);
    
    // 验证数据结构
    if (!data?.food || 
        typeof data.food.total_calories === 'undefined' ||
        typeof data.food.fat === 'undefined' ||
        typeof data.food.carbs === 'undefined' ||
        typeof data.food.protein === 'undefined') {
      throw new Error('Incomplete nutrition data');
    }
    
    return data;
  } catch (error) {
    console.error('Parsing failed:', error.message);
    throw new Error(ERROR_MESSAGES.PARSING_ERROR);
  }
};

const chatbot = async (query) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query }
      ],
      model: MODELS.DEFAULT,
      max_tokens: 200,
      temperature: 0.2
    });

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return parseNutritionData(completion.choices[0].message.content);
  } catch (error) {
    console.error(`Chatbot Error: ${error.message}`, {
      query,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { chatbot };