const pool = require('../config/db');
const openai = require('../config/deepseek');
const jsonPattern = /```json\n([\s\S]*?)\n```/;

const chatbot = async (query) => {
    try {
        // 调用 Deepseek API
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful assistant. I will give you a sentence, and you need to extract each food item and calculate its corresponding calories and macronutrient breakdown. If the sentence does not contain any food-related information, return string 'Wrong input'. Otherwise, return the results in JSON format only, following this structure: {food: {total_intake: X(gram or ml), total_calories: X cal, fat: X g, carbs: X g, protein: X g}}.",
                },
                {
                    role: "user",
                    content: query,
                },
            ],
            model: "deepseek-chat",
        });

        const output = completion.choices[0].message.content;

        // 检查是否是 "Wrong input"
        if (output.includes("Wrong input")) {
            throw new Error("The sentence does not contain any food-related information.");
        }

        const jsonData = output.match(jsonPattern);

        if (jsonData) {
            const jsonString = jsonData[1]; // 提取 JSON 字符串
            try {
                const obj = JSON.parse(jsonString); // 解析为 JavaScript 对象
                return obj; // 返回解析后的对象
            } catch (error) {
                throw new Error('Failed to parse JSON: ' + error.message);
            }
        } else {
            throw new Error('No JSON data found in the response.');
        }
    } catch (error) {
        console.error("Error:", error);
        throw error; // 抛出错误，由调用者处理
    }
};

module.exports = { chatbot };