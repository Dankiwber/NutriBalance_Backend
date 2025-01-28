const OpenAI = require("openai");
require('dotenv').config();
const DEEPSEEK_API = process.env.DEEPSEEK_API;

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: DEEPSEEK_API
});

async function main() {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. I will give you a sentence, and you need to extract each food item and calculate its corresponding calories and macronutrient breakdown. Please return the results in JSON format only, following this structure: {food: {total_intake: X(gram or ml), total_calories: X cal, fat: X g, carbs: X g, protein: X g}}.",
        },
        {
          role: "user",
          content: "I ate 5 apples, 2 slices of bread (about 150g), and drank a can of cola",
        },
      ],
      model: "deepseek-chat", // 确保模型名称正确
    });
  
    console.log(completion.choices[0].message.content);
  }
  
  main();