// 修改后的 chatbot.js
const pool = require('../../config/db');
const openai = require('../../config/deepseek');
const {
  SYSTEM_PROMPT,
  RESPONSE_PATTERNS,
  MODELS,
  ERROR_MESSAGES
} = require('../../config/chatbot_prompt');

const parseNutritionData = (output) => {
  // 优先检查错误输入
  if (RESPONSE_PATTERNS.WRONG_INPUT.test(output)) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  // 提取 JSON 数据
  const jsonMatch = output.match(RESPONSE_PATTERNS.JSON_BLOCK);
  if (!jsonMatch) throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);

  try {
    const jsonString = jsonMatch[1].trim();
    const data = JSON.parse(jsonString);
    
    // 验证数据结构：现在 data 应该是一个数组，每个元素都应有必要的字段
    if (!Array.isArray(data)) {
      throw new Error('Expected an array of food items');
    }
    
    data.forEach(item => {
      if (
        typeof item.name === 'undefined' ||
        typeof item.intake === 'undefined' ||
        typeof item.calories === 'undefined' ||
        typeof item.fat === 'undefined' ||
        typeof item.carbs === 'undefined' ||
        typeof item.protein === 'undefined'
      ) {
        throw new Error('Incomplete nutrition data in one or more items');
      }
    });
    console.log(data)
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
      max_tokens: 400,
      temperature: 0.2
    });

    const modelResponse = completion.choices[0].message.content;
    console.log('Model Response:', modelResponse); // 记录原始响应

    if (!modelResponse) {
      throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
    }

    return parseNutritionData(modelResponse);
  } catch (error) {
    console.error(`Chatbot Error: ${error.message}`, {
      query,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { chatbot };