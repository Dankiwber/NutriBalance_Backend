const OpenAI = require("openai");
require('dotenv').config();
const DEEPSEEK_API = process.env.DEEPSEEK_API;
const jsonPattern = /```json\n([\s\S]*?)\n```/;

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: DEEPSEEK_API
});

const query = "I ate 5 apples, 2 slices of bread (about 150g), and drank a can of cola";

async function main(query) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant. I will give you a sentence, and you need to extract each food item and calculate its corresponding calories and macronutrient breakdown. Please return the results in JSON format only, following this structure: {food: {total_intake: X(gram or ml), total_calories: X cal, fat: X g, carbs: X g, protein: X g}}.",
                },
                {
                    role: "user",
                    content: query,
                },
            ],
            model: "deepseek-chat",
        });

        const output = completion.choices[0].message.content;

       
        const jsonData = output.match(jsonPattern);

        if (jsonData) {
            const jsonString = jsonData[1]; // 提取 JSON 字符串
            try {
                const obj = JSON.parse(jsonString); // 解析为 JavaScript obj
                console.log("Parsed Object:", obj);
                console.log("Object Keys:", Object.keys(obj));
            } catch (error) {
                throw new Error('Failed to parse JSON: ' + error.message);
            }
        } else {
            throw new Error('No JSON data found in the response.');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

main(query);