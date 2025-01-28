const OpenAI = require("openai");
require('dotenv').config();
const DEEPSEEK_API = process.env.DEEPSEEK_API;

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: DEEPSEEK_API
});

module.exports = openai